import { User } from 'firebase/auth';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ProfilePageProps {
  user: User | null;
  handleGoogleSignIn: () => void;
  handleSignOut: () => void;
}

const ViewProfilePage: React.FC<ProfilePageProps> = ({
  user,
  handleGoogleSignIn,
  handleSignOut,
}) => {
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (user) {
      handleSignOut();
    } else {
      handleGoogleSignIn();
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4 bg-gray-100">
      {/* Pastel card */}
      <div className="max-w-md w-full bg-slate-100 rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          {user && (
            <div className="flex flex-col items-center text-center">
              <img
                src={user.photoURL || '/default-profile.png'}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover mb-4"
              />
              <h2 className="text-2xl font-bold mb-1 text-gray-700">
                {user.displayName}
              </h2>
              <hr className="w-1/2 border-t border-gray-400 my-4" />
              <span className="text-sm text-gray-600 mb-4">{user.email}</span>
            </div>
          )}
          <div className="space-y-3">
            <button
              onClick={handleAuthClick}
              className="w-full px-4 py-2 bg-indigo-300 text-white rounded-md hover:bg-indigo-400 transition-colors text-sm"
            >
              {user ? 'Sign Out' : 'Sign In with Google'}
            </button>
            {user && (
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handleNavigate('/households')}
                  className="w-full px-4 py-2 border border-indigo-300 text-gray-600 rounded-md hover:bg-indigo-100 transition-colors text-sm"
                >
                  View My Households
                </button>
                <button
                  onClick={() => handleNavigate('/join-household')}
                  className="w-full px-4 py-2 border border-indigo-300 text-gray-600 rounded-md hover:bg-indigo-100 transition-colors text-sm"
                >
                  Join a Household
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfilePage;
