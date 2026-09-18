import { useLocation } from "react-router";
import { TextLink } from "./text-link";
import type { NavigationProps } from "@/types/props";

export function Navigation({ items }: NavigationProps) {
  const location = useLocation();

  return (
    <nav className="sticky top-3 sm:top-4 z-40 flex flex-row items-center justify-center px-4 sm:px-6 py-1.5 sm:py-2.5 rounded-full bg-card/85 backdrop-blur-md border border-border/80 shadow-md max-w-fit mx-auto my-2 transition-all duration-300" aria-label="Main Navigation">
      <div className="flex flex-row items-center gap-4 sm:gap-8">
        {items.map(({ label, path }) => {
          const isActive = location.pathname === path;

          return (
            <TextLink
              key={label}
              to={path}
              className={`relative text-xs sm:text-sm md:text-base font-semibold transition-colors duration-200 hover-target
                ${isActive ? "text-primary font-bold pointer-events-none" : "text-muted-foreground hover:text-foreground"} 
                after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-primary after:transition-all after:duration-300 
                ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}
              `}
            >
              {label}
            </TextLink>
          );
        })}
      </div>
    </nav>
  );
}
