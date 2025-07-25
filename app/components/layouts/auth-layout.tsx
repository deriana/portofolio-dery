import { AuthHeroSection } from "@/components/auth/hero-section";
import { AuthSkeleton } from "@/components/auth/auth-skeleton";
import { SocialButton } from "@/components/auth/social-button";
import Logo from "../ui/logo";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  loading?: boolean;
  showSocial?: boolean;
}

export function AuthLayout({
  children,
  title,
  description,
  loading = false,
  showSocial = true,
}: AuthLayoutProps) {
  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <AuthHeroSection />

      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          <div>{loading ? <AuthSkeleton /> : children}</div>

          <SocialButton show={showSocial} />
        </div>
      </div>
    </div>
  );
}
