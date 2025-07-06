import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { AddSectionForm } from "../components/AddSectionForm";
import { Section, type SectionData } from "../components/Section";
import { db } from "../services/firebase";
import { DEFAULT_PROJECT_ID, type Item } from "../types";

interface ProjectMeta {
  name: string;
  description: string;
}

export const Project = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [sections, setSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialMeta, setInitialMeta] = useState<ProjectMeta>({
    name: "",
    description: "",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<ProjectMeta>({
    defaultValues: initialMeta,
  });

  const fetchProject = async () => {
    if (!projectId) return;

    const docRef = doc(db, `projects/${projectId}`);
    const expenseDocRef = doc(db, `expenses/${projectId}`);
    const snapshot = await getDoc(docRef);
    const expenseSnapshot = await getDoc(expenseDocRef);

    if (snapshot.exists()) {
      console.log("snapshot exiists");
      const data = snapshot.data();
      setInitialMeta({
        name: data.name || "",
        description: data.description || "",
      });
      reset({ name: data.name || "", description: data.description || "" });
    }
    if (expenseSnapshot.exists()) {
      console.log("snapshot exiists");
      const data = expenseSnapshot.data();
      setInitialMeta({
        name: data.name || "",
        description: data.description || "",
      });
      reset({ name: data.name || "", description: data.description || "" });
    }
  };

  const fetchSectionsAndItems = async () => {
    if (!projectId) return;

    const projectRef =
      projectId === DEFAULT_PROJECT_ID ? "expenses" : "projects";

    const sectionSnap = await getDocs(
      collection(db, `${projectRef}/${projectId}/sections`)
    );
    const sectionData: SectionData[] = [];

    for (const sectionDoc of sectionSnap.docs) {
      const sectionId = sectionDoc.id;
      const sectionName = sectionDoc.data().name || "Unnamed Section";

      const itemsSnap = await getDocs(
        collection(db, `${projectRef}/${projectId}/sections/${sectionId}/items`)
      );

      const items = itemsSnap.docs.map(
        (doc) =>
          ({
            id: doc.id,
            name: doc.data().name,
            amount: doc.data().amount,
          }) as Item
      );

      sectionData.push({ id: sectionId, name: sectionName, items });
    }

    setSections(sectionData);
    setLoading(false);
  };

  useEffect(() => {
    fetchProject();
    fetchSectionsAndItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const onSaveMeta = async (data: ProjectMeta) => {
    if (!projectId) return;
    const projectRef =
      projectId === DEFAULT_PROJECT_ID ? "expenses" : "projects";
    await updateDoc(doc(db, `${projectRef}/${projectId}`), {
      name: data.name,
      description: data.description,
    });
    fetchProject();
  };

  const onAddSection = async (name: string) => {
    if (!projectId) return;
    const projectRef =
      projectId === DEFAULT_PROJECT_ID ? "expenses" : "projects";
    await addDoc(collection(db, `${projectRef}/${projectId}/sections`), {
      name,
      createdAt: serverTimestamp(),
    });
    fetchSectionsAndItems();
  };

  return (
    <div className="min-h-screen flex justify-center items-start px-4 py-8 bg-gray-100">
      <div className="w-full max-w-3xl bg-white p-6 rounded shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-black">Project Details</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Project Meta Form */}
        <form onSubmit={handleSubmit(onSaveMeta)} className="mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-black">
              Project Name
            </label>
            <input
              {...register("name", { required: true })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          {isDirty && (
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          )}
        </form>

        {/* Section Management */}
        <AddSectionForm projectId={projectId!} onAdd={onAddSection} />
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          sections.map((section) => (
            <Section
              key={section.id}
              projectId={projectId!}
              section={section}
              onUpdated={fetchSectionsAndItems}
            />
          ))
        )}
      </div>
    </div>
  );
};
