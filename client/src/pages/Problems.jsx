import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Play,
  Search,
  ChevronRight,
  ChevronDown,
  Calendar,
  Loader2,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const URL = import.meta.env.VITE_SERVER_URL;

// Custom Glitch-Free Dropdown Selector Component
const CustomSelect = ({ value, onChange, options, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div className="relative w-full sm:w-40" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#0c0c0c] border border-[#262626] hover:border-[#404040] text-[#a3a3a3] hover:text-[#fafafa] text-xs font-medium px-3.5 py-2 rounded-lg flex items-center justify-between gap-2 focus:outline-none transition-colors cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>{activeOption.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#525252] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 sm:right-0 mt-1.5 w-full bg-[#141414] border border-[#1f1f1f] rounded-lg shadow-xl py-1 z-50 overflow-hidden"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs transition-colors cursor-pointer ${
                  value === opt.value
                    ? "bg-white/10 text-white font-medium"
                    : "text-[#a3a3a3] hover:bg-white/5 hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Problems = ({ problems }) => {
  const [problemsList, setProblemsList] = useState(problems || []);
  const [statsLoading, setStatsLoading] = useState(true);

  const navigate = useNavigate();
  const [filterDifficulty, setFilterDifficulty] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Live database user stats
  const [userStats, setUserStats] = useState({
    username: "",
    totalSolved: 0,
    totalAttempted: 0,
    difficultyStats: { Easy: 0, Medium: 0, Hard: 0 },
    streak: 0,
    solvedDates: []
  });

  // Protect the page & fetch stats + problems
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    const fetchData = async () => {
      try {
        // 1. Fetch latest problems
        const probResponse = await fetch(`${URL}/api/problems`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (probResponse.ok) {
          const probData = await probResponse.json();
          setProblemsList(Array.isArray(probData) ? probData : []);
        }

        // 2. Fetch user stats
        const response = await fetch(`${URL}/api/dashboard`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserStats({
            username: data.username,
            totalSolved: data.totalSolved || 0,
            totalAttempted: data.totalAttempted || 0,
            difficultyStats: data.difficultyStats || { Easy: 0, Medium: 0, Hard: 0 },
            streak: data.streak || 0,
            solvedDates: data.solvedDates || []
          });
        }
      } catch (err) {
        console.error("Error loading user progress:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "text-emerald-400";
      case "Medium":
        return "text-amber-400";
      case "Hard":
        return "text-rose-400";
      default:
        return "text-[#525252]";
    }
  };

  // Extract unique tags
  const allTags = ["All", ...new Set((problemsList || []).flatMap((p) => p.tags || []))];

  // Filtering Logic
  const filteredProblems = (problemsList || []).filter((problem) => {
    const difficultyMatch = filterDifficulty === "All" || problem.difficulty === filterDifficulty;
    const statusMatch =
      filterStatus === "All" ||
      (filterStatus === "Completed" && problem.completed) ||
      (filterStatus === "Not Completed" && !problem.completed);
    const tagMatch = selectedTag === "All" || (problem.tags && problem.tags.includes(selectedTag));
    const searchMatch =
      searchQuery.trim() === "" ||
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchQuery.toLowerCase());

    return difficultyMatch && statusMatch && tagMatch && searchMatch;
  });

  // Calendar Grid Month Dates
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthName = today.toLocaleString("default", { month: "long" });

  const numDays = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const paddingDays = Array.from({ length: firstDayIndex }, (_, i) => null);
  const calendarDays = Array.from({ length: numDays }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
    const hasCompleted = userStats.solvedDates.includes(dateStr);
    const isToday = dayNum === today.getDate();
    return { dayNum, hasCompleted, isToday };
  });

  const totalCalendarCells = [...paddingDays, ...calendarDays];

  // Counts
  const easyTotal = problemsList?.filter((p) => p.difficulty === "Easy").length || 0;
  const mediumTotal = problemsList?.filter((p) => p.difficulty === "Medium").length || 0;
  const hardTotal = problemsList?.filter((p) => p.difficulty === "Hard").length || 0;

  const handleSolveProblem = (problem) => {
    navigate(`/solve/${problem.slug}`);
  };

  const difficultyOptions = [
    { value: "All", label: "All Difficulty" },
    { value: "Easy", label: "Easy" },
    { value: "Medium", label: "Medium" },
    { value: "Hard", label: "Hard" }
  ];

  const statusOptions = [
    { value: "All", label: "All Status" },
    { value: "Completed", label: "Solved" },
    { value: "Not Completed", label: "Unsolved" }
  ];

  return (
    <main className="min-h-screen bg-[#0c0c0c] text-[#fafafa] w-full py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl text-[#fafafa]">
            Problems
          </h1>
          <p className="text-[#737373] text-sm mt-2 max-w-xl">
            Practice backend system design by writing real code. Each problem runs in a sandboxed container.
          </p>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">

          {/* LEFT COLUMN: Problems list */}
          <div className="space-y-5 min-w-0">

            {/* Category Tags Skeleton or Normal */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {statsLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-7 w-20 rounded-full bg-[#141414] animate-pulse border border-[#1f1f1f] shrink-0"
                  />
                ))
              ) : (
                allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                      selectedTag === tag
                        ? "bg-[#fafafa] text-[#0a0a0a]"
                        : "bg-[#1a1a1a] text-[#737373] border border-[#262626] hover:border-[#404040] hover:text-[#a3a3a3]"
                    }`}
                  >
                    {tag === "All" ? "All Topics" : tag}
                  </button>
                ))
              )}
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-[#141414] border border-[#1f1f1f] rounded-xl p-3">
              {/* Search */}
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#525252]" />
                <input
                  type="text"
                  disabled={statsLoading}
                  placeholder="Search problems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0c0c0c] border border-[#262626] text-sm text-[#e5e5e5] pl-10 pr-4 py-2 rounded-lg placeholder-[#525252] focus:outline-none focus:border-[#404040] transition-colors disabled:opacity-50"
                />
              </div>

              {/* Custom Difficulty Selector */}
              <CustomSelect
                value={filterDifficulty}
                onChange={setFilterDifficulty}
                options={difficultyOptions}
                disabled={statsLoading}
              />

              {/* Custom Status Selector */}
              <CustomSelect
                value={filterStatus}
                onChange={setFilterStatus}
                options={statusOptions}
                disabled={statsLoading}
              />
            </div>

            {/* Problems Table */}
            <div className="overflow-hidden border border-[#1f1f1f] rounded-xl bg-[#141414]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#1f1f1f] text-[11px] uppercase tracking-wider text-[#525252]">
                    <th className="py-3 px-4 w-12 text-center">Status</th>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4 w-24">Difficulty</th>
                    <th className="py-3 px-4 w-28 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {statsLoading ? (
                      /* Shimmering Skeleton Loader Rows */
                      Array.from({ length: 6 }).map((_, idx) => (
                        <tr key={`skeleton-row-${idx}`} className="border-b border-[#1f1f1f]">
                          <td className="py-4 px-4 text-center">
                            <div className="w-4 h-4 rounded-full bg-[#1c1c1e] animate-pulse mx-auto" />
                          </td>
                          <td className="py-4 px-4">
                            <div className="h-4 w-48 bg-[#1c1c1e] rounded animate-pulse" />
                            <div className="flex gap-1.5 mt-2">
                              <div className="h-3 w-10 bg-[#1c1c1e] rounded animate-pulse" />
                              <div className="h-3 w-12 bg-[#1c1c1e] rounded animate-pulse" />
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="h-4 w-14 bg-[#1c1c1e] rounded animate-pulse" />
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="h-7 w-16 bg-[#1c1c1e] rounded-full animate-pulse ml-auto" />
                          </td>
                        </tr>
                      ))
                    ) : filteredProblems.length > 0 ? (
                      filteredProblems.map((problem, index) => (
                        <motion.tr
                          key={problem._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15, delay: Math.min(index * 0.02, 0.2) }}
                          className="border-b border-[#1f1f1f] hover:bg-[#1a1a1a] transition-colors group"
                        >
                          {/* Status */}
                          <td className="py-3.5 px-4 text-center">
                            {problem.completed ? (
                              <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-[#333] mx-auto" />
                            )}
                          </td>

                          {/* Title */}
                          <td className="py-3.5 px-4">
                            <div
                              className="text-sm font-medium text-[#e5e5e5] hover:text-[#fafafa] cursor-pointer transition-colors"
                              onClick={() => handleSolveProblem(problem)}
                            >
                              {problem.title}
                            </div>
                            {problem.tags && problem.tags.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1 mt-1">
                                {problem.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-[10px] text-[#525252] bg-[#1a1a1a] px-1.5 py-0.5 rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>

                          {/* Difficulty */}
                          <td className="py-3.5 px-4">
                            <span className={`text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                              {problem.difficulty}
                            </span>
                          </td>

                          {/* Action */}
                          <td className="py-3.5 px-4 text-right">
                            {problem.completed ? (
                              <button
                                onClick={() => handleSolveProblem(problem)}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#737373] hover:text-[#fafafa] border border-[#262626] hover:border-[#404040] bg-transparent px-3 py-1.5 rounded-full transition-all cursor-pointer select-none"
                              >
                                <span>Review</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleSolveProblem(problem)}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-black bg-[#fafafa] hover:bg-[#e5e5e5] px-3.5 py-1.5 rounded-full transition-all cursor-pointer shadow-sm hover:shadow-white/5 select-none"
                              >
                                <span>Solve</span>
                                <Play className="w-3.5 h-3.5 fill-current" />
                              </button>
                            )}
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-16 px-4">
                          <p className="text-[#525252] text-sm mb-3">
                            No problems match your filters.
                          </p>
                          <button
                            onClick={() => {
                              setFilterDifficulty("All");
                              setFilterStatus("All");
                              setSelectedTag("All");
                              setSearchQuery("");
                            }}
                            className="text-xs font-medium text-[#a3a3a3] hover:text-[#fafafa] transition-colors cursor-pointer"
                          >
                            Reset all filters
                          </button>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar Skeletons or Normal */}
          <div className="space-y-5">

            {/* Stats Card */}
            <div className="rounded-xl border border-[#1f1f1f] bg-[#141414] p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xs font-medium uppercase tracking-wider text-[#525252]">
                  Progress
                </h3>
                {statsLoading ? (
                  <div className="h-4 w-10 bg-[#1c1c1e] rounded animate-pulse" />
                ) : (
                  <span className="text-sm font-semibold text-[#fafafa]">
                    {userStats.totalSolved}/{problemsList?.length || 0}
                  </span>
                )}
              </div>

              {statsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between">
                        <div className="h-3 w-10 bg-[#1c1c1e] rounded animate-pulse" />
                        <div className="h-3 w-8 bg-[#1c1c1e] rounded animate-pulse" />
                      </div>
                      <div className="h-1.5 w-full bg-[#1c1c1e] rounded-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-emerald-400 font-medium">Easy</span>
                      <span className="text-[#737373]">{userStats.difficultyStats.Easy}/{easyTotal}</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#1f1f1f] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${easyTotal > 0 ? (userStats.difficultyStats.Easy / easyTotal) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-amber-400 font-medium">Medium</span>
                      <span className="text-[#737373]">{userStats.difficultyStats.Medium}/{mediumTotal}</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#1f1f1f] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${mediumTotal > 0 ? (userStats.difficultyStats.Medium / mediumTotal) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-rose-400 font-medium">Hard</span>
                      <span className="text-[#737373]">{userStats.difficultyStats.Hard}/{hardTotal}</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#1f1f1f] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-400 rounded-full transition-all duration-500"
                        style={{ width: `${hardTotal > 0 ? (userStats.difficultyStats.Hard / hardTotal) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Calendar Card */}
            <div className="rounded-xl border border-[#1f1f1f] bg-[#141414] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-medium uppercase tracking-wider text-[#525252] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {monthName} {year}
                </h3>
              </div>

              {statsLoading ? (
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 35 }).map((_, idx) => (
                    <div key={idx} className="aspect-square bg-[#1c1c1e] rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-[#525252] mb-1">
                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                      <div key={i} className="py-1 font-medium">{d}</div>
                    ))}
                    {totalCalendarCells.map((cell, idx) => {
                      if (cell === null) {
                        return <div key={`empty-${idx}`} className="aspect-square" />;
                      }
                      const { dayNum, hasCompleted, isToday } = cell;
                      return (
                        <div
                          key={`day-${dayNum}`}
                          className={`aspect-square flex items-center justify-center rounded text-[10px] transition-all ${
                            isToday
                              ? "bg-[#fafafa] text-[#0a0a0a] font-bold"
                              : hasCompleted
                                ? "bg-[#10b981]/20 text-[#10b981] font-medium border border-[#10b981]/25"
                                : "text-[#525252] hover:bg-[#1a1a1a]"
                          }`}
                        >
                          {dayNum}
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-[#404040] text-center mt-3">
                    Green = solved a problem on that day
                  </p>
                </>
              )}
            </div>

          </div>

        </div>

      </div>
    </main>
  );
};

export default Problems;
