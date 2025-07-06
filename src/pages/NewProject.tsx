import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../services/firebase";

interface NewProjectForm {
  name: string;
  description: string;
  collaborators: string;
  startDate: string;
  endDate: string;
}

export const NewProject = () => {
  const { register, handleSubmit, reset } = useForm<NewProjectForm>();
  const navigate = useNavigate();

  const onSubmit = async (data: NewProjectForm) => {
    const user = auth.currentUser;
    if (!user) return;

    const docData = {
      name: data.name,
      description: data.description || "",
      startDate: data.startDate ? new Date(data.startDate) : null,
      createdAt: serverTimestamp(),
      ownerId: user.uid,
    };

    await addDoc(collection(db, "projects"), docData);
    reset();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create New Project
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-black">
              Project Name
            </label>
            <input
              {...register("name", { required: true })}
              className="w-full border-2 border-black px-3 py-2 rounded"
              placeholder="e.g. House Build Phase 1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-black">
              Description (optional)
            </label>
            <textarea
              {...register("description")}
              className="w-full border-2 border-black px-3 py-2 rounded"
              placeholder="Add details about this project..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-black">
              Start Date
            </label>
            <input
              {...register("startDate", { required: true })}
              type="date"
              className="w-full border-2 border-black px-3 py-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
};
