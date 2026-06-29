import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MonacoEditor from "@monaco-editor/react";
import {
  Play,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Send,
  FileCode,
  Terminal,
  RotateCcw,
  BookOpen,
  Copy,
  Check,
  Loader2,
  History,
  Code2,
  ChevronRight,
  ChevronLeft,
  Shuffle,
  List,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const URL = import.meta.env.VITE_SERVER_URL;

const ProblemSolve = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("// Write your code here...");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const { slug } = useParams();
  const [allProblems, setAllProblems] = useState([]);
  const [activeLeftTab, setActiveLeftTab] = useState("description");
  const [activeTestCaseIdx, setActiveTestCaseIdx] = useState(0);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [expandedSubmission, setExpandedSubmission] = useState(null);
  const [bottomTab, setBottomTab] = useState("testcase");
  const [timerRunning, setTimerRunning] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/signin");
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); } catch { setUser(null); }
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`${URL}/api/problems`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setAllProblems(d); })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`${URL}/api/problems/${slug}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => { if (r.status === 401) { navigate("/signin"); return null; } return r.json(); })
      .then((d) => { if (d) { setSelectedProblem(d); if (d.starterCode) setCode(d.starterCode); } })
      .catch(console.error);
  }, [slug, navigate]);

  useEffect(() => {
    if (activeLeftTab === "submissions" && selectedProblem?._id) fetchSubmissions();
  }, [activeLeftTab, selectedProblem]);

  const fetchSubmissions = async () => {
    const token = localStorage.getItem("token");
    if (!token || !selectedProblem?._id) return;
    setSubmissionsLoading(true);
    try {
      const res = await fetch(`${URL}/api/submit/${selectedProblem._id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setSubmissions(await res.json());
    } catch (err) { console.error(err); }
    finally { setSubmissionsLoading(false); }
  };

  useEffect(() => {
    if (!timerRunning) return;
    const t = setInterval(() => setTimeSpent((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, [timerRunning]);

  const fmt = (s) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return h > 0 ? `${h}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}` : `${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  };

  const diffColor = (d) => d === "Easy" ? "text-emerald-400" : d === "Medium" ? "text-amber-400" : d === "Hard" ? "text-rose-400" : "text-[#525252]";

  const runCode = useCallback(async () => {
    if (isRunning) return;
    if (!selectedProblem?.testCases?.length) { setOutput("No testcases available."); return; }
    setIsRunning(true); setOutput("Spinning up sandbox container...\n"); setBottomTab("result");
    try {
      const res = await fetch(`${URL}/api/run`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code, tests: selectedProblem.testCases }) });
      const data = await res.json();
      if (data.results) { setTestResults(data.results); setActiveTestCaseIdx(0); const p = data.results.filter((r) => r.passed).length; setOutput(p === data.results.length ? "All test cases passed!" : `${p}/${data.results.length} test cases passed.`); }
      else { setOutput(data.output || "No output."); setTestResults([]); }
    } catch (e) { setOutput("Error: " + e.message); }
    setIsRunning(false);
  }, [isRunning, selectedProblem, code]);

  const submitSolution = useCallback(async () => {
    if (testResults.length === 0) { toast.error("Run your code first."); return; }
    try {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/signin"); return; }
      const res = await fetch(`${URL}/api/submit`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ problemId: selectedProblem._id, code, testResults, timeSpent }) });
      const data = await res.json();
      if (res.ok) { setIsSubmitted(true); fetchSubmissions(); setActiveLeftTab("submissions"); }
      else toast.error(`Failed: ${data.message || "Unknown error"}`);
    } catch (e) { toast.error(`Error: ${e.message}`); }
  }, [testResults, selectedProblem, code, timeSpent, navigate]);

  useEffect(() => {
    const h = (e) => {
      if (e.ctrlKey && e.key === "'") { e.preventDefault(); runCode(); }
      if (e.ctrlKey && e.key === "Enter") { e.preventDefault(); submitSolution(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [runCode, submitSolution]);

  const resetCode = () => { if (window.confirm("Reset to starter code?")) setCode(selectedProblem.starterCode || "// Write your code here..."); };
  const copyTo = (text, i) => { navigator.clipboard.writeText(text); setCopiedIdx(i); setTimeout(() => setCopiedIdx(null), 2000); };
  const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  const ci = allProblems.findIndex((p) => p.slug === slug);
  const goP = () => { if (ci > 0) navigate(`/solve/${allProblems[ci - 1].slug}`); };
  const goN = () => { if (ci < allProblems.length - 1) navigate(`/solve/${allProblems[ci + 1].slug}`); };
  const goR = () => { if (allProblems.length <= 1) return; let r; do { r = Math.floor(Math.random() * allProblems.length); } while (r === ci); navigate(`/solve/${allProblems[r].slug}`); };

  const initials = user?.username?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U";

  if (!selectedProblem) {
    return (
      <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center text-white">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#525252] animate-spin mx-auto mb-4" />
          <p className="text-[#525252] text-sm">Loading workspace...</p>
        </div>
      </div>
    );
  }

  const pc = testResults.filter((r) => r.passed).length;
  const tc = testResults.length;
  const ap = tc > 0 && pc === tc;

  return (
    <div className="h-screen bg-[#0c0c0c] flex flex-col text-[#fafafa] overflow-hidden">
      {/* ── Header Bar ── */}
      <div className="h-[48px] bg-[#141414] border-b border-[#1f1f1f] flex items-center justify-between px-4 shrink-0 select-none">
        {/* Left */}
        <div className="flex items-center gap-1.5">
          <button onClick={() => navigate("/")} className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#1a1a1a] transition-colors cursor-pointer" title="Home">
            <Code2 className="w-4 h-4 text-[#a3a3a3]" />
          </button>
          <div className="w-px h-4 bg-[#262626] mx-1" />
          <button onClick={() => navigate("/problems")} className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg hover:bg-[#1a1a1a] transition-colors cursor-pointer text-xs text-[#737373] hover:text-[#e5e5e5] font-medium">
            <List className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Problems</span>
          </button>
          <div className="flex items-center gap-0.5 ml-1">
            <button onClick={goP} disabled={ci <= 0} className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-[#1a1a1a] transition-colors cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"><ChevronLeft className="w-4 h-4 text-[#737373]" /></button>
            <button onClick={goN} disabled={ci >= allProblems.length - 1} className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-[#1a1a1a] transition-colors cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"><ChevronRight className="w-4 h-4 text-[#737373]" /></button>
            <button onClick={goR} className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-[#1a1a1a] transition-colors cursor-pointer"><Shuffle className="w-3.5 h-3.5 text-[#737373]" /></button>
          </div>
        </div>
        {/* Center */}
        <div className="flex items-center gap-2">
          <button onClick={runCode} disabled={isRunning} className="inline-flex items-center gap-1.5 h-8 px-4 rounded-lg bg-[#1a1a1a] border border-[#262626] hover:border-[#404040] transition-all text-xs font-medium cursor-pointer disabled:opacity-50 text-[#a3a3a3] hover:text-[#fafafa]" title="Run (Ctrl+')">
            {isRunning ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /><span>Running</span></> : <><Play className="w-3 h-3" /><span>Run</span></>}
          </button>
          <button onClick={submitSolution} disabled={isSubmitted} className="inline-flex items-center gap-1.5 h-8 px-4 rounded-lg bg-[#fafafa] hover:bg-[#e5e5e5] text-[#0a0a0a] transition-all text-xs font-bold cursor-pointer disabled:opacity-50" title="Submit (Ctrl+Enter)">
            {isSubmitted ? <><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /><span>Submitted</span></> : <><Send className="w-3 h-3" /><span>Submit</span></>}
          </button>
        </div>
        {/* Right */}
        <div className="flex items-center gap-2">
          <button onClick={() => setTimerRunning((p) => !p)} className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg hover:bg-[#1a1a1a] transition-colors cursor-pointer text-[#737373] hover:text-[#e5e5e5] font-mono text-xs" title={timerRunning ? "Pause" : "Resume"}>
            <Clock className="w-3.5 h-3.5" /><span>{fmt(timeSpent)}</span>
          </button>
          <div className="w-px h-4 bg-[#262626]" />
          <button onClick={() => navigate("/dashboard")} className="flex h-7 w-7 items-center justify-center rounded-full border border-[#262626] text-[11px] font-medium text-[#a3a3a3] hover:border-[#404040] hover:text-[#fafafa] cursor-pointer transition-colors" title="Profile">{initials}</button>
        </div>
      </div>

      {/* ── Title Bar ── */}
      <div className="h-[36px] bg-[#0c0c0c] border-b border-[#1f1f1f] flex items-center px-5 shrink-0 gap-3">
        <span className={`text-[10px] font-bold uppercase tracking-wider ${diffColor(selectedProblem.difficulty)}`}>{selectedProblem.difficulty}</span>
        <span className="text-[13px] font-medium text-[#e5e5e5] truncate">{ci >= 0 ? `${ci + 1}. ` : ""}{selectedProblem.title}</span>
      </div>

      {/* ── Workspace ── */}
      <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT: Description / Submissions */}
        <div className="lg:w-[45%] flex flex-col overflow-hidden border-r border-[#1f1f1f] bg-[#0c0c0c]">
          <div className="flex items-center border-b border-[#1f1f1f] shrink-0 bg-[#141414]">
            {[{ key: "description", icon: BookOpen, label: "Description" }, { key: "submissions", icon: History, label: "Submissions" }].map((tab) => (
              <button key={tab.key} onClick={() => setActiveLeftTab(tab.key)}
                className={`py-2.5 px-5 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 border-b-2 ${activeLeftTab === tab.key ? "border-[#fafafa] text-[#fafafa]" : "border-transparent text-[#525252] hover:text-[#a3a3a3]"}`}>
                <tab.icon className="w-3.5 h-3.5" />{tab.label}
                {tab.key === "submissions" && submissions.length > 0 && <span className="ml-1 bg-[#1a1a1a] text-[#737373] text-[9px] px-1.5 py-0.5 rounded-full font-mono">{submissions.length}</span>}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            <AnimatePresence mode="wait">
              {activeLeftTab === "description" && (
                <motion.div key="desc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }} className="space-y-5">
                  <p className="text-[#a3a3a3] text-[13px] leading-relaxed whitespace-pre-wrap">{selectedProblem.description}</p>
                  {selectedProblem.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProblem.tags.map((t) => <span key={t} className="bg-[#1a1a1a] text-[#525252] text-[10px] font-medium px-2 py-0.5 rounded border border-[#262626]">{t}</span>)}
                    </div>
                  )}
                  <div className="border-t border-[#1f1f1f]" />
                  {selectedProblem.examples?.length > 0 && (
                    <div className="space-y-3">
                      {selectedProblem.examples.map((ex, i) => (
                        <div key={i}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[#e5e5e5] text-[12px] font-semibold">Example {i + 1}</span>
                            <button onClick={() => copyTo(`Input: ${ex.input}\nOutput: ${ex.output}`, i)} className="text-[#404040] hover:text-[#a3a3a3] transition-colors cursor-pointer">
                              {copiedIdx === i ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          <div className="bg-[#141414] border border-[#1f1f1f] rounded-lg p-4 font-mono text-[11px] space-y-1.5">
                            <div><span className="text-[#525252]">Input: </span><span className="text-[#a3a3a3]">{ex.input}</span></div>
                            <div><span className="text-[#525252]">Output: </span><span className="text-[#a3a3a3]">{ex.output}</span></div>
                            {ex.explanation && <div className="border-t border-[#1f1f1f] pt-1.5 mt-1.5"><span className="text-[#525252]">Explanation: </span><span className="text-[#737373] font-sans">{ex.explanation}</span></div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="border-t border-[#1f1f1f]" />
                  <div>
                    <span className="text-[#e5e5e5] text-[12px] font-semibold">Constraints:</span>
                    {selectedProblem.constraints?.length > 0 ? (
                      <ul className="mt-2 space-y-1">
                        {selectedProblem.constraints.map((c, i) => (
                          <li key={i} className="text-[#737373] text-xs flex items-start gap-2">
                            <span className="text-[#404040] mt-0.5">•</span>
                            <code className="text-[#a3a3a3] text-xs bg-[#141414] px-1.5 py-0.5 rounded border border-[#1f1f1f]">{c}</code>
                          </li>
                        ))}
                      </ul>
                    ) : <p className="text-xs text-[#525252] mt-2">Standard constraints apply.</p>}
                  </div>
                </motion.div>
              )}
              {activeLeftTab === "submissions" && (
                <motion.div key="subs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }} className="space-y-2">
                  {submissionsLoading ? (
                    <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 text-[#525252] animate-spin" /></div>
                  ) : submissions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-[#404040]">
                      <History className="w-10 h-10 mb-3 text-[#262626]" />
                      <p className="text-xs">No submissions yet.</p>
                    </div>
                  ) : submissions.map((sub) => (
                    <div key={sub._id} className="border border-[#1f1f1f] bg-[#141414] rounded-lg overflow-hidden hover:border-[#262626] transition-colors">
                      <button onClick={() => setExpandedSubmission(expandedSubmission === sub._id ? null : sub._id)} className="w-full flex items-center justify-between p-3 cursor-pointer text-left">
                        <div className="flex items-center gap-3">
                          {sub.status === "passed" ? <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                          <div>
                            <span className={`text-xs font-semibold ${sub.status === "passed" ? "text-emerald-400" : "text-rose-400"}`}>{sub.status === "passed" ? "Accepted" : "Wrong Answer"}</span>
                            <div className="flex items-center gap-3 mt-0.5 text-[10px] text-[#525252] font-mono">
                              <span>{fmtDate(sub.submittedAt)}</span>
                              <span>{sub.testResults?.filter((t) => t.passed).length}/{sub.testResults?.length} passed</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-[#404040] transition-transform ${expandedSubmission === sub._id ? "rotate-90" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {expandedSubmission === sub._id && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                            <div className="border-t border-[#1f1f1f] p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] text-[#525252] font-mono uppercase tracking-wider flex items-center gap-1.5"><Code2 className="w-3 h-3" /> Code</span>
                                <button onClick={() => setCode(sub.code)} className="text-[10px] text-[#a3a3a3] hover:text-[#fafafa] font-mono cursor-pointer transition-colors">Load in Editor →</button>
                              </div>
                              <pre className="bg-[#0c0c0c] border border-[#1f1f1f] rounded-lg p-3 text-xs text-[#a3a3a3] font-mono overflow-x-auto max-h-[250px] overflow-y-auto whitespace-pre-wrap">{sub.code}</pre>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT: Editor + Test Results */}
        <div className="lg:w-[55%] flex flex-col overflow-hidden bg-[#0c0c0c]">
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex items-center justify-between py-1.5 px-3 border-b border-[#1f1f1f] bg-[#141414] shrink-0">
              <span className="text-[11px] font-mono text-[#525252] flex items-center gap-1.5"><FileCode className="w-3.5 h-3.5 text-amber-400/70" /> JavaScript</span>
              <button onClick={resetCode} className="inline-flex items-center gap-1 text-[10px] font-mono text-[#525252] hover:text-[#a3a3a3] transition-colors cursor-pointer hover:bg-[#1a1a1a] px-2 py-1 rounded"><RotateCcw className="w-3 h-3" /> Reset</button>
            </div>
            <div className="flex-1 min-h-0">
              <MonacoEditor height="100%" defaultLanguage="javascript" theme="vs-dark" value={code} onChange={(v) => setCode(v)}
                options={{ fontSize: 14, fontFamily: "Menlo, Monaco, 'Courier New', monospace", minimap: { enabled: false }, automaticLayout: true, scrollBeyondLastLine: false, padding: { top: 12, bottom: 12 }, cursorBlinking: "smooth", cursorSmoothCaretAnimation: "on", lineNumbers: "on", renderLineHighlight: "line", scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 } }} />
            </div>
          </div>

          {/* Bottom Panel */}
          <div className="border-t border-[#1f1f1f] flex flex-col h-[260px] shrink-0 bg-[#0c0c0c]">
            <div className="flex items-center border-b border-[#1f1f1f] shrink-0 bg-[#141414]">
              <button onClick={() => setBottomTab("testcase")} className={`py-2 px-4 text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1.5 border-b-2 ${bottomTab === "testcase" ? "border-[#fafafa] text-[#fafafa]" : "border-transparent text-[#525252] hover:text-[#a3a3a3]"}`}><Terminal className="w-3 h-3" /> Testcase</button>
              <button onClick={() => setBottomTab("result")} className={`py-2 px-4 text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1.5 border-b-2 ${bottomTab === "result" ? "border-[#fafafa] text-[#fafafa]" : "border-transparent text-[#525252] hover:text-[#a3a3a3]"}`}>
                Test Result
                {tc > 0 && <span className={`ml-1 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${ap ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>{pc}/{tc}</span>}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {bottomTab === "testcase" && (
                <div className="space-y-3">
                  {selectedProblem.testCases?.length > 0 ? selectedProblem.testCases.map((t, i) => (
                    <div key={i} className="bg-[#141414] border border-[#1f1f1f] rounded-lg p-3 font-mono text-[11px]">
                      <span className="text-[#525252] text-[10px] font-semibold">Case {i + 1}</span>
                      <div className="mt-1.5"><span className="text-[#525252]">Input = </span><pre className="mt-1 text-[#a3a3a3] whitespace-pre-wrap">{typeof t.input === "object" ? JSON.stringify(t.input, null, 2) : t.input}</pre></div>
                    </div>
                  )) : <div className="flex flex-col items-center justify-center py-8 text-[#404040]"><Terminal className="w-6 h-6 mb-2 text-[#262626]" /><p className="text-xs">No test cases.</p></div>}
                </div>
              )}
              {bottomTab === "result" && (
                <div>
                  {testResults.length > 0 ? (
                    <div className="space-y-3">
                      <span className={`text-base font-bold ${ap ? "text-emerald-400" : "text-rose-400"}`}>{ap ? "Accepted" : "Wrong Answer"}</span>
                      <p className="text-[11px] text-[#525252] font-mono -mt-2">{pc}/{tc} testcases passed</p>
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                        {testResults.map((r, i) => (
                          <button key={i} onClick={() => setActiveTestCaseIdx(i)} className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${activeTestCaseIdx === i ? "bg-[#1a1a1a] text-[#fafafa] border border-[#262626]" : "text-[#525252] hover:bg-[#141414] border border-transparent"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${r.passed ? "bg-emerald-400" : "bg-rose-400"}`} /> Case {r.index || i + 1}
                          </button>
                        ))}
                      </div>
                      {testResults[activeTestCaseIdx] && (
                        <div className="space-y-2 font-mono text-[11px]">
                          {testResults[activeTestCaseIdx].input && <div><span className="text-[#525252] text-[10px]">Input</span><pre className="mt-1 bg-[#141414] border border-[#1f1f1f] rounded-lg p-3 text-[#a3a3a3] whitespace-pre-wrap">{JSON.stringify(testResults[activeTestCaseIdx].input)}</pre></div>}
                          <div><span className="text-[#525252] text-[10px]">Expected</span><pre className="mt-1 bg-[#141414] border border-[#1f1f1f] rounded-lg p-3 text-[#a3a3a3] whitespace-pre-wrap">{JSON.stringify(testResults[activeTestCaseIdx].expected)}</pre></div>
                          <div><span className="text-[#525252] text-[10px]">Output</span><pre className={`mt-1 bg-[#141414] border border-[#1f1f1f] rounded-lg p-3 whitespace-pre-wrap ${testResults[activeTestCaseIdx].passed ? "text-emerald-400" : "text-rose-400"}`}>{JSON.stringify(testResults[activeTestCaseIdx].actual)}</pre></div>
                          {testResults[activeTestCaseIdx].error && <div><span className="text-rose-400 text-[10px]">Error</span><pre className="mt-1 bg-rose-500/5 border border-rose-500/10 rounded-lg p-3 text-rose-400 whitespace-pre-wrap">{testResults[activeTestCaseIdx].error}</pre></div>}
                        </div>
                      )}
                    </div>
                  ) : <div className="flex flex-col items-center justify-center py-8 text-[#404040]"><p className="text-xs">Run your code first.</p></div>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemSolve;
