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
    <div className="flex flex-col items-center text-center px-6 py-6 max-w-2xl mx-auto rounded-3xl bg-card/75 backdrop-blur-md border border-border/60 shadow-md mb-6 transition-all duration-300">
      <h2 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight text-foreground">
        <DecryptedText text={name} loop={false} />
      </h2>
      <TextLink
        to={`mailto:${email}`}
        className="text-sm text-primary font-medium hover:text-primary/80 mb-3 break-all hover:underline hover-target transition-colors"
      >
        {email}
      </TextLink>

      <p className="text-sm md:text-base text-foreground/85 max-w-xs md:max-w-md lg:max-w-lg mb-5 leading-relaxed font-normal">
        {bio}
      </p>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="default"
            className="rounded-2xl shadow-sm bg-foreground text-background hover:bg-foreground/90 mb-4 px-5 py-2 text-sm hover-target cursor-pointer font-semibold"
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
