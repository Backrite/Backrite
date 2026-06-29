import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Code,
  Terminal,
  Database,
  Lock,
  Cpu,
  Layers,
  Sparkles,
  Search,
  Play,
  Check,
  ChevronRight,
  MoreHorizontal,
  Shield,
  Zap,
  RefreshCw,
  FolderOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";



/* ═══════════════════════════════════════════════════════════
   SHARED PRIMITIVES
═══════════════════════════════════════════════════════════ */

export function AppleLogo({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 384 512" fill="currentColor" className={className}>
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

export function LogoMark({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 256 256" fill="white" className={className}>
      <path d="M 0 128 C 70.692 128 128 185.308 128 256 L 64 256 C 64 220.654 35.346 192 0 192 Z M 256 192 C 220.654 192 192 220.654 192 256 L 128 256 C 128 185.308 185.308 128 256 128 Z M 128 0 C 128 70.692 70.692 128 0 128 L 0 64 C 35.346 64 64 35.346 64 0 Z M 192 0 C 192 35.346 220.654 64 256 64 L 256 128 C 185.308 128 128 70.692 128 0 Z" />
    </svg>
  );
}

export function AppleButton({ label = "Get started", full = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`group inline-flex items-center justify-center gap-2 rounded-full bg-white text-black font-semibold text-sm px-6 py-3.5 transition-all hover:bg-white/90 active:scale-[0.98] cursor-pointer ${full ? "w-full" : ""
        }`}
    >
      <span className="flex items-center gap-2">
        <AppleLogo className="w-3.5 h-3.5" />
        <span>{label}</span>
      </span>
      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-[2px]" />
    </button>
  );
}

export function SectionEyebrow({ label, tag }) {
  return (
    <div className="inline-flex items-center gap-3.5">
      <span className="w-1.5 h-1.5 rounded-full bg-white" />
      <span className="text-xs uppercase tracking-[0.2em] font-semibold text-white/50">{label}</span>
      {tag && (
        <span className="px-2.5 py-0.5 rounded-full border border-white/10 bg-white/[0.02] text-[10px] text-white/40">
          {tag}
        </span>
      )}
    </div>
  );
}

const headlineGradientStyle = {
  backgroundImage:
    "linear-gradient(to right, #091020 0%, #0B2551 12.5%, #A4F4FD 32.5%, #00d2ff 50%, #0B2551 67.5%, #091020 87.5%, #091020 100%)",
  backgroundSize: "200% auto",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  WebkitTextFillColor: "transparent",
  filter: "url(#c3-noise)",
};

/* ═══════════════════════════════════════════════════════════
   MOCKUP CODE FILE DATABASE
═══════════════════════════════════════════════════════════ */

const MOCK_FILES = {
  "limiter.js": {
    name: "limiter.js",
    route: "GET /api/v1/resource",
    category: "Security",
    difficulty: "Medium",
    summary: "Implements rate limiting using Redis to prevent DDoS and API resource exhaustion.",
    code: `const redis = require('./redis');

module.exports = async function limiter(req, res, next) {
  const ip = req.ip;
  const requests = await redis.incr(ip);
  
  if (requests === 1) {
    await redis.expire(ip, 60); // 1 minute window
  }
  
  if (requests > 100) {
    res.setHeader('Retry-After', 60);
    return res.status(429).json({
      error: 'Too Many Requests',
      limit: 100
    });
  }
  next();
};`,
    tests: [
      { name: "limits request count inside window", pass: true },
      { name: "refills tokens over time", pass: true },
      { name: "returns 429 when exhausted", pass: true },
      { name: "includes Retry-After header", pass: true },
    ],
  },
  "auth.js": {
    name: "auth.js",
    route: "POST /auth/login",
    category: "Authentication",
    difficulty: "Hard",
    summary: "Verifies user password credentials and mints a JWT claims token with standard expirations.",
    code: `const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./db');

module.exports = async function login(req, res) {
  const { email, password } = req.body;
  const user = await db.findUser(email);
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });
  
  return res.json({ token });
};`,
    tests: [
      { name: "verifies bcrypt password hash", pass: true },
      { name: "returns 401 on bad credentials", pass: true },
      { name: "signs token with JWT_SECRET", pass: true },
      { name: "jwt expiration set to 1 hour", pass: true },
    ],
  },
  "validate.js": {
    name: "validate.js",
    route: "PUT /users/:id",
    category: "Validation",
    difficulty: "Easy",
    summary: "Verifies incoming request payloads match the user profile validation schema.",
    code: `const z = require('zod');

const schema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  age: z.number().min(18).optional()
});

module.exports = function validate(req, res, next) {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: result.error.format()
    });
  }
  req.validatedBody = result.data;
  next();
};`,
    tests: [
      { name: "rejects invalid email formats", pass: true },
      { name: "accepts clean payload schema", pass: true },
      { name: "rejects underage values", pass: true },
      { name: "strips unlisted object properties", pass: true },
    ],
  },
  "queue.js": {
    name: "queue.js",
    route: "Worker: job-dispatcher",
    category: "Async Processing",
    difficulty: "Hard",
    summary: "Dispatches payload processing tasks asynchronously to background worker processes.",
    code: `const amqp = require('amqplib');

module.exports = async function dispatch(taskData) {
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await conn.createChannel();
  const queue = 'task_queue';
  
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(taskData)), {
    persistent: true
  });
  
  setTimeout(() => {
    conn.close();
  }, 500);
};`,
    tests: [
      { name: "establishes RabbitMQ link", pass: true },
      { name: "creates durable task queue", pass: true },
      { name: "marks messages persistent", pass: true },
      { name: "closes connection gracefully", pass: true },
    ],
  },
  "cors.js": {
    name: "cors.js",
    route: "OPTIONS /*",
    category: "Security",
    difficulty: "Easy",
    summary: "Applies origin-based security policies for incoming cross-origin client resources.",
    code: `module.exports = function cors(req, res, next) {
  const origin = req.headers.origin;
  const allowed = ['https://backrite.dev', 'http://localhost:5173'];
  
  if (allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
};`,
    tests: [
      { name: "allows backrite.dev origin whitelist", pass: true },
      { name: "returns 204 on preflight request", pass: true },
      { name: "attaches allowed authorization headers", pass: true },
      { name: "blocks third-party script origins", pass: true },
    ],
  },
};

/* ═══════════════════════════════════════════════════════════
   HOME PAGE INTERACTIVE WORKSPACE MOCKUP
═══════════════════════════════════════════════════════════ */

function InteractiveWorkspace() {
  const [activeFile, setActiveFile] = useState("limiter.js");
  const [isRunning, setIsRunning] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [testSuiteResults, setTestSuiteResults] = useState(MOCK_FILES["limiter.js"].tests);
  const [activeMenu, setActiveMenu] = useState(null);

  const fileData = MOCK_FILES[activeFile];

  const handleFileChange = (fileName) => {
    setActiveFile(fileName);
    setTestSuiteResults(MOCK_FILES[fileName].tests);
    setConsoleLogs([]);
  };

  const runTestSuite = () => {
    if (isRunning) return;
    setIsRunning(true);
    setConsoleLogs([]);

    const steps = [
      `$ backrite-test run ${activeFile}`,
      `> Fetching runtime context... OK`,
      `> Connecting to sandbox environment... OK`,
      `> Spawning virtual client container...`,
      `> Initiating 100 concurrent mock API hits...`,
    ];

    let delay = 0;
    steps.forEach((log, idx) => {
      setTimeout(() => {
        setConsoleLogs((prev) => [...prev, log]);
      }, delay);
      delay += 300;
    });

    setTimeout(() => {
      setIsRunning(false);
      setConsoleLogs((prev) => [
        ...prev,
        `\n✔ Successfully ran all assertions for ${activeFile}!`,
        `✔ All tests passed successfully.`,
      ]);
    }, 2000);
  };

  const toggleMenu = (menuName) => {
    if (activeMenu === menuName) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menuName);
    }
  };

  useEffect(() => {
    const handleOutside = () => setActiveMenu(null);
    window.addEventListener("click", handleOutside);
    return () => window.removeEventListener("click", handleOutside);
  }, []);

  const menuOptions = {
    File: ["New Endpoint", "Save Changes", "Import Repository", "Close Project"],
    Edit: ["Format Code", "Find Reference", "Optimize Imports", "Reset Sandbox"],
    View: ["Console Output", "Database Explorer", "Queue Watcher", "Terminal"],
    Go: ["Next Problem", "Previous Problem", "Search Files", "Go to Database"],
    Window: ["Zoom In", "Split View Editor", "Layout Settings", "Minimize"],
    Help: ["BackRite Documentation", "Interactive Runtimes", "Submit Feedback", "AboutIDE"],
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0e1014]/90 backdrop-blur-2xl shadow-2xl">


        {/* 2. MacOS App Title Bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 bg-black/20">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-xs font-mono text-white/50">backrite-ide — active-session // {activeFile}</span>
          <div className="w-12" />
        </div>

        {/* 3. Main Editor Layout */}
        <div className="grid grid-cols-12 h-[600px] font-mono text-xs">
          {/* Sidebar file explorer: col-span-3 */}
          <div className="col-span-12 md:col-span-3 border-b md:border-b-0 md:border-r border-white/10 bg-black/30 p-4 flex flex-col justify-between overflow-y-auto">
            <div>
              <button
                onClick={runTestSuite}
                disabled={isRunning}
                className="w-full rounded-lg bg-white text-black font-semibold text-xs px-3 py-2 flex items-center justify-center gap-2 hover:bg-white/90 transition-colors mb-5 disabled:opacity-50 cursor-pointer"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Running Suite...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run Test Suite</span>
                  </>
                )}
              </button>

              <div className="space-y-1">
                <div className="text-[10px] text-white/40 uppercase tracking-widest px-2 mb-2 flex items-center gap-1.5">
                  <FolderOpen className="w-3 h-3" />
                  <span>Endpoints</span>
                </div>
                {Object.keys(MOCK_FILES).map((fileName) => {
                  const isActive = activeFile === fileName;
                  return (
                    <div
                      key={fileName}
                      onClick={() => handleFileChange(fileName)}
                      className={`flex items-center justify-between px-2.5 py-2 rounded-md cursor-pointer transition-colors ${isActive
                          ? "bg-white/10 text-white"
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <Terminal className="w-3.5 h-3.5" />
                        <span>{fileName}</span>
                      </div>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2 mt-6">
              <div className="text-[10px] text-white/40 uppercase tracking-widest px-2">
                Services
              </div>
              <div className="flex flex-wrap gap-2 px-2">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-400">
                  <span className="w-1 h-1 rounded-full bg-emerald-400" />
                  Redis
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-400">
                  <span className="w-1 h-1 rounded-full bg-emerald-400" />
                  Postgres
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-400">
                  <span className="w-1 h-1 rounded-full bg-emerald-400" />
                  RabbitMQ
                </span>
              </div>
            </div>
          </div>

          {/* Code Editor Pane: col-span-5 */}
          <div className="col-span-12 md:col-span-5 border-b md:border-b-0 md:border-r border-white/10 bg-black/10 flex flex-col">
            <div className="p-3 border-b border-white/10 flex items-center justify-between bg-black/20 px-4">
              <span className="text-[10px] text-white/40 uppercase tracking-widest">Editor</span>
              <span className="text-white/60 font-semibold">{fileData.name}</span>
            </div>

            <div className="flex-1 p-5 overflow-y-auto bg-black/30 font-mono text-[11px] leading-relaxed">
              <pre className="text-white/80 whitespace-pre-wrap select-text">{fileData.code}</pre>
            </div>
          </div>

          {/* Test Runner & Logs Output Pane: col-span-4 */}
          <div className="col-span-12 md:col-span-4 flex flex-col bg-black/20">
            {/* Header Toolbar */}
            <div className="p-3 border-b border-white/10 flex items-center justify-between bg-black/40 px-4">
              <span className="text-[10px] text-white/40 uppercase tracking-widest">Test Console</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={runTestSuite}
                  className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-white/60 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  Run Tests
                </button>
              </div>
            </div>

            <div className="flex-1 p-5 overflow-y-auto flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px]">
                    {fileData.category}
                  </span>
                  <span className="text-[10px] text-white/40 uppercase">{fileData.difficulty}</span>
                </div>

                <div className="p-3.5 rounded-lg border border-[#3D81E3]/20 bg-[#3D81E3]/5 text-[11px] leading-relaxed text-white/80 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#3D81E3] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#3D81E3]">BackRite Analytics: </span>
                    {fileData.summary}
                  </div>
                </div>

                {/* Assertions */}
                <div className="space-y-2">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-2 font-semibold">
                    Assertions
                  </span>
                  {testSuiteResults.map((t, idx) => (
                    <motion.div
                      key={t.name}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className="flex items-center gap-2.5 text-[11px] text-white/70"
                    >
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>{t.name}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Console Logs */}
                {consoleLogs.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-1 font-mono text-[10px] text-white/50">
                    <span className="text-[9px] uppercase tracking-widest text-white/30 block mb-1">
                      Logs
                    </span>
                    {consoleLogs.map((log, index) => (
                      <div key={index} className="whitespace-pre-wrap">
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status footer */}
              <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/5 text-[10px] text-white/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Runtimes Sandbox: Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN HOME PAGE
═══════════════════════════════════════════════════════════ */

export default function Home() {
  const navigate = useNavigate();
  const [yearly, setYearly] = useState(false);

  const start = () => {
    const token = localStorage.getItem("token");
    navigate(token ? "/dashboard" : "/signup");
  };

  const topics = [
    { icon: Code, title: "API Design", count: 6 },
    { icon: Database, title: "Data Modeling", count: 4 },
    { icon: Lock, title: "Auth Flows", count: 5 },
    { icon: Cpu, title: "Queues & Workers", count: 3 },
    { icon: Shield, title: "Validation", count: 4 },
    { icon: Layers, title: "CORS Policies", count: 5 },
  ];

  const steps = [
    { n: "01", title: "Select an endpoint", desc: "Select and solve exercises mapped directly to live system runtimes." },
    { n: "02", title: "Compose solutions", desc: "Write actual code inside the sandbox matching industry specs." },
    { n: "03", title: "Trigger test runners", desc: "Instantly compile, analyze code quality, and run automated health checks." },
    { n: "04", title: "Scale progression", desc: "Log active results into your personal developer dashboard." },
  ];

  return (
    <main className="min-h-screen bg-[#0c0c0c] text-white w-full">
      {/* SVG Noise Filter (Root) */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <filter id="c3-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0" />
            <feComposite in2="SourceGraphic" operator="in" result="noise" />
            <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
          </filter>
        </defs>
      </svg>

      {/* Global background video (fixed, behind everything) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video autoPlay loop muted playsInline
          className="w-full h-full object-cover pointer-events-none"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4" />
      </div>

      {/* Guides */}
      <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 -translate-x-[calc(50%+36rem)] w-px bg-white/10 z-[5]" />
      <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 translate-x-[calc(-50%+36rem)] w-px bg-white/10 z-[5]" />

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* ─── HERO ────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-36 pb-20 w-full text-center flex flex-col items-center px-4">
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-full max-w-7xl" />

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#12141c]/50 px-4 py-1.5 backdrop-blur-md"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-white/60 tracking-wider">Open for sandbox preview</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl md:text-7xl font-bold tracking-tight leading-[1.05]"
          >
            Your backend. <br />
            <span style={headlineGradientStyle} className="animate-shiny inline-block">
              Architected.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-8 max-w-xl text-base md:text-lg leading-[1.6] text-white/60 text-balance"
          >
            Stop memorizing algorithms. Practice building real-world REST endpoints, routing authentication tokens, and wiring database queues inside a highly optimized live sandbox.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-10 flex flex-col items-center gap-3.5"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <AppleButton label="Get started" onClick={start} />
              <button
                type="button"
                onClick={() => navigate("/problems")}
                id="hero-cta-explore"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 px-7 text-sm font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                Browse Problems
              </button>
            </div>
            <span className="text-xs text-white/40 font-mono tracking-wider uppercase">
              Free to use sandbox environments
            </span>
          </motion.div>
        </section>

        {/* ─── INTERACTIVE WORKSPACE MOCKUP (Connected macOS bar) ─── */}
        <section className="w-full py-8">
          <InteractiveWorkspace />
        </section>

        {/* ─── STATS ───────────────────────────────────────── */}
        <section className="w-full py-16 px-4">
          <div className="w-full max-w-7xl mx-auto">
            <div className="h-px bg-white/10" />
            <div className="grid grid-cols-2 gap-8 py-12 sm:grid-cols-4 font-mono text-center">
              {[
                { val: "27+", label: "Problems" },
                { val: "6", label: "Categories" },
                { val: "100%", label: "In-browser" },
                { val: "Free", label: "Always" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    {s.val}
                  </div>
                  <div className="mt-1 text-sm text-white/40">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="h-px bg-white/10" />
          </div>
        </section>

        {/* ─── TOPICS ──────────────────────────────────────── */}
        <section className="w-full py-20 px-4">
          <div className="w-full max-w-7xl mx-auto">
            <div className="mb-6">
              <SectionEyebrow label="Topics" tag="Domains" />
            </div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl mb-12">
              Six core areas. <span className="text-white/40">Real backend depth.</span>
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topics.map((t) => (
                <div
                  key={t.title}
                  onClick={() => navigate("/problems")}
                  className="liquid-glass rounded-2xl p-6 cursor-pointer flex items-center justify-between group hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-white/50 group-hover:text-white transition-colors">
                      <t.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{t.title}</h3>
                      <p className="text-xs text-white/40 mt-0.5">{t.count} problems available</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white transition-transform group-hover:translate-x-1" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── HOW IT WORKS ────────────────────────────────── */}
        <section className="w-full py-20 px-4">
          <div className="w-full max-w-7xl mx-auto">
            <div className="grid gap-16 lg:grid-cols-2 items-start">
              <div>
                <div className="mb-6">
                  <SectionEyebrow label="How it works" tag="Pipeline" />
                </div>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl mb-6">
                  Select, solve, test, and ship.
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-white/50">
                  A high-velocity playground designed for rapid iteration. Every assertion evaluates your execution footprint in real-time.
                </p>
              </div>

              <div className="space-y-3">
                {steps.map((step) => (
                  <div
                    key={step.n}
                    className="liquid-glass rounded-2xl p-5 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex gap-4">
                      <span className="text-xs font-mono font-bold text-white/30 mt-0.5">
                        {step.n}
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold text-white">{step.title}</h3>
                        <p className="mt-1 text-xs leading-relaxed text-white/45">{step.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIALS ────────────────────────────────── */}
        <section className="w-full py-20 px-4 border-t border-white/10">
          <div className="w-full max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  quote: "BackRite gave our engineering team a clear workspace to iterate on complex load balancer logic. It works like a testing suite from the future.",
                  author: "Parker Wilf",
                  role: "Group Product Manager",
                  company: "MERCURY",
                },
                {
                  quote: "The IDE runtime validation has changed how we train new hires. They get real, production-like feedback immediately in their browser.",
                  author: "Andrew von Rosenbach",
                  role: "Senior Engineering Manager",
                  company: "COHERE",
                },
                {
                  quote: "Testing race conditions and rate limits used to require complex setups. BackRite simulates these inside our workspace with zero overhead.",
                  author: "Mathies Christensen",
                  role: "Platform Lead",
                  company: "LUNAR",
                },
              ].map((t, i) => (
                <div key={i} className="liquid-glass rounded-3xl p-6 flex flex-col justify-between min-h-[220px]">
                  <blockquote className="text-sm text-white/80 leading-[1.6]">
                    "{t.quote}"
                  </blockquote>
                  <div className="mt-6 pt-5 border-t border-white/10 flex flex-col font-mono">
                    <span className="text-sm font-semibold text-white">{t.author}</span>
                    <span className="text-[11px] text-white/50">{t.role}</span>
                    <span className="text-[10px] text-[#3D81E3] tracking-wider font-semibold uppercase mt-1">
                      {t.company}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PRICING ─────────────────────────────────────── */}
        <section className="c3-pricing-section w-full border-t border-white/10 bg-[#0c0c0c]/80 backdrop-blur-md">
          <svg className="absolute w-0 h-0 pointer-events-none">
            <defs>
              <filter id="c3-pricing-noise">
                <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" stitchTiles="stitch" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.075" />
                </feComponentTransfer>
                <feComposite in2="SourceGraphic" operator="in" result="noise" />
                <feBlend in="SourceGraphic" in2="noise" mode="overlay" />
              </filter>
            </defs>
          </svg>

          <div className="c3-watermark-container pointer-events-none select-none">
            <div className="c3-watermark-main font-bold">
              <span className="c3-watermark-line-1">Your code.</span>
              <span className="c3-watermark-line-2">Validated.</span>
            </div>
          </div>

          <div className="c3-grid">
            {/* Free */}
            <div className="c3-card">
              <span className="c3-tier-small font-mono">Sandbox</span>
              <span className="c3-tier-large font-bold">Free</span>
              <p className="c3-desc">For developers looking to practice essential backend operations.</p>
              <ul className="c3-list space-y-3 font-mono">
                <li>
                  <span className="c3-check">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </span>
                  <span>15 basic exercises</span>
                </li>
                <li>
                  <span className="c3-check">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </span>
                  <span>Node.js / Go runtimes</span>
                </li>
                <li>
                  <span className="c3-check">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </span>
                  <span>Standard execution limits</span>
                </li>
              </ul>
              <button onClick={start} className="c3-btn font-mono">
                Get started
              </button>
            </div>

            {/* Standard */}
            <div className="c3-card">
              <span className="c3-tier-small font-mono">Standard</span>
              <span className="c3-tier-large font-bold">
                {yearly ? "$99.99/y" : "$9.99/m"}
              </span>
              <p className="c3-desc">For professionals preparing for core backend interviews.</p>
              <ul className="c3-list space-y-3 font-mono">
                <li>
                  <span className="c3-check">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </span>
                  <span>All basic & intermediate challenges</span>
                </li>
                <li>
                  <span className="c3-check">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </span>
                  <span>Full database execution sandbox</span>
                </li>
                <li>
                  <span className="c3-check">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </span>
                  <span>Detailed telemetry execution logs</span>
                </li>
              </ul>
              <button onClick={start} className="c3-btn font-mono">
                Get started
              </button>
            </div>

            {/* Enterprise */}
            <div className="c3-card c3-card-pro" style={{ borderColor: '#3D81E3', borderWidth: '1.5px' }}>
              <span className="c3-tier-small font-mono text-[#3D81E3]">Enterprise</span>
              <span className="c3-tier-large font-bold">
                {yearly ? "$199.99/y" : "$19.99/m"}
              </span>
              <p className="c3-desc">For system architects and scaling development teams.</p>
              <ul className="c3-list space-y-3 font-mono">
                <li>
                  <span className="c3-check">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </span>
                  <span>Unlimited backend endpoints workspace</span>
                </li>
                <li>
                  <span className="c3-check">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </span>
                  <span>Stress testing & concurrency simulation</span>
                </li>
                <li>
                  <span className="c3-check">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </span>
                  <span>Dedicated architectural sandbox</span>
                </li>
              </ul>
              <button onClick={start} className="c3-btn font-mono" style={{ background: '#3D81E3', color: '#fff' }}>
                Get started
              </button>
            </div>
          </div>

          <div className="c3-toggle-wrap">
            <span className="text-xs font-mono tracking-widest uppercase text-white/50">Yearly billing</span>
            <button
              onClick={() => setYearly(!yearly)}
              className={`c3-toggle ${yearly ? "active" : ""}`}
            >
              <div className="c3-toggle-knob" />
            </button>
          </div>
        </section>

        {/* ─── FINAL CTA ───────────────────────────────────── */}
        <section className="w-full max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="liquid-glass relative overflow-hidden rounded-3xl px-8 py-16 md:py-24 text-center flex flex-col items-center justify-center">
            <div
              className="pointer-events-none absolute inset-0 opacity-25"
              style={{
                background: "radial-gradient(600px circle at 50% 0%, rgba(255,255,255,0.15), transparent 70%)",
              }}
            />

            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.1] mb-6">
              Write the endpoint. Ship the API.
            </h2>
            <p className="text-white/60 max-w-md mx-auto text-sm leading-[1.6] mb-10 font-mono">
              Join thousands of developers, architects, and engineering leads who build system mechanics in browser.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <AppleButton label="Get started" onClick={start} />
              <button
                onClick={() => navigate("/problems")}
                className="group flex items-center justify-center gap-2 rounded-full border border-white/15 text-white font-medium text-sm px-6 py-3.5 hover:bg-white/5 transition-all cursor-pointer"
              >
                <span>Browse Challenges</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-[2px]" />
              </button>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
