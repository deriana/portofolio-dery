import type { SkillMetaProps } from "@/types/props";

export function SkillMeta({ label, items }: SkillMetaProps) {
  return (
    <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
      <span className="text-sm font-medium text-foreground/80">{label}:</span>
      <div className="flex flex-wrap justify-center gap-2">
        {items.map((item, index) => (
          <span
            key={index}
            className="px-3 py-1 text-xs font-medium rounded-full bg-muted/60 text-muted-foreground border border-border/50 hover:bg-muted hover:text-foreground transition-colors"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
