"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

interface WaveBgProps {
  /** grayscale = fully desaturated, upright. rotated = fully desaturated, rotated 180deg. normal = full color, upright. */
  variant: "grayscale" | "rotated" | "normal";
  /** Applies the same scroll-parallax treatment as the homepage hero. */
  parallax?: boolean;
  className?: string;
  imgClassName?: string;
  /** CSS object-position for the image, e.g. "left bottom", "right bottom". Defaults to "left bottom". */
  position?: string;
  /** Opacity of the whole layer, 0-1. Defaults to 1. */
  opacity?: number;
  /** Positioning classes for the outer wrapper (e.g. restrict to bottom half of a section). Defaults to full coverage. */
  bounds?: string;
}

const filterByVariant: Record<WaveBgProps["variant"], string> = {
  grayscale: "grayscale(1)",
  rotated: "grayscale(1)",
  normal: "none",
};

export function WaveBg({
  variant,
  parallax = false,
  className = "",
  imgClassName = "",
  position = "left bottom",
  opacity = 1,
  bounds = "inset-0",
}: WaveBgProps) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!parallax) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let ticking = false;

    const applyOffset = () => {
      if (layerRef.current) {
        layerRef.current.style.transform = `translate3d(0, ${window.scrollY * 0.3}px, 0)`;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(applyOffset);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [parallax]);

  return (
    <div className={`pointer-events-none absolute overflow-hidden ${bounds} ${className}`} aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          filter: filterByVariant[variant],
          transform: variant === "rotated" ? "rotate(180deg)" : undefined,
          opacity,
        }}
      >
        <div ref={layerRef} className="absolute inset-0 will-change-transform">
          <Image
            src="/images/hero-section-bg.png"
            alt=""
            fill
            className={`object-cover ${imgClassName}`}
            style={{ objectPosition: position }}
            sizes="100vw"
          />
        </div>
      </div>
    </div>
  );
}
