import { create } from "zustand";

import {
  AUTH_EXPIRED_EVENT,
  login as apiLogin,
  register as apiRegister,
  type LoginData,
  type RegisterData,
  type User,
} from "../client";
import { useWorkspaceStore } from "./workSpaceStore";

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
};

function getStoredUser(): User | null {
  const rawUser = localStorage.getItem("authUser");
  const token = localStorage.getItem("accessToken");

  if (!rawUser || !token) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as User;
  } catch {
    localStorage.removeItem("authUser");
    localStorage.removeItem("accessToken");

    return null;
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Authentication failed";
}

function clearSession() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("authUser");

  useWorkspaceStore.getState().reset();
}

const storedUser = getStoredUser();

export const useAuthStore = create<AuthStore>((set) => ({
  user: storedUser,
  isAuthenticated: storedUser !== null,
  isLoading: false,
  error: null,

  clearError: () => {
    set({ error: null });
  },

  login: async (data) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await apiLogin(data);

      localStorage.setItem("accessToken", response.accessToken);

      localStorage.setItem("authUser", JSON.stringify(response.user));

      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: getErrorMessage(error),
      });

      throw error;
    }
  },

  register: async (data) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await apiRegister(data);

      localStorage.setItem("accessToken", response.accessToken);

      localStorage.setItem("authUser", JSON.stringify(response.user));

      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: getErrorMessage(error),
      });

      throw error;
    }
  },

  logout: () => {
    clearSession();

    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },
}));

window.addEventListener(AUTH_EXPIRED_EVENT, () => {
  useAuthStore.getState().logout();
});
