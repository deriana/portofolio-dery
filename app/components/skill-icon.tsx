import {
  Code,
  Cpu,
  Database,
  GitBranch,
  MonitorSmartphone,
  Network,
  Server,
  Settings2,
  Terminal,
  Sparkles,
  Layers,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Code,
  Database,
  Cpu,
  Terminal,
  MonitorSmartphone,
  Server,
  Settings2,
  GitBranch,
  Network,
  Sparkles,
  Layers,
};

export function SkillIcon({ icon, className = "w-6 h-6" }: { icon: string; className?: string }) {
  if (icon.startsWith("/") || icon.includes(".")) {
    return (
      <img
        src={icon}
        alt="Skill icon"
        className={`${className} object-contain`}
        loading="lazy"
      />
    );
  }

  const IconComponent = iconMap[icon] || Code;
  return <IconComponent className={`${className} text-primary`} />;
}
