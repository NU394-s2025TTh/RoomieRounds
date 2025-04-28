import { useEffect, useState } from 'react';

import { Status } from '../../types/status';
import { Chore } from '../types';

export const useFilters = (
  chores: Chore[],
  setFilteredChores: (chores: Chore[]) => void,
) => {
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [completedFilter, setCompletedFilter] = useState<Status>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');

  useEffect(() => {
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

    // Update local state
    setCompletedFilter(status);
    setAssigneeFilter(assignee);
  };

  return {
    showFilters,
    setShowFilters,
    completedFilter,
    assigneeFilter,
    handleApplyFilters,
  };
};
