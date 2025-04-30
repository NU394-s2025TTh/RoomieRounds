import { User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import FilterModal from '../components/FilterModal';
import { AddIcon, DeleteIcon, EditIcon, FilterIcon, SwapIcon } from '../components/Icons';
import Modal from '../components/Modal';
import { db, onValue, push, ref, set, update } from '../firebase';
import { Status } from '../types';
import { Chore } from '../types';
import { getColorForAssignee } from '../utils/getColorForAssignee';
import { formatDueDate } from '../utils/getHumanReadableDay';

interface ViewChoresPageProps {
  user: User | null;
}

function ViewChoresPage({ user }: ViewChoresPageProps) {
  // State for chores
  const [chores, setChores] = useState<Chore[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [task, setTask] = useState<string>('');
  const [assignee, setAssignee] = useState<string>('');
  const [day, setDay] = useState<string>('');
  const [editChore, setEditChore] = useState<Chore | null>(null);

  // Filters
  const [filteredChores, setFilteredChores] = useState<Chore[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [completedFilter, setCompletedFilter] = useState<Status>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');

  // Household
  const { household } = useParams<{ household: string }>();
  const [householdName, setHouseholdName] = useState<string>('');

  // Get reference to household we want to view chores for
  useEffect(() => {
    if (household) {
      const householdRef = ref(db, `households/${household}`);
      onValue(householdRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setHouseholdName(data.name);
        }
      });
    }
  }, [household]);

  // Get chores for the household
  useEffect(() => {
    console.log(household);

    console.log(user);

    const choresRef = ref(db, `households/${household}/chores`);
    onValue(choresRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedChores = Object.entries(data as Record<string, Chore>).map(
          ([id, value]) => ({
            id,
            ...value,
          }),
        );
        setChores(loadedChores);
        setFilteredChores(loadedChores);
      }
    });
  }, [household]);

  // Handle adding chores
  const handleAddChore = async () => {
    if (!task || !assignee || !day) return;

    const color = `${getColorForAssignee(assignee)} bg-opacity-20`;
    const newChore: Omit<Chore, 'id'> = {
      task,
      assignee,
      day,
      color: `${color} bg-opacity-20`,
      completed: false,
    };

    const choreRef = push(ref(db, `households/${household}/chores`));
    await set(choreRef, newChore);

    resetForm();
  };

  // Handle updating chores
  const handleUpdateChore = async () => {
    if (!task || !assignee || !day || !editChore) return;

    const color = `${getColorForAssignee(assignee)} bg-opacity-20`;
    const updatedChore = {
      task,
      assignee,
      day,
      color: `${color} bg-opacity-20`,
      completed: editChore.completed,
    };

    const choreRef = ref(db, `households/${household}/chores/${editChore.id}`);
    await update(choreRef, updatedChore);

    const updatedChores = chores.map((chore) =>
      chore.id === editChore.id ? { ...chore, ...updatedChore } : chore,
    );

    setChores(updatedChores);
    resetForm();
  };

  // Handle swapping chores
  const handleSwapChores = () => {
    const confirmable = window.confirm('Are you sure you want to shuffle the chores?');
    if (!confirmable) return;

    const uniqueAssignees = [...new Set(chores.map((c) => c.assignee))];
    if (uniqueAssignees.length === 0) return;

    const shuffledChores = [...chores].sort(() => Math.random() - 0.5);

    const distributedChores: Chore[] = [];
    const countPerAssignee = Math.floor(shuffledChores.length / uniqueAssignees.length);
    let remaining = shuffledChores.length % uniqueAssignees.length;

    let index = 0;
    for (const assignee of uniqueAssignees) {
      const numChores = countPerAssignee + (remaining > 0 ? 1 : 0);
      if (remaining > 0) remaining--;

      for (let i = 0; i < numChores; i++) {
        const chore = { ...shuffledChores[index++] };
        chore.assignee = assignee;
        chore.color = `${getColorForAssignee(assignee)} bg-opacity-20`;
        distributedChores.push(chore);
      }
    }

    distributedChores.forEach((chore) => {
      if (chore.id) {
        const choreRef = ref(db, `households/${household}/chores/${chore.id}`);
        update(choreRef, {
          assignee: chore.assignee,
          color: chore.color,
        });
      }
    });

    setChores(distributedChores);
  };

  // Handle editing chores
  const handleEditChore = (chore: Chore) => {
    if (editChore && editChore.id === chore.id) {
      resetForm();
    } else {
      setEditChore(chore);
      setTask(chore.task);
      setAssignee(chore.assignee);
      setDay(chore.day);
      setShowForm(true);
    }
  };

  // Handle deleting chores
  const handleDeleteChore = async (choreId: string) => {
    const confirmable = window.confirm('Are you sure you want to delete this chore?');
    if (!confirmable) return;

    const choreRef = ref(db, `households/${household}/chores/${choreId}`);
    await set(choreRef, null);

    setChores((prev) => prev.filter((chore) => chore.id !== choreId));
  };

  // Handle applying filters
  const handleApplyFilters = (status: Status, assignee: string) => {
    let filtered = [...chores];

    if (status !== 'all') {
      filtered = filtered.filter((chore) =>
        status === 'completed' ? chore.completed : !chore.completed,
      );
    }

    if (assignee !== 'all') {
      filtered = filtered.filter((chore) => chore.assignee === assignee);
    }

    setFilteredChores(filtered);
    setShowFilters(false);
  };

  useEffect(() => {
    handleApplyFilters(completedFilter, assigneeFilter);
  }, [chores, completedFilter, assigneeFilter]);

  const resetForm = () => {
    setTask('');
    setAssignee('');
    setDay(new Date().toISOString());
    setEditChore(null);
    setShowForm(false);
  };

  return (
    <div className="flex flex-col justify-between flex-grow">
      <header className="flex items-center justify-between p-4">
        {/* Household Name */}
        <h1 className="text-2xl font-bold">{householdName}</h1>

        {/* Swap Chores */}
        <button
          type="button"
          onClick={handleSwapChores}
          className="bg-transparent justify-left p-1 text-black hover:text-gray-600"
        >
          <SwapIcon />
        </button>
        {/* End of swap chores */}

        {/* Filter Icon */}
        <button onClick={() => setShowFilters(true)} type="button">
          <FilterIcon />
        </button>
        {showFilters && (
          <FilterModal
            onClose={() => setShowFilters(false)}
            onApplyFilters={(status, assignee) => {
              setCompletedFilter(status);
              setAssigneeFilter(assignee);
              handleApplyFilters(status, assignee);
            }}
            currentCompletedFilter={completedFilter}
            currentAssigneeFilter={assigneeFilter}
            assignees={chores
              .map((chore) => chore.assignee)
              .filter((value, index, self) => self.indexOf(value) === index)}
          />
        )}

        {/* Add Chores */}
        <button
          type="button"
          onClick={() => {
            setTask('');
            setAssignee('');
            setDay(new Date().toISOString());
            setEditChore(null);
            setShowForm(true);
          }}
          className="bg-transparent text-black hover:text-gray-600 w-5 h-5"
        >
          <AddIcon />
        </button>
        {/* End of Add Chores */}
      </header>

      <main className="flex flex-col gap-4 mt-4 flex-grow">
        {/* Showing the Modal Here */}
        {showForm && (
          <Modal
            onClose={resetForm}
            taskHandler={(e) => setTask(e.target.value)}
            assigneeHandler={(e) => setAssignee(e.target.value)}
            setDay={setDay}
            taskValue={task}
            assigneeValue={assignee}
            dayValue={day}
            handleAddChore={(e) => {
              e.preventDefault();
              handleAddChore();
            }}
            handleUpdateChore={(e) => {
              e.preventDefault();
              handleUpdateChore();
            }}
            editChore={editChore}
          />
        )}

        {filteredChores
          .sort((a, b) => {
            if (a.completed !== b.completed) {
              return Number(a.completed) - Number(b.completed);
            }
            const dateA = new Date(a.day).getTime();
            const dateB = new Date(b.day).getTime();
            return dateA - dateB;
          })
          .map((chore, idx) => {
            const cardClass = chore.completed
              ? 'border-gray-700 bg-gray-300'
              : chore.color;

            return (
              <div
                key={idx}
                className={`flex items-center justify-between p-4 rounded-xl border-2 shadow-sm ${cardClass}`}
              >
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="checkbox"
                    checked={chore.completed}
                    onChange={() => {
                      const updatedChores = chores.map((c) =>
                        c.id === chore.id ? { ...c, completed: !c.completed } : c,
                      );
                      setChores(updatedChores);

                      // Sync to Firebase
                      if (chore.id) {
                        const choreRef = ref(
                          db,
                          `households/${household}/chores/${chore.id}`,
                        );
                        update(choreRef, { completed: !chore.completed });
                      }
                    }}
                    className="w-5 h-5 accent-black"
                  />
                  <div className="flex flex-col text-left w-full">
                    <span
                      className={`font-semibold ${chore.completed ? 'line-through text-black/60' : ''}`}
                    >
                      {chore.task}
                    </span>
                    <span className="italic text-sm text-black/60">
                      {formatDueDate(chore.day)}
                    </span>
                  </div>
                  <span className="font-semibold">{chore.assignee}</span>
                  <button
                    onClick={() => handleEditChore(chore)}
                    className="bg-transparent w-[32px] h-[32px] p-1 text-black cursor-pointer"
                  >
                    <EditIcon />
                  </button>
                  <button
                    onClick={() => handleDeleteChore(chore.id!)}
                    className="bg-transparent w-[32px] h-[32px] p-1 text-red-500 cursor-pointer"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            );
          })}
      </main>
    </div>
  );
}

export default ViewChoresPage;
