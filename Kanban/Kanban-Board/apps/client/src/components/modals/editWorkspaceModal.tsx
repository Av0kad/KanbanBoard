import ModalForm from "../ModalForm";
import { workspaceNameSchema } from "../../schemes/nameFormValues";
import { useWorkspaceStore } from "../../stores/workSpaceStore";
import { useModalStore } from "../../stores/modalStore";
import { MODAL_TYPE } from "../../types/modal";

const EditWorkspaceModal = () => {
  const modal = useModalStore((state) => state.modal);
  const updateWorkspace = useWorkspaceStore((state) => state.updateWorkspace);

  const closeModal = useModalStore((state) => state.closeModal);
  const openConfirmModal = useModalStore((state) => state.openConfirmModal);
  const closeConfirmModal = useModalStore((state) => state.closeConfirmModal);

  if (!modal || modal.type !== MODAL_TYPE.EDIT_WORKSPACE) {
    return null;
  }

  return (
    <ModalForm
      title="Edit workspace"
      label="Workspace name"
      initialValue={modal.initialValue}
      submitText="Save"
      schema={workspaceNameSchema}
      onRequestClose={closeModal}
      onSubmit={(title) =>
        openConfirmModal({
          title: "Save workspace?",
          message: `Rename workspace to "${title}"?`,
          confirmText: "Save",
          onConfirm: () => {
            void updateWorkspace(modal.workspaceId, title);
            closeModal();
            closeConfirmModal();
          },
        })
      }
    />
  );
};

export default EditWorkspaceModal;
