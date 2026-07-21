import ModalForm from "../ModalForm";
import { workspaceNameSchema } from "../../schemes/nameFormValues";
import { useWorkspaceStore } from "../../stores/workSpaceStore";
import { useModalStore } from "../../stores/modalStore";
import { MODAL_TYPE } from "../../types/modal";

const CreateWorkspaceModal = () => {
  const modal = useModalStore((state) => state.modal);
  const addWorkspace = useWorkspaceStore((state) => state.addWorkspace);

  const closeModal = useModalStore((state) => state.closeModal);
  const openConfirmModal = useModalStore((state) => state.openConfirmModal);
  const closeConfirmModal = useModalStore((state) => state.closeConfirmModal);

  if (!modal || modal.type !== MODAL_TYPE.CREATE_WORKSPACE) {
    return null;
  }

  return (
    <ModalForm
      title="Create workspace"
      label="Workspace name"
      submitText="Create"
      schema={workspaceNameSchema}
      onRequestClose={closeModal}
      onSubmit={(title) =>
        openConfirmModal({
          title: "Create workspace?",
          message: `Create workspace "${title}"?`,
          confirmText: "Create",
          onConfirm: () => {
            void addWorkspace(title);
            closeModal();
            closeConfirmModal();
          },
        })
      }
    />
  );
};

export default CreateWorkspaceModal;
