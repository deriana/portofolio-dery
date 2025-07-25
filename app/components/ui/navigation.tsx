import { useLocation } from "react-router";
import { TextLink } from "./text-link";

type NavItem = {
  label: string;
  path: string;
};

type NavigationProps = {
  items: NavItem[];
};

export function Navigation({ items }: NavigationProps) {
  const location = useLocation();

  return (
    <div className="flex flex-row items-center justify-center gap-6 px-4">
      {items.map(({ label, path }) => {
        const isActive = location.pathname === path;

        return (
          <TextLink
            key={label}
            to={path}
            className={`relative text-lg font-medium text-primary hover-target
              ${isActive ? "font-semibold pointer-events-none" : ""} 
              after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-current after:transition-all after:duration-300 
              ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}
            `}
          >
            {label}
          </TextLink>
        );
      })}
    </div>
  );
}
