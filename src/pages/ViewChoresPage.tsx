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

// TODO:
// Fetch proper chores from Firebase for the current household
// only display the chores if the user is logged in and a member of the household

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

  // Household query parameter from the URL
  const { household } = useParams<{ household: string }>();

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
  }, [household, user]);

  useEffect(() => {
    handleApplyFilters(completedFilter, assigneeFilter);
  }, [chores, completedFilter, assigneeFilter]);

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

    const choreRef = ref(db, `households/${household}/chores${editChore.id}`);
    await update(choreRef, updatedChore);

    const updatedChores = chores.map((chore) =>
      chore.id === editChore.id ? { ...chore, ...updatedChore } : chore,
    );

    setChores(updatedChores);
    resetForm();
  };

  const handleSwapChores = () => {
    const assignees = chores.map((c) => c.assignee);
    const shuffled = [...assignees].sort(() => Math.random() - 0.5);

    const updatedChores = chores.map((chore, i) => {
      const newAssignee = shuffled[i];
      return {
        ...chore,
        assignee: newAssignee,
        color: `${getColorForAssignee(newAssignee)} bg-opacity-20`,
      };
    });

    updatedChores.forEach((chore) => {
      if (chore.id) {
        const choreRef = ref(db, `households/${household}/chores/${chore.id}`);
        update(choreRef, {
          assignee: chore.assignee,
          color: chore.color,
        });
      }
    });

    setChores(updatedChores);
  };

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

  const handleDeleteChore = async (choreId: string) => {
    const confirmable = window.confirm('Are you sure you want to delete this chore?');
    if (!confirmable) return;

    const choreRef = ref(db, `households/${household}/chores/${choreId}`);
    await set(choreRef, null);

    setChores((prev) => prev.filter((chore) => chore.id !== choreId));
  };

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

  const resetForm = () => {
    setTask('');
    setAssignee('');
    setDay(new Date().toISOString());
    setEditChore(null);
    setShowForm(false);
  };

  return (
    <div className="flex flex-col justify-between flex-grow">
      <main className="flex flex-col gap-4 mt-4 flex-grow">
        <div className="flex justify-end">
          <button
            onClick={() => setShowFilters(true)} // Open the filter modal
            type="button"
          >
            <FilterIcon />
          </button>
          {showFilters && (
            <FilterModal
              onClose={() => setShowFilters(false)} // Close the modal
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
        </div>
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

      <footer className="flex justify-around items-center mt-4 border-t pt-2">
        <div>
          <button
            onClick={() => {
              setTask('');
              setAssignee('');
              setDay(new Date().toISOString());
              setEditChore(null);
              setShowForm(true);
            }}
            className="bg-slate-500 py-[10px] px-[32px] text-white hover:bg-slate-600"
            type="button"
          >
            <AddIcon />
          </button>
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
        </div>
        <button
          className="bg-slate-500 py-[10px] px-[32px] text-white hover:bg-slate-600"
          onClick={handleSwapChores}
        >
          <SwapIcon />
        </button>
      </footer>
    </div>
  );
}

export default ViewChoresPage;
