"use client";

import { getImageProps } from "next/image";
import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  HERO_DESKTOP_POSTER,
  HERO_DESKTOP_VIDEO,
  HERO_IMAGE_QUALITY,
  HERO_MOBILE_MAX_WIDTH,
  HERO_MOBILE_POSTER,
  heroVideoPreload,
  shouldAttachHeroVideoSource,
  shouldAutoplayHeroVideo,
} from "@/lib/performance/hero-media";

export function HeroMedia() {
  const reduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(true);
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${HERO_MOBILE_MAX_WIDTH}px)`);
    const sync = () => setIsMobile(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "120px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const autoplay = shouldAutoplayHeroVideo({
    reducedMotion: Boolean(reduced),
    isMobile,
  });
  const attachVideo = shouldAttachHeroVideoSource({ autoplay, inView });

  const shared = {
    alt: "",
    fill: true,
    sizes: "100vw",
    quality: HERO_IMAGE_QUALITY,
  } as const;
  const { props: desktop } = getImageProps({
    ...shared,
    src: HERO_DESKTOP_POSTER,
  });
  const { props: mobile } = getImageProps({
    ...shared,
    src: HERO_MOBILE_POSTER,
  });

  return (
    <div ref={rootRef} className="absolute inset-0" aria-hidden>
      <picture>
        <source
          media={`(min-width: ${HERO_MOBILE_MAX_WIDTH + 1}px)`}
          srcSet={desktop.srcSet}
          sizes={desktop.sizes}
        />
        <img
          {...mobile}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_35%] md:object-center"
          decoding="async"
          fetchPriority="high"
        />
      </picture>
      {attachVideo ? (
        <video
          className="absolute inset-0 h-full w-full object-cover object-center"
          autoPlay
          muted
          loop
          playsInline
          preload={heroVideoPreload(true)}
        >
          <source src={HERO_DESKTOP_VIDEO} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}
