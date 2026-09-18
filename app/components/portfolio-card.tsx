import { Card, CardContent } from "@/components/ui/card";
import type { PortfolioCardProps } from "@/types/props";
import { ArrowUpRight } from "lucide-react";
import { LazyImage } from "./lazy-image";

export const PortfolioCard = ({ item }: PortfolioCardProps) => {
  return (
    <Card className="border border-border/70 bg-card text-card-foreground shadow-sm hover:shadow-md hover:border-primary/40 hover:-translate-y-1 transition-all duration-200 rounded-2xl overflow-hidden hover-target flex flex-col justify-between h-full">
      <div>
        <div className="p-3 pb-0">
          <div className="group/img relative w-full h-48 sm:h-52 bg-muted/30 rounded-xl overflow-hidden border border-border/40 cursor-pointer">
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
            {/* Quick view indicator on photo */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-black/60 text-white text-[11px] font-semibold border border-white/20 backdrop-blur-sm shadow-md">
                View Project Details
              </span>
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

      <div className="flex justify-between items-center text-xs text-muted-foreground px-4 pb-4 pt-1 border-t border-border/30">
        <span className="text-[11px] text-muted-foreground font-medium">
          {item.client || "Showcase"}
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-primary font-semibold">
          <span>Detail</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Card>
  );
};
