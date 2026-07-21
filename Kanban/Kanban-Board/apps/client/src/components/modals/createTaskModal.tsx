import ModalForm from "../ModalForm";
import { workspaceNameSchema } from "../../schemes/nameFormValues";
import { useWorkspaceStore } from "../../stores/workSpaceStore";
import { useModalStore } from "../../stores/modalStore";
import { MODAL_TYPE } from "../../types/modal";

const CreateTaskModal = () => {
  const modal = useModalStore((state) => state.modal);

  const addTask = useWorkspaceStore((state) => state.addTask);

  const closeModal = useModalStore((state) => state.closeModal);
  const openConfirmModal = useModalStore((state) => state.openConfirmModal);
  const closeConfirmModal = useModalStore((state) => state.closeConfirmModal);

  if (!modal || modal.type !== MODAL_TYPE.CREATE_TASK) {
    return null;
  }

  return (
    <ModalForm
      title="Create task"
      label="Task title"
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
      onSubmit={(title) =>
        openConfirmModal({
          title: "Create task?",
          message: `Create task "${title}"?`,
          confirmText: "Create",
          onConfirm: () => {
            addTask(modal.workspaceId, modal.boardId, title);
            closeModal();
            closeConfirmModal();
          },
        })
      }
    />
  );
};

export default CreateTaskModal;
