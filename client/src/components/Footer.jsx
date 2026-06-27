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
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-md">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950">
                <Code2 className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-slate-950">BackRite</span>
            </div>
            <p className="text-sm leading-6 text-slate-600">
              Backend practice problems, OAuth-secured progress, and a focused
              coding workspace for developers building real systems.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-950">Platform</h4>
            <div className="space-y-2">
              <Link to="/problems" className="block text-sm text-slate-600 transition hover:text-slate-950">
                Problems
              </Link>
              <Link to="/dashboard" className="block text-sm text-slate-600 transition hover:text-slate-950">
                Dashboard
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-950">Contact</h4>
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white transition hover:bg-slate-50"
                >
                  <social.icon className="h-4 w-4 text-slate-600" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 md:flex-row">
          <p className="text-sm text-slate-500">Copyright 2026 BackRite. All rights reserved.</p>
          <div className="flex gap-5">
            {["Privacy", "Terms", "Cookies"].map((link) => (
              <a key={link} href="#" className="text-sm text-slate-500 transition hover:text-slate-950">
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
