// src/components/lazy-image.tsx

import type { LazyImageProps } from "@/types/props";
import { useEffect, useState } from "react";

// Cache global di luar komponen
const loadedImages = new Set<string>();

export function LazyImage({
  src,
  alt,
  className = "",
  placeholderClassName = "",
  ...rest
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(() => loadedImages.has(src));

  useEffect(() => {
    if (loadedImages.has(src)) {
      setIsLoaded(true);
    }
  }, [src]);

  function handleLoad() {
    loadedImages.add(src);
    setIsLoaded(true);
  }

  return (
    <div className="relative overflow-hidden">
      {!isLoaded && (
        <div
          className={`absolute inset-0 bg-gray-300 animate-pulse ${placeholderClassName}`}
        />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={handleLoad}
        className={`transition-opacity duration-700 ease-in-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
        {...rest}
      />
    </div>
  );
}
