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

  // Hide header and footer on the problem solve page (it has its own header)
  const isSolvePage = location.pathname.startsWith("/solve/");

  if (isSolvePage) {
    return (
      <div className="flex min-h-screen flex-col bg-[#0c0c0c] text-[#f0f0f5]">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0c0c0c] text-[#f0f0f5]">
      <Header user={user} setUser={setUser} />
      <main className={`flex-grow ${hasFullBleedPage ? "" : "pt-20"}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
