import { useState } from "react";

import Modal from "../Modal";
import { useModalStore } from "../../stores/modalStore";
import { useWorkspaceStore } from "../../stores/workSpaceStore";
import { MODAL_TYPE } from "../../types/modal";

const InviteMemberModal = () => {
  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const modal = useModalStore((state) => state.modal);
  const closeModal = useModalStore((state) => state.closeModal);
  const inviteMember = useWorkspaceStore((state) => state.inviteMember);

  if (!modal || modal.type !== MODAL_TYPE.INVITE_MEMBER) {
    return null;
  }

  const submit = async () => {
    if (!email.trim()) {
      setLocalError("Email is required");
      return;
    }

    try {
      setLocalError(null);
      await inviteMember(modal.workspaceId, email);
      closeModal();
    } catch (error) {
      setLocalError(
        error instanceof Error ? error.message : "Failed to add member",
      );
    }
  };

  return (
    <Modal
      title="Add workspace member"
      confirmText="Add"
      cancelText="Cancel"
      onRequestClose={closeModal}
      onCancel={closeModal}
      onConfirm={() => void submit()}
    >
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="user@example.com"
        className="w-full rounded-lg bg-slate-800 px-3 py-2"
      />

      {localError && <p className="mt-2 text-sm text-red-400">{localError}</p>}
    </Modal>
  );
};

export default InviteMemberModal;
