import { useState, useMemo } from "react";
import rawData from "@/data/portofolio.json";
import { WebLayout } from "@/components/layouts/web-layout";
import { PortfolioList } from "@/components/portfolio-list";
import { PortfolioModal } from "@/components/portfolio-modal";
import { PageLayout } from "@/components/page-layout";
import type { PortfolioItem } from "@/types/props";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";

const ITEMS_PER_PAGE = 6;

export function Portofolio() {
  const data = rawData as PortfolioItem[];
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
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

  // Filter items based on active category & search query
  const filteredData = useMemo(() => {
    let list = data;
    if (activeCategory !== "All") {
      list = list.filter((item) => item.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((item) => {
        const titleMatch = item.title?.toLowerCase().includes(q);
        const taglineMatch = item.tagline?.toLowerCase().includes(q);
        const descMatch = item.description?.toLowerCase().includes(q);
        const clientMatch = item.client?.toLowerCase().includes(q);
        const tagsMatch = item.tags?.some((t) => t.toLowerCase().includes(q));
        return titleMatch || taglineMatch || descMatch || clientMatch || tagsMatch;
      });
    }
    return list;
  }, [data, activeCategory, searchQuery]);

  // Reset page on search or category change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

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
        {/* Search Bar & Result Counter */}
        <div className="w-full max-w-md mx-auto mb-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Cari proyek, teknologi (Go, Java, Laravel, gRPC)..."
              className="w-full pl-10 pr-10 py-2 rounded-full bg-card/80 border border-border/80 text-foreground placeholder:text-muted-foreground/60 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                title="Hapus pencarian"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

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
        <section className="space-y-8 mt-6">
          {filteredData.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-border/80 bg-card/40 max-w-md mx-auto space-y-3">
              <p className="text-sm font-bold text-foreground">Tidak ada proyek yang ditemukan</p>
              <p className="text-xs text-muted-foreground">
                Tidak ada hasil untuk kata kunci &quot;{searchQuery}&quot; pada kategori &quot;{activeCategory}&quot;.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                  setCurrentPage(1);
                }}
                className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow hover:opacity-90 transition-all cursor-pointer"
              >
                Reset Filter &amp; Pencarian
              </button>
            </div>
          ) : (
            <PortfolioList
              data={currentItems}
              onCardClick={handleCardClick}
            />
          )}

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
