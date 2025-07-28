import { Navigation } from "./navigation";
import { Profile } from "./profile";

const navItems = [
  { label: "About", path: "/" },
  { label: "Skills", path: "/skills" },
  { label: "Portfolio", path: "/portfolio" },
  { label: "Contact", path: "/contact" },
];

export function Header() {
  return (
    <>
      <Profile
        pathBanner="banner.jpg"
        pathIcon="profile.jpg"
        name="Deryana Maruf"
        email="deryana.maruf@gmail.com"
        bio="Backend Developer & Tech Enthusiast. I love Laravel, React, and building clean, efficient systems to solve real-world problems."
      />

      <Navigation items={navItems} />

      <hr className="w-full border-t-2 border-primary my-4" />
    </>
  );
}
