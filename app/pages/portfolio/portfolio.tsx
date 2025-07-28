import { useState } from "react";
import data from "@/data/portofolio.json";
import { WebLayout } from "@/components/layouts/web-layout";
import { LoadMoreButton } from "@/components/load-more";
import { PortfolioList } from "@/components/portfolio-list";
import { PageTitle } from "@/components/page-title";
import { PortfolioModal } from "@/components/portfolio-modal";

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  image: string;
  author: string;
}

export function Portofolio() {
  const [visibleCount, setVisibleCount] = useState(8);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  const handleCardClick = (item: PortfolioItem) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <WebLayout>
      <div className="container mx-auto px-4 py-12 space-y-8">
        <section>
          <PageTitle title="Portofolio" />
          <PortfolioList
            data={data.slice(0, visibleCount)}
            onCardClick={handleCardClick}
          />
          {visibleCount < data.length && (
            <LoadMoreButton onClick={handleLoadMore} />
          )}
        </section>

        <PortfolioModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          item={selectedItem}
        />
      </div>
    </WebLayout>
  );
}
