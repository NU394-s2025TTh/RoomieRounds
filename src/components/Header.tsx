import { User } from 'firebase/auth';
import React from 'react';

import { FormState } from '../types';
import { AddIcon, ProfileIcon, SwapIcon } from './Icons';

interface HeaderProps {
  handleSwapChores: () => void;
  // Removed showForm as it's not used
  setShowForm: (show: boolean) => void;
  resetForm: () => void;
  setFormState: (state: FormState | ((prevState: FormState) => FormState)) => void;
  user: User | null;
  showProfileMenu: boolean;
  setShowProfileMenu: (show: boolean) => void;
  handleGoogleSignIn: () => Promise<void>;
  handleSignOut: () => Promise<void>;
}

const Header: React.FC<HeaderProps> = ({
  handleSwapChores,
  // Removed showForm from destructuring
  setShowForm,
  resetForm,
  setFormState,
  user,
  showProfileMenu,
  setShowProfileMenu,
  handleGoogleSignIn,
  handleSignOut,
}) => {
  return (
    <header className="sticky top-0 z-20 bg-slate-100 border-b font-[Atma]">
      <div className="flex justify-between items-center px-4 py-2">
        {/* Swap Chores */}
        <button
          type="button"
          onClick={handleSwapChores}
          className="bg-transparent justify-left p-1 text-black hover:text-gray-600"
        >
          <SwapIcon />
        </button>
        {/* End of swap chores */}

        <h1 className="text-2xl font-semibold">RoomieRounds</h1>

        {/* Grouping add and profile icons together for CSS justification */}
        <div className="flex items-center justify-center gap-2 relative">
          {/* Add Chores */}
          <button
            type="button"
            onClick={() => {
              setFormState({
                task: '',
                assignee: '',
                day: new Date().toISOString(),
              });
              resetForm();
              setShowForm(true);
            }}
            className="bg-transparent text-black hover:text-gray-600 w-5 h-5"
          >
            <AddIcon />
          </button>
          {/* End of Add Chores */}

          {/* Profile Icon temporarily here until add household pages */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              type="button"
              className="focus:outline-none pl-2 w-8 h-4"
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
                </div>
                {user && (
                  <div className="px-4 py-2 text-sm text-gray-700">
                    Signed in as: {user.displayName}
                  </div>
                )}
              </div>
            )}
          </div>
          {/* End of Profile Icon */}
        </div>
        {/* End of the add icon + profile icon group */}
      </div>
    </header>
  );
};

export default Header;
