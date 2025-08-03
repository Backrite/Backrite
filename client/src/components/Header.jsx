// import React, { useState, useEffect } from "react";
// import { Code, Menu, X } from "lucide-react";

// function Header() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [scrollY, setScrollY] = useState(0);

//   useEffect(() => {
//     const handleScroll = () => setScrollY(window.scrollY);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <header
//       className={`fixed top-0 w-full z-50 transition-all duration-700 ${
//         scrollY > 50
//           ? "bg-slate-900/90 backdrop-blur-xl border-b border-purple-500/20 shadow-2xl shadow-purple-500/10"
//           : "bg-transparent"
//       }`}
//     >
//       <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-transparent to-blue-600/5"></div>

//       <div className="relative max-w-7xl mx-auto px-6 py-5">
//         <div className="flex items-center justify-between">
//           {/* Logo */}
//           <div className="flex items-center space-x-4 group cursor-pointer">
//             <div className="relative">
//               <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-xl blur-lg opacity-30 group-hover:opacity-60 transition-all duration-500 animate-pulse"></div>
//               <div className="relative w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-600 to-cyan-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl">
//                 <Code className="w-7 h-7 text-white transform group-hover:scale-110 transition-transform duration-300" />
//               </div>
//             </div>
//             <div className="flex flex-col">
//               <span className="text-2xl font-black bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:via-blue-300 group-hover:to-cyan-300 transition-all duration-300">
//                 BackRite
//               </span>
//               <span className="text-xs text-slate-400 font-medium tracking-wider -mt-1">
//                 CODE • LEARN • EXCEL
//               </span>
//             </div>
//           </div>

//           {/* Desktop Nav */}
//           <nav className="hidden lg:flex items-center space-x-12">
//             {[
//               { name: "Challenges", isNew: true },
//               { name: "Practice", isNew: false },
//               { name: "Leaderboard", isNew: false },
//               { name: "Community", isNew: false },
//               { name: "Docs", isNew: false },
//             ].map((item, index) => (
//               <div key={item.name} className="relative group">
//                 <a
//                   href="#"
//                   className="text-slate-300 hover:text-white transition-all duration-300 relative font-medium text-lg group-hover:scale-105 transform"
//                 >
//                   {item.name}
//                   {item.isNew && (
//                     <span className="absolute -top-2 -right-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-bounce">
//                       NEW
//                     </span>
//                   )}
//                 </a>
//                 <div className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 group-hover:w-full transition-all duration-500 rounded-full"></div>
//                 <div className="absolute -inset-x-4 -inset-y-2 bg-gradient-to-r from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 rounded-lg transition-all duration-300"></div>
//               </div>
//             ))}
//           </nav>

//           {/* Desktop Buttons */}
//           <div className="hidden lg:flex items-center gap-x-6">
//             <button className="text-slate-300 hover:text-white transition-all duration-300 font-medium relative group">
//               <span className="relative z-10">Sign In</span>
//               <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/20 group-hover:to-blue-500/20 rounded-lg transition-all duration-300"></div>
//             </button>

//             <button className="relative group overflow-hidden">
//               <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-xl blur-lg opacity-60 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
//               <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-500 hover:via-blue-500 hover:to-cyan-500 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 transform group-hover:scale-105 shadow-2xl">
//                 <span className="relative z-10 flex items-center gap-2">
//                   Get Started
//                   <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
//                 </span>
//               </div>
//             </button>
//           </div>

//           {/* Mobile Toggle */}
//           <button
//             className="lg:hidden relative group"
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//           >
//             <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg opacity-0 group-hover:opacity-20 transition-all duration-300"></div>
//             <div className="relative w-10 h-10 flex items-center justify-center">
//               {isMenuOpen ? (
//                 <X className="w-6 h-6 text-white transition-transform duration-300 rotate-90" />
//               ) : (
//                 <Menu className="w-6 h-6 text-white transition-transform duration-300" />
//               )}
//             </div>
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {/* Enhanced Mobile Menu */}
//         {/* Mobile Menu */}
//         <div
//           className={`lg:hidden transition-all duration-500 overflow-hidden ${
//             isMenuOpen ? "max-h-screen opacity-100 mt-6" : "max-h-0 opacity-0"
//           }`}
//         >
//           <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-6 shadow-2xl">
//             {/* Navigation Links */}
//             <nav className="space-y-4 mb-6">
//               {[
//                 { name: "Challenges", link: "/challenges" },
//                 { name: "Practice", link: "/practice" },
//                 { name: "Leaderboard", link: "/leaderboard" },
//                 { name: "Community", link: "/community" },
//                 { name: "Docs", link: "/docs" },
//               ].map((item, index) => (
//                 <a
//                   key={item.name}
//                   href={item.link}
//                   className="block text-white transition-all duration-300 py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-blue-500/20 transform hover:scale-105"
//                   style={{ animationDelay: `${index * 100}ms` }}
//                 >
//                   {item.name}
//                 </a>
//               ))}
//             </nav>

