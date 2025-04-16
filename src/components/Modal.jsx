// reference used for original HTML-version code example of this component: https://flowbite.com/docs/components/modal/
// After converting from HTML to JSX manually, prompted chatGPT to double check work: "Is this valid JSX for a React app? [inserted converted code here]"

import React from 'react';
import { useState } from 'react';

export default function ModalWrapper({ modalTitle }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        Toggle modal
      </button>

      {isOpen && <Modal onClose={() => setIsOpen(false)} modalTitle={modalTitle} />}
    </div>
  );
}

export function Modal({ onClose, modalTitle }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black/50"
    >
      {/* -------- Modal content -------- */}
      <div className="relative rounded-lg bg-slate-100">
        {/* -------- Modal header -------- */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-slate-500">
          <h3 className="text-xl font-semibold text-black">{modalTitle}</h3>

          <button
            onClick={onClose}
            type="button"
            className="text-gray-500 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
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

        {/* -------- Modal body -------- */}
        <form className="p-5 md:p-5">
          <div className="flex flex-col gap-4 mb-4">
            {/* -------- Task description input -------- */}
            <div className="col-span-2">
              <label
                htmlFor="task"
                className="block mb-2 text-medium font-medium text-black-900"
              >
                Task Description
              </label>
              <input
                type="text"
                name="task"
                id="task"
                className="bg-slate-200 border border-slate-500 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Type task description here"
                required=""
              />
            </div>

            {/* -------- Assignee name input -------- */}
            <div className="col-span-2">
              <label
                htmlFor="assignee"
                className="block mb-2 text-medium font-medium text-black-900"
              >
                Assignee
              </label>
              <input
                type="text"
                name="assignee"
                id="assignee"
                className="bg-slate-200 border border-slate-500 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Type household member name here"
                required=""
              />
            </div>

            {/* --------  Due date input -------- */}
            <div className="col-span-2">
              <label
                htmlFor="day"
                className="block mb-2 text-medium font-medium text-black-900"
              >
                Due Date
              </label>
              <textarea
                type="text"
                name="day"
                id="day"
                className="bg-slate-200 border border-slate-500 text-slate-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="Type due date here"
                required=""
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            className="text-white inline-flex items-center bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg !text-sm px-3 py-1.5 text-center"
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
            {modalTitle}
          </button>
        </form>
      </div>
    </div>
  );
}

// ! could be helpful for future reference if choose to add tags to chores
/*
<div className="col-span-2 sm:col-span-1">
<label
  htmlFor="day"
  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
>
  Due Date
</label>
<select
  id="room"
  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
>
  <option selected="">Select room</option>
  <option value="TV">TV/Monitors</option>
  <option value="PC">PC</option>
  <option value="GA">Gaming/Console</option>
  <option value="PH">Phones</option>
</select>
</div>
*/
