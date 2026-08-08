import Image from "next/image";
import { Download, ShoppingBag } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-bg">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] opacity-90"
        aria-hidden="true"
      >
        <Image
          src="/images/hero-bg.png"
          alt=""
          fill
          priority
          className="object-cover object-left-bottom"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 pb-40 pt-24 text-center sm:pt-32 lg:px-8">
        <Reveal>
          <h1 className="text-balance font-display text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            Quality Software
            <br />
            <span className="text-text-muted">On Your Machine</span>
          </h1>
        </Reveal>

        <Reveal delayMs={100}>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-base text-text-muted sm:text-lg">
            Zero cloud uploads. Everything runs locally on your hardware.
            High-performance desktop tools for PDF editing, video transcoding, and more.
          </p>
        </Reveal>

        <Reveal delayMs={200}>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/#download" icon={<Download className="h-4 w-4" strokeWidth={2.25} />}>
              Download Folio
            </Button>
            <Button
              href="/#product"
              variant="secondary"
              icon={<ShoppingBag className="h-4 w-4" strokeWidth={2.25} />}
            >
              Visit Products Page
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
