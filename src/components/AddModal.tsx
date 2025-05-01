// Backend integration written with help of GitHub CoPilot
import { User } from 'firebase/auth';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { db, push, ref, set } from '../firebase';
import { Household } from '../types';

interface AddModalProps {
  onClose: () => void;
  user: User | null;
}

const AddModal: React.FC<AddModalProps> = ({ onClose, user }) => {
  const navigate = useNavigate();
  const [householdName, setHouseholdName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      console.error('User is null. Cannot add to household members.');
      return;
    }

    const newMember = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
    };

    if (householdName.trim()) {
      const newHousehold: Omit<Household, 'id'> = {
        name: householdName,
        members: [newMember],
        chores: [],
      };
      const newHouseholdRef = push(ref(db, 'households'));
      await set(newHouseholdRef, newHousehold);

      onClose();
      const household_id = newHouseholdRef.key;
      if (!household_id) {
        console.error('Household ID is null. Cannot navigate to view chores.');
        return;
      }

      navigate(`/view-chores/${household_id}`);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black/50"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4">Create a Household</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="household-name" className="block font-medium mb-2">
              Household Name
            </label>
            <input
              id="household-name"
              type="text"
              value={householdName}
              onChange={(e) => setHouseholdName(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter household name"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 py-2 px-4 text-base font-medium rounded-md hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-slate-500 text-white py-2 px-4 text-base font-medium rounded-md hover:bg-slate-600 transition"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModal;
