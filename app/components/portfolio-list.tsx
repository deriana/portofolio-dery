import { PortfolioCard } from "./portfolio-card";

interface PortfolioItem {
  id: number | string;
  title: string;
  description: string;
  image: string;
  author: string;
}

interface PortfolioListProps {
  data: PortfolioItem[];
}

export function PortfolioList({ data }: PortfolioListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.map((item) => (
        <PortfolioCard key={item.id} item={item} />
      ))}
    </div>
  );
}
