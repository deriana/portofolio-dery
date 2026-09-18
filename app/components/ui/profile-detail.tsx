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
      <h2 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">
        <DecryptedText text={name} loop={false} />
      </h2>
      <TextLink
        to={`mailto:${email}`}
        className="text-sm text-muted-foreground hover:text-foreground mb-3 break-all hover:underline hover-target transition-colors"
      >
        {email}
      </TextLink>

      <p className="text-sm text-muted-foreground max-w-xs md:max-w-md lg:max-w-lg mb-4 leading-relaxed">
        {bio}
      </p>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="default"
            className="rounded-2xl shadow-sm bg-foreground text-background hover:bg-foreground/90 mb-4 px-5 py-2 text-sm hover-target cursor-pointer"
          >
            Download CV
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Download Curriculum Vitae</p>
        </TooltipContent>
      </Tooltip>

      <SocialLinks />
    </div>
  );
}
