import { Facebook, Github, Instagram, Linkedin, Twitter } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils"; // path ke fungsi cn kamu

const SOCIALS = [
  {
    icon: Linkedin,
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/deryana-ma-ruf-00b926292/",
  },
  {
    icon: Facebook,
    label: "Facebook",
    url: "https://www.facebook.com/jerri.maruf",
  },
  {
    icon: Github,
    label: "GitHub",
    url: "https://github.com/deriana",
  },
  {
    icon: Instagram,
    label: "Instagram",
    url: "https://www.instagram.com/hi_deri",
  },
  {
    icon: Twitter,
    label: "X",
    url: "https://x.com/Deriana765",
  },
];

const TOOLTIP_CLASS =
  "absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap";

type SocialLinkProps = {
  icon: React.ElementType;
  label: string;
  url: string;
  size?: number;
};

function SocialLink({
  icon: Icon,
  label,
  url,
  size = 28,
}: SocialLinkProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative group"
    >
      <Icon className={cn("hover-target", `w-[${size}px] h-[${size}px]`)} />
      <span className={TOOLTIP_CLASS}>{label}</span>
    </a>
  );
}

type SocialLinksProps = {
  direction?: "row" | "col";
  iconSize?: number;
  className?: string;
};

export function SocialLinks({
  direction = "row",
  iconSize = 28,
  className,
}: SocialLinksProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap gap-4 justify-center mt-4",
        direction === "col" && "flex-col items-center",
        className
      )}
    >
      {SOCIALS.map((social, i) => (
        <SocialLink key={i} {...social} size={iconSize} />
      ))}
    </div>
  );
}
