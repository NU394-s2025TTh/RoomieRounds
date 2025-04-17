import './App.css';

import React, { useEffect, useState } from 'react';

import {
  AddIcon,
  EditIcon,
  // NudgeIcon,
  // ProfileIcon,
  // SettingsIcon,
  SwapIcon,
} from './components/Icons';
import { db, onValue, push, ref, set, update } from './firebase';
import { Chore } from './types';
import { getColorForAssignee } from './utils/getColorForAssignee';

function App() {
  const [chores, setChores] = useState<Chore[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [task, setTask] = useState<string>('');
  const [assignee, setAssignee] = useState<string>('');
  const [day, setDay] = useState<string>('');
  const [editChore, setEditChore] = useState<Chore | null>(null);

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
      }
    });
  }, []);

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

    setTask('');
    setAssignee('');
    setDay('');
    setShowForm(false);
  };

  // Wrote the following function with Github Copilot enabled

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
    setTask('');
    setAssignee('');
    setDay('');
    setShowForm(false);
    setEditChore(null);
  };

  const handleEditChore = (chore: Chore) => {
    if (editChore && editChore.id === chore.id) {
      setEditChore(null);
      setShowForm(false);
      setTask('');
      setAssignee('');
      setDay('');
    } else {
      setEditChore(chore);
      setTask(chore.task);
      setAssignee(chore.assignee);
      setDay(chore.day);
      setShowForm(true);
    }
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
        const choreRef = ref(db, `chores/${chore.id}`);
        update(choreRef, {
          assignee: chore.assignee,
          color: chore.color,
        });
      }
    });

    setChores(updatedChores);
  };

  return (
    <div className="App">
      <div className="min-h-screen flex flex-col justify-between bg-slate-100 text-black font-[Inter] p-4">
        {/* Header */}
        <header className="text-center border-b font-[Atma] pb-2">
          {/* <div className="flex justify-between items-center mb-2"> */}
          <div className="flex justify-center items-center mb-2">
            {/* Settings Icon */}
            {/* <SettingsIcon /> */}
            <h1 className="text-2xl font-semibold">RoomieRounds</h1>
            {/* Profile Icon */}
            {/* <ProfileIcon /> */}
          </div>
        </header>

        {/* Chore Form */}
        {showForm && (
          <div className="p-4 border rounded-md shadow mb-4">
            <input
              type="text"
              placeholder="Chore"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Assignee"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Day"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            <button
              onClick={editChore ? handleUpdateChore : handleAddChore}
              className="bg-slate-500 text-white font-semibold px-4 py-2 rounded-md mt-2 w-full hover:bg-slate-600 transition"
            >
              {editChore ? 'Update Chore' : 'Add Chore'}
            </button>
          </div>
        )}

        {/* Chore List */}
        <main className="flex flex-col gap-4 mt-4 flex-grow">
          {chores
            .sort((a, b) => Number(a.completed) - Number(b.completed))
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
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={chore.completed}
                      onChange={() => {
                        const updated = [...chores];
                        updated[idx].completed = !updated[idx].completed;
                        setChores(updated);

                        // Sync to Firebase
                        const choreId = updated[idx].id;
                        if (choreId) {
                          const choreRef = ref(db, `chores/${choreId}`);
                          update(choreRef, { completed: updated[idx].completed });
                        }
                      }}
                      className="w-5 h-5 accent-black"
                    />
                    {/* Chore text */}
                    <div className="flex flex-col text-left w-full">
                      <span
                        className={`font-semibold ${chore.completed ? 'line-through text-black/60' : ''}`}
                      >
                        {chore.task}
                      </span>
                      <span className="italic text-sm text-black/60">{chore.day}</span>
                    </div>
                    {/* Assignee */}
                    <span className="font-semibold">{chore.assignee}</span>
                    {/* Edit Button */}
                    <button
                      onClick={() => handleEditChore(chore)}
                      className="bg-transparent w-[32px] h-[32px] p-1 text-black cursor-pointer"
                    >
                      <EditIcon />
                    </button>
                  </div>
                </div>
              );
            })}
        </main>

        {/* Bottom Navigation */}
        <footer className="flex justify-around items-center mt-4 border-t pt-2">
          {/* Add */}
          <button
            className="bg-slate-500 py-[10px] px-[32px] text-white cursor-pointer"
            onClick={() => setShowForm(!showForm)}
          >
            <AddIcon />
          </button>
          {/* Swap */}
          <button
            className="bg-slate-500 py-[10px] px-[32px] text-white cursor-pointer"
            onClick={handleSwapChores}
          >
            <SwapIcon />
          </button>
          {/* Nudge */}
          {/* <button className="bg-slate-500 py-[10px] px-[32px] text-white">
            <NudgeIcon />
          </button> */}
        </footer>
      </div>
    </div>
  );
}

export default App;
