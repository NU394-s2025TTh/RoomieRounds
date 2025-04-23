import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Household } from '../types';
// import { db, onValue, push, ref, set, update } from '../firebase';

// TODO:
// need firebase integration for pulling proper household data for the current user

interface ViewHouseholdsPageProps {
  user: User | null;
}

function ViewHouseholdsPage({ user }: ViewHouseholdsPageProps) {
  const [households, setHouseholds] = useState<Household[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    console.log(user);
    // const housesRef = ref(db, 'chores');
    // onValue(housesRef, (snapshot) => {
    //   const data = snapshot.val();
    //   if (data) {
    //     const loadedHouses = Object.entries(data as Record<string, Household>).map(
    //       ([id, value]) => ({
    //         id,
    //         ...value,
    //       }),
    //     );
    //     setHouseholds(loadedHouses);
    //   }
    // });

    // Test data
    setHouseholds([
      {
        id: '1',
        name: 'Household 1',
        chores: [],
        members: ['member1', 'member2'],
        color: 'bg-blue-500',
      },
      {
        id: '2',
        name: 'Household 2',
        chores: [],
        members: ['member3', 'member4'],
        color: 'bg-green-500',
      },
    ]);
  }, []);

  return (
    <div className="flex flex-col justify-between flex-grow">
      <main className="flex flex-col gap-4 mt-4 flex-grow">
        {user &&
          households.map((household, idx) => {
            return (
              <button
                key={idx}
                onClick={() => navigate(`/view-chores/${household.name}`)}
                style={{ border: '2px solid black' }}
                className={`flex items-center justify-center gap-2 w-full p-4 rounded-xl shadow-sm ${household.color} hover:bg-gray-200 text-center text-xs`}
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
