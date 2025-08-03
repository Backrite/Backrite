// import React, { useState } from "react";
// import {
//   Code,
//   Github,
//   Twitter,
//   Linkedin,
//   Mail,
//   Phone,
//   MapPin,
//   ArrowRight,
//   Heart,
//   Zap,
// } from "lucide-react";

// function Footer() {
//   const [email, setEmail] = useState("");
//   const [isSubscribed, setIsSubscribed] = useState(false);

//   const handleSubscribe = (e) => {
//     e.preventDefault();
//     if (email) {
//       setIsSubscribed(true);
//       setEmail("");
//       setTimeout(() => setIsSubscribed(false), 3000);
//     }
//   };

//   return (
//     <footer className="relative bg-gradient-to-b from-slate-800/50 to-slate-900 border-t border-purple-500/20">
//       {/* Background Effects */}
//       <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-transparent to-blue-600/5"></div>
//       <div className="absolute inset-0">
//         {[...Array(20)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-pulse"
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               animationDelay: `${Math.random() * 3}s`,
//               animationDuration: `${2 + Math.random() * 2}s`,
//             }}
//           />
//         ))}
//       </div>

//       <div className="relative max-w-7xl mx-auto px-6">
//         {/* Newsletter Section */}
//         <div className="py-16 border-b border-slate-700/50">
//           <div className="text-center max-w-4xl mx-auto">
//             <h3 className="text-4xl md:text-5xl font-black text-white mb-6">
//               Stay Ahead of the{" "}
//               <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
//                 Curve
//               </span>
//             </h3>
//             <p className="text-xl text-slate-300 mb-10 leading-relaxed">
//               Get exclusive access to new challenges, expert tips, and industry
//               insights delivered to your inbox weekly.
//             </p>

//             <form
//               onSubmit={handleSubscribe}
//               className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
//             >
//               <div className="flex-1 relative group">
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="Enter your email address"
//                   className="w-full bg-slate-800/80 backdrop-blur-xl border border-slate-600 focus:border-purple-500 rounded-xl px-6 py-4 text-white placeholder-slate-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
//                   required
//                 />
//                 <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl opacity-0 group-focus-within:opacity-20 transition-all duration-300 -z-10"></div>
//               </div>

//               <button
//                 type="submit"
//                 className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-purple-500/25"
//               >
//                 <span className="flex items-center gap-2">
//                   {isSubscribed ? "Subscribed!" : "Subscribe"}
//                   <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
//                 </span>
//               </button>
//             </form>

//             {isSubscribed && (
//               <div className="mt-6 text-green-400 font-medium animate-bounce">
//                 🎉 Welcome to the BackRite community!
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Main Footer Content */}
//         <div className="py-16 grid lg:grid-cols-5 gap-12">
//           {/* Brand Section */}
//           <div className="lg:col-span-2">
//             <div className="flex items-center space-x-4 mb-8 group">
//               <div className="relative">
//                 <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-xl blur-lg opacity-30 group-hover:opacity-60 transition-all duration-500"></div>
//                 <div className="relative w-14 h-14 bg-gradient-to-br from-purple-500 via-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-2xl">
//                   <Code className="w-8 h-8 text-white" />
//                 </div>
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-3xl font-black bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
//                   BackRite
//                 </span>
//                 <span className="text-sm text-slate-400 font-medium tracking-wider">
//                   CODE • LEARN • EXCEL
//                 </span>
//               </div>
//             </div>

//             <p className="text-slate-300 mb-8 leading-relaxed text-lg">
//               Empowering the next generation of backend developers through
//               innovative challenges, real-world projects, and a supportive
//               global community of learners and experts.
//             </p>

//             <div className="flex space-x-4">
//               {[
//                 { icon: Github, href: "#", color: "hover:text-white" },
//                 { icon: Twitter, href: "#", color: "hover:text-blue-400" },
//                 { icon: Linkedin, href: "#", color: "hover:text-blue-500" },
//               ].map((social, index) => (
//                 <a key={index} href={social.href} className="group relative">
//                   <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl opacity-0 group-hover:opacity-20 transition-all duration-300"></div>
//                   <div className="relative w-12 h-12 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 backdrop-blur-sm">
//                     <social.icon
//                       className={`w-6 h-6 text-slate-400 ${social.color} transition-colors duration-300`}
//                     />
//                   </div>
//                 </a>
//               ))}
//             </div>
//           </div>

//           {/* Platform Links */}
//           <div>
//             <h4 className="text-white font-bold text-xl mb-8 flex items-center gap-2">
//               <Zap className="w-5 h-5 text-purple-400" />
//               Platform
//             </h4>
//             <div className="space-y-4">
//               {[
//                 "Coding Challenges",
//                 "Practice Arena",
//                 "Skill Assessment",
//                 "Leaderboard",
//                 "Community Hub",
//                 "Live Sessions",
//               ].map((link) => (
//                 <a
//                   key={link}
//                   href="#"
//                   className="block text-slate-400 hover:text-purple-400 transition-all duration-300 relative group"
//                 >
//                   <span className="relative z-10">{link}</span>
//                   <div className="absolute -inset-x-2 -inset-y-1 bg-gradient-to-r from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 rounded-lg transition-all duration-300"></div>
//                 </a>
//               ))}
//             </div>
//           </div>

