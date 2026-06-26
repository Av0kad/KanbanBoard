// stores/workspaceStore.ts
import { create } from "zustand";
import { mockData } from "../data/mockData";
import type { Board, Task, Workspace } from "../types/workspace";

type WorkspaceStore = {
  workspaces: Workspace[];
  selectedWorkspaceId: string;

  setSelectedWorkspaceId: (workspaceId: string) => void;

  addWorkspace: (name: string) => void;
  updateWorkspace: (workspaceId: string, name: string) => void;
  deleteWorkspace: (workspaceId: string) => void;

  addBoard: (workspaceId: string, name: string) => void;
  updateBoard: (workspaceId: string, boardId: string, name: string) => void;
  deleteBoard: (workspaceId: string, boardId: string) => void;
  moveBoard: (
    workspaceId: string,
    boardId: string,
    direction: "left" | "right",
  ) => void;

  addTask: (workspaceId: string, boardId: string, title: string) => void;
  updateTask: (
    workspaceId: string,
    boardId: string,
    taskId: string,
    title: string,
  ) => void;
  deleteTask: (workspaceId: string, boardId: string, taskId: string) => void;
};

const createId = () => crypto.randomUUID();

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  workspaces: structuredClone(mockData.workspaces),
  selectedWorkspaceId: mockData.workspaces[0]?.id ?? "",

  setSelectedWorkspaceId: (workspaceId) => {
    set({ selectedWorkspaceId: workspaceId });
  },

  addWorkspace: (name) => {
    const newWorkspace: Workspace = {
      id: createId(),
      name,
      boards: [],
    };

    set((state) => ({
      workspaces: [...state.workspaces, newWorkspace],
      selectedWorkspaceId: newWorkspace.id,
    }));
  },

  updateWorkspace: (workspaceId, name) => {
    set((state) => ({
      workspaces: state.workspaces.map((workspace) =>
        workspace.id === workspaceId ? { ...workspace, name } : workspace,
      ),
    }));
  },

  deleteWorkspace: (workspaceId) => {
    set((state) => {
      const nextWorkspaces = state.workspaces.filter(
        (workspace) => workspace.id !== workspaceId,
      );

      const shouldChangeSelectedWorkspace =
        state.selectedWorkspaceId === workspaceId;

      return {
        workspaces: nextWorkspaces,
        selectedWorkspaceId: shouldChangeSelectedWorkspace
          ? (nextWorkspaces[0]?.id ?? "")
          : state.selectedWorkspaceId,
      };
    });
  },

  addBoard: (workspaceId, name) => {
    const newBoard: Board = {
      id: createId(),
      name,
      tasks: [],
    };

    set((state) => ({
      workspaces: state.workspaces.map((workspace) =>
        workspace.id === workspaceId
          ? {
              ...workspace,
              boards: [...workspace.boards, newBoard],
            }
          : workspace,
      ),
    }));
  },

  updateBoard: (workspaceId, boardId, name) => {
    set((state) => ({
      workspaces: state.workspaces.map((workspace) =>
        workspace.id === workspaceId
          ? {
              ...workspace,
              boards: workspace.boards.map((board) =>
                board.id === boardId ? { ...board, name } : board,
              ),
            }
          : workspace,
      ),
    }));
  },

  deleteBoard: (workspaceId, boardId) => {
    set((state) => ({
      workspaces: state.workspaces.map((workspace) =>
        workspace.id === workspaceId
          ? {
              ...workspace,
              boards: workspace.boards.filter((board) => board.id !== boardId),
            }
          : workspace,
      ),
    }));
  },

  moveBoard: (workspaceId, boardId, direction) => {
    set((state) => ({
      workspaces: state.workspaces.map((workspace) => {
        if (workspace.id !== workspaceId) return workspace;

        const currentIndex = workspace.boards.findIndex(
          (board) => board.id === boardId,
        );

        if (currentIndex === -1) return workspace;

        const nextIndex =
          direction === "left" ? currentIndex - 1 : currentIndex + 1;

        if (nextIndex < 0 || nextIndex >= workspace.boards.length) {
          return workspace;
        }

        const nextBoards = [...workspace.boards];
        const [movedBoard] = nextBoards.splice(currentIndex, 1);
        nextBoards.splice(nextIndex, 0, movedBoard);

        return {
          ...workspace,
          boards: nextBoards,
        };
      }),
    }));
  },

  addTask: (workspaceId, boardId, title) => {
    const newTask: Task = {
      id: createId(),
      title,
    };

    set((state) => ({
      workspaces: state.workspaces.map((workspace) =>
        workspace.id === workspaceId
          ? {
              ...workspace,
              boards: workspace.boards.map((board) =>
                board.id === boardId
                  ? {
                      ...board,
                      tasks: [...board.tasks, newTask],
                    }
                  : board,
              ),
            }
          : workspace,
      ),
    }));
  },

  updateTask: (workspaceId, boardId, taskId, title) => {
    set((state) => ({
      workspaces: state.workspaces.map((workspace) =>
        workspace.id === workspaceId
          ? {
              ...workspace,
              boards: workspace.boards.map((board) =>
                board.id === boardId
                  ? {
                      ...board,
                      tasks: board.tasks.map((task) =>
                        task.id === taskId ? { ...task, title } : task,
                      ),
                    }
                  : board,
              ),
            }
          : workspace,
      ),
    }));
  },

  deleteTask: (workspaceId, boardId, taskId) => {
    set((state) => ({
      workspaces: state.workspaces.map((workspace) =>
        workspace.id === workspaceId
          ? {
              ...workspace,
              boards: workspace.boards.map((board) =>
                board.id === boardId
                  ? {
                      ...board,
                      tasks: board.tasks.filter((task) => task.id !== taskId),
                    }
                  : board,
              ),
            }
          : workspace,
      ),
    }));
  },
}));
