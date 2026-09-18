import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CheckCircle2, Layers } from "lucide-react";
import type { PortfolioModalProps } from "@/types/props";

export function PortfolioModal({ isOpen, onClose, item }: PortfolioModalProps) {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full p-0 rounded-2xl overflow-hidden border border-border/80 bg-card text-card-foreground shadow-2xl">
        <div className="max-h-[85vh] overflow-y-auto p-5 sm:p-7 space-y-5">
          {/* Header */}
          <DialogHeader className="space-y-1.5 text-left">
            <div className="flex flex-wrap items-center gap-2">
              {item.category && (
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                  {item.category}
                </span>
              )}
              {item.client && (
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-lg bg-muted text-muted-foreground border border-border/60">
                  {item.client}
                </span>
              )}
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-bold leading-tight">
              {item.title}
            </DialogTitle>
            {item.tagline && (
              <DialogDescription className="text-sm font-medium text-foreground/80">
                {item.tagline}
              </DialogDescription>
            )}
          </DialogHeader>

          {/* Project Image */}
          <div className="overflow-hidden rounded-xl border border-border/60 bg-muted/20 flex items-center justify-center">
            <img
              src={item.image}
              alt={item.title}
              className="w-full max-h-[380px] object-contain rounded-xl"
            />
          </div>

          {/* Project Overview */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Tentang Proyek
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Key Capabilities */}
          {item.features && item.features.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Fitur Utama</span>
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-muted-foreground">
                {item.features.map((feat, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 bg-muted/30 p-2 rounded-xl border border-border/40"
                  >
                    <span className="text-emerald-500 font-bold shrink-0">✓</span>
                    <span className="text-foreground/90">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technologies */}
          {item.tags && item.tags.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-border/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-primary" />
                <span>Teknologi</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-muted text-foreground border border-border"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
