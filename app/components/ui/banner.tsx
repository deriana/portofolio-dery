import type { BannerProps } from "@/types/props";
import { LazyImage } from "../lazy-image";

export function Banner({ path }: BannerProps) {
  return (
    <div className="relative w-full h-full rounded-2xl shadow-2xl overflow-hidden">
      <LazyImage
        src={path}
        alt="Banner"
        className="w-full h-full object-cover"
        placeholderClassName="bg-gray-200"
      />
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}
