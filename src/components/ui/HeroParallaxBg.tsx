"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export function HeroParallaxBg() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div ref={layerRef} className="absolute inset-0 will-change-transform">
        <Image
          src="/images/hero-section-bg.png"
          alt=""
          fill
          priority
          className="object-cover object-left-bottom"
          sizes="100vw"
        />
      </div>
    </div>
  );
}
