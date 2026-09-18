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
        bio="Backend Developer & DevOps Engineer with a Linux-first mindset. Specializing in high-performance services with Java, Go, Node.js, and Laravel, alongside modern frontend (React/Next/Vue), Python for AI/ML models, and container orchestration with Docker & Kubernetes."
      />

      <Navigation items={navItems} />

      <hr className="w-full border-t border-border my-4" />
    </>
  );
}
