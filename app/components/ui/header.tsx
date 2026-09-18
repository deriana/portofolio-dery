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
        pathBanner="banner-hd.png"
        pathIcon="profile-opt.webp"
        name="Deryana Maruf"
        email="deryana.maruf@gmail.com"
        bio="Backend Engineer berfokus pada arsitektur server, RESTful API performa tinggi, dan keandalan database. Berpengalaman membangun sistem produksi skala enterprise dengan Laravel & Go."
      />

      <Navigation items={navItems} />

      <hr className="w-full border-t border-border my-4" />
    </>
  );
}
