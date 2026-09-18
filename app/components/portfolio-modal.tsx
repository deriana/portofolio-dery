import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Check, CheckCircle2, Layers, Maximize2, X } from "lucide-react";
import type { PortfolioModalProps } from "@/types/props";
import { Lightbox } from "./ui/lightbox";

export function PortfolioModal({ isOpen, onClose, item }: PortfolioModalProps) {
  const [isLightboxOpen, setLightboxOpen] = useState(false);

  if (!item) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          showCloseButton={false}
          className="max-w-2xl w-[94vw] p-0 rounded-2xl sm:rounded-3xl overflow-hidden border border-border/80 bg-card text-card-foreground shadow-2xl flex flex-col max-h-[88vh]"
        >
          {/* Top Sticky Header Bar with Tags and Dedicated Close Button */}
          <div className="flex items-center justify-between px-5 py-3.5 sm:px-7 sm:py-4 border-b border-border/50 bg-card/95 backdrop-blur-md shrink-0 z-20">
            <div className="flex flex-wrap items-center gap-2">
              {item.category && (
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25">
                  {item.category}
                </span>
              )}
              {item.client && (
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/50 hidden sm:inline-block">
                  {item.client}
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer border border-border/60 shrink-0"
              title="Close modal"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Content Container */}
          <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6 space-y-5">
            {/* Title & Tagline */}
            <div className="space-y-1 text-left">
              <DialogTitle className="text-xl sm:text-2xl font-extrabold leading-tight tracking-tight text-foreground">
                {item.title}
              </DialogTitle>
              {item.tagline && (
                <DialogDescription className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {item.tagline}
                </DialogDescription>
              )}
            </div>

            {/* Clickable Project Image (Opens Lightbox) */}
            <div className="space-y-1.5">
              <div
                onClick={() => setLightboxOpen(true)}
                className="group relative overflow-hidden rounded-2xl border border-border/70 bg-muted/20 flex items-center justify-center cursor-zoom-in transition-all hover:border-primary/50 shadow-sm"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full max-h-[340px] object-contain rounded-2xl transition-transform duration-300 group-hover:scale-[1.02]"
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

            {/* Tech Stack Used */}
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
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Key Features */}
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
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
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

      {/* Lightbox for enlarged photo */}
      <Lightbox
        isOpen={isLightboxOpen}
        onClose={() => setLightboxOpen(false)}
        src={item.image}
        alt={item.title}
        title={item.title}
        category={item.category}
      />
    </>
  );
}
