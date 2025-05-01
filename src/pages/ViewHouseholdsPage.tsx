import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { db, onValue, ref } from '../firebase';
import { Household } from '../types';

interface ViewHouseholdsPageProps {
  user: User | null;
  handleGoogleSignIn: () => void;
}

function ViewHouseholdsPage({ user, handleGoogleSignIn }: ViewHouseholdsPageProps) {
  const [households, setHouseholds] = useState<Household[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const housesRef = ref(db, 'households');
      onValue(housesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const loadedHouses = Object.entries(data as Record<string, Household>).map(
            ([id, value]) => ({
              id,
              ...value,
            }),
          );

          // Utilized GitHub Copilot for filtering logic
          const userHouseholds = loadedHouses.filter((household) =>
            household.members.some((member) => member.uid === user.uid),
          );
          setHouseholds(userHouseholds);
        }
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="relative h-screen bg-slate-100 overflow-hidden">
        {/* Login Content */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center">
          <h2 className="text-3xl font-bold mb-4">Welcome!</h2>
          <p className="text-lg mb-4">Sign in to access households</p>
          <button
            onClick={handleGoogleSignIn}
            className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition text-sm"
          >
            Sign In with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between flex-grow">
      <main className="flex flex-col gap-4 mt-4 flex-grow">
        <h2 className="text-2xl font-bold text-left pl-2">Your Households</h2>
        {households.map((household, idx) => {
          return (
            <button
              key={idx}
              onClick={() => navigate(`/view-chores/${household.id}`)}
              style={{ border: '2px solid black' }}
              className={`flex items-center justify-center gap-2 w-full p-4 bg-sky-200 rounded-xl shadow-sm hover:bg-sky-300 text-center text-xs`}
            >
              <span>{household.name}</span>
            </button>
          );
        })}
      </main>
    </div>
  );
}

export default ViewHouseholdsPage;
