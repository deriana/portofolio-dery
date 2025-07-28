import { useEffect, useState } from "react";
import data from "@/data/portofolio.json";
import { WebLayout } from "@/components/layouts/web-layout";
import { LoadMoreButton } from "@/components/load-more";
import { PortfolioList } from "@/components/portfolio-list";
import { PageTitle } from "@/components/page-title";
import { PortfolioModal } from "@/components/portfolio-modal";
import { PageLayout } from "@/components/page-layout";
import { DecryptedText } from "@/components/ui/decrypted-text";
import type { PortfolioItem } from "@/types/props";


export function Portofolio() {
  const [visibleCount, setVisibleCount] = useState(8);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

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
      <PageLayout title="Portfolio">
        <section>
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
      </PageLayout>
    </WebLayout>
  );
}
