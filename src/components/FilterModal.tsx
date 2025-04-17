import React, { useEffect, useState } from 'react';

import { Status } from '../../types/status';

interface FilterModalProps {
  onClose: () => void;
  onApplyFilters: (completedFilter: Status, assigneeFilter: string) => void;
  currentCompletedFilter: Status;
  currentAssigneeFilter: string;
  assignees: string[];
}

const FilterModal: React.FC<FilterModalProps> = ({
  onClose,
  onApplyFilters,
  currentCompletedFilter,
  currentAssigneeFilter,
  assignees,
}) => {
  const [completedFilter, setCompletedFilter] = useState<Status>(currentCompletedFilter);
  const [assigneeFilter, setAssigneeFilter] = useState<string>(currentAssigneeFilter);

  // Sync local state with props when the modal is reopened
  useEffect(() => {
    setCompletedFilter(currentCompletedFilter);
    setAssigneeFilter(currentAssigneeFilter);
  }, [currentCompletedFilter, currentAssigneeFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilters(completedFilter, assigneeFilter);
    onClose();
  };

  const handleReset = () => {
    setCompletedFilter('all');
    setAssigneeFilter('all');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4">Filter Chores</h2>
        <form onSubmit={handleSubmit}>
          {/* Completed Filter */}
          <div className="mb-4">
            <label htmlFor="completed-filter" className="block font-medium mb-2">
              Status
            </label>
            <select
              id="completed-filter"
              value={completedFilter}
              onChange={(e) => setCompletedFilter(e.target.value as Status)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="incomplete">Incomplete</option>
            </select>
          </div>

          {/* Assignee Filter */}
          <div className="mb-4">
            <label htmlFor="assignee-filter" className="block font-medium mb-2">
              Assignee
            </label>
            <select
              id="assignee-filter"
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="all">All</option>
              {assignees.map((assignee) => (
                <option key={assignee} value={assignee}>
                  {assignee}
                </option>
              ))}
            </select>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 py-2 px-4 text-base font-medium rounded-md hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-slate-500 text-white py-2 px-4 text-base font-medium rounded-md hover:bg-slate-600 transition"
            >
              Reset
            </button>
            <button
              type="submit"
              className="bg-slate-500 text-white py-2 px-4 text-base font-medium rounded-md hover:bg-slate-600 transition"
            >
              Apply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilterModal;
