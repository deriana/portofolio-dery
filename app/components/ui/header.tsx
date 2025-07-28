import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TextLink } from "@/components/ui/text-link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DecryptedText } from "@/components/ui/decrypted-text";
import { Banner } from "@/components/ui/banner";
import { SocialLinks } from "@/components/ui/social-icon";
import { ModeToggle } from "@/components/mode-toggle";
import { Navigation } from "./navigation";
import { Profile } from "./profile";

const navItems = [
  { label: "About", path: "/" },
  { label: "Skills", path: "/skills" },
  { label: "Portfolio", path: "/portfolio" },
  { label: "Contact", path: "/contact" },
];

export function Header() {
  return (
    <>
      <Profile
        pathBanner="banner.png"
        pathIcon="icon.jpeg"
        name="Deryana Maruf"
        email="deryana.maruf@gmail.com"
        bio="Backend Developer & Tech Enthusiast. I love Laravel, React, and building clean, efficient systems to solve real-world problems."
      />

      <Navigation items={navItems} />

      <hr className="w-full border-t-2 border-primary my-4" />
    </>
  );
}
