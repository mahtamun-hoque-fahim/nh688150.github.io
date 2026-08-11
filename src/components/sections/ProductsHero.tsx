import { Reveal } from "@/components/ui/Reveal";
import { WaveBg } from "@/components/ui/WaveBg";

export function ProductsHero() {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-bg pt-20">
      <WaveBg variant="grayscale" parallax />

      <div className="relative mx-auto max-w-5xl px-6 pb-16 pt-16 text-center sm:pt-12 lg:px-8">
        <Reveal>
          <h1 className="text-balance font-display text-5xl font-medium leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl">
            Native Utilities
            <br />
            <span className="text-text-muted">Built To Run Fully Offline</span>
          </h1>
        </Reveal>

        <Reveal delayMs={100}>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-base text-[#eeeeee] sm:text-lg">
            Falcotrix is a studio developing a growing suite of desktop-native software —
            no cloud dependency, no telemetry, no subscriptions holding your files hostage.
            Every product below runs entirely on your machine.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
