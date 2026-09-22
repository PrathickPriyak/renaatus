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
    reduced ? [1, 1] : [1, 1.08],
  );
  const chromeOpacity = useTransform(
    scrollYProgress,
    [0, 0.55],
    reduced ? [1, 1] : [1, 0],
  );
  const chromeY = useTransform(
    scrollYProgress,
    [0, 0.55],
    reduced ? [0, 0] : [0, 36],
  );

  return (
    <section
      ref={sectionRef}
      className="grain relative isolate min-h-[100dvh]"
    >
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <motion.div className="absolute inset-0" style={{ scale: mediaScale }}>
          <HeroMedia />
          {/* Soft edges — keep the video center readable for kit typography */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_70%_at_50%_42%,transparent_0%,rgba(7,9,14,0.28)_62%,rgba(7,9,14,0.78)_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[28%] bg-[linear-gradient(180deg,rgba(7,9,14,0.72)_0%,transparent_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] bg-[linear-gradient(0deg,rgba(7,9,14,0.96)_0%,rgba(7,9,14,0.55)_42%,transparent_100%)]" />
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[22%] bg-[linear-gradient(90deg,rgba(7,9,14,0.45)_0%,transparent_100%)] md:block" />
        </motion.div>
      </div>

      <Container className="relative flex min-h-[100dvh] flex-col justify-end pt-[calc(var(--header-height)+2.5rem)] pb-16 md:pb-20">
        <motion.div
          className="max-w-3xl"
          style={{ opacity: chromeOpacity, y: chromeY }}
        >
          <motion.p
            className="font-display text-cream text-[clamp(3rem,10vw,7.25rem)] leading-[0.9] tracking-[-0.03em]"
            initial={motionSafe(reduced, { opacity: 0, y: 28 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.slow, ease: easePremium, delay: 0.35 }}
          >
            {brand.name}
          </motion.p>

          <motion.p
            className="text-cream/90 mt-5 max-w-xl text-[clamp(1.05rem,2.1vw,1.35rem)] leading-relaxed font-light tracking-wide md:mt-7"
            initial={motionSafe(reduced, { opacity: 0, y: 20 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.slow, ease: easePremium, delay: 0.55 }}
          >
            We build more than structures.
            <span className="text-brass"> We build futures.</span>
          </motion.p>

          <motion.p
            className="text-cream-muted mt-4 max-w-md text-sm leading-6 md:text-[0.95rem] md:leading-7"
            initial={motionSafe(reduced, { opacity: 0, y: 16 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.base, ease: easePremium, delay: 0.7 }}
          >
            Half a century of construction trust across India, the Maldives, and
            Mauritius — infrastructure, luxury residences, and Renacon AAC.
          </motion.p>

          <motion.div
            className="mt-8 flex w-full max-w-lg flex-col gap-3 sm:mt-10 sm:max-w-none sm:flex-row"
            initial={motionSafe(reduced, { opacity: 0, y: 16 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.base, ease: easePremium, delay: 0.85 }}
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
            transition={{ delay: 1.2, duration: duration.base }}
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
