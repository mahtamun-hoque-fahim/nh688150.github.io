"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { DiagnosticPanel } from "@/components/ui/DiagnosticPanel";

export function RawPerformance() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#0c0d11] pb-32 pt-4">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div
          ref={sectionRef}
          className={`reveal ${active ? "is-visible" : ""}`}
        >
          <div className="relative overflow-hidden rounded-xl border border-border bg-surface p-8 sm:p-12 lg:p-16">
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-full opacity-60"
              aria-hidden="true"
            >
              <Image
                src="/images/hero-bg.png"
                alt=""
                fill
                className={`object-cover object-right-bottom transition-transform duration-[2200ms] ease-out ${
                  active ? "scale-125" : "scale-100"
                }`}
                sizes="100vw"
              />
            </div>

            <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
              <div>
                <h2 className="text-balance font-display text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl">
                  Raw Performance.
                  <br />
                  Zero Cloud Latency.
                </h2>
                <p className="mt-6 max-w-md text-base leading-relaxed text-text-muted">
                  Falcotrix bypasses the browser and the cloud to speak directly to your
                  machine&apos;s hardware. Whether it&apos;s Apple Silicon, NVIDIA CUDA, or modern
                  x86 instructions, we optimize every calculation to run natively on your metal.
                </p>
              </div>

              <DiagnosticPanel active={active} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
