import type { BannerProps } from "@/types/props";
import { LazyImage } from "../lazy-image";

export function Banner({ path }: BannerProps) {
  return (
    <div className="relative w-full h-full rounded-3xl shadow-2xl overflow-hidden border border-white/10 backdrop-blur-sm bg-card/20">
      <LazyImage
        src={path}
        alt="Banner"
        className="w-full h-full object-cover opacity-80 transition-opacity duration-500 hover:opacity-90"
        placeholderClassName="bg-muted/40"
      />
      {/* Subtle overlay gradients for depth while keeping transparency */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-black/15 to-transparent pointer-events-none" />
    </div>
  );
}
