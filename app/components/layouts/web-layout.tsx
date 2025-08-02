import { CustomCursor } from "../custom-cursor";
import { ScrollToTop } from "../scroll-top";
import { Header } from "../ui/header";

interface WebLayoutProps {
  children: React.ReactNode;
}

export function WebLayout({ children }: WebLayoutProps) {
  return (
    <div className="flex flex-col items-center min-h-screen p-4 md:p-8 lg:p-12 md:cursor-none">
      <CustomCursor />
      <Header />

      {children}

      <ScrollToTop />
    </div>
  );
}
