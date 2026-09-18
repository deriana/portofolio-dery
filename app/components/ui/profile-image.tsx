import type { ProfileImageProps } from "@/types/props";
import { Banner } from "./banner";

export function ProfileImage({ pathBanner, pathIcon }: ProfileImageProps) {
  return (
    <div className="relative w-full mb-20 h-40 md:h-56 lg:h-80 flex justify-center">
      <Banner path={pathBanner} />

      <div className="absolute left-1/2 -bottom-16 transform -translate-x-1/2 group">
        <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden shadow-2xl border-4 border-card/80 backdrop-blur-md ring-2 ring-primary/30 bg-card/60 transition-transform duration-300 group-hover:scale-105">
          <img
            src={pathIcon}
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
            loading="eager"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "icon.jpeg";
            }}
          />
        </div>
      </div>
    </div>
  );
}
