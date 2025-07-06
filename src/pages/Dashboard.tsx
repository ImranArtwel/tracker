import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../services/firebase";
import { DEFAULT_PROJECT_ID } from "../types";

interface Project {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  startDate: Date | null;
}

type ProjectWithTotal = Project & {
  totalAmount: number;
};

export default function Dashboard() {
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [expenseProjects, setExpenseProjects] = useState<Project[]>([]);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;

      const q = query(collection(db, "projects"));
      const p = query(collection(db, "expenses"));
      const snapshot = await getDocs(q);
      const expenseSnapshot = await getDocs(p);

      const my: Project[] = [];
      const expenses: Project[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data() as Omit<Project, "id">;
        const project = { id: doc.id, ...data };
        my.push(project);
      });
      expenseSnapshot.forEach((doc) => {
        const data = doc.data() as Omit<Project, "id">;
        const project = { id: doc.id, ...data };
        expenses.push(project);
      });

      setMyProjects(my);
      setExpenseProjects(expenses);
    };

    fetchProjects();
  }, [user]);

  const handleSignOut = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button
            type="button"
            onClick={() => navigate("/project/new")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + New Project
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 hover: cursor-pointer"
          >
            Sign Out
          </button>
        </div>

        <Section title="My Projects" projects={myProjects} />
        <Section
          title="My Expenses"
          projects={expenseProjects}
          id={DEFAULT_PROJECT_ID}
        />
      </div>
    </div>
  );
}

function Section({
  id,
  title,
  projects,
}: {
  id?: string;
  title: string;
  projects: Project[];
}) {
  const [projectsWithTotal, setProjectsWithTotal] = useState<
    ProjectWithTotal[]
  >([]);

  useEffect(() => {
    const fetchTotals = async () => {
      const results: ProjectWithTotal[] = [];

      const projectRef = id === DEFAULT_PROJECT_ID ? "expenses" : "projects";

      for (const project of projects) {
        let total = 0;

        const sectionsSnap = await getDocs(
          collection(db, `${projectRef}/${project.id}/sections`)
        );

        for (const sectionDoc of sectionsSnap.docs) {
          const itemsSnap = await getDocs(
            collection(
              db,
              `${projectRef}/${project.id}/sections/${sectionDoc.id}/items`
            )
          );

          for (const item of itemsSnap.docs) {
            const data = item.data();
            total += data.amount || 0;
          }
        }

        results.push({ ...project, totalAmount: total });
      }

      setProjectsWithTotal(results);
    };

    fetchTotals();
  }, [id, projects]);

  if (projects.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {projectsWithTotal.map((project) => (
          <Link
            key={project.id}
            to={`/project/${project.id}`}
            className="bg-white shadow p-5 rounded hover:shadow-md transition"
          >
            <h3 className="text-lg font-bold">{project.name}</h3>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
              {project.description || "No description"}
            </p>
            <p className="text-black font-semibold mt-2">
              Total: ${project.totalAmount.toLocaleString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
