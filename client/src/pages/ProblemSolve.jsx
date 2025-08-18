import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import MonacoEditor from "@monaco-editor/react";
import {
  ArrowLeft,
  Play,
  CheckCircle,
  Clock,
  RefreshCw,
  Send,
} from "lucide-react";

const ProblemSolve = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("// Write your code here...");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);

  const { problemId } = useParams();

  // Fetch problem details
  useEffect(() => {
    fetch(`http://localhost:5000/api/problems/${problemId}`)
      .then((res) => res.json())
      .then((data) => setSelectedProblem(data))
      .catch((err) => console.error(err));
  }, [problemId]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => setTimeSpent((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-400 bg-green-400/10";
      case "Medium":
        return "text-yellow-400 bg-yellow-400/10";
      case "Hard":
        return "text-red-400 bg-red-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  const runCode = () => {
    setIsRunning(true);
    setOutput("Running your code...\n");

    setTimeout(() => {
      const mockOutput = `✓ Code executed successfully\n\nTest Results:\n✓ Basic functionality passed\n✓ Edge cases passed`;
      setOutput(mockOutput);
      setTestResults([
        { name: "Basic Functionality", status: "passed", points: 50 },
        { name: "Edge Cases", status: "passed", points: 50 },
      ]);
      setIsRunning(false);
    }, 1500);
  };

  const submitSolution = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      alert("Solution submitted successfully!");
      navigate("/dashboard");
    }, 500);
  };

  if (!selectedProblem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            No Problem Selected
          </h2>
          <button
            onClick={() => navigate("/problems")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Problems
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-slate-900/90 backdrop-blur-lg border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/problems")}
              className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Problems
            </button>
            <h1 className="text-xl font-semibold text-white">
              {selectedProblem.title}
            </h1>
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                selectedProblem.difficulty
              )}`}
            >
              {selectedProblem.difficulty}
            </div>
            <div className="text-sm text-gray-400">
              {selectedProblem.points} points
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{formatTime(timeSpent)}</span>
            </div>
            <button
              onClick={runCode}
              disabled={isRunning}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Run Code
                </>
              )}
            </button>
            <button
              onClick={submitSolution}
              disabled={isSubmitted}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              {isSubmitted ? (
                <>
                  <CheckCircle className="w-4 h-4" /> Submitted
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Submit
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Problem Description */}
      <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden">
        <div className="md:w-1/2 bg-slate-800 p-4 rounded-lg overflow-auto">
          <h2 className="text-lg font-semibold text-white mb-2">
            Problem Description
          </h2>
          <p className="text-gray-300 whitespace-pre-wrap">
            {selectedProblem.description}
          </p>
        </div>

        {/* Code Editor */}
        <div className="md:w-1/2 flex flex-col">
          <MonacoEditor
            height="400px"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value)}
            options={{
              fontSize: 16,
              minimap: { enabled: false },
              automaticLayout: true,
              scrollBeyondLastLine: false,
            }}
          />
          {/* Output */}
          <div className="mt-2 bg-slate-900 p-4 rounded-lg text-gray-300 h-48 overflow-auto whitespace-pre-wrap">
            {output || "Your output will appear here..."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemSolve;
