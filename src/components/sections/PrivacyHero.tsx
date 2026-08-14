import { Reveal } from "@/components/ui/Reveal";
import { WaveBg } from "@/components/ui/WaveBg";

export function PrivacyHero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-bg">
      <WaveBg variant="grayscale" parallax />

      <div className="relative mx-auto max-w-5xl px-6 pb-16 pt-32 text-center sm:pt-24 lg:px-8">
        <Reveal>
          <h1 className="text-balance font-display text-5xl font-medium leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl">
            Privacy &amp; Policy
          </h1>
        </Reveal>

        <Reveal delayMs={100}>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-base text-white sm:text-lg">
            Falcotrix is a studio developing a growing suite of desktop-native software —
            no cloud dependency, no telemetry, no subscriptions holding your files hostage.
            Every product below runs entirely on your machine.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
