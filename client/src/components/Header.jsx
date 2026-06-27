import { useEffect, useRef, useState } from "react";
import { Code2, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Header({ user, setUser }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
  const hasBorder = scrollY > 8 || isMenuOpen;

  return (
    <header
      className={`fixed top-0 z-50 w-full bg-white/90 backdrop-blur-xl transition ${
        hasBorder ? "border-b border-slate-200 shadow-sm" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 py-3 sm:px-6">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-white">
              <Code2 className="h-5 w-5" />
            </span>
            <span className="text-xl font-semibold tracking-tight text-slate-950">
              BackRite
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className={`text-sm font-medium transition ${
                  location.pathname === link.to
                    ? "text-slate-950"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {!user ? (
              <>
                <Link
                  to="/signin"
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-slate-950"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Get started
                </Link>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-950 shadow-sm transition hover:border-slate-300"
                  onClick={() => setShowDropdown((current) => !current)}
                  aria-label="Open account menu"
                >
                  {initials}
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-48 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                      onClick={() => setShowDropdown(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-800 transition hover:bg-slate-50 lg:hidden"
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-label="Toggle navigation"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3 shadow-xl lg:hidden">
            <div className="grid gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`rounded-lg px-3 py-3 text-sm font-medium transition ${
                    location.pathname === link.to
                      ? "bg-slate-100 text-slate-950"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="mt-3 border-t border-slate-200 pt-3">
              {!user ? (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/signin"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-lg border border-slate-200 px-3 py-3 text-center text-sm font-semibold text-slate-800"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-lg bg-slate-950 px-3 py-3 text-center text-sm font-semibold text-white"
                  >
                    Get started
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm font-semibold text-slate-800"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
