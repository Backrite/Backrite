import { Code2, Instagram, Linkedin, MailIcon } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  const socialLinks = [
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
  ];

  return (
    <footer className="relative mt-auto border-t border-white/[0.06] bg-transparent backdrop-blur-md">
      {/* Subtle top glow */}
      <div
        className="pointer-events-none absolute -top-px left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.2), rgba(59,130,246,0.2), transparent)",
        }}
      />

      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          {/* Brand */}
          <div className="max-w-md">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#fafafa]">
                <Code2 className="h-3.5 w-3.5 text-[#0a0a0a]" />
              </div>
              <span className="text-lg font-bold text-white">BackRite</span>
            </div>
            <p className="text-sm leading-relaxed text-white/30">
              Backend practice problems, OAuth-secured progress, and a focused
              coding workspace for developers building real systems.
            </p>
          </div>

          {/* Platform links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-white/60">Platform</h4>
            <div className="space-y-2.5">
              <Link
                to="/problems"
                className="block text-sm text-white/30 transition-colors hover:text-white/70"
              >
                Problems
              </Link>
              <Link
                to="/dashboard"
                className="block text-sm text-white/30 transition-colors hover:text-white/70"
              >
                Dashboard
              </Link>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-white/60">Connect</h4>
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] text-white/30 transition-all hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-white/60"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="divider-gradient mt-10" />
        <div className="mt-6 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-white/20">
            © 2026 BackRite. All rights reserved.
          </p>
          <div className="flex gap-5">
            {["Privacy", "Terms", "Cookies"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-xs text-white/20 transition-colors hover:text-white/50"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
