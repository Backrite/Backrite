// src/components/Footer.jsx
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

function Footer({ showNewsletter = false }) {
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
    <footer className="bg-gray-950 border-t border-gray-800 mt-auto">
      {/* Newsletter Section - Only show when showNewsletter is true */}
      {showNewsletter && (
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
      )}

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
