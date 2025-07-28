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

const navItems = [
  { label: "About", path: "/" },
  { label: "Skills", path: "/skills" },
  { label: "Portfolio", path: "/portfolio" },
  { label: "Contact", path: "/contact" },
];

export function Header() {
  return (
    <>
      {/* <div className="fixed top-4 right-4 z-50">
        <ModeToggle />
      </div> */}

      <div className="relative w-full mb-20 h-40 md:h-56 lg:h-80 flex justify-center">
        <Banner path="banner.png" />

        <div className="absolute left-1/2 -bottom-16 transform -translate-x-1/2">
          <Avatar className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 shadow-2xl rounded-full">
            <AvatarImage src="icon.jpeg" alt="Profile" />
            <AvatarFallback>DP</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="flex flex-col items-center text-center px-4 mb-4">
        <h2 className="text-xl md:text-2xl font-semibold mb-2">
          <DecryptedText text="Deryana Maruf" />
        </h2>
        <TextLink
          to="mailto:deryana.maruf@gmail.com"
          className="text-sm mb-4 break-all hover:underline hover-target"
        >
          deryana.maruf@gmail.com
        </TextLink>

        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs md:max-w-md lg:max-w-sm mb-4">
          Backend Developer & Tech Enthusiast. I love Laravel, React, and
          building clean, efficient systems to solve real-world problems.
        </p>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="rounded-2xl shadow bg-gray-600 mb-4 px-4 py-2 text-sm hover-target">
              Resume Cv
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Download CV</p>
          </TooltipContent>
        </Tooltip>

        <SocialLinks />
      </div>

      <Navigation items={navItems} />

      <hr className="w-full border-t-2 border-primary my-4" />
    </>
  );
}
