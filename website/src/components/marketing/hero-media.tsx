"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";

const DESKTOP_POSTER = "/assets/images/banners/infrastructure.jpg";
const MOBILE_POSTER = "/assets/images/realty/maldives/irumathi-exterior.png";

export function HeroMedia() {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className="absolute inset-0" aria-hidden>
        <Image
          src={DESKTOP_POSTER}
          alt=""
          fill
          priority
          sizes="100vw"
          className="hidden object-cover md:block"
        />
        <Image
          src={MOBILE_POSTER}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%] md:hidden"
        />
      </div>
    );
  }

  return (
    <video
      className="absolute inset-0 h-full w-full object-cover object-[center_18%] md:object-center"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={DESKTOP_POSTER}
      aria-hidden
    >
      <source src="/assets/videos/hero-mobile.mp4" media="(max-width: 767px)" />
      <source src="/assets/videos/hero-desktop.mp4" />
    </video>
  );
}
