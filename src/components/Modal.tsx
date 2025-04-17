// Modal.tsx

import 'react-datepicker/dist/react-datepicker.css';

import React from 'react';
import DatePicker from 'react-datepicker';

import { Chore } from '../types';

interface ModalProps {
  onClose: () => void;
  taskHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  assigneeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setDay: (val: string) => void;
  taskValue: string;
  assigneeValue: string;
  dayValue: string;
  handleAddChore: (e: React.FormEvent<HTMLFormElement>) => void;
  handleUpdateChore: (e: React.FormEvent<HTMLFormElement>) => void;
  editChore: Chore | null;
}

export default function Modal({
  onClose,
  taskHandler,
  assigneeHandler,
  setDay,
  taskValue,
  assigneeValue,
  dayValue,
  handleAddChore,
  handleUpdateChore,
  editChore,
}: ModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black/50 px-4 px-6"
    >
      <div className="relative rounded-lg bg-slate-100 w-full max-w-2xl max-h-full">
        {/* Header */}
        <div className="flex justify-between align-middle p-4 md:p-5 border-b rounded-t border-slate-500">
          <h3 className="text-center text-2xl font-semibold text-black">
            {editChore ? 'Update Chore' : 'Add Chore'}
          </h3>

          <button
            onClick={onClose}
            type="button"
            className="text-gray-900 bg-transparent hover:bg-gray-300 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>

        {/* Body */}
        <form
          className="p-5 md:p-5"
          onSubmit={editChore ? handleUpdateChore : handleAddChore}
        >
          <div className="flex flex-col gap-4 mb-4">
            {/* Task */}
            <div className="col-span-2">
              <label
                htmlFor="task"
                className="block mb-2 text-lg font-medium text-black-900"
              >
                Task Description
              </label>
              <input
                type="text"
                value={taskValue}
                className="w-full mb-2 p-2 border rounded-lg bg-slate-200 border-slate-500 text-slate-900"
                placeholder="Type task description here"
                onChange={taskHandler}
              />
            </div>

            {/* Assignee */}
            <div className="col-span-2">
              <label
                htmlFor="assignee"
                className="block mb-2 text-lg font-medium text-black-900"
              >
                Assignee
              </label>
              <input
                type="text"
                value={assigneeValue}
                className="w-full mb-2 p-2 border rounded-lg bg-slate-200 border-slate-500 text-slate-900"
                placeholder="Type household member name here"
                onChange={assigneeHandler}
              />
            </div>

            {/* Date Picker */}
            <div className="col-span-2">
              <label
                htmlFor="day"
                className="block mb-2 text-lg font-medium text-black-900"
              >
                Due Date
              </label>
              <DatePicker
                selected={dayValue ? new Date(dayValue) : null}
                onChange={(date: Date | null) => {
                  if (date) setDay(date.toISOString());
                }}
                showTimeSelect
                timeFormat="h:mm aa"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                placeholderText="Select date and time"
                className="w-full mb-2 p-2 border rounded-lg bg-slate-200 border-slate-500 text-slate-900"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="inline-flex items-center justify-center bg-slate-500 text-white font-semibold px-4 py-2 rounded-md mt-2 w-full hover:bg-slate-600 transition"
          >
            <svg
              className="me-1 -ms-1 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              ></path>
            </svg>
            {editChore ? 'Update Chore' : 'Add Chore'}
          </button>
        </form>
      </div>
    </div>
  );
}
