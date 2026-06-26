export type Task = {
  id: string;
  title: string;
};

export type Board = {
  id: string;
  name: string;
  tasks: Task[];
};

export type Workspace = {
  id: string;
  name: string;
  boards: Board[];
};

export type MockData = {
  workspaces: Workspace[];
};
