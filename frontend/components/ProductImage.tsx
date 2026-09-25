"use client";

import { useState } from "react";
import Image from "next/image";
import { isR2DevUrl } from "@/lib/images";

type ProductImageProps = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/**
 * Wraps next/image with a visible loading state and a graceful fallback.
 * R2's public dev URL is unreliable enough that images sometimes take a
 * moment (or fail outright) even in production — this replaces the
 * previous "blank box with tiny alt text" with a pulsing placeholder while
 * loading, and the same placeholder style (not broken-image iconography)
 * if the image never arrives.
 */
export default function ProductImage({ src, alt, sizes, priority, className }: ProductImageProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "failed">("loading");

  if (status === "failed") {
    return (
      <div className="flex h-full w-full items-center justify-center bg-canvas">
        <span className="label-caps text-graphite">{alt}</span>
      </div>
    );
  }

  return (
    <>
      {status === "loading" && <div className="absolute inset-0 animate-pulse bg-border" />}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={isR2DevUrl(src)}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("failed")}
        className={`${className ?? ""} transition-opacity duration-500 ${
          status === "loaded" ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}
