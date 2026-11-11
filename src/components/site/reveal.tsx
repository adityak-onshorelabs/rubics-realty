"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

const tags = { div: motion.div, li: motion.li, p: motion.p, figure: motion.figure } as const;

/**
 * Lift-like arrival: 10px rise and fade, once.
 * Reduced motion is handled globally by <MotionConfig reducedMotion="user"> (transforms off, short fade only).
 */
export function Reveal({
  children,
  as = "div",
  delay = 0,
  className,
}: {
  children: ReactNode;
  as?: keyof typeof tags;
  delay?: number;
  className?: string;
}) {
  const Tag = tags[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.65, 0, 0.35, 1] }}
    >
      {children}
    </Tag>
  );
}
