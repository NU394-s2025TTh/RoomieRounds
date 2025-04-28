import { useEffect, useState } from 'react';

import { db, onValue, push, ref, set, update } from '../firebase';
import { Chore, FormState } from '../types';
import { getColorForAssignee } from '../utils/getColorForAssignee';

export const useChores = () => {
  const [chores, setChores] = useState<Chore[]>([]);
  const [filteredChores, setFilteredChores] = useState<Chore[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formState, setFormState] = useState<FormState>({
    task: '',
    assignee: '',
    day: new Date().toISOString(),
  });
  const [editChore, setEditChore] = useState<Chore | null>(null);

  useEffect(() => {
    const choresRef = ref(db, 'chores');
    onValue(choresRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedChores = Object.entries(data as Record<string, Chore>).map(
          ([id, value]) => ({
            id,
            ...value,
          }),
        );
        setChores(loadedChores);
        setFilteredChores(loadedChores);
      }
    });
  }, []);

  const handleAddChore = async () => {
    const { task, assignee, day } = formState;
    if (!task || !assignee || !day) return;

    const color = `${getColorForAssignee(assignee)} bg-opacity-20`;
    const newChore: Omit<Chore, 'id'> = {
      task,
      assignee,
      day,
      color: `${color} bg-opacity-20`,
      completed: false,
    };

    const choreRef = push(ref(db, 'chores'));
    await set(choreRef, newChore);

    resetForm();
  };

  const handleUpdateChore = async () => {
    const { task, assignee, day } = formState;
    if (!task || !assignee || !day || !editChore) return;

    const color = `${getColorForAssignee(assignee)} bg-opacity-20`;
    const updatedChore = {
      task,
      assignee,
      day,
      color: `${color} bg-opacity-20`,
      completed: editChore.completed,
    };

    const choreRef = ref(db, `chores/${editChore.id}`);
    await update(choreRef, updatedChore);

    const updatedChores = chores.map((chore) =>
      chore.id === editChore.id ? { ...chore, ...updatedChore } : chore,
    );

    setChores(updatedChores);
    resetForm();
  };

  const handleEditChore = (chore: Chore) => {
    if (editChore && editChore.id === chore.id) {
      resetForm();
    } else {
      setEditChore(chore);
      setFormState({
        task: chore.task,
        assignee: chore.assignee,
        day: chore.day,
      });
      setShowForm(true);
    }
  };

  const handleSwapChores = () => {
    const confirmable = window.confirm('Are you sure you want to shuffle the chores?');
    if (!confirmable) return;

    const assignees = chores.map((c) => c.assignee);
    const shuffled = [...assignees].sort(() => Math.random() - 0.5);

    const updatedChores = chores.map((chore, i) => {
      const newAssignee = shuffled[i];
      return {
        ...chore,
        assignee: newAssignee,
        color: `${getColorForAssignee(newAssignee)} bg-opacity-20`,
      };
    });

    updatedChores.forEach((chore) => {
      if (chore.id) {
        const choreRef = ref(db, `chores/${chore.id}`);
        update(choreRef, {
          assignee: chore.assignee,
          color: chore.color,
        });
      }
    });

    setChores(updatedChores);
  };

  const handleDeleteChore = async (choreId: string) => {
    const confirmable = window.confirm('Are you sure you want to delete this chore?');
    if (!confirmable) return;

    const choreRef = ref(db, `chores/${choreId}`);
    await set(choreRef, null);

    setChores((prev) => prev.filter((chore) => chore.id !== choreId));
  };

  const resetForm = () => {
    setFormState({
      task: '',
      assignee: '',
      day: new Date().toISOString(),
    });
    setEditChore(null);
    setShowForm(false);
  };

  return {
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
  };
};
