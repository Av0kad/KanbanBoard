import ModalForm from "../ModalForm";
import { workspaceNameSchema } from "../../schemes/nameFormValues";
import { useWorkspaceStore } from "../../stores/workSpaceStore";
import { useModalStore } from "../../stores/modalStore";
import { MODAL_TYPE } from "../../types/modal";

const EditBoardModal = () => {
  const modal = useModalStore((state) => state.modal);

  const updateBoard = useWorkspaceStore((state) => state.updateBoard);

  const closeModal = useModalStore((state) => state.closeModal);
  const openConfirmModal = useModalStore((state) => state.openConfirmModal);
  const closeConfirmModal = useModalStore((state) => state.closeConfirmModal);

  if (!modal || modal.type !== MODAL_TYPE.EDIT_BOARD) {
    return null;
  }

  return (
    <ModalForm
      title="Edit board"
      label="Board name"
      initialValue={modal.initialValue}
      submitText="Save"
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
          title: "Save board?",
          message: `Rename board to "${name}"?`,
          confirmText: "Save",
          onConfirm: () => {
            updateBoard(modal.workspaceId, modal.boardId, name);
            closeModal();
            closeConfirmModal();
          },
        })
      }
    />
  );
};

export default EditBoardModal;
