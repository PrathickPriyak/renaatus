"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { motionSafe, revealTransition } from "@/design-system/motion";

type RevealProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
};

export function Reveal({ children, className, ...props }: RevealProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={motionSafe(reduced, { opacity: 0, y: 14 })}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={revealTransition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
