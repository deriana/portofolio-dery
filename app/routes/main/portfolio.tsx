import type { Route } from "./+types/portfolio";
import { Portofolio } from "@/pages/portfolio/portfolio";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Hideri | Portfolio"},
        { name: "description", content: "Portofolio Section In Portfolio"}
    ]
}

export default function Home() {
    return <Portofolio />
}