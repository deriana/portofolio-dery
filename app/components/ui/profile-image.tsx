import type { ProfileImageProps } from "@/types/props";
import { Banner } from "./banner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ProfileImage({ pathBanner, pathIcon }: ProfileImageProps) {
  return (
    <div className="relative w-full mb-20 h-40 md:h-56 lg:h-80 flex justify-center">
      <Banner path={pathBanner} />

      <div className="absolute left-1/2 -bottom-16 transform -translate-x-1/2">
        <Avatar className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 shadow-2xl rounded-full">
          <AvatarImage src={pathIcon} alt="Profile" />
          <AvatarFallback>DM</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
