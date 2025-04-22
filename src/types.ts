export type Chore = {
  id?: string;
  task: string;
  assignee: string;
  day: string;
  color: string;
  completed: boolean;
};

export type Household = {
  id?: string;
  name: string;
  chores: Chore[];
  members: string[];
  color: string;
};

export type Status = 'all' | 'completed' | 'incomplete';
