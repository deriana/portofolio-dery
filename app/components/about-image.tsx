import type { AboutImageProps } from "@/types/props";

export function AboutImage({ path }: AboutImageProps) {
  return (
    <div className="flex justify-center">
      <img
        src={path}
        alt="My Photo"
        className="w-full max-w-xs sm:max-w-sm md:max-w-md h-auto object-cover rounded-2xl shadow-xl border border-muted"
      />
    </div>
  );
}
