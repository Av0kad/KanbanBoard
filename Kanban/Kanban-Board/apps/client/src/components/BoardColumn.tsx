import type { Board } from "../types/workspace";
import TaskCard from "./taskCard";
import { useWorkspaceStore } from "../stores/workSpaceStore";
import { useModalStore } from "../stores/modalStore";
import { MODAL_TYPE } from "../types/modal";
import { ArrowLeft, ArrowRight, PencilIcon, Plus, Trash2 } from "lucide-react";

type BoardColumnProps = {
  workspaceId: string;
  board: Board;
};

const BoardColumn = ({ workspaceId, board }: BoardColumnProps) => {
  const moveBoard = useWorkspaceStore((state) => state.moveBoard);
  const deleteBoard = useWorkspaceStore((state) => state.deleteBoard);

  const openModal = useModalStore((state) => state.openModal);
  const openConfirmModal = useModalStore((state) => state.openConfirmModal);
  const closeConfirmModal = useModalStore((state) => state.closeConfirmModal);

  return (
    <div className="min-w-72 rounded-xl bg-black p-4 shadow">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-bold">{board.name}</h2>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => moveBoard(workspaceId, board.id, "left")}
            className="rounded bg-slate-700 px-2 py-1 text-white cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>

          <button
            type="button"
            onClick={() => moveBoard(workspaceId, board.id, "right")}
            className="rounded bg-slate-700 px-2 py-1 text-white cursor-pointer"
          >
            <ArrowRight size={16} />
          </button>

          <button
            type="button"
            onClick={() =>
              openModal({
                type: MODAL_TYPE.EDIT_BOARD,
                workspaceId,
                boardId: board.id,
                initialValue: board.name,
              })
            }
            className="rounded bg-slate-700 px-2 py-1 text-white cursor-pointer"
          >
            <PencilIcon size={16} />
          </button>

          <button
            type="button"
            onClick={() =>
              openConfirmModal({
                title: "Delete board?",
                message: `Delete board "${board.name}"?`,
                confirmText: "Delete",
                onConfirm: () => {
                  deleteBoard(workspaceId, board.id);
                  closeConfirmModal();
                },
              })
            }
            className="rounded bg-red-700 px-2 py-1 text-white cursor-pointer"
          >
            <Trash2 size={16} />
          </button>

          <button
            type="button"
            onClick={() =>
              openModal({
                type: MODAL_TYPE.CREATE_TASK,
                workspaceId,
                boardId: board.id,
              })
            }
            className="rounded-lg bg-violet-700 px-3 py-1 text-white cursor-pointer"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {board.tasks.map((task) => (
          <TaskCard
            key={task.id}
            workspaceId={workspaceId}
            boardId={board.id}
            task={task}
          />
        ))}
      </div>
    </div>
  );
};

export default BoardColumn;
