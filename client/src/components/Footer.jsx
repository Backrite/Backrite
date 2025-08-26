// src/components/Footer.jsx
import React from "react";
import { Code, Linkedin, Instagram, MailIcon } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Top Section: Brand + Links + Contact */}
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-8">
          {/* Brand Section */}
          <div className="max-w-md">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                <Code className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-semibold text-white">BackRite</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              The premier platform for backend developers to master their craft
              through real-world challenges and expert-guided learning paths.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Platform
            </h4>
            <div className="space-y-3">
              <a
                href="/problems"
                className="block text-gray-400 hover:text-white transition-colors duration-200 text-sm"
              >
                Problems
              </a>
              <a
                href="/dashboard"
                className="block text-gray-400 hover:text-white transition-colors duration-200 text-sm"
              >
                Dashboard
              </a>
            </div>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Contact Us
            </h4>
            <div className="flex space-x-3">
              {[
                {
                  icon: Instagram,
                  href: "https://www.instagram.com/hackxcelerate/",
                  label: "Instagram",
                },
                {
                  icon: MailIcon,
                  href: "mailto:hackxcelerate@gmail.com",
                  label: "Mail",
                },
                {
                  icon: Linkedin,
                  href: "https://www.linkedin.com/in/hackxcelerate-9b6409366/",
                  label: "LinkedIn",
                },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors duration-200 border border-gray-700/50 hover:border-gray-600/50"
                >
                  <social.icon className="w-4 h-4 text-gray-400" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2025 BackRite. All rights reserved.
          </p>
          <div className="flex gap-6">
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
    </footer>
  );
}

export default Footer;
