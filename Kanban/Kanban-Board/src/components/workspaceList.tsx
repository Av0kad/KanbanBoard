import { useWorkspaceStore } from "../stores/workSpaceStore";
import { useModalStore } from "../stores/modalStore";
import { MODAL_TYPE } from "../types/modal";
import { PencilIcon, Trash2 } from "lucide-react";

const WorkspaceList = () => {
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const selectedWorkspaceId = useWorkspaceStore(
    (state) => state.selectedWorkspaceId,
  );
  const setSelectedWorkspaceId = useWorkspaceStore(
    (state) => state.setSelectedWorkspaceId,
  );
  const deleteWorkspace = useWorkspaceStore((state) => state.deleteWorkspace);

  const openModal = useModalStore((state) => state.openModal);
  const openConfirmModal = useModalStore((state) => state.openConfirmModal);
  const closeConfirmModal = useModalStore((state) => state.closeConfirmModal);

  return (
    <div className="flex flex-col gap-2">
      {workspaces.map((workspace) => (
        <div key={workspace.id} className="flex items-center gap-2">
          <button
            type="button"
            className={
              workspace.id === selectedWorkspaceId
                ? "rounded-lg bg-violet-500 px-4 py-2 text-white cursor-pointer transition-all duration-200 ease-in-out"
                : "rounded-lg bg-violet-800 px-4 py-2 text-white cursor-pointer transition-all duration-200 ease-in-out"
            }
            onClick={() => setSelectedWorkspaceId(workspace.id)}
          >
            {workspace.name}
          </button>

          <button
            type="button"
            onClick={() =>
              openModal({
                type: MODAL_TYPE.EDIT_WORKSPACE,
                workspaceId: workspace.id,
                initialValue: workspace.name,
              })
            }
            className="rounded bg-slate-700 px-2 py-1 text-sm text-white cursor-pointer"
          >
            <PencilIcon size={24} />
          </button>

          <button
            type="button"
            onClick={() =>
              openConfirmModal({
                title: "Delete workspace?",
                message: `Delete workspace "${workspace.name}"?`,
                confirmText: "Delete",
                onConfirm: () => {
                  deleteWorkspace(workspace.id);
                  closeConfirmModal();
                },
              })
            }
            className="rounded bg-red-700 px-2 py-1 text-sm text-white cursor-pointer"
          >
            <Trash2 size={24} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default WorkspaceList;
