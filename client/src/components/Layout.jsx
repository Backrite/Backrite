// src/components/Layout.jsx
import React, { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { div } from "framer-motion/client";

const Layout = () => {
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-950 text-white min-h-screen flex flex-col">
      <Header />

      {/* Add top padding so content doesn't go under Header */}
      <main className="flex-grow pt-20">
        <div className="w-full">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
