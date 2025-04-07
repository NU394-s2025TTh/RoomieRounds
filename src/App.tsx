import './App.css';

import React, { useState } from 'react';

import { Chore } from './types';

const initialChores: Chore[] = [
  { task: 'Wash Dishes', assignee: 'Anthony', day: 'Friday', color: 'bg-blue-600' },
  { task: 'Take out Trash', assignee: 'Joanne', day: 'Tuesday', color: 'bg-red-500' },
  { task: 'Pay Rent', assignee: 'David', day: 'Monday', color: 'bg-green-600' },
  { task: 'Pay Internet Bill', assignee: 'Anthony', day: 'Thurs.', color: 'bg-blue-600' },
];

function App() {
  const [chores, setChores] = useState<Chore>(initialChores);
  const [showForm, setShowForm] = useState<boolean>(false);

  const [task, setTask] = useState<string>('');
  const [assignee, setAssignee] = useState<string>('');
  const [day, setDay] = useState<string>('');

  const handleAddChore = () => {
    if (!task || !assignee || !day) return;

    const newChore: Chore = {
      task,
      assignee,
      day,
      color: 'bg-gray-600', // default color, or we could rotate through a palette
    };

    setChores([...chores, newChore]);
    setTask('');
    setAssignee('');
    setDay('');
    setShowForm(false);
  };

  return (
    <div className="App">
      <div className="min-h-screen flex flex-col justify-between bg-white text-black font-serif p-4">
        {/* Header */}
        <header className="text-center border-b pb-2">
          <div className="flex justify-between items-center mb-2">
            {/* Settings Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
              />
            </svg>
            <h1 className="text-lg font-semibold">RoomieRounds</h1>
            {/* Profile Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
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
          {chores.map((chore, idx) => (
            <div key={idx} className={`${chore.color} text-white rounded-lg p-4 shadow`}>
              <div className="text-md font-medium">
                {chore.task} - {chore.assignee}
              </div>
              <div className="text-sm text-right mt-1">{chore.day}</div>
            </div>
          ))}
        </main>

        {/* Bottom Navigation */}
        <footer className="flex justify-around items-center mt-4 border-t pt-2">
          {/* Plus button adds a new chore */}
          <button onClick={() => setShowForm(!showForm)}>
            {/* Plus Icon */}
            <svg
              className="size-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>
          {/* Swap button */}
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
              />
            </svg>
          </button>
          {/* Nudge Button */}
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
              />
            </svg>
          </button>
        </footer>
      </div>
    </div>
  );
}

export default App;
