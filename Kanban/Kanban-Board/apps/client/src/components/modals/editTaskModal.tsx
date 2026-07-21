import ModalForm from "../ModalForm";
import { workspaceNameSchema } from "../../schemes/nameFormValues";
import { useWorkspaceStore } from "../../stores/workSpaceStore";
import { useModalStore } from "../../stores/modalStore";
import { MODAL_TYPE } from "../../types/modal";

const EditTaskModal = () => {
  const modal = useModalStore((state) => state.modal);

  const updateTask = useWorkspaceStore((state) => state.updateTask);

  const closeModal = useModalStore((state) => state.closeModal);
  const openConfirmModal = useModalStore((state) => state.openConfirmModal);
  const closeConfirmModal = useModalStore((state) => state.closeConfirmModal);

  if (!modal || modal.type !== MODAL_TYPE.EDIT_TASK) {
    return null;
  }

  return (
    <ModalForm
      title="Edit task"
      label="Task title"
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
      onSubmit={(title) =>
        openConfirmModal({
          title: "Save task?",
          message: `Rename task to "${title}"?`,
          confirmText: "Save",
          onConfirm: () => {
            updateTask(modal.workspaceId, modal.boardId, modal.taskId, title);
            closeModal();
            closeConfirmModal();
          },
        })
      }
    />
  );
};

export default EditTaskModal;
