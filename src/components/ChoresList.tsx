import React from 'react';

import { Status } from '../../types/status';
import { db, ref, update } from '../firebase';
import { Chore, FormState } from '../types';
import { formatDueDate } from '../utils/getHumanReadableDay';
import FilterModal from './FilterModal';
import { DeleteIcon, EditIcon, FilterIcon } from './Icons';
import Modal from './Modal';

interface ChoresListProps {
  filteredChores: Chore[];
  chores: Chore[];
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  completedFilter: Status;
  assigneeFilter: string;
  handleApplyFilters: (status: Status, assignee: string) => void;
  showForm: boolean;
  resetForm: () => void;
  formState: FormState;
  setFormState: (state: FormState | ((prevState: FormState) => FormState)) => void;
  handleAddChore: () => Promise<void>;
  handleUpdateChore: () => Promise<void>;
  handleEditChore: (chore: Chore) => void;
  handleDeleteChore: (choreId: string) => Promise<void>;
  editChore: Chore | null;
}

const ChoresList: React.FC<ChoresListProps> = ({
  filteredChores,
  chores,
  showFilters,
  setShowFilters,
  completedFilter,
  assigneeFilter,
  handleApplyFilters,
  showForm,
  resetForm,
  formState,
  setFormState,
  handleAddChore,
  handleUpdateChore,
  handleEditChore,
  handleDeleteChore,
  editChore,
}) => {
  const sortedChores = [...filteredChores].sort((a, b) => {
    if (a.completed !== b.completed) {
      return Number(a.completed) - Number(b.completed);
    }
    const dateA = new Date(a.day).getTime();
    const dateB = new Date(b.day).getTime();
    return dateA - dateB;
  });

  return (
    <main className="flex flex-col gap-4 mt-4 pt-2 px-4 flex-grow">
      <div className="flex justify-end">
        <button onClick={() => setShowFilters(true)} type="button">
          <FilterIcon />
        </button>
        {showFilters && (
          <FilterModal
            onClose={() => setShowFilters(false)}
            onApplyFilters={(status, assignee) => {
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

      {/* Modal Form */}
      {showForm && (
        <Modal
          onClose={resetForm}
          taskHandler={(e) => setFormState({ ...formState, task: e.target.value })}
          assigneeHandler={(e) =>
            setFormState({ ...formState, assignee: e.target.value })
          }
          setDay={(day) => setFormState({ ...formState, day })}
          taskValue={formState.task}
          assigneeValue={formState.assignee}
          dayValue={formState.day}
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

      {/* Chores List */}
      {sortedChores.map((chore, idx) => {
        const cardClass = chore.completed ? 'border-gray-700 bg-gray-300' : chore.color;

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
                  // Update in Firebase
                  if (chore.id) {
                    const choreRef = ref(db, `chores/${chore.id}`);
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
  );
};

export default ChoresList;
