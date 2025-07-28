import { PageTitle } from "./page-title";

interface PageLayout {
  children: React.ReactNode;
  title?: string; 
}

export function PageLayout({ children, title }: PageLayout) {
  return (
    <div className="container flex flex-col gap-6 md:gap-8 lg:gap-10">
      <div className="container mx-auto px-4 py-12 space-y-8">
        {title && <PageTitle title={title} />}
        {children}
      </div>
    </div>
  );
}
