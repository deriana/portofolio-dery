import type { Route } from "./+types/skills";
import { Skills } from "@/pages/skills/skills";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hideri | Skills" },
    { name: "description", content: "Skills Section In Portofolio" },
  ];
}

export default function Skill() {
  return <Skills />;
}
