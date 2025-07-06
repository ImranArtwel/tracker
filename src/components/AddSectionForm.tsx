// File: src/components/AddSectionForm.tsx
import { useForm } from "react-hook-form";

interface Props {
  projectId: string;
  onAdd: (name: string) => void;
}

export const AddSectionForm = ({ onAdd }: Props) => {
  const { register, handleSubmit, reset } = useForm<{ sectionName: string }>();

  const onSubmit = (data: { sectionName: string }) => {
    onAdd(data.sectionName);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 mb-8">
      <input
        {...register("sectionName", { required: true })}
        placeholder="New section name"
        className="flex-1 border-2 border-black px-3 py-2 rounded"
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        + Add Section
      </button>
    </form>
  );
};
