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
};

export function SkillIcon({ icon }: { icon: string }) {
  const IconComponent = iconMap[icon];
  return IconComponent ? <IconComponent className="w-7 h-7 text-primary" /> : null;
}
