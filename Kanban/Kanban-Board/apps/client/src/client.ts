const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export const AUTH_EXPIRED_EVENT = "auth-expired";

export type User = {
  id: string;
  email: string;
  name: string | null;
};

export type AuthResponse = {
  accessToken: string;
  user: User;
};

export type Task = {
  id: string;
  title: string;
  boardId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Board = {
  id: string;
  title: string;
  workspaceId?: string;
  tasks: Task[];
  createdAt?: string;
  updatedAt?: string;
};

export type WorkspaceMember = {
  id: string;
  role: "OWNER" | "MEMBER";
  user: User;
  createdAt?: string;
};

export type Workspace = {
  id: string;
  title: string;
  ownerId: string;
  boards: Board[];
  members?: WorkspaceMember[];
  createdAt?: string;
  updatedAt?: string;
};

export type RegisterData = {
  email: string;
  password: string;
  name?: string;
};

export type LoginData = {
  email: string;
  password: string;
};

type ApiErrorResponse = {
  message?: string | string[];
  error?: string;
};

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("accessToken");
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authUser");

    window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
  }

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;

    try {
      const errorData = (await response.json()) as ApiErrorResponse;

      if (Array.isArray(errorData.message)) {
        errorMessage = errorData.message.join(", ");
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch {
      // Відповідь сервера не містить JSON.
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const responseText = await response.text();

  if (!responseText) {
    return undefined as T;
  }

  return JSON.parse(responseText) as T;
}

/*
 * Authentication
 */

export function register(data: RegisterData) {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function login(data: LoginData) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/*
 * Workspaces
 */

export function getWorkspaces() {
  return apiRequest<Workspace[]>("/workspaces");
}

export function createWorkspace(title: string) {
  return apiRequest<Workspace>("/workspaces", {
    method: "POST",
    body: JSON.stringify({
      title,
    }),
  });
}

export function updateWorkspace(workspaceId: string, title: string) {
  return apiRequest<Workspace>(`/workspaces/${workspaceId}`, {
    method: "PATCH",
    body: JSON.stringify({
      title,
    }),
  });
}

export function deleteWorkspace(workspaceId: string) {
  return apiRequest<Workspace>(`/workspaces/${workspaceId}`, {
    method: "DELETE",
  });
}

export function inviteWorkspaceMember(workspaceId: string, email: string) {
  return apiRequest<WorkspaceMember>(`/workspaces/${workspaceId}/members`, {
    method: "POST",
    body: JSON.stringify({
      email,
    }),
  });
}

/*
 * Boards
 */

export function createBoard(workspaceId: string, title: string) {
  return apiRequest<Board>(`/workspaces/${workspaceId}/boards`, {
    method: "POST",
    body: JSON.stringify({
      title,
    }),
  });
}

export function updateBoard(boardId: string, title: string) {
  return apiRequest<Board>(`/boards/${boardId}`, {
    method: "PATCH",
    body: JSON.stringify({
      title,
    }),
  });
}

export function deleteBoard(boardId: string) {
  return apiRequest<Board>(`/boards/${boardId}`, {
    method: "DELETE",
  });
}

/*
 * Tasks
 */

export function createTask(boardId: string, title: string) {
  return apiRequest<Task>(`/boards/${boardId}/tasks`, {
    method: "POST",
    body: JSON.stringify({
      title,
    }),
  });
}

export function updateTask(
  taskId: string,
  data: {
    title?: string;
    boardId?: string;
  },
) {
  return apiRequest<Task>(`/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteTask(taskId: string) {
  return apiRequest<Task>(`/tasks/${taskId}`, {
    method: "DELETE",
  });
}
