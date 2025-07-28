import type { Route } from "./+types/not-found";
import { NotFound } from "@/pages/error/not-found";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hideri | 404" },
    { name: "description", content: "NotFound Pages" },
  ];
}

export default function NotFounds() {
    return <NotFound />
}