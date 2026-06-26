import React from "react";
import type { Task } from "../types/workspace";
import { useWorkspaceStore } from "../stores/workSpaceStore";
import { useModalStore } from "../stores/modalStore";
import { MODAL_TYPE } from "../types/modal";

type TaskCardProps = {
  workspaceId: string;
  boardId: string;
  task: Task;
};

const TaskCard = ({ workspaceId, boardId, task }: TaskCardProps) => {
  const deleteTask = useWorkspaceStore((state) => state.deleteTask);

  const openModal = useModalStore((state) => state.openModal);
  const openConfirmModal = useModalStore((state) => state.openConfirmModal);
  const closeConfirmModal = useModalStore((state) => state.closeConfirmModal);

  return (
    <div className="flex items-center justify-between bg-slate-900 px-3 py-2">
      <p>{task.title}</p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() =>
            openModal({
              type: MODAL_TYPE.EDIT_TASK,
              workspaceId,
              boardId,
              taskId: task.id,
              initialValue: task.title,
            })
          }
          className="rounded bg-slate-700 px-2 py-1 text-sm text-white"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() =>
            openConfirmModal({
              title: "Delete task?",
              message: "Delete this task?",
              confirmText: "Delete",
              onConfirm: () => {
                deleteTask(workspaceId, boardId, task.id);
                closeConfirmModal();
              },
            })
          }
          className="rounded bg-red-700 px-2 py-1 text-sm text-white"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default React.memo(TaskCard);
