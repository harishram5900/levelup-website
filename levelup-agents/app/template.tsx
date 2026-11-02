"use client";
import { motion } from "framer-motion";
import { ease } from "@/lib/motion";

/** Re-mounts on every route change, giving each page a soft entrance. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    // Transform-only so content is visible on first paint (good for LCP), then settles into place.
    <motion.div initial={{ y: 10 }} animate={{ y: 0 }} transition={{ duration: 0.45, ease }}>
      {children}
    </motion.div>
  );
}
