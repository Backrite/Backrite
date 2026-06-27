import { ArrowRight, Github, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const URL = import.meta.env.VITE_SERVER_URL;

const providerPath = {
  google: "/api/auth/google",
  github: "/api/auth/github",
};

const startOAuth = (provider) => {
  window.location.href = `${URL}${providerPath[provider]}`;
};

const OAuthButton = ({ provider, children, icon }) => (
  <button
    type="button"
    onClick={() => startOAuth(provider)}
    className="group flex h-12 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-200"
  >
    <span className="flex items-center gap-3">
      {icon}
      {children}
    </span>
    <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-950" />
  </button>
);

const OAuthAccess = ({ mode = "signin" }) => {
  const isSignup = mode === "signup";

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="mx-auto grid min-h-screen max-w-7xl gap-12 px-5 pb-14 pt-28 sm:px-6 lg:grid-cols-[1fr_430px] lg:items-center lg:pt-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700">
            <ShieldCheck className="h-4 w-4 text-sky-600" />
            OAuth-only access
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Sign in once. Keep every backend rep protected.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            BackRite uses Google and GitHub OAuth only. Your backend receives a
            JWT after provider verification, and protected pages keep validating
            that token before showing problems or dashboard data.
          </p>

          <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
            {["No passwords", "Verified identity", "JWT API access"].map((item) => (
              <div key={item} className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/70">
          <div className="mb-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-950 text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-semibold">
              {isSignup ? "Create your account" : "Welcome back"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {isSignup
                ? "Choose a provider to create your BackRite account."
                : "Continue with the same provider you used before."}
            </p>
          </div>

          <div className="space-y-3">
            <OAuthButton
              provider="google"
              icon={<span className="flex h-5 w-5 items-center justify-center rounded border border-slate-200 bg-white text-sm font-bold text-slate-950">G</span>}
            >
              Continue with Google
            </OAuthButton>
            <OAuthButton provider="github" icon={<Github className="h-5 w-5" />}>
              Continue with GitHub
            </OAuthButton>
          </div>

          <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
            Protected API calls still use <span className="font-semibold">Authorization: Bearer token</span> after OAuth succeeds.
          </div>

          <p className="mt-6 text-center text-sm text-slate-600">
            {isSignup ? "Already have access?" : "New to BackRite?"}{" "}
            <Link to={isSignup ? "/signin" : "/signup"} className="font-semibold text-slate-950 hover:text-sky-700">
              {isSignup ? "Sign in" : "Create an account"}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default OAuthAccess;
