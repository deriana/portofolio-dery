import type { SkillMetaProps } from "@/types/props";

export function SkillMeta({ label, items }: SkillMetaProps) {
  return (
    <div className="mt-6 flex flex-wrap justify-center gap-4 text-muted-foreground text-sm">
      {items.map((item, index) => (
        <span
          key={index}
          className={index !== 0 ? "px-2 border-l border-muted" : "px-2"}
        >
          {index === 0 ? `${label}: ` : ""}
          {item}
        </span>
      ))}
    </div>
  );
}
