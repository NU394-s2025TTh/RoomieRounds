import { useEffect, useState } from 'react';

import { Household } from '../types';
// import { useNavigate } from 'react-router-dom';
// import { db, onValue, push, ref, set, update } from '../firebase';

// TODO:
// this component might need to take in the user state from App.tsx to make firebase integration work
// need join household modal that integrates with firebase
// after joining household, navigate to chores page
// uncomment line 19 below too to use navigate
// need add household modal form that integrates with firebase
// display a message if the user isn't logged in
function JoinHouseholdPage() {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [showAddHouseholdModal, setShowAddHouseholdModal] = useState(false);
  const [showJoinHouseholdModal, setShowJoinHouseholdModal] = useState(false);

  // !!!!!!!!!!!UNCOMMENT THIS WHEN YOU IMPLEMENT JOIN HOUSEHOLD MODAL
  // const navigate = useNavigate();

  useEffect(() => {
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
        {households.map((household, idx) => {
          return (
            <button
              key={idx}
              onClick={() => setShowJoinHouseholdModal(!showJoinHouseholdModal)}
              style={{ border: '2px solid black' }}
              className={`flex items-center justify-center gap-2 w-full p-4 rounded-xl shadow-sm ${household.color} hover:bg-gray-200 text-center text-xs`}
            >
              <span>{household.name}</span>
            </button>
          );
        })}
        <button
          onClick={() => setShowAddHouseholdModal(!showAddHouseholdModal)}
          style={{ border: '2px solid black' }}
          className={`flex items-center justify-center gap-2 w-full p-4 rounded-xl shadow-sm hover:bg-gray-200 text-center text-xs`}
        >
          <span>+</span>
        </button>
      </main>
    </div>
  );
}

export default JoinHouseholdPage;
