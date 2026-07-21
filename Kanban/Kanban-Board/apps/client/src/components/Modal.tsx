import type { ReactNode } from "react";

type ModalProps = {
  title: string;
  children?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onRequestClose: () => void;
};

const Modal = ({
  title,
  children,
  onRequestClose,
  onConfirm,
  onCancel,
  cancelText = "Cancel",
  confirmText = "Confirm",
}: ModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onRequestClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-slate-900 p-6 text-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="mb-4 text-2xl font-bold">{title}</h2>

        {children}

        {(onCancel || onConfirm) && (
          <div className="mt-6 flex justify-end gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="cursor-pointer rounded-lg bg-slate-700 px-4 py-2 transition-all duration-200 ease-in-out hover:bg-slate-500"
              >
                {cancelText}
              </button>
            )}

            {onConfirm && (
              <button
                type="button"
                onClick={onConfirm}
                className="cursor-pointer rounded-lg bg-violet-700 px-4 py-2 transition-all duration-200 ease-in-out hover:bg-violet-500"
              >
                {confirmText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
