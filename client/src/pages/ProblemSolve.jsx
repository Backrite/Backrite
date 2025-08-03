import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Play,
  Save,
  Terminal,
  CheckCircle,
  Clock,
  Lightbulb,
  Code,
  Database,
  Settings,
  RefreshCw,
  Send,
} from "lucide-react";

const ProblemSolve = ({
  selectedProblem,
  setCurrentPage,
  setSelectedProblem,
}) => {
  const [code, setCode] = useState(`// Welcome to ${
    selectedProblem?.title || "Backend Challenge"
  }
// Write your Node.js/Express solution here

const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Your solution here


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});

module.exports = app;
`);

  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [activeTab, setActiveTab] = useState("problem");
  const [showHints, setShowHints] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const runCode = () => {
    setIsRunning(true);
    setOutput("Running your code...\n");

    // Simulate code execution
    setTimeout(() => {
      const mockOutput = `✓ Server started successfully
✓ Routes initialized
✓ Middleware configured
✓ Database connection established

Server running on port 3000
Ready to handle requests!

Test Results:
${
  selectedProblem?.title === "Build a User Auth API"
    ? "✓ POST /auth/signup - User registration works\n✓ POST /auth/login - User login works\n✓ GET /auth/profile - Protected route works\n✗ Missing JWT token validation"
    : "✓ All basic tests passed\n✓ Error handling implemented\n✓ Input validation works\n⚠ Consider edge cases"
}`;

      setOutput(mockOutput);
      setTestResults([
        { name: "Basic Functionality", status: "passed", points: 50 },
        { name: "Error Handling", status: "passed", points: 25 },
        { name: "Input Validation", status: "passed", points: 15 },
        { name: "Edge Cases", status: "warning", points: 5 },
        { name: "Code Quality", status: "pending", points: 5 },
      ]);
      setIsRunning(false);
    }, 2000);
  };

  const submitSolution = () => {
    setIsSubmitted(true);
    // Simulate submission
    setTimeout(() => {
      alert(
        "Solution submitted successfully! Check your dashboard for results."
      );
      setCurrentPage("problems");
    }, 1000);
  };

  const resetCode = () => {
    setCode(`// Welcome to ${selectedProblem?.title || "Backend Challenge"}
// Write your Node.js/Express solution here

const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Your solution here


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});

module.exports = app;
`);
    setOutput("");
    setTestResults([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.target;
      const newValue =
        code.substring(0, selectionStart) + "  " + code.substring(selectionEnd);
      setCode(newValue);
      // Set cursor position after the inserted tab
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = selectionStart + 2;
      }, 0);
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
            onClick={() => setCurrentPage("problems")}
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
              onClick={() => {
                setSelectedProblem(null);
                setCurrentPage("problems");
              }}
              className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Problems
            </button>
            <div className="h-6 w-px bg-slate-600"></div>
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
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run Code
                </>
              )}
            </button>
            <button
              onClick={submitSolution}
              disabled={isSubmitted}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {isSubmitted ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Submitted
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Panel - Problem Description */}
        <div className="w-2/5 bg-slate-800/50 border-r border-slate-700 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-slate-700">
            <button
              onClick={() => setActiveTab("problem")}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "problem"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Problem
            </button>
            <button
              onClick={() => setActiveTab("tests")}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "tests"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Test Results
            </button>
            <button
              onClick={() => setActiveTab("output")}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "output"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Output
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {/* Problem Tab */}
            {activeTab === "problem" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    {selectedProblem.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {selectedProblem.title}
                    </h2>
                    <div className="text-gray-400">
                      {selectedProblem.points} points
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Description
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {selectedProblem.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Requirements
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      Implement proper error handling with appropriate HTTP
                      status codes
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      Follow RESTful API conventions and best practices
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      Include comprehensive input validation
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      Write clean, maintainable, and well-documented code
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      Implement appropriate middleware and security measures
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProblem.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-slate-700 text-gray-300 text-sm rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400" />
                    <h4 className="text-white font-medium">Hints</h4>
                    <button
                      onClick={() => setShowHints(!showHints)}
                      className="text-sm text-blue-400 hover:text-blue-300 ml-auto"
                    >
                      {showHints ? "Hide" : "Show"}
                    </button>
                  </div>
                  {showHints && (
                    <div className="text-gray-300 text-sm space-y-2">
                      <p>
                        • Start by setting up your Express server with proper
                        middleware
                      </p>
                      <p>
                        • Consider what routes you'll need and their HTTP
                        methods
                      </p>
                      <p>
                        • Think about data validation and error handling early
                      </p>
                      <p>• Use environment variables for configuration</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Test Results Tab */}
            {activeTab === "tests" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Test Results
                </h3>
                {testResults.length > 0 ? (
                  <div className="space-y-3">
                    {testResults.map((test, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              test.status === "passed"
                                ? "bg-green-500/20"
                                : test.status === "warning"
                                ? "bg-yellow-500/20"
                                : "bg-gray-500/20"
                            }`}
                          >
                            {test.status === "passed" ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : test.status === "warning" ? (
                              <Clock className="w-4 h-4 text-yellow-400" />
                            ) : (
                              <Clock className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <span className="text-white">{test.name}</span>
                        </div>
                        <div className="text-sm text-gray-400">
                          {test.points} pts
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Terminal className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Run your code to see test results</p>
                  </div>
                )}
              </div>
            )}

            {/* Output Tab */}
            {activeTab === "output" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Console Output
                </h3>
                <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm">
                  <pre className="text-gray-300 whitespace-pre-wrap">
                    {output || 'Click "Run Code" to see output here...'}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-3/5 bg-slate-900 flex flex-col">
          {/* Editor Header */}
          <div className="bg-slate-800 p-3 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">solution.js</span>
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Database className="w-3 h-3" />
                <span>Node.js</span>
                <span>•</span>
                <span>Express</span>
              </div>
              <button
                onClick={resetCode}
                className="text-gray-400 hover:text-white p-1"
                title="Reset code"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                className="text-gray-400 hover:text-white p-1"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 relative">
            <div className="absolute top-0 left-0 w-12 h-full bg-slate-800/50 border-r border-slate-700 pointer-events-none z-10">
              <div className="text-xs text-gray-500 p-2 leading-6 font-mono">
                {code.split("\n").map((_, index) => (
                  <div key={index + 1} className="text-right pr-2">
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full h-full bg-slate-900 text-gray-100 pl-14 pr-4 py-4 font-mono text-sm resize-none focus:outline-none leading-6"
              placeholder="// Write your backend solution here..."
              spellCheck={false}
              style={{
                fontFamily:
                  "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                tabSize: 2,
              }}
            />
          </div>

          {/* Editor Footer */}
          <div className="bg-slate-800 p-3 border-t border-slate-700">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-400 flex items-center gap-4">
                <span>
                  Ln {code.substring(0, code.length).split("\n").length}, Col 1
                </span>
                <span>•</span>
                <span>JavaScript</span>
                <span>•</span>
                <span className="text-green-400">● Ready</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>{code.length} chars</span>
                <span>•</span>
                <span>UTF-8</span>
                <span>•</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(code);
                    // You could add a toast notification here
                  }}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemSolve;
