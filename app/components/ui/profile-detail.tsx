import type { ProfileDetailProps } from "@/types/props";
import { Button } from "./button";
import { DecryptedText } from "./decrypted-text";
import { SocialLinks } from "./social-icon";
import { TextLink } from "./text-link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ProfileDetail({ name, email, bio }: ProfileDetailProps) {
  return (
    <div className="flex flex-col items-center text-center px-4 mb-4">
      <h2 className="text-xl md:text-2xl font-semibold mb-2">
        <DecryptedText text={name} />
      </h2>
      <TextLink
        to={`mailto:${email}`}
        className="text-sm mb-4 break-all hover:underline hover-target"
      >
        {email}
      </TextLink>

      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs md:max-w-md lg:max-w-sm mb-4">
        {bio}
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
  );
}
