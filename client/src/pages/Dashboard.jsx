// src/components/Dashboard.jsx
import React from "react";
import { CheckCircle, Code, Zap } from "lucide-react";

const Dashboard = ({ user, problems }) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.username}!
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
                  {completedProblems.length}
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
                  {inProgressProblems.length}
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
                  {user?.streak || 5}
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
                className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg"
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
                      problem.icon
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
                  {problems?.filter(
                    (p) => p.difficulty === "Easy" && p.completed
                  ).length || 0}{" "}
                  /{" "}
                  {problems?.filter((p) => p.difficulty === "Easy").length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-yellow-400">Medium</span>
                <span className="text-gray-300">
                  {problems?.filter(
                    (p) => p.difficulty === "Medium" && p.completed
                  ).length || 0}{" "}
                  /{" "}
                  {problems?.filter((p) => p.difficulty === "Medium").length ||
                    0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-red-400">Hard</span>
                <span className="text-gray-300">
                  {problems?.filter(
                    (p) => p.difficulty === "Hard" && p.completed
                  ).length || 0}{" "}
                  /{" "}
                  {problems?.filter((p) => p.difficulty === "Hard").length || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Achievement Points
            </h3>
            <div className="text-3xl font-bold text-white mb-2">
              {completedProblems.reduce(
                (total, problem) => total + problem.points,
                0
              )}
            </div>
            <div className="text-gray-400">Total points earned</div>
            <div className="mt-4 w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
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
