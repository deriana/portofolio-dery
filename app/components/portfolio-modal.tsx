import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CheckCircle2, Layers, Maximize2, X, Sparkles } from "lucide-react";
import type { PortfolioModalProps } from "@/types/props";

export function PortfolioModal({ isOpen, onClose, item }: PortfolioModalProps) {
  const [isLightboxOpen, setLightboxOpen] = useState(false);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isLightboxOpen) {
        setLightboxOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen]);

  // Reset lightbox when main modal closes
  useEffect(() => {
    if (!isOpen) {
      setLightboxOpen(false);
    }
  }, [isOpen]);

  if (!item) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl w-full p-0 rounded-3xl overflow-hidden border border-border/80 bg-card text-card-foreground shadow-2xl">
          <div className="max-h-[85vh] overflow-y-auto p-5 sm:p-7 space-y-5">
            {/* Header */}
            <DialogHeader className="space-y-1.5 text-left">
              <div className="flex flex-wrap items-center gap-2">
                {item.category && (
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25">
                    {item.category}
                  </span>
                )}
                {item.client && (
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/60">
                    {item.client}
                  </span>
                )}
              </div>
              <DialogTitle className="text-xl sm:text-2xl font-extrabold leading-tight tracking-tight text-foreground">
                {item.title}
              </DialogTitle>
              {item.tagline && (
                <DialogDescription className="text-sm font-medium text-foreground/80">
                  {item.tagline}
                </DialogDescription>
              )}
            </DialogHeader>

            {/* Clickable Project Image (Opens Lightbox) */}
            <div className="space-y-1.5">
              <div
                onClick={() => setLightboxOpen(true)}
                className="group relative overflow-hidden rounded-2xl border border-border/70 bg-muted/20 flex items-center justify-center cursor-zoom-in transition-all hover:border-primary/50 shadow-sm"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full max-h-[360px] object-contain rounded-2xl transition-transform duration-300 group-hover:scale-[1.02]"
                />
                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 text-white text-xs font-bold pointer-events-none backdrop-blur-[2px]">
                  <div className="px-3.5 py-1.5 rounded-full bg-black/60 border border-white/20 shadow-lg flex items-center gap-2">
                    <Maximize2 className="w-3.5 h-3.5 text-primary" />
                    <span>Click to enlarge photo</span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground text-center">
                Click photo to view full size
              </p>
            </div>

            {/* Tech Stack Used (Prominent Section) */}
            {item.tags && item.tags.length > 0 && (
              <div className="space-y-2 p-4 rounded-2xl bg-muted/35 border border-border/50">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-primary" />
                    <span>Tech Stack Used</span>
                  </h4>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {item.tags.length} Technologies
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs font-bold rounded-full bg-card text-foreground border border-primary/20 shadow-xs hover:border-primary/40 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Project Overview */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                About The Project
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Key Capabilities / Features */}
            {item.features && item.features.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Key Features & Capabilities</span>
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-muted-foreground">
                  {item.features.map((feat, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 bg-muted/25 p-2.5 rounded-xl border border-border/40"
                    >
                      <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span>
                      <span className="text-foreground/90">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Metrics if available */}
            {item.metrics && item.metrics.length > 0 && (
              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-border/40">
                {item.metrics.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-center">
                    <p className="text-sm sm:text-base font-extrabold text-foreground">{m.value}</p>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{m.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Full-Screen Lightbox Modal for Enlarged Photo */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[100000] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Top bar with close button & title */}
          <div
            className="w-full max-w-5xl flex items-center justify-between text-white mb-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                {item.title}
              </h3>
              <p className="text-xs text-white/60">
                {item.category || "Portfolio Preview"}
              </p>
            </div>
            <button
              onClick={() => setLightboxOpen(false)}
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Large image container */}
          <div
            className="relative max-w-5xl max-h-[80vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={item.image}
              alt={item.title}
              className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/20"
            />
          </div>

          <p className="text-xs text-white/50 mt-3 text-center">
            Click anywhere or press Esc to close
          </p>
        </div>
      )}
    </>
  );
}
