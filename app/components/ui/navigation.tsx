import { useLocation } from "react-router";
import { TextLink } from "./text-link";
import type { NavigationProps } from "@/types/props";

export function Navigation({ items }: NavigationProps) {
  const location = useLocation();

  return (
    <nav className="flex flex-row items-center justify-center gap-4 sm:gap-6 px-4 py-1" aria-label="Main Navigation">
      <div className="flex flex-row items-center gap-5 sm:gap-8">
        {items.map(({ label, path }) => {
          const isActive = location.pathname === path;

          return (
            <TextLink
              key={label}
              to={path}
              className={`relative text-base sm:text-lg font-medium transition-colors duration-200 hover-target
                ${isActive ? "text-foreground font-semibold pointer-events-none" : "text-muted-foreground hover:text-foreground"} 
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
