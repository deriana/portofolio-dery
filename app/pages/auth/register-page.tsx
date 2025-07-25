import { RegisterForm } from "@/components/auth/register-form";
import { AuthLayout } from "@/components/layouts/auth-layout";

export function RegisterPage() {
  return (
    <AuthLayout
      title="Create a New Account"
      description="Please fill in the details to create an account."
      loading={false}
      showSocial={true}
    >
      <RegisterForm />
    </AuthLayout>
  );
}
