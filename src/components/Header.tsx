import { User } from 'firebase/auth';
import React, { useState } from 'react';

import { ProfileIcon } from './Icons';
import ProfileMenu from './ProfileMenu';

interface HeaderProps {
  user: User | null;
  handleGoogleSignIn: () => void;
  handleSignOut: () => void;
}

function Header({ user, handleGoogleSignIn, handleSignOut }: HeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
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
          <ProfileMenu
            user={user}
            handleGoogleSignIn={handleGoogleSignIn}
            handleSignOut={handleSignOut}
            onClose={() => setShowProfileMenu(false)}
          />
        )}
      </div>
    </header>
  );
}

export default Header;
