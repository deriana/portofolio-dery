import { WebLayout } from "@/components/layouts/web-layout";
import { LoadMoreButton } from "@/components/load-more";
import { PortfolioList } from "@/components/portfolio-list";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import data from "@/data/portofolio.json"


export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  image: string;
  author: string;
}


export function Portofolio() {
  const [visibleCount, setVisibleCount] = useState(8);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  return (
    <WebLayout>
      <div className="container mx-auto px-4 py-12 space-y-8">
        <section>
          <h2 className="text-3xl font-bold mb-6 text-center">Portfolio</h2>

          <PortfolioList data={data.slice(0, visibleCount)} />

          {visibleCount < data.length && (
            <LoadMoreButton onClick={handleLoadMore} />
          )}
        </section>
      </div>
    </WebLayout>
  );
}
