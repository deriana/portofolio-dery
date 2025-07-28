import { useEffect, useState } from "react";
import { PageTitle } from "./page-title";
import { DecryptedText } from "./ui/decrypted-text";
import type { PageLayoutProps } from "@/types/props";


export function PageLayout({ children, title }: PageLayoutProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="container flex flex-col gap-6 md:gap-8 lg:gap-10">
      <div className="container mx-auto px-4 py-12 space-y-8">
        {title && <PageTitle title={title} />}
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <DecryptedText text="Loading..." />
          </div>
        ) : (
          <>{children}</>
        )}
      </div>
    </div>
  );
}
