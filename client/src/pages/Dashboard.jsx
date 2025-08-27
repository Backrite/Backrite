import React, { useState, useEffect } from "react";
import { CheckCircle, Code, Zap, Loader2, AlertCircle } from "lucide-react";
const URL = import.meta.env.VITE_SERVER_URL
const Dashboard = () => {
  // State management for data and loading states
  const [user, setUser] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data from your backend
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      console.log("Token found:", !!token); // Debug: Check if token exists

      // Call your existing dashboard endpoint
      const response = await fetch(`${URL}/api/dashboard`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📡 API Response status:", response.status); // Debug: Check response status

      if (!response.ok) {
        if (response.status === 401) {
          // Redirect user to signup if not logged in
          window.location.href = "/signup";
          return; // stop further execution
        }
        throw new Error(`Failed to fetch dashboard data: ${response.status}`);
      }

      const data = await response.json();
      console.log("📊 Dashboard data received:", data); // Debug: Check received data

      // Set user data from the response
      setUser({
        username: data.username,
        totalSolved: data.totalSolved,
        totalAttempted: data.totalAttempted,
        difficultyStats: data.difficultyStats,
        streak: data.streak || 0, // use backend streak if available
      });

      console.log("✅ User state updated"); // Debug: Confirm state update

      // Create mock problems array based on your backend data
      // You can replace this with actual problems data if you have a separate endpoint
      setProblems(generateMockProblems(data));
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to generate mock problems based on your backend data
  // Replace this with actual problems fetching if you have the data
  const generateMockProblems = (dashboardData) => {
    const mockProblems = [];
    let problemId = 1;

    // Generate problems based on difficulty stats
    Object.entries(dashboardData.difficultyStats).forEach(
      ([difficulty, solvedCount]) => {
        // Add solved problems
        for (let i = 0; i < solvedCount; i++) {
          mockProblems.push({
            id: problemId++,
            title: `${difficulty} Problem ${i + 1}`,
            description: `A ${difficulty.toLowerCase()} coding challenge`,
            difficulty,
            completed: true,
            points:
              difficulty === "Easy" ? 50 : difficulty === "Medium" ? 100 : 200,
          });
        }

        // Add a few unsolved problems for each difficulty
        const unsolvedCount =
          difficulty === "Easy" ? 3 : difficulty === "Medium" ? 2 : 1;
        for (let i = 0; i < unsolvedCount; i++) {
          mockProblems.push({
            id: problemId++,
            title: `${difficulty} Problem ${solvedCount + i + 1}`,
            description: `A ${difficulty.toLowerCase()} coding challenge`,
            difficulty,
            completed: false,
            points:
              difficulty === "Easy" ? 50 : difficulty === "Medium" ? 100 : 200,
          });
        }
      }
    );

    return mockProblems;
  };

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []); // Empty dependency array means this runs once on mount

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

  const completedProblems = problems?.filter((p) => p.completed) || [];
  const inProgressProblems = problems?.filter((p) => !p.completed) || [];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.username || user?.name || "User"}!
          </h1>
          <p className="text-gray-400">
            Ready to tackle some backend challenges?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-green-500/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {user?.totalSolved || 0}
                </div>
                <div className="text-gray-400">Problems Solved</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-yellow-500/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  0
                  {/* {(user?.totalAttempted || 0) - (user?.totalSolved || 0)} */}
                </div>
                <div className="text-gray-400">In Progress</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  0{/* {user?.streak || 0} */}
                </div>
                <div className="text-gray-400">Day Streak</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {problems?.slice(0, 5).map((problem) => (
              <div
                key={problem.id}
                className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      problem.completed ? "bg-green-500/20" : "bg-gray-500/20"
                    }`}
                  >
                    {problem.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <Code className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-white">
                      {problem.title}
                    </div>
                    <div className="text-sm text-gray-400">
                      {problem.description}
                    </div>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                    problem.difficulty
                  )}`}
                >
                  {problem.difficulty}
                </div>
              </div>
            ))}
          </div>

          {problems.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">No problems available yet.</p>
            </div>
          )}
        </div>

        {/* Progress Overview */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Difficulty Breakdown
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-green-400">Easy</span>
                <span className="text-gray-300">
                  {user?.difficultyStats?.Easy || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-yellow-400">Medium</span>
                <span className="text-gray-300">
                  {user?.difficultyStats?.Medium || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-red-400">Hard</span>
                <span className="text-gray-300">
                  {user?.difficultyStats?.Hard || 0}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Total Attempted</span>
                <span className="text-white">{user?.totalSolved || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Achievement Points
            </h3>
            <div className="text-3xl font-bold text-white mb-2">
              {completedProblems.reduce(
                (total, problem) => total + (problem.points || 0),
                0
              )}
            </div>
            <div className="text-gray-400">Total points earned</div>
            <div className="mt-4 w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    (completedProblems.length / (problems?.length || 1)) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
            <div className="text-sm text-gray-400 mt-2">
              {Math.round(
                (completedProblems.length / (problems?.length || 1)) * 100
              )}
              % Complete
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
