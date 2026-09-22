"use client";

import { useState } from "react";
import { socialLinks } from "@/lib/navigation";

type BlogShareProps = {
  title: string;
  url: string;
};

export function BlogShare({ title, url }: BlogShareProps) {
  const [copied, setCopied] = useState(false);
  const linkedIn = socialLinks[0];
  const shareHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className="text-caption text-cream-muted tracking-[0.12em] uppercase">Share</p>
      {linkedIn ? (
        <a
          href={shareHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-caption text-brass inline-flex min-h-11 items-center tracking-[0.12em] uppercase"
        >
          {linkedIn.label}
        </a>
      ) : null}
      <button
        type="button"
        onClick={() => {
          void copyLink();
        }}
        className="text-caption text-cream/80 hover:text-cream inline-flex min-h-11 items-center tracking-[0.12em] uppercase"
        aria-label={`Copy link to ${title}`}
      >
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
