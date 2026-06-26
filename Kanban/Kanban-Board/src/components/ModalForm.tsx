import type { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "./Modal";
import type { NameFormValues } from "../schemes/nameFormValues";

type ModalFormProps = {
  title: string;
  label: string;
  initialValue?: string;
  submitText: string;
  schema: z.ZodObject<{
    name: z.ZodString;
  }>;
  onSubmit: (value: string) => void;
  onRequestClose: () => void;
};

const ModalForm = ({
  title,
  label,
  initialValue = "",
  submitText,
  schema,
  onSubmit,
  onRequestClose,
}: ModalFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NameFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialValue,
    },
  });

  const submitForm = handleSubmit((data) => {
    onSubmit(data.name);
  });

  return (
    <Modal
      title={title}
      confirmText={submitText}
      cancelText="Cancel"
      onConfirm={submitForm}
      onCancel={onRequestClose}
      onRequestClose={onRequestClose}
    >
      <label className="mb-2 block text-sm text-slate-300">{label}</label>

      <input
        {...register("name")}
        className="w-full rounded-lg bg-slate-800 px-3 py-2 text-white outline-none ring-1 ring-slate-700 focus:ring-violet-500"
        autoFocus
      />

      {errors.name?.message && (
        <p className="mt-2 text-sm text-red-400">{errors.name.message}</p>
      )}
    </Modal>
  );
};

export default ModalForm;
