import { Facebook, Github, Instagram, Linkedin, Twitter } from "lucide-react";
import React from "react";

const SOCIALS = [
  {
    icon: <Linkedin className="icon-style" />,
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/deryana-ma-ruf-00b926292/",
  },
  {
    icon: <Facebook className="icon-style" />,
    label: "Facebook",
    url: "https://www.facebook.com/jerri.maruf",
  },
  {
    icon: <Github className="icon-style" />,
    label: "GitHub",
    url: "https://github.com/deriana",
  },
  {
    icon: <Instagram className="icon-style" />,
    label: "Instagram",
    url: "https://www.instagram.com/hi_deri",
  },
  {
    icon: <Twitter className="icon-style" />,
    label: "X",
    url: "https://x.com/Deriana765",
  },
];

const ICON_CLASS = "w-7 h-7";
const TOOLTIP_CLASS =
  "absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap";

function SocialLink({
  icon,
  label,
  url,
}: {
  icon: React.ReactNode;
  label: string;
  url: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative group"
    >
      {icon}
      <span className={TOOLTIP_CLASS}>{label}</span>
    </a>
  );
}

export function SocialLinks() {
  return (
    <div className="flex flex-wrap gap-4 justify-center mt-4">
      {SOCIALS.map((social, i) => (
        <SocialLink key={i} {...social} />
      ))}
    </div>
  );
}
