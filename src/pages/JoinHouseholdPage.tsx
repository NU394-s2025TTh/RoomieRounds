import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';

import AddModal from '../components/AddModal';
import JoinModal from '../components/JoinModal';
import { db, onValue, ref } from '../firebase';
import { Household } from '../types';

interface JoinHouseholdsPageProps {
  user: User | null;
  handleGoogleSignIn: () => void;
}

function JoinHouseholdPage({ user, handleGoogleSignIn }: JoinHouseholdsPageProps) {
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

  {
    /* {!user && <p> Please sign in to access households to join! </p>} */
  }
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
                    household_name={selectedHousehold?.name || ''}
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
