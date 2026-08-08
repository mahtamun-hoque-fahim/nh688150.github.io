import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { DiagnosticPanel } from "@/components/ui/DiagnosticPanel";

export function RawPerformance() {
  return (
    <section className="relative overflow-hidden bg-[#0c0d11] pb-32 pt-4">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-72 opacity-70"
        aria-hidden="true"
      >
        <Image
          src="/images/hero-bg.png"
          alt=""
          fill
          className="object-cover object-bottom"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-[#0c0d11]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-xl border border-border bg-surface p-8 sm:p-12 lg:p-16">
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

              <DiagnosticPanel />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
