import { onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

import { NewProject } from "./pages/NewProject";
import { Project } from "./pages/Project";
import { auth } from "./services/firebase";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // const navigate = useNavigate();

  useEffect(() => {
    return onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
  }, []);

  // useEffect(() => {
  //   if (!loading && user) {
  //     navigate("/dashboard", { replace: true });
  //   }
  // }, [user, loading, navigate]);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
      />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/project/new" element={<NewProject />} />
      <Route path="/project/:projectId" element={<Project />} />
    </Routes>
  );
}

export default App;
