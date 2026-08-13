import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

export function ContactHero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-bg">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <Image
          src="/images/products-listing-bg.png"
          alt=""
          fill
          className="object-cover"
          style={{ objectPosition: "left bottom" }}
          sizes="100vw"
        />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 pb-16 pt-32 sm:pt-24 lg:px-8">
        <Reveal>
          <h1 className="text-balance font-display text-5xl font-medium leading-[1.05] tracking-tight text-text-muted sm:text-6xl md:text-7xl">
            Support &amp; Contact
          </h1>
        </Reveal>

        <Reveal delayMs={100}>
          <p className="mt-6 max-w-2xl text-balance text-base text-[#eeeeee] sm:text-lg">
            Falcotrix is committed to giving customers an absolute priority and continuously
            seeks new ideas and feedback. Whether you have a feature request for an existing
            Falcotrix product or a proposal for an entirely new tool, we welcome your input.
            Falcotrix provides direct developer-to-customer technical support — no ticketing
            system, no chatbot layer. Messages are read and answered by the person who builds
            the software, with typical response windows of 24–48 business hours.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
