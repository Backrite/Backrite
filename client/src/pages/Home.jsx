import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

  const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
      <button
        onClick={() =>{ 
          const token = localStorage.getItem("token");
      if (token) {
        navigate("/dashboard"); // ✅ already logged in → go to dashboard
      } else {
        navigate("/signup"); // ❌ no token → go to signup
      }
    }}
        className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 flex items-center gap-2"
      >
        Start coding for free
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
      </button>
    </div>
  );
};

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
              <HeroSection />
            </div>

            {/* Premium Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  icon: Users,
                  number: "50+",
                  label: "Active developers",
                  color: "text-blue-400",
                },
                {
                  icon: Code,
                  number: "20+",
                  label: "Coding challenges",
                  color: "text-purple-400",
                },
                {
                  icon: Award,
                  number: "98%",
                  label: "Execution rate",
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
    </main>
  );
}

export default Home;
