import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 32, height: 32 });
  const [isHovering, setIsHovering] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const cursor = cursorRef.current;

    const move = (e: MouseEvent) => {
      if (!cursor) return;

      if (isHovering && targetRect) {
        // Tambahkan efek "sticky"
        const centerX = targetRect.left + targetRect.width / 2;
        const centerY = targetRect.top + targetRect.height / 2;
        // Gerakan sedikit mengikut mouse
        const offsetX = (e.clientX - centerX) * 0.1;
        const offsetY = (e.clientY - centerY) * 0.1;

        cursor.style.transform = `translate(${
          centerX - size.width / 2 + offsetX
        }px, ${centerY - size.height / 2 + offsetY}px)`;
      } else {
        // Normal follow cursor
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
          width: rect.width + 20, // tambahkan padding
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
  }, [isHovering, size, targetRect]);

  return (
    <div
      ref={cursorRef}
      style={{
        width: size.width,
        height: size.height,
        borderRadius: "9999px",
        backgroundColor: "rgba(156, 163, 175, 0.15)", // lebih transparan
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
