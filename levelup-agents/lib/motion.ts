import type { Transition, Variants } from "framer-motion";

/** One shared motion language: every animation in the app pulls from here. */
export const ease = [0.22, 1, 0.36, 1] as const; // soft "expo out"

export const duration = { fast: 0.2, base: 0.45, slow: 0.8 } as const;

export const spring: Transition = { type: "spring", stiffness: 260, damping: 26, mass: 0.8 };
export const softSpring: Transition = { type: "spring", stiffness: 120, damping: 20 };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: duration.slow, ease } },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: duration.base, ease } },
};

export const stagger = (step = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: step, delayChildren: delay } },
});

export const viewportOnce = { once: true, margin: "-80px" } as const;
