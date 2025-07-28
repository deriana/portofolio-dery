import { Card, CardContent } from "@/components/ui/card";
import { SkillIcon } from "./skill-icon";
import type { SkillCardProps } from "@/types/props";

export function SkillCard({ icon, label, desc }: SkillCardProps) {
  return (
    <Card className="transition-transform hover:-translate-y-2 duration-300 shadow-md rounded-2xl hover-target">
      <CardContent className="p-6 space-y-3">
        <div className="flex items-center gap-3">
          <SkillIcon icon={icon} />
          <h3 className="text-lg font-semibold">{label}</h3>
        </div>
        <p className="text-muted-foreground text-sm">{desc}</p>
      </CardContent>
    </Card>
  );
}
