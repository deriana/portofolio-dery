import type { BannerProps } from "@/types/props";

export function Banner({ path }: BannerProps) {
  return (
    <div className="relative w-full h-full rounded-2xl shadow-2xl overflow-hidden">
      <img src={path} alt="Banner" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}
