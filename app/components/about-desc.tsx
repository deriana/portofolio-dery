import type { AboutDescProps } from "@/types/props";
import { AnimatedEaseOut } from "./animation"; 
import { Link } from "react-router";
import { ArrowRight, Mail } from "lucide-react";

export function AboutDesc({ text }: AboutDescProps) {
  return (
    <div className="flex flex-col gap-4 items-start px-2 sm:px-4">
      <AnimatedEaseOut as="h2" className="text-3xl font-bold">
        About Me
      </AnimatedEaseOut>

      <AnimatedEaseOut as="p" className="text-muted-foreground leading-relaxed max-w-prose">
        {text}
      </AnimatedEaseOut>

      <AnimatedEaseOut as="div" className="mt-4 flex flex-wrap items-center gap-3">
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity hover-target shadow-sm"
        >
          <Mail className="w-4 h-4" />
          <span>Get in Touch</span>
          <ArrowRight className="w-4 h-4 ml-0.5" />
        </Link>
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-card-foreground text-sm font-medium hover:bg-muted transition-colors hover-target"
        >
          <span>View Projects</span>
        </Link>
      </AnimatedEaseOut>
    </div>
  );
}
