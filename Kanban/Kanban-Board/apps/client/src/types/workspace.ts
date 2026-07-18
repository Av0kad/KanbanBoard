export type Task = {
  id: string;
  title: string;
};

export type Board = {
  id: string;
  title: string;
  tasks: Task[];
};

export type Workspace = {
  id: string;
  title: string;
  ownerId: string;
  boards: Board[];
};

export type MockData = {
  workspaces: Workspace[];
};
