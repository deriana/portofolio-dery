import { LoginPage } from "@/pages/auth/login-page";
export function meta() {
  return [
    { title: "Login Page" },
    { name: "description", content: "Please log in to continue." },
  ];
}

export default function Login() {
  return <LoginPage />;
}