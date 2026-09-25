"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const DWELL_MS = 5000;

export default function HeroCrossfade({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, DWELL_MS);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-canvas">
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 58vw, 100vw"
          priority={i === 0}
          // R2's public dev URL (pub-*.r2.dev) has been unreliable to reach
          // from server-side fetches (used by Next's image optimizer) even
          // though browsers load it directly without issue — unoptimized
          // skips the server-side resize/proxy step so the browser fetches
          // the original URL itself, same as it did before this was next/image.
          unoptimized
          className={`object-cover transition-opacity duration-[1200ms] ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
