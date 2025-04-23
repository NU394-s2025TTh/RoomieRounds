import { User } from 'firebase/auth';

// TODO: need firebase integration for pulling proper household data for the current user
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Household } from '../types';
// import { db, onValue, push, ref, set, update } from '../firebase';

interface LoginPageProps {
  user: User | null;
}

export default function LoginPage({ user }: LoginPageProps) {
  return (
    <div className="flex flex-col justify-between flex-grow">
      <main className="flex flex-col gap-4 mt-4 flex-grow">
        {!user && <p> Click on the profile icon to sign in! </p>}
      </main>
    </div>
  );
}
