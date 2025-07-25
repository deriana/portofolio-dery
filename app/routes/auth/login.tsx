import { LoginPage } from "@/pages/auth/login-page";
import type { Route } from "./+types/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login Page" },
    { name: "description", content: "Please log in to continue." },
  ];
}

export default function Login() {
  return <LoginPage />;
}