export const MODAL_TYPE = {
  CREATE_WORKSPACE: "create-workspace",
  EDIT_WORKSPACE: "edit-workspace",
  CREATE_BOARD: "create-board",
  EDIT_BOARD: "edit-board",
  CREATE_TASK: "create-task",
  EDIT_TASK: "edit-task",
  INVITE_MEMBER: "invite-member",
} as const;

export type ModalType = (typeof MODAL_TYPE)[keyof typeof MODAL_TYPE];
