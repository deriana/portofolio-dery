import { Header } from "../ui/header";

interface WebLayoutProps {
  children: React.ReactNode;
}

export function WebLayout({ children }: WebLayoutProps) {
  return (
    <div className="flex flex-col items-center min-h-screen p-4 md:p-8 lg:p-12">
      <Header />

      <div className="container flex flex-col gap-6 md:gap-8 lg:gap-10">
        {children}
      </div>
    </div>
  );
}
