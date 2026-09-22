"use client";

import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { Button } from "@/design-system/components/button";
import { Container } from "@/design-system/components/container";
import { duration, easePremium, motionSafe } from "@/design-system/motion";
import { HeroMedia } from "@/components/marketing/hero-media";
import { brand } from "@/lib/content";

export function HomeHero() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const mediaScale = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [1, 1] : [1, 1.06],
  );
  const chromeOpacity = useTransform(
    scrollYProgress,
    [0, 0.5],
    reduced ? [1, 1] : [1, 0],
  );
  const chromeY = useTransform(
    scrollYProgress,
    [0, 0.5],
    reduced ? [0, 0] : [0, 28],
  );

  return (
    <section
      ref={sectionRef}
      className="grain relative isolate min-h-[100dvh]"
    >
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <motion.div className="absolute inset-0" style={{ scale: mediaScale }}>
          <HeroMedia />
          {/* Keep the video center clear for burned-in kit typography */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_65%_at_50%_38%,transparent_0%,transparent_48%,rgba(7,9,14,0.35)_78%,rgba(7,9,14,0.82)_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[22%] bg-[linear-gradient(180deg,rgba(7,9,14,0.78)_0%,transparent_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] bg-[linear-gradient(0deg,rgba(7,9,14,0.97)_0%,rgba(7,9,14,0.62)_55%,transparent_100%)]" />
        </motion.div>
      </div>

      <Container className="relative flex min-h-[100dvh] flex-col justify-end pt-[calc(var(--header-height)+1.5rem)] pb-14 md:pb-16">
        <motion.div
          className="max-w-2xl"
          style={{ opacity: chromeOpacity, y: chromeY }}
        >
          <motion.p
            className="font-display text-cream text-[clamp(1.85rem,7vw,4.25rem)] leading-[0.94] tracking-[-0.025em]"
            initial={motionSafe(reduced, { opacity: 0, y: 22 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.slow, ease: easePremium, delay: 1.1 }}
          >
            {brand.name}
          </motion.p>

          <motion.p
            className="text-cream/90 mt-2.5 max-w-lg text-[clamp(0.95rem,1.7vw,1.2rem)] leading-snug font-light tracking-wide md:mt-4"
            initial={motionSafe(reduced, { opacity: 0, y: 16 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.base, ease: easePremium, delay: 1.35 }}
          >
            We build more than structures.
            <span className="text-brass"> We build futures.</span>
          </motion.p>

          <motion.div
            className="mt-6 flex w-full max-w-md flex-col gap-3 sm:mt-8 sm:max-w-none sm:flex-row"
            initial={motionSafe(reduced, { opacity: 0, y: 14 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.base, ease: easePremium, delay: 1.55 }}
          >
            <Button
              asChild
              size="lg"
              className="w-full transition-transform duration-500 hover:-translate-y-0.5 sm:w-auto"
            >
              <Link href="/projects?type=realty">Explore residences</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="w-full transition-transform duration-500 hover:-translate-y-0.5 sm:w-auto"
            >
              <Link href="/projects?type=infrastructure">View infrastructure</Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 md:block"
          style={{ opacity: chromeOpacity }}
          aria-hidden
        >
          <motion.div
            className="text-cream-muted flex flex-col items-center gap-2 text-[0.65rem] tracking-[0.32em] uppercase"
            initial={motionSafe(reduced, { opacity: 0 })}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: duration.base }}
          >
            <span className="hero-scroll-line bg-brass/85 relative h-11 w-px overflow-hidden">
              <span className="hero-scroll-glint absolute inset-x-0 top-0 h-1/3 bg-cream/90" />
            </span>
            Scroll
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
