"use client";
import { motion } from "framer-motion";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

/** Fades and rises its children once when they scroll into view. */
export function Reveal({ children, className, delay = 0, as = "div" }: { children: React.ReactNode; className?: string; delay?: number; as?: "div" | "li" }) {
  const M = as === "li" ? motion.li : motion.div;
  return (
    <M className={className} variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce} transition={{ delay }}>
      {children}
    </M>
  );
}

/** Staggers the reveal of direct `RevealItem` children. */
export function RevealGroup({ children, className, step = 0.08 }: { children: React.ReactNode; className?: string; step?: number }) {
  return (
    <motion.div className={className} variants={stagger(step)} initial="hidden" whileInView="show" viewport={viewportOnce}>
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <motion.div className={className} variants={fadeUp}>{children}</motion.div>;
}
