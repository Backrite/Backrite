import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Calendar,
  Loader2,
  AlertCircle,
  Code2,
  ChevronRight,
  Flame,
  TrendingUp,
  Play
} from "lucide-react";

const URL = import.meta.env.VITE_SERVER_URL;

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [problemsList, setProblemsList] = useState([]);
  const [showAllSubmissions, setShowAllSubmissions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submissionsLoading, setSubmissionsLoading] = useState(true);
  const [error, setError] = useState(null);
  const heatmapRef = useRef(null);

  // Fetch stats, submissions and problems
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch(`${URL}/api/dashboard`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          if (res.status === 401) {
            navigate("/signin");
            return;
          }
          throw new Error("Failed to load dashboard data");
        }
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchAllSubmissions = async () => {
      try {
        const res = await fetch(`${URL}/api/submit`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setSubmissions(data);
        }
      } catch (err) {
        console.error("Error loading submissions:", err);
      } finally {
        setSubmissionsLoading(false);
      }
    };

    const fetchProblemsList = async () => {
      try {
        const res = await fetch(`${URL}/api/problems`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setProblemsList(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Error loading problems:", err);
      }
    };

    fetchStats();
    fetchAllSubmissions();
    fetchProblemsList();
  }, [navigate]);

  // Auto-scroll heatmap to the far right after DOM paint
  useEffect(() => {
    const timer = setTimeout(() => {
      if (heatmapRef.current) {
        heatmapRef.current.scrollLeft = heatmapRef.current.scrollWidth;
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [submissions, loading]);

  // Get count of submissions grouped by local YYYY-MM-DD string
  const getSubmissionsCountMap = () => {
    const map = {};
    submissions.forEach((sub) => {
      const d = new Date(sub.submittedAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  };

  const submissionsCountMap = getSubmissionsCountMap();

  // Get color scale matching GitHub/LeetCode shades of green
  const getHeatmapColor = (count) => {
    if (!count || count === 0) return "bg-[#161618]"; // empty dark
    if (count <= 2) return "bg-[#0e4429]"; // light green
    if (count <= 4) return "bg-[#006d32]"; // medium green
    if (count <= 6) return "bg-[#26a641]"; // active green
    return "bg-[#39d353]"; // brightest green
  };

  // Generate LeetCode Activity Heatmap (53 weeks) with month labels
  const renderHeatmap = () => {
    const today = new Date();
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    
    // Start exactly 53 weeks ago on the preceding Sunday
    const startDay = new Date();
    startDay.setDate(today.getDate() - 364);
    const startDayOfWeek = startDay.getDay();
    startDay.setDate(startDay.getDate() - startDayOfWeek);

    const weeks = [];
    let currentDay = new Date(startDay);

    for (let w = 0; w < 53; w++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        const dateStr = `${currentDay.getFullYear()}-${String(
          currentDay.getMonth() + 1
        ).padStart(2, "0")}-${String(currentDay.getDate()).padStart(2, "0")}`;
        
        const count = submissionsCountMap[dateStr] || 0;
        const isFuture = currentDay > today;

        days.push({
          dateStr,
          count,
          isFuture,
          month: currentDay.getMonth(),
          day: currentDay.getDate(),
          formattedDate: currentDay.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
          })
        });
        
        currentDay.setDate(currentDay.getDate() + 1);
      }
      weeks.push(days);
    }

    // Filter out any weeks that are entirely in the future
    const activeWeeks = weeks.filter(week => week.some(day => !day.isFuture));

    // Build month labels: show label on the first week where a new month appears
    // Skip if less than 4 weeks since last label to prevent overlapping
    const monthLabels = [];
    let lastMonth = -1;
    let lastLabelIdx = -10;
    activeWeeks.forEach((week, wIdx) => {
      const firstDayMonth = week[0].month;
      if (firstDayMonth !== lastMonth && wIdx - lastLabelIdx >= 4) {
        monthLabels.push({ wIdx, label: monthNames[firstDayMonth] });
        lastMonth = firstDayMonth;
        lastLabelIdx = wIdx;
      } else if (firstDayMonth !== lastMonth) {
        lastMonth = firstDayMonth;
      }
    });

    return (
      <div
        ref={heatmapRef}
        className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10 select-none"
      >
        <div className="inline-flex flex-col min-w-min">
          {/* Month labels row */}
          <div className="flex gap-1 mb-1.5 h-4">
            {activeWeeks.map((_, wIdx) => {
              const ml = monthLabels.find(m => m.wIdx === wIdx);
              return (
                <div key={wIdx} className="shrink-0 w-[11px] relative h-full">
                  {ml ? (
                    <span className="absolute top-0 left-0 text-[10px] text-[#737373] font-medium whitespace-nowrap">{ml.label}</span>
                  ) : null}
                </div>
              );
            })}
          </div>
          {/* Grid */}
          <div className="flex gap-1">
            {activeWeeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1 shrink-0">
                {week.map((day, dIdx) => (
                  <div key={dIdx} className="relative group">
                    <div
                      className={`w-[11px] h-[11px] rounded-[2px] transition-all duration-150 ${
                        day.isFuture ? "opacity-0 pointer-events-none" : getHeatmapColor(day.count)
                      }`}
                    />
                    
                    {!day.isFuture && (
                      <div className={`absolute left-1/2 -translate-x-1/2 hidden group-hover:block bg-[#1f1f1f] border border-[#262626] text-white text-[10px] font-mono px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none shadow-xl ${
                        dIdx < 2 ? "top-full mt-1.5" : "bottom-full mb-1.5"
                      }`}>
                        {day.count === 0 ? "No" : day.count} submission{day.count !== 1 ? "s" : ""} on {day.formattedDate}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Get 3 recommended unsolved problems
  const getRecommendedProblems = () => {
    const solvedIds = new Set(
      submissions.filter((s) => s.status === "passed" && s.problem).map((s) => s.problem._id)
    );
    const unsolved = problemsList.filter((p) => !solvedIds.has(p._id) && !p.completed);
    return unsolved.slice(0, 3);
  };

  const recommendedProblems = getRecommendedProblems();

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "text-emerald-450";
      case "Medium":
        return "text-amber-450";
      case "Hard":
        return "text-rose-450";
      default:
        return "text-[#525252]";
    }
  };

  const getDifficultyBadgeBg = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-500/10 border-emerald-500/20";
      case "Medium":
        return "bg-amber-500/10 border-amber-500/20";
      case "Hard":
        return "bg-rose-500/10 border-rose-500/20";
      default:
        return "bg-white/5 border-white/10";
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center text-white">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#525252] animate-spin mx-auto mb-4" />
          <p className="text-[#525252] text-sm font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center text-white p-6">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-[#fafafa] mb-2">Error Loading Dashboard</h2>
          <p className="text-xs text-[#737373] mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-1.5 rounded-lg bg-[#1a1a1a] border border-[#262626] text-xs font-semibold text-[#fafafa] hover:border-[#404040]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const displayedSubmissions = showAllSubmissions
    ? submissions
    : submissions.slice(0, 5);

  const solvedPercentage = user?.totalSolved
    ? Math.round((user.totalSolved / (user.totalSolved + user.totalAttempted || 1)) * 100)
    : 0;

  const totalSubmissions = submissions.length;

  return (
    <main className="min-h-screen bg-[#0c0c0c] text-[#fafafa] w-full pt-14 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
        
        {/* LEFT COLUMN: Profile and Solved statistics (LeetCode-style Circular Ring) */}
        <div className="space-y-6">
          {/* Profile Details Card */}
          <div className="rounded-xl border border-[#1f1f1f] bg-[#141414] p-5 flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full border border-[#262626] bg-[#0c0c0c] flex items-center justify-center text-[#fafafa] text-2xl font-bold select-none mb-3">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-lg font-bold tracking-tight text-[#fafafa]">{user?.username}</h2>
            <p className="text-[11px] text-[#525252] font-mono mt-0.5">DEVELOPER</p>

            <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full border border-amber-500/15 text-xs font-mono font-bold mt-4 select-none">
              <Flame className="w-3.5 h-3.5 fill-current animate-pulse" />
              <span>{user?.streak || 0}d Streak</span>
            </div>
          </div>

          {/* Solved Statistics Progress Ring (LeetCode-style) */}
          <div className="rounded-xl border border-[#1f1f1f] bg-[#141414] p-5 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#525252] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Solved Breakdown
            </h3>

            {/* Circular Progress Gauge */}
            <div className="flex items-center justify-center py-2">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="46"
                    className="stroke-[#1f1f1f]"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="46"
                    className="stroke-[#10b981] transition-all duration-500"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 46}
                    strokeDashoffset={2 * Math.PI * 46 * (1 - (solvedPercentage / 100 || 0))}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <div className="text-2xl font-bold text-[#fafafa] font-mono">{user?.totalSolved || 0}</div>
                  <div className="text-[10px] text-[#525252] uppercase font-semibold tracking-wider">Solved</div>
                </div>
              </div>
            </div>

            {/* Difficulty List */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center bg-[#0c0c0c] border border-[#1f1f1f] rounded-lg px-3 py-1.5">
                <span className="text-emerald-400 font-medium">Easy</span>
                <span className="font-mono text-white/70 font-semibold">{user?.difficultyStats?.Easy || 0}</span>
              </div>
              <div className="flex justify-between items-center bg-[#0c0c0c] border border-[#1f1f1f] rounded-lg px-3 py-1.5">
                <span className="text-amber-400 font-medium">Medium</span>
                <span className="font-mono text-white/70 font-semibold">{user?.difficultyStats?.Medium || 0}</span>
              </div>
              <div className="flex justify-between items-center bg-[#0c0c0c] border border-[#1f1f1f] rounded-lg px-3 py-1.5">
                <span className="text-rose-400 font-medium">Hard</span>
                <span className="font-mono text-white/70 font-semibold">{user?.difficultyStats?.Hard || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Heatmap, Target Suggestions & Submissions */}
        <div className="space-y-6 min-w-0">
          
          {/* Heatmap Grid */}
          <div className="rounded-xl border border-[#1f1f1f] bg-[#141414] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#525252] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Submission Calendar
              </h3>
              <span className="text-xs text-[#737373] font-mono">
                {totalSubmissions} submission{totalSubmissions !== 1 ? "s" : ""}
              </span>
            </div>
            {renderHeatmap()}
          </div>

          {/* Target Recommendations Card (Replaces Badges and Skills lists) */}
          <div className="rounded-xl border border-[#1f1f1f] bg-[#141414] p-5 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#525252] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-brand" />
              Recommended Challenges
            </h3>

            {recommendedProblems.length === 0 ? (
              <p className="text-xs text-[#737373] py-2">
                All challenges solved! You are fully up-to-date.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedProblems.map((prob) => (
                  <div
                    key={prob._id}
                    onClick={() => navigate(`/solve/${prob.slug}`)}
                    className="group border border-[#1f1f1f] bg-[#0c0c0c] hover:border-[#262626] rounded-lg p-4 flex flex-col justify-between cursor-pointer transition-all hover:bg-[#141414]"
                  >
                    <div>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getDifficultyColor(prob.difficulty)} ${getDifficultyBadgeBg(prob.difficulty)}`}>
                        {prob.difficulty}
                      </span>
                      <h4 className="text-sm font-semibold mt-2.5 text-[#e5e5e5] group-hover:text-white transition-colors truncate">
                        {prob.title}
                      </h4>
                      <p className="text-[11px] text-[#525252] mt-1 line-clamp-2">
                        {prob.description}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-[11px] font-bold text-white/40 group-hover:text-white transition-all">
                      <span>Solve Challenge</span>
                      <Play className="w-3 h-3 fill-current" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submissions list */}
          <div className="rounded-xl border border-[#1f1f1f] bg-[#141414] p-5 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#525252] flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" />
              Submission Log
            </h3>

            {submissionsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-[#525252] animate-spin" />
              </div>
            ) : submissions.length === 0 ? (
              <p className="text-xs text-[#737373] text-center py-6">No submissions recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {displayedSubmissions.map((sub) => (
                  <div
                    key={sub._id}
                    onClick={() => sub.problem && navigate(`/solve/${sub.problem.slug}`)}
                    className="flex items-center justify-between p-3.5 rounded-lg border border-[#1f1f1f] bg-[#0c0c0c] hover:border-[#262626] hover:bg-[#141414] cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      {sub.status === "passed" ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                      <div>
                        <span className="text-sm font-semibold text-[#fafafa] group-hover:text-white transition-colors">
                          {sub.problem?.title || "Deleted Problem"}
                        </span>
                        <div className="flex items-center gap-3 mt-1 text-[10px] text-[#525252] font-mono">
                          <span>{formatDate(sub.submittedAt)}</span>
                          {sub.problem && (
                            <span className={getDifficultyColor(sub.problem.difficulty)}>
                              {sub.problem.difficulty}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#404040] group-hover:text-[#fafafa] transition-all" />
                  </div>
                ))}

                {submissions.length > 5 && (
                  <div className="text-center pt-2">
                    <button
                      onClick={() => setShowAllSubmissions(!showAllSubmissions)}
                      className="px-4 py-1.5 rounded-lg border border-[#262626] hover:border-[#404040] text-xs font-semibold text-[#a3a3a3] hover:text-[#fafafa] transition-colors cursor-pointer select-none"
                    >
                      {showAllSubmissions ? "Show Less" : "View all submissions"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </main>
  );
};

export default Dashboard;
