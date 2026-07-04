import Modal from "../Modal";
import { useModalStore } from "../../stores/modalStore";

const ConfirmModal = () => {
  const confirmModal = useModalStore((state) => state.confirmModal);
  const closeConfirmModal = useModalStore((state) => state.closeConfirmModal);

  if (!confirmModal) return null;

  return (
    <Modal
      title={confirmModal.title}
      confirmText={confirmModal.confirmText}
      cancelText="Cancel"
      onRequestClose={closeConfirmModal}
      onCancel={closeConfirmModal}
      onConfirm={confirmModal.onConfirm}
    >
      <p className="text-slate-300">{confirmModal.message}</p>
    </Modal>
  );
};

export default ConfirmModal;
