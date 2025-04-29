import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';

import AddModal from '../components/AddModal';
import JoinModal from '../components/JoinModal';
import { db, onValue, ref } from '../firebase';
import { Household } from '../types';

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
            onClick={() => setShowAddHouseholdModal(true)}
            style={{ border: '2px solid black' }}
            className={`flex items-center justify-center gap-2 w-full p-4 rounded-xl shadow-sm hover:bg-gray-200 text-center font-[Inter] text-xs`}
          >
            <span>+</span>
          </button>
        )}
        {!user && <p> Please sign in to access households to join! </p>}

        {showAddHouseholdModal && (
          <AddModal
            onClose={() => {
              setShowAddHouseholdModal(false);
            }}
            user={user}
          />
        )}
      </main>
    </div>
  );
}

export default JoinHouseholdPage;
