// import React, { useState, useEffect } from "react";
// import {
//   Code,
//   Users,
//   Award,
//   ArrowRight,
//   ChevronDown,
//   Zap,
//   Target,
//   BookOpen,
//   Star,
//   TrendingUp,
// } from "lucide-react";

// function Home() {
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   const [isVisible, setIsVisible] = useState({});

//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       setMousePosition({ x: e.clientX, y: e.clientY });
//     };

//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, []);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           setIsVisible((prev) => ({
//             ...prev,
//             [entry.target.id]: entry.isIntersecting,
//           }));
//         });
//       },
//       { threshold: 0.1 }
//     );

//     document.querySelectorAll("[id]").forEach((el) => observer.observe(el));
//     return () => observer.disconnect();
//   }, []);

//   // Generate minimal background elements
//   const generateElements = () => {
//     return [...Array(15)].map((_, i) => ({
//       id: i,
//       x: Math.random() * 100,
//       y: Math.random() * 100,
//       size: Math.random() * 1.5 + 0.5,
//       delay: Math.random() * 12,
//       duration: Math.random() * 20 + 25,
//     }));
//   };

//   const elements = generateElements();

//   return (
//     <main className="min-h-screen relative overflow-hidden">
//       {/* Enhanced Dark Background */}
//       <div className="fixed inset-0 bg-gradient-to-br from-black via-slate-900 to-gray-900">
//         {/* Very Subtle Mouse Glow */}
//         <div
//           className="absolute w-64 h-64 bg-gradient-to-r from-purple-600/5 via-blue-600/5 to-purple-600/5 rounded-full blur-3xl transition-all duration-700 ease-out pointer-events-none"
//           style={{
//             left: mousePosition.x - 128,
//             top: mousePosition.y - 128,
//           }}
//         />

//         {/* Minimal Background Elements */}
//         {elements.map((element) => (
//           <div
//             key={element.id}
//             className="absolute rounded-full bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 opacity-20"
//             style={{
//               left: `${element.x}%`,
//               top: `${element.y}%`,
//               width: `${element.size}px`,
//               height: `${element.size}px`,
//               animationDelay: `${element.delay}s`,
//               animation: `minimalFloat ${element.duration}s infinite ease-in-out`,
//             }}
//           />
//         ))}

//         {/* Minimal Overlays */}
//         <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
//       </div>

//       {/* Hero Section */}
//       <section className="relative min-h-screen flex items-center justify-center pt-20">
//         <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
//           <div
//             className={`transform transition-all duration-1000 ${
//               isVisible.hero
//                 ? "translate-y-0 opacity-100"
//                 : "translate-y-20 opacity-0"
//             }`}
//             id="hero"
//           >
//             {/* Badge */}
//             <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-xl border border-purple-500/30 rounded-full px-6 py-3 mb-8 animate-pulse">
//               <Star className="w-4 h-4 text-yellow-400" />
//               <span className="text-slate-300 font-medium">
//                 Trusted by 50,000+ Developers
//               </span>
//               <TrendingUp className="w-4 h-4 text-green-400" />
//             </div>

//             <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
//               <span className="block">
//                 <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
//                   Master
//                 </span>
//               </span>
//               <span className="block">
//                 <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
//                   Backend
//                 </span>
//               </span>
//               <span className="block text-white drop-shadow-2xl">
//                 Development
//               </span>
//             </h1>

//             <p className="text-xl md:text-3xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
//               Challenge yourself with{" "}
//               <span className="text-purple-400 font-semibold">
//                 real-world problems
//               </span>
//               . Write code, master algorithms, and become the
//               <span className="text-blue-400 font-semibold">
//                 {" "}
//                 elite developer
//               </span>{" "}
//               you've always dreamed of being.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
//               <button className="group relative overflow-hidden">
//                 <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
//                 <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-500 hover:via-blue-500 hover:to-cyan-500 text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform group-hover:scale-110 shadow-2xl flex items-center gap-3">
//                   Start Your Journey
//                   <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
//                 </div>
//               </button>

