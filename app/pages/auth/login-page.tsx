import { LoginForm } from "@/components/auth/login-form";
import { AuthLayout } from "@/components/layouts/auth-layout";

export function LoginPage() {
  return (
    <AuthLayout
      title="Login to Your Account"
      description="Please enter your credentials to continue."
      loading={false}
      showSocial={true}
    >
      <LoginForm />
    </AuthLayout>
  );
}
