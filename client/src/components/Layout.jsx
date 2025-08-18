// src/components/Layout.jsx
import React, { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";

const Layout = ({ user, setUser }) => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Check if current page is home to show newsletter
  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  return (
    <div className="bg-gray-950 text-white min-h-screen flex flex-col">
      <Header user={user} setUser={setUser} />

      {/* Add top padding so content doesn't go under Header */}
      <main className="flex-grow pt-20">
        <div className="w-full">
          <Outlet />
        </div>
      </main>

      <Footer showNewsletter={isHomePage} />
    </div>
  );
};

export default Layout;
