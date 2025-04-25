import { User } from 'firebase/auth';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ProfileMenuProps {
  user: User | null;
  handleGoogleSignIn: () => void;
  handleSignOut: () => void;
  onClose: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  user,
  handleGoogleSignIn,
  handleSignOut,
  onClose,
}) => {
  const navigate = useNavigate();

  const handleAuthClick = () => {
    onClose(); // close the menu
    if (user) {
      handleSignOut();
    } else {
      handleGoogleSignIn();
    }
  };

  const handleNavigate = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50 font-[Inter]">
      <div className="py-2">
        <button
          onClick={handleAuthClick}
          className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-left"
          style={{ fontSize: '16px' }}
        >
          {user ? 'Sign Out' : 'Sign In with Google'}
        </button>
        {user && (
          <div>
            <button
              onClick={() => handleNavigate('/households')}
              className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-left"
              style={{ fontSize: '16px' }}
            >
              View My Households
            </button>
            <button
              onClick={() => handleNavigate('/join-household')}
              className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-left"
              style={{ fontSize: '16px' }}
            >
              Join a Household
            </button>
            <button
              onClick={() => handleNavigate('/view-profile')}
              className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-left"
              style={{ fontSize: '16px' }}
            >
              View Profile
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
  );
};

export default ProfileMenu;
