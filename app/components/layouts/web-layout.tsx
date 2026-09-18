import { AmbientSkyBackground } from "../ambient-sky-background";
import { CustomCursor } from "../custom-cursor";
import { ScrollToTop } from "../scroll-top";
import { Header } from "../ui/header";
import { DigitalClock } from "../ui/digital-clock";

interface WebLayoutProps {
  children: React.ReactNode;
}

export function WebLayout({ children }: WebLayoutProps) {
  return (
    <div className="relative flex flex-col items-center min-h-screen p-4 md:p-8 lg:p-12 lg:cursor-none">
      {/* Ambient sky background — fixed, z-0 */}
      <AmbientSkyBackground />

      <DigitalClock />
      <CustomCursor />

      <div className="relative z-10 w-full flex flex-col items-center">
        <Header />
        {children}
        <ScrollToTop />
      </div>
    </div>
  );
}
