import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Problems from "./pages/Problems";
import ProblemSolve from "./pages/ProblemSolve";

function App() {
  const [user, setUser] = useState(null);
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/problems")
      .then((res) => res.json())
      .then((data) => {
        setProblems(data);
        console.log("Problems fetched:", data); // log actual fetched data
      })
      .catch((err) => console.error(err));
  }, []);

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
    <BrowserRouter>
      <Routes>
        {/* All routes under shared Layout */}
        <Route path="/" element={<Layout user={user} setUser={setUser} />}>
          <Route index element={<Home />} />
          <Route path="signin" element={<SignIn setUser={setUser} />} />
          <Route path="signup" element={<SignUp setUser={setUser} />} />
          <Route path="dashboard" element={<Dashboard user={user} />} />
          <Route path="problems" element={<Problems problems={problems} />} />
          <Route path="solve/:slug" element={<ProblemSolve />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
