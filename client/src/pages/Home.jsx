import {
  ArrowRight,
  BadgeCheck,
  Braces,
  CheckCircle2,
  Clock3,
  Code2,
  Database,
  FileCode2,
  GitBranch,
  Layers3,
  LockKeyhole,
  Play,
  Server,
  TerminalSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const start = () => {
    const token = localStorage.getItem("token");
    navigate(token ? "/dashboard" : "/signup");
  };

  const topics = [
    { icon: Server, title: "API design", count: "6 problems" },
    { icon: Database, title: "Data modeling", count: "4 problems" },
    { icon: LockKeyhole, title: "Auth flows", count: "5 problems" },
    { icon: GitBranch, title: "Queues and jobs", count: "3 problems" },
    { icon: Braces, title: "Parsing and validation", count: "4 problems" },
    { icon: TerminalSquare, title: "Runtime execution", count: "5 problems" },
  ];

  const plan = [
    "Warm up with request and response fundamentals",
    "Build persistence patterns with schemas and relations",
    "Practice JWT, OAuth, and protected route behavior",
    "Submit complete backend solutions from the browser",
  ];

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="relative overflow-hidden border-b border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_72%)]">
        <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.18),transparent_60%)]" />

        <div className="relative mx-auto grid min-h-[88vh] max-w-7xl gap-12 px-5 pb-16 pt-28 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:pt-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm">
              <BadgeCheck className="h-4 w-4 text-sky-600" />
              OAuth-secured backend interview practice
            </div>

            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-normal text-slate-950 sm:text-6xl lg:text-7xl">
              Practice backend coding the way real systems are built.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              BackRite gives you focused API, database, auth, and execution
              challenges with a clean workspace, protected progress, and a
              no-password OAuth sign-in flow.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={start}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Start practicing
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate("/problems")}
                className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                Explore problems
              </button>
            </div>

            <div className="mt-9 flex flex-wrap gap-5 text-sm text-slate-600">
              {["Google/GitHub OAuth", "JWT-protected data", "Browser coding workspace"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-200/70">
            <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  Design a rate limiter API
                </p>
                <p className="text-xs text-slate-500">Medium · Auth + cache</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Ready
              </span>
            </div>

            <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h2 className="text-sm font-semibold text-slate-950">
                  Prompt
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Implement middleware that limits each authenticated user to
                  100 requests per minute and returns a predictable error shape.
                </p>
                <div className="mt-5 space-y-2">
                  {["Read bearer token", "Track request count", "Return 429 response"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-sky-600" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-slate-900 bg-slate-950">
                <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                  <span className="ml-2 text-xs text-slate-400">middleware.js</span>
                </div>
                <pre className="overflow-x-auto p-4 text-sm leading-6 text-slate-200">
{`export function limiter(req, res, next) {
  const userId = req.user.id;
  const window = getWindow(userId);

  if (window.count >= 100) {
    return res.status(429).json({
      error: "RATE_LIMITED"
    });
  }

  next();
}`}
                </pre>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Clock3, label: "35 min", detail: "Target time" },
                { icon: FileCode2, label: "8 tests", detail: "Validation" },
                { icon: Play, label: "Run", detail: "Instant checks" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-slate-200 bg-white p-3">
                  <item.icon className="h-4 w-4 text-sky-600" />
                  <div className="mt-2 text-sm font-semibold text-slate-950">{item.label}</div>
                  <div className="text-xs text-slate-500">{item.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white px-5 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
                Topic library
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">
                Train backend fundamentals by category.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-600">
              Each category is designed for repeated practice, quick review, and
              measurable progress inside your dashboard.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic) => (
              <div
                key={topic.title}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <topic.icon className="h-5 w-5 text-slate-950" />
                <h3 className="mt-4 text-lg font-semibold text-slate-950">{topic.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{topic.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-16 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Study plan
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
              A simple progression from routes to production behavior.
            </h2>
            <p className="mt-5 text-base leading-7 text-slate-600">
              The platform keeps the loop tight: learn the concept, solve a
              practical task, submit code, and track the result against your
              authenticated account.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              {plan.map((item, index) => (
                <div key={item} className="flex gap-4 rounded-lg border border-slate-200 bg-white p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-950">{item}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Short, practical exercises built for consistent reps.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-slate-950 p-8 text-white sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-white text-slate-950">
                <Layers3 className="h-5 w-5" />
              </div>
              <h2 className="text-3xl font-semibold">Ready to solve your next backend challenge?</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Sign in with Google or GitHub, open the problem library, and keep your progress protected behind the same token your API already validates.
              </p>
            </div>
            <button
              type="button"
              onClick={start}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Start now
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
