import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import type { PortfolioItem } from "@/pages/portfolio/portfolio";
import { Github, X } from "lucide-react";

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: PortfolioItem | null;
}

export function PortfolioModal({ isOpen, onClose, item }: PortfolioModalProps) {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-6 overflow-hidden rounded-2xl">
        <DialogHeader className="relative p-5 pb-2">
          <DialogTitle>{item.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 text-gray-500">
            <Github className="w-4 h-4" />
            {item.author}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6">
          <img
            src={item.image}
            alt={item.title}
            className="rounded-lg w-full object-contain mb-4"
          />
          <p className="text-gray-500">{item.description}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
