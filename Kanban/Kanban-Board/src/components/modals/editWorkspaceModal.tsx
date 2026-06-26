import ModalForm from "../ModalForm";
import { workspaceNameVal } from "../../schemes/nameFormValues";
import { useWorkspaceStore } from "../../stores/workSpaceStore";
import { useModalStore } from "../../stores/modalStore";

const CreateWorkspaceModal = () => {
  const addWorkspace = useWorkspaceStore((state) => state.addWorkspace);

  const closeModal = useModalStore((state) => state.closeModal);
  const openConfirmModal = useModalStore((state) => state.openConfirmModal);
  const closeConfirmModal = useModalStore((state) => state.closeConfirmModal);

  return (
    <ModalForm
      title="Create workspace"
      label="Workspace name"
      submitText="Create"
      schema={workspaceNameVal}
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
          title: "Create workspace?",
          message: `Create workspace "${name}"?`,
          confirmText: "Create",
          onConfirm: () => {
            addWorkspace(name);
            closeModal();
            closeConfirmModal();
          },
        })
      }
    />
  );
};

export default CreateWorkspaceModal;
