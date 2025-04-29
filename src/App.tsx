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
import { Route, Routes } from 'react-router-dom';

import Header from './components/Header';
import JoinHouseholdPage from './pages/JoinHouseholdPage';
import ViewChoresPage from './pages/ViewChoresPage';
import ViewHouseholdsPage from './pages/ViewHouseholdsPage';
import ViewProfilePage from './pages/ViewProfilePage';

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleGoogleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="App">
      <div className="min-h-screen flex flex-col bg-slate-100 text-black font-[Inter] p-4">
        <Header
          user={user}
          handleGoogleSignIn={handleGoogleSignIn}
          handleSignOut={handleSignOut}
        />
        <Routes>
          <Route
            path="/"
            element={
              <ViewHouseholdsPage user={user} handleGoogleSignIn={handleGoogleSignIn} />
            }
          />
          <Route
            path="/households"
            element={
              <ViewHouseholdsPage user={user} handleGoogleSignIn={handleGoogleSignIn} />
            }
          />
          <Route path="/join-household" element={<JoinHouseholdPage user={user} />} />
          <Route
            path="/view-chores/:household"
            element={<ViewChoresPage user={user} />}
          />
          <Route
            path="/view-profile"
            element={
              <ViewProfilePage
                user={user}
                handleGoogleSignIn={handleGoogleSignIn}
                handleSignOut={handleSignOut}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
