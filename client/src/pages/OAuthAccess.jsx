import React, { useState, useEffect } from "react";
import { ArrowRight, Github, ShieldCheck, Code2, Zap, Lock, Loader2, Terminal } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const URL = import.meta.env.VITE_SERVER_URL;

const providerPath = {
  google: "/api/auth/google",
  github: "/api/auth/github",
};

/* ── Custom Google "G" icon ── */
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

/* ── OAuth provider button ── */
const OAuthButton = ({ provider, children, icon, onClick }) => (
  <motion.button
    type="button"
    onClick={() => onClick(provider)}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="group flex h-13 w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-brand/40 cursor-pointer"
  >
    <span className="flex items-center gap-3.5">
      {icon}
      {children}
    </span>
    <ArrowRight className="h-4 w-4 text-white/30 transition-all group-hover:translate-x-1 group-hover:text-white/70" />
  </motion.button>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const OAuthAccess = ({ mode = "signin" }) => {
  const isSignup = mode === "signup";
  const [isWaking, setIsWaking] = useState(false);
  const [wakeLogs, setWakeLogs] = useState([]);
  const [pendingProvider, setPendingProvider] = useState(null);

  const startOAuth = async (provider) => {
    setPendingProvider(provider);
    setIsWaking(true);
    setWakeLogs([
      "==> [Render Check] Pinging service instance on Render free tier...",
      "==> Service is asleep. Initializing spin-up process (approx. 50 seconds)..."
    ]);

    // Background timer logs to simulate Render startup output
    const logIntervals = [
      { t: 3000, l: "==> [00:03] Spinning up container runtime environments..." },
      { t: 8000, l: "==> [00:08] Preparing microservice clusters and network bridges..." },
      { t: 15000, l: "==> [00:15] Launching node backrite-server application index.js..." },
      { t: 22000, l: "==> [00:22] Establishing MongoDB Atlas connection handshakes..." },
      { t: 30000, l: "==> [00:30] Waiting on Express web health check approval..." },
      { t: 38000, l: "==> [00:38] Performing sanity check assertions..." },
    ];

    const timeouts = logIntervals.map(item => 
      setTimeout(() => {
        setWakeLogs(prev => [...prev, item.l]);
      }, item.t)
    );

    // Keep polling the server's home route or status endpoint
    const intervalId = setInterval(async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(`${URL}/api/problems`, { 
          method: "GET",
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.status === 200 || response.status === 401) {
          clearInterval(intervalId);
          timeouts.forEach(clearTimeout);
          setWakeLogs(prev => [...prev, "==> Success! BackRite server is online. Redirecting to OAuth..."]);
          setTimeout(() => {
            window.location.href = `${URL}${providerPath[provider]}`;
          }, 1200);
        }
      } catch (err) {
        // Keep waiting
      }
    }, 4000);

    return () => {
      clearInterval(intervalId);
      timeouts.forEach(clearTimeout);
    };
  };

  return (
    <main className="relative min-h-screen bg-[#0c0c0c] text-white overflow-hidden">
      {/* Background Video */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover pointer-events-none opacity-40"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4"
        />
      </div>

      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(61,129,227,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 -translate-x-[calc(50%+36rem)] w-px bg-white/10 z-[2]" />
      <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 translate-x-[calc(-50%+36rem)] w-px bg-white/10 z-[2]" />

      <section className="relative z-10 mx-auto grid min-h-screen max-w-7xl gap-12 px-5 pb-14 pt-32 sm:px-6 lg:grid-cols-[1fr_440px] lg:items-center lg:pt-24">
        {/* Left side — copy */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants} className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 backdrop-blur-md">
            <ShieldCheck className="h-4 w-4 text-brand" />
            <span className="text-xs font-medium tracking-wider text-white/60 uppercase">Secure OAuth access</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
          >
            {isSignup ? (
              <>
                Build backend services.{" "}
                <span className="bg-gradient-to-r from-brand via-sky-400 to-brand bg-clip-text text-transparent">
                  Practice coding.
                </span>
              </>
            ) : (
              <>
                Continue your{" "}
                <span className="bg-gradient-to-r from-brand via-sky-400 to-brand bg-clip-text text-transparent">
                  journey.
                </span>
              </>
            )}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-lg text-base leading-[1.7] text-white/50 sm:text-lg"
          >
            {isSignup
              ? "Access standard sandbox environments to design, compile, and run your API code. Secure OAuth lets you track your challenge progress immediately."
              : "Access your dashboard, challenge solutions, and code submissions from anywhere using secure Google or GitHub verification."}
          </motion.p>

          <motion.div variants={itemVariants} className="mt-9 grid max-w-lg gap-3 sm:grid-cols-3">
            {[
              { icon: Lock, label: "Secure login" },
              { icon: ShieldCheck, label: "Verified profile" },
              { icon: Zap, label: "Sandbox compile" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm font-medium text-white/60 backdrop-blur-sm"
              >
                <item.icon className="h-3.5 w-3.5 text-brand/70" />
                {item.label}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right side — auth card or starting console */}
        <AnimatePresence mode="wait">
          {!isWaking ? (
            <motion.div
              key="auth-card"
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.97 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] p-7 shadow-2xl shadow-black/40 backdrop-blur-xl"
            >
              <div
                className="pointer-events-none absolute -inset-px rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(61,129,227,0.1) 0%, transparent 40%, transparent 60%, rgba(61,129,227,0.05) 100%)",
                }}
              />

              <div className="relative z-10">
                <div className="mb-7">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 border border-brand/20">
                    <Code2 className="h-5 w-5 text-brand" />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight">
                    {isSignup ? "Create account" : "Sign in"}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-white/45">
                    {isSignup
                      ? "Choose a login provider to set up your account."
                      : "Choose a login provider to enter the workspace."}
                  </p>
                </div>

                <div className="space-y-3">
                  <OAuthButton provider="google" icon={<GoogleIcon />} onClick={startOAuth}>
                    Continue with Google
                  </OAuthButton>
                  <OAuthButton provider="github" icon={<Github className="h-5 w-5 text-white/80" />} onClick={startOAuth}>
                    Continue with GitHub
                  </OAuthButton>
                </div>

                <div className="mt-6 rounded-xl border border-brand/15 bg-brand/[0.05] p-4 text-[13px] leading-relaxed text-white/50">
                  <span className="font-semibold text-brand/80">Secure by design —</span>{" "}
                  All API calls use <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-xs font-mono text-white/60">Authorization: Bearer</code> tokens after OAuth verification.
                </div>

                <p className="mt-6 text-center text-sm text-white/40">
                  {isSignup ? "Already have an account?" : "New to BackRite?"}{" "}
                  <Link
                    to={isSignup ? "/signin" : "/signup"}
                    className="font-semibold text-brand hover:text-brand/80 transition-colors"
                  >
                    {isSignup ? "Sign in" : "Create an account"}
                  </Link>
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="waking-card"
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.97 }}
              className="relative rounded-2xl border border-white/[0.08] bg-[#0c0c0e] p-6 shadow-2xl shadow-black/40 backdrop-blur-xl w-full min-h-[380px] flex flex-col font-mono text-xs text-white/80"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <span className="flex items-center gap-2 font-bold tracking-tight text-white">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  Render Deployment Shell
                </span>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#737373]" />
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 select-text text-[11px] leading-relaxed max-h-[250px] scrollbar-thin scrollbar-thumb-white/10 pr-2">
                {wakeLogs.map((log, idx) => (
                  <div key={idx} className={log.includes("Success") ? "text-emerald-400 font-bold" : "text-[#a3a3a3]"}>
                    {log}
                  </div>
                ))}
              </div>

              <div className="border-t border-white/5 pt-3 mt-4 flex items-center justify-between text-[10px] text-white/45">
                <span>Instigating OAuth callback...</span>
                <span className="animate-pulse">Active spinup sequence</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
};

export default OAuthAccess;
