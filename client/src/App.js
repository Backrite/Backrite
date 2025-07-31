// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Problems from "./pages/Problems";
import ProblemDetails from "./pages/ProblemDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/problems/:id" element={<ProblemDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
