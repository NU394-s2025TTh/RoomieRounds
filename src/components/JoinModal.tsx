// Backend integration written with help of GitHub CoPilot
// Modal confirming a user wants to join a household
import { User } from 'firebase/auth';
import { get } from 'firebase/database';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { db, ref, update } from '../firebase';

interface FilterModalProps {
  onClose: () => void;
  user: User | null;
  household_id: string;
  household_name: string;
}

const JoinModal: React.FC<FilterModalProps> = ({
  onClose,
  user,
  household_id,
  household_name,
}) => {
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(user);

    const householdRef = ref(db, `households/${household_id}`);
    const householdMembersRef = ref(db, `households/${household_id}/members`);

    try {
      const snapshot = await get(householdMembersRef);
      const currentMembers = snapshot.val() || [];

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

      // Go to chores page if the user already exists in the current members
      if (
        Array.isArray(currentMembers) &&
        currentMembers.some((member) => member.uid === user.uid)
      ) {
        navigate(`/view-chores/${household_id}`);
      }

      let updatedMembers = [];

      if (Array.isArray(currentMembers)) {
        updatedMembers = [...currentMembers, newMember];
      } else {
        updatedMembers = [newMember];
      }

      await update(householdRef, {
        members: updatedMembers,
      });

      navigate(`/view-chores/${household_id}`);
    } catch (error) {
      console.error('Error updating household members:', error);
    }
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
