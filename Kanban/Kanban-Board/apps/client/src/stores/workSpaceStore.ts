import { create } from "zustand";

import {
  createBoard as apiCreateBoard,
  createTask as apiCreateTask,
  createWorkspace as apiCreateWorkspace,
  deleteBoard as apiDeleteBoard,
  deleteTask as apiDeleteTask,
  deleteWorkspace as apiDeleteWorkspace,
  getWorkspaces,
  updateBoard as apiUpdateBoard,
  updateTask as apiUpdateTask,
  updateWorkspace as apiUpdateWorkspace,
} from "../client";

import type { Workspace } from "../types/workspace";

type WorkspaceStore = {
  workspaces: Workspace[];
  selectedWorkspaceId: string;
  isLoading: boolean;
  error: string | null;

  loadWorkspaces: () => Promise<void>;
  clearError: () => void;

  setSelectedWorkspaceId: (workspaceId: string) => void;

  addWorkspace: (title: string) => Promise<void>;
  updateWorkspace: (workspaceId: string, title: string) => Promise<void>;
  deleteWorkspace: (workspaceId: string) => Promise<void>;

  addBoard: (workspaceId: string, title: string) => Promise<void>;

  updateBoard: (
    workspaceId: string,
    boardId: string,
    title: string,
  ) => Promise<void>;

  deleteBoard: (workspaceId: string, boardId: string) => Promise<void>;

  moveBoard: (
    workspaceId: string,
    boardId: string,
    direction: "left" | "right",
  ) => void;

  addTask: (
    workspaceId: string,
    boardId: string,
    title: string,
  ) => Promise<void>;

  updateTask: (
    workspaceId: string,
    boardId: string,
    taskId: string,
    title: string,
  ) => Promise<void>;

  deleteTask: (
    workspaceId: string,
    boardId: string,
    taskId: string,
  ) => Promise<void>;
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}

export const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  workspaces: [],
  selectedWorkspaceId: "",
  isLoading: false,
  error: null,

  clearError: () => {
    set({ error: null });
  },

  setSelectedWorkspaceId: (workspaceId) => {
    set({ selectedWorkspaceId: workspaceId });
  },

  loadWorkspaces: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const workspaces = await getWorkspaces();
      const currentSelectedId = get().selectedWorkspaceId;

      const selectedWorkspaceStillExists = workspaces.some(
        (workspace) => workspace.id === currentSelectedId,
      );

      set({
        workspaces,
        selectedWorkspaceId: selectedWorkspaceStillExists
          ? currentSelectedId
          : (workspaces[0]?.id ?? ""),
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: getErrorMessage(error),
      });
    }
  },

  addWorkspace: async (title) => {
    set({ error: null });

    try {
      const newWorkspace = await apiCreateWorkspace(title);

      set((state) => ({
        workspaces: [...state.workspaces, newWorkspace],
        selectedWorkspaceId: newWorkspace.id,
      }));
    } catch (error) {
      set({
        error: getErrorMessage(error),
      });
    }
  },

  updateWorkspace: async (workspaceId, title) => {
    set({ error: null });

    try {
      const updatedWorkspace = await apiUpdateWorkspace(workspaceId, title);

      set((state) => ({
        workspaces: state.workspaces.map((workspace) =>
          workspace.id === workspaceId
            ? {
                ...workspace,
                ...updatedWorkspace,
              }
            : workspace,
        ),
      }));
    } catch (error) {
      set({
        error: getErrorMessage(error),
      });
    }
  },

  deleteWorkspace: async (workspaceId) => {
    set({ error: null });

    try {
      await apiDeleteWorkspace(workspaceId);

      set((state) => {
        const nextWorkspaces = state.workspaces.filter(
          (workspace) => workspace.id !== workspaceId,
        );

        const workspaceWasSelected = state.selectedWorkspaceId === workspaceId;

        return {
          workspaces: nextWorkspaces,
          selectedWorkspaceId: workspaceWasSelected
            ? (nextWorkspaces[0]?.id ?? "")
            : state.selectedWorkspaceId,
        };
      });
    } catch (error) {
      set({
        error: getErrorMessage(error),
      });
    }
  },

  addBoard: async (workspaceId, title) => {
    set({ error: null });

    try {
      const newBoard = await apiCreateBoard(workspaceId, title);

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
    } catch (error) {
      set({
        error: getErrorMessage(error),
      });
    }
  },

  updateBoard: async (workspaceId, boardId, title) => {
    set({ error: null });

    try {
      const updatedBoard = await apiUpdateBoard(boardId, title);

      set((state) => ({
        workspaces: state.workspaces.map((workspace) =>
          workspace.id === workspaceId
            ? {
                ...workspace,
                boards: workspace.boards.map((board) =>
                  board.id === boardId
                    ? {
                        ...board,
                        ...updatedBoard,
                      }
                    : board,
                ),
              }
            : workspace,
        ),
      }));
    } catch (error) {
      set({
        error: getErrorMessage(error),
      });
    }
  },

  deleteBoard: async (workspaceId, boardId) => {
    set({ error: null });

    try {
      await apiDeleteBoard(boardId);

      set((state) => ({
        workspaces: state.workspaces.map((workspace) =>
          workspace.id === workspaceId
            ? {
                ...workspace,
                boards: workspace.boards.filter(
                  (board) => board.id !== boardId,
                ),
              }
            : workspace,
        ),
      }));
    } catch (error) {
      set({
        error: getErrorMessage(error),
      });
    }
  },

  /*
   * Поки що зміна порядку board залишається локальною.
   * Для збереження після перезавантаження backend
   * повинен мати поле position і reorder endpoint.
   */
  moveBoard: (workspaceId, boardId, direction) => {
    set((state) => ({
      workspaces: state.workspaces.map((workspace) => {
        if (workspace.id !== workspaceId) {
          return workspace;
        }

        const currentIndex = workspace.boards.findIndex(
          (board) => board.id === boardId,
        );

        if (currentIndex === -1) {
          return workspace;
        }

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

  addTask: async (workspaceId, boardId, title) => {
    set({ error: null });

    try {
      const newTask = await apiCreateTask(boardId, title);

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
    } catch (error) {
      set({
        error: getErrorMessage(error),
      });
    }
  },

  updateTask: async (workspaceId, boardId, taskId, title) => {
    set({ error: null });

    try {
      const updatedTask = await apiUpdateTask(taskId, {
        title,
      });

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
                          task.id === taskId
                            ? {
                                ...task,
                                ...updatedTask,
                              }
                            : task,
                        ),
                      }
                    : board,
                ),
              }
            : workspace,
        ),
      }));
    } catch (error) {
      set({
        error: getErrorMessage(error),
      });
    }
  },

  deleteTask: async (workspaceId, boardId, taskId) => {
    set({ error: null });

    try {
      await apiDeleteTask(taskId);

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
    } catch (error) {
      set({
        error: getErrorMessage(error),
      });
    }
  },
}));
