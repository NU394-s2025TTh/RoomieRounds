import './App.css';
import 'react-datepicker/dist/react-datepicker.css';

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import { ProfileIcon } from './components/Icons';
import JoinHouseholdPage from './pages/JoinHouseholdPage';
import ViewChoresPage from './pages/ViewChoresPage';
import ViewHouseholdsPage from './pages/ViewHouseholdsPage';

function App() {
  // User state
  const [user, setUser] = useState<User | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user); // Save the signed-in user
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      setUser(null); // Clear the user state
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="App">
      <div className="min-h-screen flex flex-col bg-slate-100 text-black font-[Inter] p-4">
        <header className="flex justify-between items-center border-b font-[Atma] pb-2">
          {/* Title in the center */}
          <h1 className="text-2xl font-semibold mx-auto">RoomieRounds</h1>

          {/* Profile Icon on the right */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              type="button"
              className="focus:outline-none"
            >
              <ProfileIcon />
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50 font-[Inter]">
                <div className="py-2">
                  <button
                    onClick={user ? handleSignOut : handleGoogleSignIn}
                    className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-left"
                    style={{ fontSize: '16px' }}
                  >
                    {user ? 'Sign Out' : 'Sign In with Google'}
                  </button>
                  {user && (
                    <div>
                      <button
                        onClick={() => navigate('/households')}
                        className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-left"
                        style={{ fontSize: '16px' }}
                      >
                        View My Households
                      </button>
                      <button
                        onClick={() => navigate('/join-household')}
                        className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-left"
                        style={{ fontSize: '16px' }}
                      >
                        Join a Household
                      </button>
                    </div>
                  )}
                </div>
                {user && (
                  <div className="px-4 py-2 text-sm text-gray-700">
                    Signed in as: {user.displayName}
                  </div>
                )}
              </div>
            )}
          </div>
        </header>
        <Routes>
          <Route path="/" element={<ViewHouseholdsPage user={user} />} />
          <Route path="/households" element={<ViewHouseholdsPage user={user} />} />
          <Route path="/join-household" element={<JoinHouseholdPage user={user} />} />
          <Route
            path="/view-chores/:household"
            element={<ViewChoresPage user={user} />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
