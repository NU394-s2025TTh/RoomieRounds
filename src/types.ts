export type Chore = {
  id?: string;
  task: string;
  assignee: string;
  day: string;
  color: string;
  completed: boolean;
};

export type Person = {
  name: string;
  phoneNumber: string;
};
