"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { isR2DevUrl } from "@/lib/images";

const DWELL_MS = 5000;

type LoadStatus = "loading" | "loaded" | "failed";

export default function HeroCrossfade({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);
  // Every image in `images` is stacked in the same spot and only tells
  // apart by opacity, so `loading="lazy"` can't help here — the browser
  // considers them all "in viewport" and would fetch every one immediately
  // regardless. Mounting only the current slide plus one preloaded ahead of
  // it (instead of all of them up front) is what actually keeps this from
  // downloading images that won't be seen for another 10-25+ seconds.
  const [revealed, setRevealed] = useState<Set<number>>(
    () => new Set(images.length > 1 ? [0, 1] : [0])
  );
  const [loadStatus, setLoadStatus] = useState<Record<number, LoadStatus>>({});

  // Wait for the *current* slide to actually finish loading (or fail)
  // before starting its dwell countdown — otherwise, on a slow connection,
  // an image that took 3s to appear would only be visible for ~2s before
  // the crossfade already moves on. Each slide now gets its full DWELL_MS
  // once it's actually visible, not from whenever the component mounted.
  const currentStatus = loadStatus[index];

  useEffect(() => {
    if (images.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (currentStatus !== "loaded" && currentStatus !== "failed") return;

    const id = setTimeout(() => {
      setIndex((current) => {
        const next = (current + 1) % images.length;
        const preload = (next + 1) % images.length;
        setRevealed((prev) => (prev.has(preload) ? prev : new Set(prev).add(preload)));
        return next;
      });
    }, DWELL_MS);
    return () => clearTimeout(id);
  }, [images.length, index, currentStatus]);

  // R2's public URL can be slow or fail outright — show a loading pulse
  // until the first slide has actually arrived, instead of empty canvas
  // with nothing happening. Once any slide has loaded, the crossfade's own
  // opacity timing (unchanged from before) takes over as normal.
  const anyLoaded = Object.values(loadStatus).some((status) => status === "loaded");

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-canvas">
      {!anyLoaded && <div className="absolute inset-0 animate-pulse bg-border" />}
      {images.map((src, i) =>
        revealed.has(i) ? (
          <Image
            key={src}
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 58vw, 100vw"
            priority={i === 0}
            unoptimized={isR2DevUrl(src)}
            onLoad={() => setLoadStatus((prev) => ({ ...prev, [i]: "loaded" }))}
            onError={() => setLoadStatus((prev) => ({ ...prev, [i]: "failed" }))}
            className={`object-cover transition-opacity duration-[1200ms] ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : null
      )}
    </div>
  );
}
