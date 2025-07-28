import type { LazyImageProps } from "@/types/props";
import { useState } from "react";

export function LazyImage({
  src,
  alt,
  className = "",
  placeholderClassName = "",
  ...rest
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  function handleLoad() {
    setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
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
