import { RegisterPage } from "@/pages/auth/register-page";
import type { Route } from "./+types/register";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Register Page" },
    { name: "description", content: "Please register to create an account." },
  ];
}

export default function Register() {
  return <RegisterPage />;
}
