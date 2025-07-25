import { cn } from "@/lib/utils"; 
import type { ComponentProps } from "react";
import { Link } from "react-router";

interface TextLinkProps extends ComponentProps<typeof Link> {
  className?: string;
}

export function TextLink({ className, ...props }: TextLinkProps) {
  return (
    <Link
      {...props}
      className={cn("underline text-indigo-600 hover:text-indigo-800", className)}
    />
  );
}
