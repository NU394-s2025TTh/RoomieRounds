// Modal confirming a user wants to join a household
import { User } from 'firebase/auth';
import React from 'react';
import { useNavigate } from 'react-router-dom';
// import { db, onValue, push, ref, set, update } from '../firebase';

// TODO:
// need join household modal that integrates with firebase

interface FilterModalProps {
  onClose: () => void;
  user: User | null;
  household_name: string;
}

const JoinModal: React.FC<FilterModalProps> = ({ onClose, user, household_name }) => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(user);

    // TODO: FIREBASE INTEGRATION HERE

    onClose();

    // Navigate to chores page
    navigate(`/view-chores/${household_name}`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4">{`Join ${household_name}?`}</h2>
        {/* Modal Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 py-2 px-4 text-base font-medium rounded-md hover:bg-gray-400 transition"
          >
            No
          </button>
          <button
            type="submit"
            className="bg-slate-500 text-white py-2 px-4 text-base font-medium rounded-md hover:bg-slate-600 transition"
            onClick={handleSubmit}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinModal;
