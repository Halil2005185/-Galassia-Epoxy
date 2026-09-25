"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { isR2DevUrl } from "@/lib/images";

const DWELL_MS = 5000;

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

  useEffect(() => {
    if (images.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      setIndex((current) => {
        const next = (current + 1) % images.length;
        const preload = (next + 1) % images.length;
        setRevealed((prev) => (prev.has(preload) ? prev : new Set(prev).add(preload)));
        return next;
      });
    }, DWELL_MS);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-canvas">
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
            className={`object-cover transition-opacity duration-[1200ms] ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : null
      )}
    </div>
  );
}
