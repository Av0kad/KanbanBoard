import { useWorkspaceStore } from "../stores/workSpaceStore";
import { useModalStore } from "../stores/modalStore";
import { useAuthStore } from "../stores/authStore";
import { MODAL_TYPE } from "../types/modal";
import { PencilIcon, Trash2, UserPlus } from "lucide-react";

const WorkspaceList = () => {
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const selectedWorkspaceId = useWorkspaceStore(
    (state) => state.selectedWorkspaceId,
  );
  const setSelectedWorkspaceId = useWorkspaceStore(
    (state) => state.setSelectedWorkspaceId,
  );
  const deleteWorkspace = useWorkspaceStore((state) => state.deleteWorkspace);
  const currentUser = useAuthStore((state) => state.user);

  const openModal = useModalStore((state) => state.openModal);
  const openConfirmModal = useModalStore((state) => state.openConfirmModal);
  const closeConfirmModal = useModalStore((state) => state.closeConfirmModal);

  return (
    <div className="flex flex-col gap-2">
      {workspaces.map((workspace) => {
        const isOwner = workspace.ownerId === currentUser?.id;

        return (
          <div key={workspace.id} className="flex items-center gap-2">
            <button
              type="button"
              className={
                workspace.id === selectedWorkspaceId
                  ? "rounded-lg bg-violet-500 px-4 py-2 text-white"
                  : "rounded-lg bg-violet-800 px-4 py-2 text-white"
              }
              onClick={() => setSelectedWorkspaceId(workspace.id)}
            >
              {workspace.title}
            </button>

            {isOwner && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    openModal({
                      type: MODAL_TYPE.INVITE_MEMBER,
                      workspaceId: workspace.id,
                    })
                  }
                  className="rounded bg-green-700 px-2 py-1 text-white"
                >
                  <UserPlus size={20} />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    openModal({
                      type: MODAL_TYPE.EDIT_WORKSPACE,
                      workspaceId: workspace.id,
                      initialValue: workspace.title,
                    })
                  }
                  className="rounded bg-slate-700 px-2 py-1 text-white"
                >
                  <PencilIcon size={20} />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    openConfirmModal({
                      title: "Delete workspace?",
                      message: `Delete workspace "${workspace.title}"?`,
                      confirmText: "Delete",
                      onConfirm: () => {
                        void deleteWorkspace(workspace.id);
                        closeConfirmModal();
                      },
                    })
                  }
                  className="rounded bg-red-700 px-2 py-1 text-white"
                >
                  <Trash2 size={20} />
                </button>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default WorkspaceList;
