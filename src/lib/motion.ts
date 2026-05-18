import type { Transition, Variants } from "framer-motion";

export const fastEase: Transition = {
  duration: 0.22,
  ease: [0.22, 1, 0.36, 1],
};

export const cardHoverTransition: Transition = {
  duration: 0.18,
  ease: [0.16, 1, 0.3, 1],
};

export const pageTransition: Transition = {
  duration: 0.28,
  ease: [0.22, 1, 0.36, 1],
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: fastEase },
};

export const staggerChildren: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

export const scaleOnHover = {
  scale: 1.02,
  transition: cardHoverTransition,
};
