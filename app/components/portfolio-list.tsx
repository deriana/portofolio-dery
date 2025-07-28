import type { PortfolioListProps } from "@/types/props";
import { PortfolioCard } from "./portfolio-card";


export function PortfolioList({ data, onCardClick }: PortfolioListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.map((item) => (
        <div
          key={item.id}
          onClick={() => onCardClick(item)}
          className="cursor-pointer"
        >
          <PortfolioCard item={item} />
        </div>
      ))}
    </div>
  );
}
