import BoardColumn from "./BoardColumn";
import { useWorkspaceStore } from "../stores/workSpaceStore";
import { useModalStore } from "../stores/modalStore";
import { MODAL_TYPE } from "../types/modal";

const WorkspaceView = () => {
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const selectedWorkspaceId = useWorkspaceStore(
    (state) => state.selectedWorkspaceId,
  );

  const openModal = useModalStore((state) => state.openModal);

  const selectedWorkspace = workspaces.find(
    (workspace) => workspace.id === selectedWorkspaceId,
  );

  if (!selectedWorkspace) {
    return <div>No workspace selected</div>;
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-center">
        <h1 className="text-center text-5xl font-bold">
          {selectedWorkspace.name}
        </h1>

        <button
          type="button"
          onClick={() =>
            openModal({
              type: MODAL_TYPE.CREATE_BOARD,
              workspaceId: selectedWorkspace.id,
            })
          }
          className="mx-2 ml-10 mt-4 rounded-lg bg-violet-800 px-4 py-2 text-white transition-all duration-200 ease-in-out hover:bg-violet-500"
        >
          Add board
        </button>
      </div>

      <div className="flex flex-wrap gap-4 p-4">
        {selectedWorkspace.boards.map((board) => (
          <BoardColumn
            key={board.id}
            workspaceId={selectedWorkspace.id}
            board={board}
          />
        ))}
      </div>
    </div>
  );
};

export default WorkspaceView;
