import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';

import JoinModal from '../components/JoinModal';
import { Household } from '../types';

// TODO:
// need to integrate join household modal form
// need to integrate add household modal form

interface JoinHouseholdsPageProps {
  user: User | null;
}

function JoinHouseholdPage({ user }: JoinHouseholdsPageProps) {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [showJoinHouseholdModal, setShowJoinHouseholdModal] = useState(false);
  const [showAddHouseholdModal, setShowAddHouseholdModal] = useState(false);
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>();

  useEffect(() => {
    console.log(user);
    // TODO: firebase integration here!
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

    // Test data -- DELETE THIS AFTER FIREBASE INTEGRATION
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

  const handleShowModal = (household: Household) => {
    setSelectedHousehold(household);
    setShowJoinHouseholdModal(true);
  };

  return (
    <div className="flex flex-col justify-between flex-grow">
      <main className="flex flex-col gap-4 mt-4 flex-grow">
        {user &&
          households.map((household, idx) => {
            console.log(household.name);
            return (
              <div key={idx}>
                <button
                  onClick={() => handleShowModal(household)}
                  style={{ border: '2px solid black' }}
                  className={`flex items-center justify-center gap-2 w-full p-4 rounded-xl shadow-sm ${household.color} hover:bg-gray-200 text-center font-[Inter] text-xs`}
                >
                  <span>{household.name}</span>
                </button>
                {showJoinHouseholdModal && (
                  <JoinModal
                    onClose={() => {
                      setShowJoinHouseholdModal(false);
                      setSelectedHousehold(null);
                    }}
                    user={user}
                    household_name={selectedHousehold?.name || ''}
                  />
                )}
              </div>
            );
          })}

        {user && (
          <button
            onClick={() => setShowAddHouseholdModal(!showAddHouseholdModal)}
            style={{ border: '2px solid black' }}
            className={`flex items-center justify-center gap-2 w-full p-4 rounded-xl shadow-sm hover:bg-gray-200 text-center font-[Inter] text-xs`}
          >
            <span>+</span>
          </button>
        )}
        {!user && <p> Please sign in to access households to join! </p>}
      </main>
    </div>
  );
}

export default JoinHouseholdPage;
