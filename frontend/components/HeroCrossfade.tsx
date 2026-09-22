"use client";

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
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={alt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`
        }
        />
      ))}
    </div>
  );
}
