import './App.css';
import 'react-datepicker/dist/react-datepicker.css';

import React from 'react';

import { Status } from '../types/status';
import ChoresList from './components/ChoresList';
import Footer from './components/Footer';
import Header from './components/Header';
import { useAuth } from './hooks/useAuth';
import { useChores } from './hooks/useChores';

function App() {
  const {
    chores,
    filteredChores,
    setFilteredChores,
    handleAddChore,
    handleUpdateChore,
    handleEditChore,
    handleDeleteChore,
    handleSwapChores,
    showForm,
    setShowForm,
    formState,
    setFormState,
    editChore,
    resetForm,
  } = useChores();

  // Filter hook
  const [showFilters, setShowFilters] = React.useState<boolean>(false);
  const [completedFilter, setCompletedFilter] = React.useState<Status>('all');
  const [assigneeFilter, setAssigneeFilter] = React.useState<string>('all');

  // Apply filters whenever chores or filter settings change
  React.useEffect(() => {
    handleApplyFilters(completedFilter, assigneeFilter);
  }, [chores, completedFilter, assigneeFilter]);

  const handleApplyFilters = (status: Status, assignee: string) => {
    let filtered = [...chores];

    if (status !== 'all') {
      filtered = filtered.filter((chore) =>
        status === 'completed' ? chore.completed : !chore.completed,
      );
    }

    if (assignee !== 'all') {
      filtered = filtered.filter((chore) => chore.assignee === assignee);
    }

    setFilteredChores(filtered);
    setShowFilters(false);
  };

  const { user, showProfileMenu, setShowProfileMenu, handleGoogleSignIn, handleSignOut } =
    useAuth();

  return (
    <div className="App">
      <div className="min-h-screen flex flex-col justify-between bg-slate-100 text-black font-[Inter]">
        <Header
          handleSwapChores={handleSwapChores}
          setShowForm={setShowForm}
          resetForm={resetForm}
          setFormState={setFormState}
          user={user}
          showProfileMenu={showProfileMenu}
          setShowProfileMenu={setShowProfileMenu}
          handleGoogleSignIn={handleGoogleSignIn}
          handleSignOut={handleSignOut}
        />

        <ChoresList
          filteredChores={filteredChores}
          chores={chores}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          completedFilter={completedFilter}
          assigneeFilter={assigneeFilter}
          handleApplyFilters={(status, assignee) => {
            setCompletedFilter(status);
            setAssigneeFilter(assignee);
            handleApplyFilters(status, assignee);
          }}
          showForm={showForm}
          resetForm={resetForm}
          formState={formState}
          setFormState={setFormState}
          handleAddChore={handleAddChore}
          handleUpdateChore={handleUpdateChore}
          handleEditChore={handleEditChore}
          handleDeleteChore={handleDeleteChore}
          editChore={editChore}
        />

        <Footer />
      </div>
    </div>
  );
}

export default App;
