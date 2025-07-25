import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 32, height: 32 });
  const [isHovering, setIsHovering] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isDesktop, setIsDesktop] = useState(true); // default true biar nggak flicker

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
    };

    setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const cursor = cursorRef.current;

    const move = (e: MouseEvent) => {
      if (!cursor) return;

      if (isHovering && targetRect) {
        const centerX = targetRect.left + targetRect.width / 2;
        const centerY = targetRect.top + targetRect.height / 2;
        const offsetX = (e.clientX - centerX) * 0.1;
        const offsetY = (e.clientY - centerY) * 0.1;

        cursor.style.transform = `translate(${
          centerX - size.width / 2 + offsetX
        }px, ${centerY - size.height / 2 + offsetY}px)`;
      } else {
        cursor.style.transform = `translate(${e.clientX - size.width / 2}px, ${
          e.clientY - size.height / 2
        }px)`;
      }
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest(".hover-target");
      if (target) {
        const rect = target.getBoundingClientRect();
        setIsHovering(true);
        setTargetRect(rect);
        setSize({
          width: rect.width + 20,
          height: rect.height + 20,
        });
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest(".hover-target");
      if (target) {
        setIsHovering(false);
        setTargetRect(null);
        setSize({ width: 32, height: 32 });
      }
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseover", handleMouseEnter);
    document.addEventListener("mouseout", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", handleMouseEnter);
      document.removeEventListener("mouseout", handleMouseLeave);
    };
  }, [isHovering, size, targetRect, isDesktop]);

  if (!isDesktop) return null;

  return (
    <div
      ref={cursorRef}
      style={{
        width: size.width,
        height: size.height,
        borderRadius: "9999px",
        backgroundColor: "rgba(156, 163, 175, 0.15)",
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 9999,
        transition: "width 0.25s ease, height 0.25s ease, transform 0.1s ease",
        mixBlendMode: "difference",
      }}
    />
  );
}