//               <button className="group relative">
//                 <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/50 to-blue-500/50 rounded-2xl blur opacity-0 group-hover:opacity-60 transition-all duration-500"></div>
//                 <div className="relative border-2 border-slate-600 hover:border-purple-400 text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform group-hover:scale-105 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10 backdrop-blur-sm">
//                   Explore Challenges
//                 </div>
//               </button>
//             </div>

//             {/* Enhanced Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
//               {[
//                 {
//                   icon: Users,
//                   number: "50,000+",
//                   label: "Active Developers",
//                   color: "from-purple-400 to-pink-400",
//                 },
//                 {
//                   icon: Code,
//                   number: "1,000+",
//                   label: "Coding Challenges",
//                   color: "from-blue-400 to-cyan-400",
//                 },
//                 {
//                   icon: Award,
//                   number: "98%",
//                   label: "Success Rate",
//                   color: "from-green-400 to-emerald-400",
//                 },
//               ].map((stat, index) => (
//                 <div
//                   key={index}
//                   className={`bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 transform transition-all duration-500 hover:scale-105 hover:bg-slate-800/60 ${
//                     isVisible.hero
//                       ? "translate-y-0 opacity-100"
//                       : "translate-y-10 opacity-0"
//                   }`}
//                   style={{ animationDelay: `${index * 150}ms` }}
//                 >
//                   <div
//                     className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-6 mx-auto`}
//                   >
//                     <stat.icon className="w-8 h-8 text-white" />
//                   </div>
//                   <div
//                     className={`text-4xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}
//                   >
//                     {stat.number}
//                   </div>
//                   <div className="text-slate-300 font-medium text-lg">
//                     {stat.label}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Enhanced Scroll Indicator */}
//         <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3 animate-bounce">
//           <span className="text-slate-400 text-sm font-medium">
//             Scroll to explore
//           </span>
//           <ChevronDown className="w-8 h-8 text-purple-400" />
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="relative py-32 bg-gradient-to-b from-transparent to-slate-800/50">
//         <div className="max-w-7xl mx-auto px-6">
//           <div
//             className={`text-center mb-20 transform transition-all duration-800 ${
//               isVisible.features
//                 ? "translate-y-0 opacity-100"
//                 : "translate-y-10 opacity-0"
//             }`}
//             id="features"
//           >
//             <h2 className="text-5xl md:text-7xl font-black text-white mb-8">
//               Why Choose{" "}
//               <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
//                 BackRite
//               </span>
//               ?
//             </h2>
//             <p className="text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
//               Our platform is engineered to transform you into a backend
//               development expert through immersive, hands-on experience and
//               cutting-edge learning methodologies.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-10">
//             {[
//               {
//                 icon: Zap,
//                 title: "Lightning-Fast IDE",
//                 description:
//                   "Experience our advanced cloud-based IDE with real-time compilation, intelligent auto-completion, and instant performance feedback.",
//                 gradient: "from-yellow-400 to-orange-500",
//               },
//               {
//                 icon: Target,
//                 title: "Precision Learning",
//                 description:
//                   "AI-curated challenges that adapt to your skill level, focusing on microservices, API design, and database optimization.",
//                 gradient: "from-purple-400 to-pink-500",
//               },
//               {
//                 icon: BookOpen,
//                 title: "Expert Resources",
//                 description:
//                   "Access comprehensive tutorials, industry best practices, and detailed solution explanations from senior engineers.",
//                 gradient: "from-blue-400 to-cyan-500",
//               },
//             ].map((feature, index) => (
//               <div
//                 key={index}
//                 className={`group relative transform transition-all duration-500 hover:scale-105 ${
//                   isVisible.features
//                     ? "translate-y-0 opacity-100"
//                     : "translate-y-10 opacity-0"
//                 }`}
//                 style={{ animationDelay: `${index * 150}ms` }}
//               >
//                 <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/50 via-blue-500/50 to-cyan-500/50 rounded-3xl blur-lg opacity-0 group-hover:opacity-60 transition-all duration-500"></div>
//                 <div className="relative bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-10 h-full hover:border-purple-500/50 transition-all duration-500">
//                   <div
//                     className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}
//                   >
//                     <feature.icon className="w-10 h-10 text-white" />
//                   </div>
//                   <h3 className="text-2xl font-bold text-white mb-6">
//                     {feature.title}
//                   </h3>
//                   <p className="text-slate-300 leading-relaxed text-lg">
//                     {feature.description}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <style jsx>{`
//         @keyframes minimalFloat {
//           0%,
//           100% {
//             transform: translateY(0px);
//             opacity: 0.15;
//           }
//           50% {
//             transform: translateY(-5px);
//             opacity: 0.25;
//           }
//         }
//       `}</style>
//     </main>
//   );
// }

