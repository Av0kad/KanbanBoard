import ModalForm from "../ModalForm";
import { workspaceNameSchema } from "../../schemes/nameFormValues";
import { useWorkspaceStore } from "../../stores/workSpaceStore";
import { useModalStore } from "../../stores/modalStore";
import { MODAL_TYPE } from "../../types/modal";

const CreateBoardModal = () => {
  const modal = useModalStore((state) => state.modal);
  const addBoard = useWorkspaceStore((state) => state.addBoard);

  const closeModal = useModalStore((state) => state.closeModal);
  const openConfirmModal = useModalStore((state) => state.openConfirmModal);
  const closeConfirmModal = useModalStore((state) => state.closeConfirmModal);

  if (!modal || modal.type !== MODAL_TYPE.CREATE_BOARD) return null;

  return (
    <ModalForm
      title="Create board"
      label="Board name"
      submitText="Create"
      schema={workspaceNameSchema}
      onRequestClose={() =>
        openConfirmModal({
          title: "Close modal?",
          message: "Are you sure you want to close this form?",
          confirmText: "Close",
          onConfirm: () => {
            closeModal();
            closeConfirmModal();
          },
        })
      }
      onSubmit={(name) =>
        openConfirmModal({
          title: "Create board?",
          message: `Create board "${name}"?`,
          confirmText: "Create",
          onConfirm: () => {
            addBoard(modal.workspaceId, name);
            closeModal();
            closeConfirmModal();
          },
        })
      }
    />
  );
};

export default CreateBoardModal;
