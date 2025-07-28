import type { Skill } from "@/types/props";
import { SkillCard } from "./skill-card";

export function SkillGrid({ skills }: { skills: Skill[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {skills.map((skill, i) => (
        <SkillCard key={i} icon={skill.icon} label={skill.label} desc={skill.desc} />
      ))}
    </div>
  );
}