//           {/* Resources */}
//           <div>
//             <h4 className="text-white font-bold text-xl mb-8 flex items-center gap-2">
//               <Code className="w-5 h-5 text-blue-400" />
//               Resources
//             </h4>
//             <div className="space-y-4">
//               {[
//                 "Documentation",
//                 "API Reference",
//                 "Video Tutorials",
//                 "Code Examples",
//                 "Best Practices",
//                 "Help Center",
//               ].map((link) => (
//                 <a
//                   key={link}
//                   href="#"
//                   className="block text-slate-400 hover:text-blue-400 transition-all duration-300 relative group"
//                 >
//                   <span className="relative z-10">{link}</span>
//                   <div className="absolute -inset-x-2 -inset-y-1 bg-gradient-to-r from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 rounded-lg transition-all duration-300"></div>
//                 </a>
//               ))}
//             </div>
//           </div>

//           {/* Contact & Support */}
//           <div>
//             <h4 className="text-white font-bold text-xl mb-8 flex items-center gap-2">
//               <Heart className="w-5 h-5 text-pink-400" />
//               Get in Touch
//             </h4>
//             <div className="space-y-6">
//               <div className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors duration-300 group">
//                 <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center group-hover:bg-purple-500/20 transition-all duration-300">
//                   <Mail className="w-5 h-5" />
//                 </div>
//                 <div>
//                   <div className="font-medium">hello@backrite.dev</div>
//                   <div className="text-sm text-slate-500">
//                     General inquiries
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors duration-300 group">
//                 <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 transition-all duration-300">
//                   <Phone className="w-5 h-5" />
//                 </div>
//                 <div>
//                   <div className="font-medium">+1 (555) 123-4567</div>
//                   <div className="text-sm text-slate-500">Support hotline</div>
//                 </div>
//               </div>

//               <div className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors duration-300 group">
//                 <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center group-hover:bg-green-500/20 transition-all duration-300">
//                   <MapPin className="w-5 h-5" />
//                 </div>
//                 <div>
//                   <div className="font-medium">San Francisco, CA</div>
//                   <div className="text-sm text-slate-500">Headquarters</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Bottom Bar */}
//         <div className="border-t border-slate-700/50 py-8">
//           <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
//             <div className="flex items-center gap-2 text-slate-400">
//               <span>© 2025 BackRite. Crafted with</span>
//               <Heart className="w-4 h-4 text-red-400 animate-pulse" />
//               <span>by developers, for developers.</span>
//             </div>

//             <div className="flex flex-wrap justify-center gap-8">
//               {[
//                 "Privacy Policy",
//                 "Terms of Service",
//                 "Cookie Policy",
//                 "Security",
//                 "Status",
//               ].map((link) => (
//                 <a
//                   key={link}
//                   href="#"
//                   className="text-slate-400 hover:text-purple-400 text-sm transition-colors duration-300 relative group"
//                 >
//                   {link}
//                   <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
//                 </a>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }

// export default Footer;

import React, { useState } from "react";
import {
  Code,
  Github,
  Twitter,
  Linkedin,
  Mail,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-gray-950 border-t border-gray-800">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-white mb-4">
              Stay ahead of the curve
            </h3>
            <p className="text-lg text-gray-400 mb-8">
              Get the latest challenges, tips, and industry insights delivered
              weekly.
            </p>

            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 justify-center"
              >
                {isSubscribed ? "Subscribed!" : "Subscribe"}
                {!isSubscribed && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            {isSubscribed && (
              <p className="mt-4 text-green-400 font-medium">
                Thanks for subscribing! Check your email for confirmation.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                <Code className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-semibold text-white">BackRite</span>
            </div>

            <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
              The premier platform for backend developers to master their craft
              through real-world challenges and expert-guided learning paths.
            </p>

            <div className="flex space-x-3">
              {[
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors duration-200 border border-gray-700/50 hover:border-gray-600/50"
                >
                  <social.icon className="w-4 h-4 text-gray-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Platform
            </h4>
            <div className="space-y-3">
              {[
                "Challenges",
                "Practice",
                "Leaderboard",
                "Community",
                "Pricing",
              ].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Resources
            </h4>
            <div className="space-y-3">
              {[
                { name: "Documentation", external: false },
                { name: "API Reference", external: true },
                { name: "Tutorials", external: false },
                { name: "Blog", external: false },
                { name: "Help Center", external: false },
              ].map((link) => (
                <a
                  key={link.name}
                  href="#"
                  className="block text-gray-400 hover:text-white transition-colors duration-200 items-center gap-1 text-sm"
                >
                  {link.name}
                  {link.external && <ExternalLink className="w-3 h-3" />}
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Company
            </h4>
            <div className="space-y-3">
              {["About", "Careers", "Contact", "Partners"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  {link}
                </a>
              ))}
              <a
                href="mailto:hello@backrite.dev"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 text-sm mt-4"
              >
                <Mail className="w-4 h-4" />
                hello@backrite.dev
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 BackRite. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (link) => (
                  <a
                    key={link}
                    href="#"
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link}
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
