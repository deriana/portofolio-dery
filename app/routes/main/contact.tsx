import type { Route } from "./+types/contact";
import { Contacts } from "@/pages/contact/contact";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hideri | Contact" },
    { name: "description", content: "Contact Section In Portofolio" },
  ];
}

export default function Contact() {
    return <Contacts />
}