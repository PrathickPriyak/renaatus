import type { Transition } from "framer-motion";

/** Intentional, architectural easing — not bounce, not springy. */
export const easePremium: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const duration = {
  instant: 0.01,
  fast: 0.2,
  base: 0.45,
  slow: 0.7,
} as const;

export const revealTransition: Transition = {
  duration: duration.base,
  ease: easePremium,
};

export const fadeTransition: Transition = {
  duration: duration.fast,
  ease: easePremium,
};

export function motionSafe<T>(reduced: boolean | null, value: T): T | false {
  return reduced ? false : value;
}
