import { useState, useMemo } from "react";
import rawData from "@/data/portofolio.json";
import { WebLayout } from "@/components/layouts/web-layout";
import { PortfolioList } from "@/components/portfolio-list";
import { PortfolioModal } from "@/components/portfolio-modal";
import { PageLayout } from "@/components/page-layout";
import type { PortfolioItem } from "@/types/props";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 6;

export function Portofolio() {
  const data = rawData as PortfolioItem[];
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    data.forEach((item) => {
      if (item.category) cats.add(item.category);
    });
    return ["All", ...Array.from(cats)];
  }, [data]);

  // Filter items based on active category
  const filteredData = useMemo(() => {
    if (activeCategory === "All") return data;
    return data.filter((item) => item.category === activeCategory);
  }, [data, activeCategory]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1;
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
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
        {/* Sleek Category Filter UI with proper rounded-full pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-muted/40 backdrop-blur-sm rounded-full border border-border/60 max-w-fit mx-auto">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm scale-[1.03]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Portfolio List */}
        <section className="space-y-8">
          <PortfolioList
            data={currentItems}
            onCardClick={handleCardClick}
          />

          {/* Clean Rounded-Full Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border border-border bg-card text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Sebelumnya</span>
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-9 h-9 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      currentPage === pageNum
                        ? "bg-primary text-primary-foreground shadow-sm scale-105"
                        : "border border-border bg-card text-foreground hover:bg-muted"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border border-border bg-card text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors cursor-pointer"
              >
                <span className="hidden sm:inline">Selanjutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>

        {/* Detail Modal */}
        <PortfolioModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          item={selectedItem}
        />
      </PageLayout>
    </WebLayout>
  );
}
