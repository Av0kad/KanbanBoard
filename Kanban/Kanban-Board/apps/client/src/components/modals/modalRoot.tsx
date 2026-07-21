import type { ReactNode } from "react";
import { useModalStore } from "../../stores/modalStore";
import { MODAL_TYPE } from "../../types/modal";

import InviteMemberModal from "./inviteModal";
import CreateWorkspaceModal from "./createWorkspaceModal";
import EditWorkspaceModal from "./editWorkspaceModal";
import CreateBoardModal from "./createBoardModal";
import EditBoardModal from "./editBoardModal";
import CreateTaskModal from "./createTaskModal";
import EditTaskModal from "./editTaskModal";
import ConfirmModal from "./confirmModal";

const modalTypeComponentMap: Record<string, ReactNode> = {
  [MODAL_TYPE.CREATE_WORKSPACE]: <CreateWorkspaceModal />,
  [MODAL_TYPE.EDIT_WORKSPACE]: <EditWorkspaceModal />,
  [MODAL_TYPE.CREATE_BOARD]: <CreateBoardModal />,
  [MODAL_TYPE.EDIT_BOARD]: <EditBoardModal />,
  [MODAL_TYPE.CREATE_TASK]: <CreateTaskModal />,
  [MODAL_TYPE.EDIT_TASK]: <EditTaskModal />,
  [MODAL_TYPE.INVITE_MEMBER]: <InviteMemberModal />,
};

const ModalRoot = () => {
  const modal = useModalStore((state) => state.modal);
  const confirmModal = useModalStore((state) => state.confirmModal);

  return (
    <>
      {modal ? modalTypeComponentMap[modal.type] : null}
      {confirmModal ? <ConfirmModal /> : null}
    </>
  );
};

export default ModalRoot;
