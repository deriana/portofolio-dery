import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import type { PortfolioItem } from "@/pages/portfolio/portfolio";
import { Github } from "lucide-react";
import { TextLink } from "./ui/text-link";

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: PortfolioItem | null;
}

export function PortfolioModal({ isOpen, onClose, item }: PortfolioModalProps) {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full px-4 sm:px-6 p-0 rounded-2xl">
        <div className="max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader className="relative pb-2">
            <DialogTitle>{item.title}</DialogTitle>
            <DialogDescription className="flex items-center gap-2 text-gray-500">
              <TextLink
                to={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary hover-target transition-colors"
              >
                <Github className="w-4 h-4" />
                {item.author}
              </TextLink>
            </DialogDescription>
          </DialogHeader>

          <div className="px-2">
            <img
              src={item.image}
              alt={item.title}
              className="rounded-lg w-full object-contain mb-4"
            />
            <p className="text-gray-500">{item.description}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
