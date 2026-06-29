import { useEffect, useRef, useState } from "react";
import { Code2, LayoutDashboard, LogOut, Menu, X, Flame } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const URL = import.meta.env.VITE_SERVER_URL;

function Header({ user, setUser }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [streak, setStreak] = useState(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user) {
      setStreak(null);
      return;
    }

    const fetchStreak = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch(`${URL}/api/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setStreak(data.streak || 0);
        }
      } catch (err) {
        console.error("Error loading header streak:", err);
      }
    };

    fetchStreak();
  }, [user, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setShowDropdown(false);
    setIsMenuOpen(false);
    navigate("/");
  };

  const navLinks = user
    ? [
        { name: "Problems", to: "/problems" },
        { name: "Dashboard", to: "/dashboard" },
      ]
    : [
        { name: "Home", to: "/" },
        { name: "Problems", to: "/problems" },
      ];

  const initials =
    user?.username?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U";

  const showBorder = scrolled || isMenuOpen;

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 z-50 w-full transition-[background,border-color,box-shadow] duration-300 ${
        showBorder
          ? "border-b border-white/10 bg-black/40 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 py-3.5 sm:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#fafafa]">
              <Code2 className="h-3.5 w-3.5 text-[#0a0a0a]" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-[#fafafa]">
              BackRite
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className={`text-sm transition-colors ${
                  location.pathname === link.to
                    ? "font-medium text-[#fafafa]"
                    : "text-[#525252] hover:text-[#a3a3a3]"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop auth */}
          <div className="hidden items-center gap-3 lg:flex">
            {!user ? (
              <>
                <Link
                  to="/signin"
                  className="px-3 py-1.5 text-sm text-[#737373] transition-colors hover:text-[#e5e5e5]"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="rounded-lg bg-[#fafafa] px-4 py-1.5 text-sm font-semibold text-[#0a0a0a] transition-all hover:bg-white"
                >
                  Get started
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                {streak !== null && (
                  <div 
                    className="flex items-center gap-1 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-500/20 transition-all font-mono text-xs font-bold cursor-default select-none shadow-sm shadow-amber-500/5" 
                    title="Daily coding streak"
                  >
                    <Flame className="w-3.5 h-3.5 fill-current animate-pulse text-amber-500" />
                    <span>{streak}d</span>
                  </div>
                )}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#262626] text-sm font-medium text-[#a3a3a3] transition-colors hover:border-[#404040] hover:text-[#fafafa] cursor-pointer"
                    onClick={() => setShowDropdown((c) => !c)}
                    aria-label="Open account menu"
                  >
                    {initials}
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-lg border border-[#1f1f1f] bg-[#141414] shadow-xl shadow-black/40">
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#a3a3a3] transition-colors hover:bg-[#1a1a1a] hover:text-[#fafafa]"
                        onClick={() => setShowDropdown(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <div className="h-px bg-[#1f1f1f]" />
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-[#a3a3a3] transition-colors hover:bg-[#1a1a1a] hover:text-[#fafafa]"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="rounded-lg border border-[#262626] p-2 text-[#737373] transition-colors hover:text-[#fafafa] lg:hidden"
            onClick={() => setIsMenuOpen((c) => !c)}
            aria-label="Toggle navigation"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="mt-3 rounded-xl border border-[#1f1f1f] bg-[#141414] p-3 shadow-xl shadow-black/40 lg:hidden">
            <div className="grid gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    location.pathname === link.to
                      ? "bg-[#1a1a1a] font-medium text-[#fafafa]"
                      : "text-[#737373] hover:bg-[#1a1a1a] hover:text-[#fafafa]"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="mx-1 mt-3 h-px bg-[#1f1f1f]" />
            <div className="mt-3">
              {!user ? (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/signin"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-lg border border-[#262626] px-3 py-2.5 text-center text-sm font-medium text-[#a3a3a3]"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-lg bg-[#fafafa] px-3 py-2.5 text-center text-sm font-semibold text-[#0a0a0a]"
                  >
                    Get started
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-lg border border-[#262626] px-3 py-2.5 text-sm font-medium text-[#a3a3a3]"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.header>
  );
}

export default Header;
