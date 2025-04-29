import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { db, onValue, ref } from '../firebase';
import { Household } from '../types';

interface ViewHouseholdsPageProps {
  user: User | null;
}

function ViewHouseholdsPage({ user }: ViewHouseholdsPageProps) {
  const [households, setHouseholds] = useState<Household[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    console.log(user);
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
        setHouseholds(loadedHouses);
      }
    });
  }, []);

  return (
    <div className="flex flex-col justify-between flex-grow">
      <main className="flex flex-col gap-4 mt-4 flex-grow">
        {user &&
          households.map((household, idx) => {
            return (
              <button
                key={idx}
                onClick={() => navigate(`/view-chores/${household.id}`)}
                style={{ border: '2px solid black' }}
                className={`flex items-center justify-center gap-2 w-full p-4 rounded-xl shadow-sm hover:bg-gray-200 text-center text-xs`}
              >
                <span>{household.name}</span>
              </button>
            );
          })}
        {!user && <p> Please sign in to access households to join! </p>}
      </main>
    </div>
  );
}

export default ViewHouseholdsPage;
