import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Play, Filter } from "lucide-react";

const Problems = ({ problems }) => {
  const navigate = useNavigate();
  const [filterDifficulty, setFilterDifficulty] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

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

  const filteredProblems =
    problems?.filter((problem) => {
      const difficultyMatch =
        filterDifficulty === "All" || problem.difficulty === filterDifficulty;
      const statusMatch =
        filterStatus === "All" ||
        (filterStatus === "Completed" && problem.completed) ||
        (filterStatus === "Not Completed" && !problem.completed);

      return difficultyMatch && statusMatch;
    }) || [];

  const handleSolveProblem = (problem) => {
    navigate(`/solve/${problem.slug}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Backend Challenges
          </h1>
          <p className="text-gray-400">
            Master backend development with hands-on coding challenges
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 text-sm">Filter by:</span>
          </div>

          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white px-3 py-1 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white px-3 py-1 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Not Completed">Not Completed</option>
          </select>
        </div>

        {/* Problems Grid */}
        <div className="grid gap-6">
          {filteredProblems.map((problem) => (
            <div
              key={problem._id}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-all hover:shadow-xl hover:shadow-blue-500/10"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      problem.completed ? "bg-green-500/20" : "bg-blue-500/20"
                    }`}
                  >
                    {problem.completed ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      problem.icon
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-xl font-semibold text-white">
                        {problem.title}
                      </h3>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                          problem.difficulty
                        )}`}
                      >
                        {problem.difficulty}
                      </div>
                      <div className="text-sm text-gray-400">
                        {problem.points} pts
                      </div>
                      {problem.completed && (
                        <div className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-md">
                          ✓ Completed
                        </div>
                      )}
                    </div>
                    <p className="text-gray-300 mb-3">{problem.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {problem.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-slate-700 text-gray-300 text-xs rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleSolveProblem(problem)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    problem.completed
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {problem.completed ? "Review" : "Solve"}
                  <Play className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProblems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">
              No problems match your filters
            </div>
            <button
              onClick={() => {
                setFilterDifficulty("All");
                setFilterStatus("All");
              }}
              className="text-blue-400 hover:text-blue-300"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Problems;
