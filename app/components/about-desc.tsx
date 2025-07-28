import { SocialLinks } from "./ui/social-icon";
import type { AboutDescProps } from "@/types/props";
import { AnimatedEaseOut } from "./animation"; 

export function AboutDesc({ text }: AboutDescProps) {
  return (
    <div className="flex flex-col gap-4 items-start px-2 sm:px-4">
      <AnimatedEaseOut as="h2" className="text-3xl font-bold">
        About Me
      </AnimatedEaseOut>

      <AnimatedEaseOut as="p" className="text-muted-foreground text-justify max-w-prose">
        {text}
      </AnimatedEaseOut>

      <AnimatedEaseOut as="div" className="mt-4">
        <SocialLinks direction="row" iconSize={32} />
      </AnimatedEaseOut>
    </div>
  );
}
