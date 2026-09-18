import { RegisterPage } from "@/pages/auth/register-page";
export function meta() {
  return [
    { title: "Register Page" },
    { name: "description", content: "Please register to create an account." },
  ];
}

export default function Register() {
  return <RegisterPage />;
}
