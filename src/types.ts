export type Chore = {
  id?: string;
  task: string;
  assignee: string;
  day: string;
  color: string;
  completed: boolean;
};

export interface FormState {
  task: string;
  assignee: string;
  day: string;
}
