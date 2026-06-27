import { useEffect, useState } from "react";
import { Loader2, ShieldAlert } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const URL = import.meta.env.VITE_SERVER_URL;

const OAuthCallback = ({ setUser }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const completeLogin = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setError("No login token was returned by the server.");
        return;
      }

      localStorage.setItem("token", token);

      try {
        const accountRes = await fetch(`${URL}/api/auth/account`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!accountRes.ok) {
          throw new Error("Could not load your account.");
        }

        const account = await accountRes.json();
        localStorage.setItem("user", JSON.stringify(account));
        setUser(account);
        navigate("/problems", { replace: true });
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setError(err.message || "Authentication failed.");
      }
    };

    completeLogin();
  }, [navigate, searchParams, setUser]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080b10] px-5 text-white">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-slate-950/80 p-8 text-center shadow-2xl shadow-cyan-950/20">
        {error ? (
          <>
            <ShieldAlert className="mx-auto mb-4 h-10 w-10 text-red-300" />
            <h1 className="text-2xl font-semibold">Login could not finish</h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">{error}</p>
            <button
              type="button"
              onClick={() => navigate("/signin", { replace: true })}
              className="mt-6 h-11 rounded-lg bg-cyan-300 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
            >
              Try again
            </button>
          </>
        ) : (
          <>
            <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-cyan-200" />
            <h1 className="text-2xl font-semibold">Finishing secure login</h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              We are verifying your token and loading your BackRite account.
            </p>
          </>
        )}
      </div>
    </main>
  );
};

export default OAuthCallback;
