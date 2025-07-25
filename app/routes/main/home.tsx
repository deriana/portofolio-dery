import type { Route } from "./+types/home";
import { About } from "@/pages/about/about";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hideri" },
    { name: "description", content: "About Section In Portofolio" },
  ];
}

export default function Home() {
  return <About />;
}
