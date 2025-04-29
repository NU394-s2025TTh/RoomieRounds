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

  const handleShowJoinModal = (household: Household) => {
    setSelectedHousehold(household);
    setShowJoinHouseholdModal(true);
  };

  const handleCloseJoinModal = () => {
    setShowJoinHouseholdModal(false);
    setSelectedHousehold(null);
  };

  return (
    <div className="flex flex-col justify-between flex-grow">
      <main className="flex flex-col gap-4 mt-4 flex-grow">
        {user &&
          households.map((household, idx) => {
            console.log(household.name);
            return (
              <div key={idx}>
                {/* Opening and Closing of Join Household Modals */}
                <button
                  onClick={() => handleShowJoinModal(household)}
                  style={{ border: '2px solid black' }}
                  className={`flex items-center justify-center gap-2 w-full p-4 rounded-xl shadow-sm hover:bg-gray-200 text-center font-[Inter] text-xs`}
                >
                  <span>{household.name}</span>
                </button>

                {showJoinHouseholdModal && (
                  <JoinModal
                    onClose={handleCloseJoinModal}
                    user={user}
                    household_id={selectedHousehold?.id || ''}
                  />
                )}
              </div>
            );
          })}

        {/* Opening and Closing of Add Household Modal */}
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
