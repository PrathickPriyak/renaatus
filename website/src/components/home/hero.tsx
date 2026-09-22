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
    [0, 0.45],
    reduced ? [1, 1] : [1, 0],
  );
  const chromeY = useTransform(
    scrollYProgress,
    [0, 0.45],
    reduced ? [0, 0] : [0, 24],
  );

  return (
    <section
      ref={sectionRef}
      className="grain relative isolate min-h-[100dvh]"
    >
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <motion.div className="absolute inset-0" style={{ scale: mediaScale }}>
          <HeroMedia />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_92%_68%_at_50%_36%,transparent_0%,transparent_52%,rgba(7,9,14,0.32)_82%,rgba(7,9,14,0.78)_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[20%] bg-[linear-gradient(180deg,rgba(7,9,14,0.8)_0%,transparent_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[26%] bg-[linear-gradient(0deg,rgba(7,9,14,0.98)_0%,rgba(7,9,14,0.55)_58%,transparent_100%)]" />
        </motion.div>
      </div>

      <Container className="relative flex min-h-[100dvh] flex-col justify-end pt-[calc(var(--header-height)+1rem)] pb-10 md:pb-12">
        <motion.div
          className="flex w-full flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-10"
          style={{ opacity: chromeOpacity, y: chromeY }}
          initial={motionSafe(reduced, { opacity: 0, y: 28 })}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.slow, ease: easePremium, delay: 1.25 }}
        >
          <div className="min-w-0 max-w-xl">
            <p className="font-display text-cream text-[clamp(1.85rem,4.2vw,3.35rem)] leading-[0.95] tracking-[-0.02em]">
              {brand.name}
            </p>
            <p className="text-cream/88 mt-2 text-[clamp(0.95rem,1.5vw,1.1rem)] leading-snug font-light tracking-wide">
              We build more than structures.
              <span className="text-brass"> We build futures.</span>
            </p>
          </div>
          <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
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
          </div>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute bottom-3 left-1/2 hidden -translate-x-1/2 md:block"
          style={{ opacity: chromeOpacity }}
          aria-hidden
        >
          <motion.div
            className="text-cream-muted flex flex-col items-center gap-1.5 text-[0.6rem] tracking-[0.32em] uppercase"
            initial={motionSafe(reduced, { opacity: 0 })}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.1, duration: duration.base }}
          >
            <span className="hero-scroll-line bg-brass/85 relative h-8 w-px overflow-hidden">
              <span className="hero-scroll-glint absolute inset-x-0 top-0 h-1/3 bg-cream/90" />
            </span>
            Scroll
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
