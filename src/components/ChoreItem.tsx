import React from 'react';

import { db, ref, update } from '../firebase';
import { Chore } from '../types';
import { formatDueDate } from '../utils/getHumanReadableDay';
import { DeleteIcon, EditIcon } from './Icons';

interface ChoreItemProps {
  chore: Chore;
  handleEditChore: (chore: Chore) => void;
  handleDeleteChore: (choreId: string) => Promise<void>;
  // Removed chores from props since it's not used
}

const ChoreItem: React.FC<ChoreItemProps> = ({
  chore,
  handleEditChore,
  handleDeleteChore,
  // Removed chores from destructuring
}) => {
  const cardClass = chore.completed ? 'border-gray-700 bg-gray-300' : chore.color;

  const handleToggleComplete = () => {
    // Update in Firebase
    if (chore.id) {
      const choreRef = ref(db, `chores/${chore.id}`);
      update(choreRef, { completed: !chore.completed });
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl border-2 shadow-sm ${cardClass}`}
    >
      <div className="flex items-center gap-2 w-full">
        <input
          type="checkbox"
          checked={chore.completed}
          onChange={handleToggleComplete}
          className="w-5 h-5 accent-black"
        />
        <div className="flex flex-col text-left w-full">
          <span
            className={`font-semibold ${chore.completed ? 'line-through text-black/60' : ''}`}
          >
            {chore.task}
          </span>
          <span className="italic text-sm text-black/60">{formatDueDate(chore.day)}</span>
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
};

export default ChoreItem;
