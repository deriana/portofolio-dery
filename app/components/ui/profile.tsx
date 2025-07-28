import { ProfileImage } from "./profile-image";
import { ProfileDetail } from "./profile-detail";
import type { ProfileImageProps } from "./profile-image";
import type { ProfileDetailProps } from "./profile-detail";

type ProfileProps = ProfileImageProps & ProfileDetailProps;

export function Profile({
  pathBanner,
  pathIcon,
  name,
  email,
  bio,
}: ProfileProps) {
  return (
    <>
      <ProfileImage pathBanner={pathBanner} pathIcon={pathIcon} />
      <ProfileDetail name={name} email={email} bio={bio} />
    </>
  );
}
