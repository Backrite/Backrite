import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import OAuthCallback from "./pages/OAuthCallback";
import Dashboard from "./pages/Dashboard";
import Problems from "./pages/Problems";
import ProblemSolve from "./pages/ProblemSolve";

const URL = import.meta.env.VITE_SERVER_URL;

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/signin" replace />;
};

function AppContent() {
  const [user, setUser] = useState(null);
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setProblems([]);
          return;
        }

        const res = await fetch(`${URL}/api/problems`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          console.error("Fetch error:", errData);
          return;
        }

        const data = await res.json();
        setProblems(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error("Could not load problems");
        console.error("Error fetching problems:", err);
      }
    };

    fetchProblems();
  }, [user]);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Layout user={user} setUser={setUser} />}>
          <Route index element={<Home />} />
          <Route path="signin" element={<SignIn setUser={setUser} />} />
          <Route path="signup" element={<SignUp setUser={setUser} />} />
          <Route path="auth/callback" element={<OAuthCallback setUser={setUser} />} />
          <Route
            path="dashboard"
            element={(
              <ProtectedRoute>
                <Dashboard problems={problems} />
              </ProtectedRoute>
            )}
          />
          <Route
            path="problems"
            element={(
              <ProtectedRoute>
                <Problems problems={problems} />
              </ProtectedRoute>
            )}
          />
          <Route
            path="solve/:slug"
            element={(
              <ProtectedRoute>
                <ProblemSolve />
              </ProtectedRoute>
            )}
          />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
