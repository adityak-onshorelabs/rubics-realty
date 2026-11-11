"use client";

import { motion } from "motion/react";

/** Headline lines rise like a lift arriving. Transform only: text is always painted (no opacity:0). */
export function HeroLines({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className="block"
            initial={{ y: "0.35em" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 + i * 0.07, ease: [0.65, 0, 0.35, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </>
  );
}
