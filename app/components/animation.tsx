import type { AnimatedEaseOutProps } from "@/types/props";
import { motion } from "framer-motion";
import type { ElementType, ComponentPropsWithoutRef } from "react";


export function AnimatedEaseOut<T extends ElementType = "div">({
  as,
  delay = 0,
  duration = 0.6,
  className,
  ...rest
}: AnimatedEaseOutProps<T> & ComponentPropsWithoutRef<T>) {
  const MotionTag = motion(as || "div");

  return (
    <MotionTag
      {...rest}
      className={className}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: "easeOut" }}
    />
  );
}
