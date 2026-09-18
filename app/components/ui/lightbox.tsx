import { useEffect } from "react";
import { X } from "lucide-react";

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt?: string;
  title?: string;
  category?: string;
}

export function Lightbox({
  isOpen,
  onClose,
  src,
  alt = "Enlarged photo",
  title,
  category,
}: LightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !src) return null;

  return (
    <div
      className="fixed inset-0 z-[100000] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top action bar */}
      <div
        className="w-full max-w-5xl flex items-center justify-between text-white mb-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pr-4">
          {title && (
            <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">
              {title}
            </h3>
          )}
          {category && (
            <p className="text-xs text-white/60">
              {category}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20 shrink-0"
          title="Close (Esc)"
          aria-label="Close photo preview"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Enlarged image preview */}
      <div
        className="relative max-w-5xl max-h-[82vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          className="max-h-[82vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/20"
        />
      </div>

      <p className="text-xs text-white/50 mt-3 text-center pointer-events-none">
        Click anywhere or press Esc to close
      </p>
    </div>
  );
}
