import { SocialLinks } from "./ui/social-icon";

interface AboutDescProps {
  text: string;
}

export function AboutDesc({ text }: AboutDescProps) {
  return (
    <div className="flex flex-col gap-4 items-start px-2 sm:px-4">
      <h2 className="text-3xl font-bold">About Me</h2>
      <p className="text-muted-foreground text-justify max-w-prose">
       {text}
      </p>
      <div className="mt-4">
        <SocialLinks direction="row" iconSize={32} />
      </div>
    </div>
  );
}
