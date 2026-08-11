import { Download, ShoppingBag } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { HeroParallaxBg } from "@/components/ui/HeroParallaxBg";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-bg">
      <HeroParallaxBg />

      <div className="relative mx-auto max-w-5xl px-6 pb-16 pt-32 text-center sm:pt-24 lg:px-8">
        <Reveal>
          <h1 className="text-balance font-display text-5xl font-medium leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl">
            Quality Software
            <br />
            <span className="text-text-muted">On Your Machine</span>
          </h1>
        </Reveal>

        <Reveal delayMs={100}>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-base text-[#eeeeee] sm:text-lg">
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
              href="/products"
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
