import './App.css';
import 'react-datepicker/dist/react-datepicker.css';

import React, { useEffect, useState } from 'react';

import { Status } from '../types/status';
import FilterModal from './components/FilterModal';
import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  FilterIcon,
  // NudgeIcon,
  // ProfileIcon,
  // SettingsIcon,
  SwapIcon,
} from './components/Icons';
import Modal from './components/Modal';
import { db, onValue, push, ref, set, update } from './firebase';
import { Chore } from './types';
import { getColorForAssignee } from './utils/getColorForAssignee';
import { formatDueDate } from './utils/getHumanReadableDay';

function App() {
  const [chores, setChores] = useState<Chore[]>([]);
  const [filteredChores, setFilteredChores] = useState<Chore[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [task, setTask] = useState<string>('');
  const [assignee, setAssignee] = useState<string>('');
  const [day, setDay] = useState<string>('');
  const [editChore, setEditChore] = useState<Chore | null>(null);

  // Filters
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [completedFilter, setCompletedFilter] = useState<Status>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');

  useEffect(() => {
    const choresRef = ref(db, 'chores');
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
  }, []);

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

    const choreRef = push(ref(db, 'chores'));
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

    const choreRef = ref(db, `chores/${editChore.id}`);
    await update(choreRef, updatedChore);

    const updatedChores = chores.map((chore) =>
      chore.id === editChore.id ? { ...chore, ...updatedChore } : chore,
    );

    setChores(updatedChores);
    resetForm();
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

  const handleSwapChores = () => {
    const confirmable = window.confirm('Are you sure you want to shuffle the chores?');
    if (!confirmable) return;

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
        const choreRef = ref(db, `chores/${chore.id}`);
        update(choreRef, {
          assignee: chore.assignee,
          color: chore.color,
        });
      }
    });

    setChores(updatedChores);
  };

  const handleDeleteChore = async (choreId: string) => {
    const confirmable = window.confirm('Are you sure you want to delete this chore?');
    if (!confirmable) return;

    const choreRef = ref(db, `chores/${choreId}`);
    await set(choreRef, null);

    setChores((prev) => prev.filter((chore) => chore.id !== choreId));
  };

  const resetForm = () => {
    setTask('');
    setAssignee('');
    setDay(new Date().toISOString());
    setEditChore(null);
    setShowForm(false);
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

  return (
    <div className="App">
      <div className="min-h-screen flex flex-col justify-between bg-slate-100 text-black font-[Inter] p-4">
        <header className="sticky top-0 z-20 bg-slate-100 text-center border-b font-[Atma] pb-2">
          <div className="flex justify-between items-center px-4 py-2">
            <button
              onClick={handleSwapChores}
              className="bg-slate-500 py-2 px-4 text-white hover:bg-slate-600 rounded-lg"
            >
              <SwapIcon />
            </button>

            <h1 className="text-2xl font-semibold">RoomieRounds</h1>

            <button
              type="button"
              onClick={() => {
                setTask('');
                setAssignee('');
                setDay(new Date().toISOString());
                setEditChore(null);
                setShowForm(true);
              }}
              className="bg-slate-500 py-2 px-4 text-white hover:bg-slate-600 rounded-lg"
            >
              <AddIcon />
            </button>
          </div>
        </header>

        <main className="flex flex-col gap-4 mt-4 pt-2 flex-grow">
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
                        const updated = [...chores];
                        updated[idx].completed = !updated[idx].completed;
                        setChores(updated);

                        const choreId = updated[idx].id;
                        if (choreId) {
                          const choreRef = ref(db, `chores/${choreId}`);
                          update(choreRef, { completed: updated[idx].completed });
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

        <footer className="flex justify-around items-center mt-4 border-t pt-2"></footer>
      </div>
    </div>
  );
}

export default App;
