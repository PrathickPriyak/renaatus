"use client";

import { getImageProps } from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  HERO_DESKTOP_POSTER,
  HERO_IMAGE_QUALITY,
  HERO_MOBILE_MAX_WIDTH,
  HERO_MOBILE_POSTER,
  heroVideoPreload,
  heroVideoSrc,
  shouldAttachHeroVideoSource,
  shouldAutoplayHeroVideo,
} from "@/lib/performance/hero-media";
import { duration, easePremium } from "@/design-system/motion";

export function HeroMedia() {
  const reduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(true);
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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
        setInView(Boolean(entry?.isIntersecting));
      },
      { rootMargin: "80px", threshold: 0.12 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const autoplay = shouldAutoplayHeroVideo({
    reducedMotion: Boolean(reduced),
    isMobile,
  });
  const attachVideo = shouldAttachHeroVideoSource({ autoplay, inView });
  const src = heroVideoSrc(isMobile);

  useEffect(() => {
    setReady(false);
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !attachVideo) {
      return;
    }

    if (inView) {
      void video.play().catch(() => {
        /* Autoplay may be blocked; poster remains. */
      });
    } else {
      video.pause();
    }
  }, [attachVideo, inView, src]);

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
          className="absolute inset-0 h-full w-full scale-[1.02] object-cover object-[center_35%] md:object-center"
          decoding="async"
          fetchPriority="high"
        />
      </picture>
      {attachVideo ? (
        <motion.video
          key={src}
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover object-center"
          autoPlay
          muted
          loop
          playsInline
          preload={heroVideoPreload(true)}
          onLoadedData={() => setReady(true)}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: ready ? 1 : 0, scale: ready ? 1 : 1.04 }}
          transition={{ duration: duration.slow, ease: easePremium }}
        >
          <source src={src} type="video/mp4" />
        </motion.video>
      ) : null}
    </div>
  );
}