// export default Home;

import React, { useState, useEffect } from "react";
import {
  Code,
  Users,
  Award,
  ArrowRight,
  ChevronDown,
  Zap,
  Target,
  BookOpen,
  Star,
  Play,
  CheckCircle,
  Sparkles,
} from "lucide-react";

function Home() {
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("[id]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* Premium Background with Gradient Mesh */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <div
            className={`transform transition-all duration-700 ${
              isVisible.hero
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
            id="hero"
          >
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-medium text-sm">
                Join 50,000+ developers mastering backend
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.1]">
              Master Backend
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Development
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Practice with real-world challenges, build production-ready
              skills, and accelerate your career with our comprehensive backend
              development platform.
            </p>

            {/* Premium CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 flex items-center gap-2">
                Start coding for free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>

              <button className="group border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:bg-gray-800/50 flex items-center gap-2">
                <Play className="w-5 h-5" />
                Watch demo
              </button>
            </div>

            {/* Premium Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  icon: Users,
                  number: "50,000+",
                  label: "Active developers",
                  color: "text-blue-400",
                },
                {
                  icon: Code,
                  number: "1,000+",
                  label: "Coding challenges",
                  color: "text-purple-400",
                },
                {
                  icon: Award,
                  number: "98%",
                  label: "Success rate",
                  color: "text-green-400",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`text-center transform transition-all duration-500 ${
                    isVisible.hero
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 bg-gray-800/50 border border-gray-700/50 rounded-lg flex items-center justify-center mb-4 mx-auto backdrop-blur-sm">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 to-gray-900"></div>
        <div className="relative max-w-6xl mx-auto px-6">
          <div
            className={`text-center mb-16 transform transition-all duration-700 ${
              isVisible.features
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
            id="features"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                excel
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools and resources
              you need to become a backend development expert.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Interactive Code Editor",
                description:
                  "Write, test, and debug your code with our powerful online IDE featuring syntax highlighting and real-time feedback.",
                features: [
                  "Syntax highlighting",
                  "Auto-completion",
                  "Real-time testing",
                ],
                gradient: "from-yellow-400 to-orange-500",
              },
              {
                icon: Target,
                title: "Structured Learning Path",
                description:
                  "Follow our carefully designed curriculum that takes you from beginner to advanced backend concepts.",
                features: [
                  "Progressive difficulty",
                  "Skill assessments",
                  "Personalized recommendations",
                ],
                gradient: "from-blue-400 to-purple-500",
              },
              {
                icon: BookOpen,
                title: "Expert Resources",
                description:
                  "Access comprehensive documentation, video tutorials, and solution explanations from industry experts.",
                features: [
                  "Detailed explanations",
                  "Video walkthroughs",
                  "Best practices",
                ],
                gradient: "from-green-400 to-blue-500",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`group bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-8 hover:border-gray-700/50 transition-all duration-300 transform hover:-translate-y-1 ${
                  isVisible.features
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.features.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-gray-300"
                    >
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)]"></div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to level up your{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              backend skills
            </span>
            ?
          </h2>
          <p className="text-xl text-gray-400 mb-10 leading-relaxed">
            Join thousands of developers who are already advancing their careers
            with BackRite.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-blue-500/25">
            Start your free trial
          </button>
        </div>
      </section>
    </main>
  );
}

export default Home;
