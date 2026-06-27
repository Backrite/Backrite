import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ user, setUser }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isHomePage = location.pathname === "/" || location.pathname === "/home";
  const hasFullBleedPage = ["/", "/signin", "/signup", "/auth/callback"].includes(location.pathname);

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-950">
      <Header user={user} setUser={setUser} />
      <main className={`flex-grow ${hasFullBleedPage ? "" : "pt-20"}`}>
        <Outlet />
      </main>
      {isHomePage && <Footer />}
    </div>
  );
};

export default Layout;
