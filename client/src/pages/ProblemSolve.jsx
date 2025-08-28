import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MonacoEditor from "@monaco-editor/react";
import {
  ArrowLeft,
  Play,
  CheckCircle,
  Clock,
  RefreshCw,
  Send,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import toast from "react-hot-toast";

const ProblemSolve = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("// Write your code here...");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showConstraints, setShowConstraints] = useState(true);
  const [showExamples, setShowExamples] = useState(true);
const URL = import.meta.env.VITE_SERVER_URL
  const { slug } = useParams();

  // ✅ Protect the page: redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signup");
    }
  }, [navigate]);

  // Fetch problem data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${URL}/api/problems/${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          navigate("/signup"); // redirect if token invalid
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setSelectedProblem(data);
          if (data.starterCode) setCode(data.starterCode);
        }
      })
      .catch((err) => console.error(err));
  }, [slug, navigate]);

  // Timer for time spent
  useEffect(() => {
    const timer = setInterval(() => setTimeSpent((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time helper
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Difficulty color helper
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

  // Run code function
  const runCode = async () => {
    if (!selectedProblem?.examples?.length) {
      setOutput("No examples/testcases available to run.");
      return;
    }

    setIsRunning(true);
    setOutput("Running your code...\n");

    try {
      const response = await fetch(`${URL}/api/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          tests: selectedProblem.testCases,
        }),
      });

      const data = await response.json();

      if (data.results) {
        setTestResults(data.results);
        setOutput("Code executed successfully.");
      } else {
        setOutput(data.output || "No output returned from backend.");
        setTestResults([]);
      }
    } catch (error) {
      setOutput("Error running code: " + error.message);
    }

    setIsRunning(false);
  };

  // Submit solution function
  const submitSolution = async () => {
    if (testResults.length === 0) {
      // alert("⚠️ Please run your code on test cases before submitting!");
      toast.error("⚠️ Please run your code on test cases before submitting!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signup");
        return;
      }

      const response = await fetch(`${URL}/api/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          problemId: selectedProblem._id,
          code,
          testResults,
          timeSpent,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        if (data.submission.status === "failed") {
          // alert(
          //   `⚠️ Submission recorded as a failed attempt. None of the test cases passed.`
          // );
          toast.error("⚠️ Submission failed: No test cases passed.");
        } else {
          // alert(
          //   `✅ Solution submitted successfully! All test cases passed, problem marked as solved.`
          // );
          toast.success("✅ Solution submitted successfully! 🎉");
        }
        navigate("/dashboard");
      } else {
        // alert(`❌ Submission failed: ${data.message || "Unknown error"}`);
        toast.error(`❌ Submission failed: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error(error);
      // alert(`❌ Error submitting solution: ${error.message}`);
      toast.error(`❌ Error: ${error.message}`);
    }
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden">
        {/* Left Panel */}
        <div className="md:w-1/2 flex flex-col gap-4 overflow-auto">
          <div className="bg-slate-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-white mb-2">
              Description
            </h2>
            <p className="text-gray-300 whitespace-pre-wrap">
              {selectedProblem.description}
            </p>
          </div>

          {selectedProblem.tags && selectedProblem.tags.length > 0 && (
            <div className="bg-slate-800 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-white mb-2">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {selectedProblem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {selectedProblem.constraints?.length > 0 && (
            <div className="bg-slate-800 p-4 rounded-lg">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setShowConstraints((prev) => !prev)}
              >
                <h2 className="text-lg font-semibold text-white mb-2">
                  Constraints
                </h2>
                {showConstraints ? <ChevronUp /> : <ChevronDown />}
              </div>
              {showConstraints && (
                <ul className="list-disc list-inside text-gray-300">
                  {selectedProblem.constraints.map((c, idx) => (
                    <li key={idx}>{c}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {selectedProblem.examples?.length > 0 && (
            <div className="bg-slate-800 p-4 rounded-lg">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setShowExamples((prev) => !prev)}
              >
                <h2 className="text-lg font-semibold text-white mb-2">
                  Examples
                </h2>
                {showExamples ? <ChevronUp /> : <ChevronDown />}
              </div>
              {showExamples &&
                selectedProblem.examples.map((ex, idx) => (
                  <div key={idx} className="mb-4 bg-slate-700 p-3 rounded-lg">
                    <p className="text-gray-400 whitespace-pre-wrap">
                      <strong>Input:</strong>
                      {"\n"}
                      {ex.input}
                    </p>
                    <p className="text-gray-400 whitespace-pre-wrap">
                      <strong>Output:</strong>
                      {"\n"}
                      {ex.output}
                    </p>
                    {ex.explanation && (
                      <p className="text-gray-400 whitespace-pre-wrap">
                        <strong>Explanation:</strong> {ex.explanation}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Right Panel - Fixed Layout */}
        <div className="md:w-1/2 flex flex-col gap-4">
          {/* Code Editor */}
          <div className="h-80 bg-slate-800 p-2 rounded-lg">
            <MonacoEditor
              height="300px"
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
          </div>

          {/* Output Section - Smaller */}
          <div className="bg-slate-900 p-3 rounded-lg text-gray-300 h-20 overflow-auto whitespace-pre-wrap">
            {output || "Your output will appear here..."}
          </div>

          {/* Test Results Section - Larger */}
          <div className="bg-slate-800 p-4 rounded-lg text-gray-300 h-80 overflow-auto">
            {testResults.length > 0 ? (
              <>
                <h2 className="font-semibold text-white mb-3">Test Results</h2>
                <p className="mb-3 text-sm text-gray-400">
                  {testResults.filter((t) => t.passed).length} / {testResults.length} Testcases Passed
                </p>
                {testResults.map((result, idx) => (
                  <div
                    key={idx}
                    className={`border-l-4 pl-3 mb-3 ${
                      result.passed ? "border-green-500" : "border-red-500"
                    }`}
                  >
                    <p className="mb-1">
                      {result.passed ? "✅" : "❌"}{" "}
                      <span className="font-semibold text-white">
                        Test Case {result.index} {result.passed ? "Passed" : "Failed"}
                      </span>
                    </p>
                    {result.input && (
                      <p>
                        <span className="text-white font-medium">Input:</span>{" "}
                        <code className="text-blue-300">{JSON.stringify(result.input)}</code>
                      </p>
                    )}
                    <p>
                      <span className="text-white font-medium">Expected:</span>{" "}
                      <code className="text-yellow-300">{JSON.stringify(result.expected)}</code>
                    </p>
                    <p>
                      <span className="text-white font-medium">Actual:</span>{" "}
                      <code className="text-purple-300">{JSON.stringify(result.actual)}</code>
                    </p>
                    {result.error && (
                      <p className="text-red-400">
                        <span className="text-white font-medium">Error:</span> {result.error}
                      </p>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <p className="text-gray-400">No test results yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemSolve;