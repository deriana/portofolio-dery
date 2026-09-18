import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import type { PortfolioCardProps } from "@/types/props";
import { ArrowUpRight, Maximize2 } from "lucide-react";
import { LazyImage } from "./lazy-image";
import { Lightbox } from "./ui/lightbox";

export const PortfolioCard = ({ item }: PortfolioCardProps) => {
  const [isPhotoLightboxOpen, setPhotoLightboxOpen] = useState(false);

  return (
    <>
      <SpotlightCard className="rounded-2xl h-full" spotlightColor="rgba(59, 130, 246, 0.16)">
        <Card className="border border-border/70 bg-card text-card-foreground shadow-sm hover:shadow-md hover:border-primary/50 hover:-translate-y-1 transition-all duration-200 rounded-2xl overflow-hidden hover-target flex flex-col justify-between h-full">
        <div>
          <div className="p-3 pb-0">
            <div className="group/img relative w-full h-48 sm:h-52 bg-muted/30 rounded-xl overflow-hidden border border-border/40">
              <LazyImage
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
              />
              {item.category && (
                <span className="absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-sm text-foreground border border-border/60 shadow-sm">
                  {item.category}
                </span>
              )}

              {/* Action buttons on photo hover */}
              <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 pointer-events-auto">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhotoLightboxOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/90 text-white text-[11px] font-semibold border border-white/25 backdrop-blur-sm shadow-md flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
                  title="Enlarge photo"
                >
                  <Maximize2 className="w-3 h-3 text-primary" />
                  <span>Enlarge Photo</span>
                </button>
              </div>
            </div>
          </div>

          <CardContent className="p-4 space-y-2">
            <h3 className="text-base font-bold text-foreground line-clamp-1">
              {item.title}
            </h3>

            <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 leading-relaxed">
              {item.tagline || item.description}
            </p>

            {item.tags && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {item.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2.5 py-0.5 rounded-lg bg-muted text-muted-foreground border border-border/40 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </div>

        <div className="flex justify-between items-center text-xs text-muted-foreground px-4 pb-4 pt-2.5 border-t border-border/30">
          <span className="text-[11px] text-muted-foreground font-medium truncate">
            {item.client || "Showcase"}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-primary font-semibold shrink-0 ml-2">
            <span>Detail</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Card>
      </SpotlightCard>

      <Lightbox
        isOpen={isPhotoLightboxOpen}
        onClose={() => setPhotoLightboxOpen(false)}
        src={item.image}
        alt={item.title}
        title={item.title}
        category={item.category}
      />
    </>
  );
};