//             {/* Buttons */}
//             <div className="flex flex-col gap-4">
//               <button className="w-full bg-slate-700 text-white py-3 rounded-xl hover:bg-slate-600 transition font-medium">
//                 Sign In
//               </button>
//               <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-purple-500 hover:to-blue-500 transition transform hover:scale-105">
//                 Get Started
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Header;

// import React, { useState, useEffect } from "react";
// import { Code, Menu, X, ChevronDown } from "lucide-react";

// function Header() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [scrollY, setScrollY] = useState(0);

//   useEffect(() => {
//     const handleScroll = () => setScrollY(window.scrollY);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <header
//       className={`fixed top-0 w-full z-50 transition-all duration-300 ${
//         scrollY > 20
//           ? "bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50"
//           : "bg-transparent"
//       }`}
//     >
//       <div className="max-w-7xl mx-auto px-6 py-4">
//         <div className="flex items-center justify-between">
//           {/* Premium Logo */}
//           <div className="flex items-center space-x-3 group cursor-pointer">
//             <div className="relative">
//               <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
//                 <Code className="w-4 h-4 text-white" />
//               </div>
//             </div>
//             <span className="text-xl font-semibold text-white">BackRite</span>
//           </div>

//           {/* Clean Navigation */}
//           <nav className="hidden lg:flex items-center space-x-8">
//             {[
//               { name: "Challenges" },
//               { name: "Practice" },
//               { name: "Leaderboard" },
//               { name: "Community" },
//               { name: "Docs" },
//             ].map((item) => (
//               <a
//                 key={item.name}
//                 href="#"
//                 className="text-gray-300 hover:text-white text-sm font-medium transition-colors duration-200 relative group"
//               >
//                 {item.name}
//                 <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-200"></span>
//               </a>
//             ))}
//           </nav>

//           {/* Premium CTA Buttons */}
//           <div className="hidden lg:flex items-center space-x-4">
//             <button className="text-gray-300 hover:text-white text-sm font-medium transition-colors duration-200">
//               Sign in
//             </button>

//             <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200">
//               Get started
//             </button>
//           </div>

//           {/* Mobile Menu Toggle */}
//           <button
//             className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors duration-200"
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//           >
//             {isMenuOpen ? (
//               <X className="w-5 h-5" />
//             ) : (
//               <Menu className="w-5 h-5" />
//             )}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         <div
//           className={`lg:hidden transition-all duration-300 overflow-hidden ${
//             isMenuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
//           }`}
//         >
//           <div className="bg-gray-900/95 backdrop-blur-xl rounded-lg border border-gray-800 p-4">
//             <nav className="space-y-1">
//               {[
//                 "Challenges",
//                 "Practice",
//                 "Leaderboard",
//                 "Community",
//                 "Docs",
//               ].map((item) => (
//                 <a
//                   key={item}
//                   href="#"
//                   className="block text-gray-300 hover:text-white hover:bg-gray-800/50 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
//                 >
//                   {item}
//                 </a>
//               ))}
//             </nav>

//             <div className="pt-4 mt-4 border-t border-gray-800 space-y-3">
//               <button className="w-full text-left text-gray-300 hover:text-white hover:bg-gray-800/50 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200">
//                 Sign in
//               </button>
//               <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200">
//                 Get started
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Header;

import React, { useState, useEffect } from "react";
import { Code, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Challenges", to: "/challenges" },
    { name: "Practice", to: "/practice" },
    { name: "Leaderboard", to: "/leaderboard" },
    { name: "Community", to: "/community" },
    { name: "Docs", to: "/docs" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 20
          ? "bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 group cursor-pointer"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
              <Code className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold text-white">BackRite</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className="text-gray-300 hover:text-white text-sm font-medium transition-colors duration-200 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-200"></span>
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              to="/signin"
              className="text-gray-300 hover:text-white text-sm font-medium transition-colors duration-200"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
            >
              Get started
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 overflow-hidden ${
            isMenuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-gray-900/95 backdrop-blur-xl rounded-lg border border-gray-800 p-4">
            {/* Nav Links */}
            <nav className="space-y-1 mb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.to}
                  className="block text-gray-300 hover:text-white hover:bg-gray-800/50 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Buttons */}
            <div className="flex flex-col gap-3 border-t border-gray-800 pt-4">
              <Link
                to="/signin"
                className="w-full bg-gray-800 text-white hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-medium text-center transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium text-center transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
