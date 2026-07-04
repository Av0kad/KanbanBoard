import { create } from "zustand";
import { MODAL_TYPE } from "../types/modal";

type ModalState =
  | null
  | {
      type: typeof MODAL_TYPE.CREATE_WORKSPACE;
    }
  | {
      type: typeof MODAL_TYPE.EDIT_WORKSPACE;
      workspaceId: string;
      initialValue: string;
    }
  | {
      type: typeof MODAL_TYPE.CREATE_BOARD;
      workspaceId: string;
    }
  | {
      type: typeof MODAL_TYPE.EDIT_BOARD;
      workspaceId: string;
      boardId: string;
      initialValue: string;
    }
  | {
      type: typeof MODAL_TYPE.CREATE_TASK;
      workspaceId: string;
      boardId: string;
    }
  | {
      type: typeof MODAL_TYPE.EDIT_TASK;
      workspaceId: string;
      boardId: string;
      taskId: string;
      initialValue: string;
    };

type ConfirmModalState = null | {
  title: string;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
};

type ModalStore = {
  modal: ModalState;
  confirmModal: ConfirmModalState;

  openModal: (modal: Exclude<ModalState, null>) => void;
  closeModal: () => void;

  openConfirmModal: (confirmModal: Exclude<ConfirmModalState, null>) => void;
  closeConfirmModal: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  modal: null,
  confirmModal: null,

  openModal: (modal) => {
    set({ modal });
  },

  closeModal: () => {
    set({ modal: null });
  },

  openConfirmModal: (confirmModal) => {
    set({ confirmModal });
  },

  closeConfirmModal: () => {
    set({ confirmModal: null });
  },
}));
