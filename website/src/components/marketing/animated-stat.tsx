"use client";

import { useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type AnimatedStatProps = {
  value: string;
  label: string;
  delay?: number;
};

function parseStat(value: string): { target: number; suffix: string; prefix: string } {
  const match = value.match(/^([^\d]*)(\d+)(.*)$/);
  if (!match) {
    return { target: 0, suffix: value, prefix: "" };
  }
  return {
    prefix: match[1] ?? "",
    target: Number(match[2]),
    suffix: match[3] ?? "",
  };
}

export function AnimatedStat({ value, label, delay = 0 }: AnimatedStatProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  const { target, suffix, prefix } = parseStat(value);
  const [display, setDisplay] = useState(reduced ? target : 0);

  useEffect(() => {
    if (!inView) {
      return;
    }
    if (reduced || target === 0) {
      setDisplay(target);
      return;
    }

    let frame = 0;
    const durationMs = 1100;
    let start: number | null = null;
    const timeout = window.setTimeout(() => {
      const tick = (now: number) => {
        if (start === null) {
          start = now;
        }
        const progress = Math.min(1, (now - start) / durationMs);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(target * eased));
        if (progress < 1) {
          frame = window.requestAnimationFrame(tick);
        }
      };
      frame = window.requestAnimationFrame(tick);
    }, delay * 1000);

    return () => {
      window.clearTimeout(timeout);
      window.cancelAnimationFrame(frame);
    };
  }, [delay, inView, reduced, target]);

  return (
    <div ref={ref} className="min-w-0 border-l border-brass/40 pl-5">
      <p className="font-display text-brass text-[clamp(2.5rem,4vw,3.75rem)] leading-none tracking-tight tabular-nums">
        {prefix}
        {display}
        {suffix}
      </p>
      <p className="text-cream-muted mt-4 max-w-[15rem] text-sm leading-6 tracking-wide">
        {label}
      </p>
    </div>
  );
}
