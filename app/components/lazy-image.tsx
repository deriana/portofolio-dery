import type { LazyImageProps } from "@/types/props";
import { useEffect, useRef, useState } from "react";

// Cache global di luar komponen
const loadedImages = new Set<string>();

export function LazyImage({
  src,
  alt,
  className = "",
  placeholderClassName = "",
  ...rest
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(() => Boolean(src && loadedImages.has(src)));
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (src && loadedImages.has(src)) {
      setIsLoaded(true);
      return;
    }

    // Check if the image was already loaded or cached by the browser before React attached onLoad
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      if (src) loadedImages.add(src);
      setIsLoaded(true);
    }
  }, [src]);

  function handleLoad() {
    if (src) {
      loadedImages.add(src);
    }
    setIsLoaded(true);
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {!isLoaded && (
        <div
          className={`absolute inset-0 bg-muted animate-pulse ${placeholderClassName}`}
        />
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={() => setIsLoaded(true)}
        className={`transition-opacity duration-300 ease-in-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
        {...rest}
      />
    </div>
  );
}
