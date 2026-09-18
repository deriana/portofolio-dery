import { Card, CardContent } from "@/components/ui/card";
import { SkillIcon } from "./skill-icon";
import type { SkillCardProps } from "@/types/props";

export function SkillCard({
  icon,
  label,
  desc,
  version,
  category,
}: SkillCardProps) {
  return (
    <Card className="border border-border/70 bg-card text-card-foreground rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-primary/40 hover:-translate-y-1 transition-all duration-200 hover-target flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted/70 flex items-center justify-center p-2 shrink-0 border border-border/60">
              <SkillIcon icon={icon} className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground leading-tight">
                {label}
              </h3>
              {category && (
                <span className="text-[11px] text-muted-foreground font-medium">
                  {category}
                </span>
              )}
            </div>
          </div>

          {version && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-primary/10 text-primary border border-primary/20 shrink-0">
              {version}
            </span>
          )}
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {desc}
        </p>
      </div>
    </Card>
  );
}
