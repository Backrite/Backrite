// src/App.js
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Problems from "./pages/Problems";
import ProblemSolve from "./pages/ProblemSolve";
import { Toaster } from "react-hot-toast";
import Feedback from "./pages/Feedback";

function AppContent() {
  const [user, setUser] = useState(null);
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/problems", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ must be sent
          },
        });

        if (!res.ok) {
          const errData = await res.json();
          console.error("Fetch error:", errData);
          return;
        }

        const data = await res.json();
        setProblems(Array.isArray(data) ? data : []);
        console.log("Problems fetched:", data);
      } catch (err) {
        console.error("Error fetching problems:", err);
      }
    };

    fetchProblems();
  }, [user]);

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

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* All routes under shared Layout */}
        <Route
          path="/"
          element={
            <Layout user={user} setUser={setUser} setProblems={setProblems} />
          }
        >
          <Route index element={<Home />} />
          <Route path="signin" element={<SignIn setUser={setUser} />} />
          <Route path="signup" element={<SignUp setUser={setUser} />} />
          <Route path="dashboard" element={<Dashboard problems={problems} />} />
          <Route path="problems" element={<Problems problems={problems} />} />
          <Route path="solve/:slug" element={<ProblemSolve />} />
          <Route path="feedback" element={<Feedback />} />
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
