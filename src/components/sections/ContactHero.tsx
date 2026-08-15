import { Reveal } from "@/components/ui/Reveal";
import { HeroParallaxBg } from "@/components/ui/HeroParallaxBg";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";

export function ContactHero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-bg">
      <HeroParallaxBg />

      <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-32 sm:pt-24 lg:px-6">
        <Reveal>
          <h1 className="text-balance font-display text-5xl font-medium leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl">
            Support &amp; Contact
          </h1>
        </Reveal>

        <Reveal delayMs={100}>
          <p className="mt-6 max-w-2xl text-balance text-base text-white sm:text-lg">
            Falcotrix is committed to giving customers an absolute priority and continuously
            seeks new ideas and feedback. Whether you have a feature request for an existing
            Falcotrix product or a proposal for an entirely new tool, we welcome your input.
            Falcotrix provides direct developer-to-customer technical support — no ticketing
            system, no chatbot layer. Messages are read and answered by the person who builds
            the software, with typical response windows of 24–48 business hours.
          </p>
        </Reveal>
      </div>

      <ScrollIndicator />
    </section>
  );
}
