import './App.css';

import React, { useState } from 'react';

import {
  AddIcon,
  NudgeIcon,
  ProfileIcon,
  SettingsIcon,
  SwapIcon,
} from './components/Icons';
import { Chore } from './types';
import { getColorForAssignee } from './utils/getColorForAssignee';

const initialChores: Chore[] = [
  {
    task: 'Take out the trash',
    assignee: 'Anthony',
    day: 'Tonight',
    color: 'border-blue-500 bg-blue-100',
    completed: false,
  },
  {
    task: 'Wipe down counters',
    assignee: 'Joanne',
    day: 'Tonight',
    color: 'border-green-500 bg-green-100',
    completed: false,
  },
  {
    task: 'Do the dishes',
    assignee: 'David',
    day: 'Tonight',
    color: 'border-red-500 bg-red-100',
    completed: false,
  },
  {
    task: 'Clean the bathroom',
    assignee: 'Anthony',
    day: 'Due Yesterday',
    color: 'border-gray-700 bg-gray-300',
    completed: true,
  },
  {
    task: 'Water the plants',
    assignee: 'Aidan',
    day: 'Due Last Sunday',
    color: 'border-gray-700 bg-gray-300',
    completed: true,
  },
];

function App() {
  const [chores, setChores] = useState<Chore[]>(initialChores);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [task, setTask] = useState<string>('');
  const [assignee, setAssignee] = useState<string>('');
  const [day, setDay] = useState<string>('');

  const handleAddChore = () => {
    if (!task || !assignee || !day) return;

    const color = getColorForAssignee(assignee, chores);
    const newChore: Chore = {
      task,
      assignee,
      day,
      color: `${color} bg-opacity-20`,
      completed: false,
    };

    setChores([...chores, newChore]);
    setTask('');
    setAssignee('');
    setDay('');
    setShowForm(false);
  };

  const handleSwapChores = () => {
    const assignees = chores.map((c) => c.assignee);
    const shuffled = [...assignees].sort(() => Math.random() - 0.5);

    const swappedChores = chores.map((chore, i) => ({
      ...chore,
      assignee: shuffled[i],
      color: getColorForAssignee(shuffled[i], chores),
    }));

    setChores(swappedChores);
  };

  return (
    <div className="App">
      <div className="min-h-screen flex flex-col justify-between bg-white text-black font-serif p-4">
        {/* Header */}
        <header className="text-center border-b pb-2">
          <div className="flex justify-between items-center mb-2">
            {/* Settings Icon */}
            <SettingsIcon />
            <h1 className="text-lg font-semibold">RoomieRounds</h1>
            {/* Profile Icon */}
            <ProfileIcon />
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
              onClick={handleAddChore}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2 w-full"
            >
              Add Chore
            </button>
          </div>
        )}

        {/* Chore List */}
        <main className="flex flex-col gap-4 mt-4 flex-grow">
          {chores.map((chore, idx) => {
            const cardClass = chore.completed
              ? 'border-gray-700 bg-gray-300'
              : chore.color;

            return (
              <div
                key={idx}
                className={`flex items-center justify-between p-4 rounded-xl border-2 shadow-sm ${cardClass}`}
              >
                <div className="flex items-start gap-2 w-full">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={chore.completed}
                    onChange={() => {
                      const updated = [...chores];
                      updated[idx].completed = !updated[idx].completed;
                      setChores(updated);
                    }}
                    className="w-5 h-5 mt-1 accent-black"
                  />
                  {/* Chore text */}
                  <div className="flex flex-col w-full">
                    <span
                      className={`font-semibold ${chore.completed ? 'line-through text-black/60' : ''}`}
                    >
                      {chore.task}
                    </span>
                    <span className="italic text-sm text-black/60">{chore.day}</span>
                  </div>
                  {/* Assignee */}
                  <span className="font-semibold">{chore.assignee}</span>
                </div>
              </div>
            );
          })}
        </main>

        {/* Bottom Navigation */}
        <footer className="flex justify-around items-center mt-4 border-t pt-2">
          {/* Add */}
          <button onClick={() => setShowForm(!showForm)}>
            <AddIcon />
          </button>
          {/* Swap */}
          <button onClick={handleSwapChores}>
            <SwapIcon />
          </button>
          {/* Nudge */}
          <button>
            <NudgeIcon />
          </button>
        </footer>
      </div>
    </div>
  );
}

export default App;
