import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProblemSolve from "./pages/ProblemSolve";
import Dashboard from "./pages/Dashboard";
import Problems from "./pages/Problems";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        {/* <Header />
        <Home />
        <Footer /> */}

        {/* <ProblemSolve /> */}
        {/* <Dashboard /> */}
        {/* <Problems /> */}
        {/* <SignUp /> */}
      </div>
    </>
  );
}

export default App;
