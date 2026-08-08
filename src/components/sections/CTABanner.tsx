import { Download, ShoppingBag } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export function CTABanner() {
  return (
    <section id="download" className="bg-light-bg py-16">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-8 rounded-xl bg-light-bg lg:flex-row lg:items-center">
            <div>
              <h2 className="font-display text-3xl font-medium tracking-tight text-light-text sm:text-4xl">
                Ready to own your software?
              </h2>
              <p className="mt-2 text-base text-light-text-muted">
                Download the desktop suite today. No accounts, no clouds, no nonsense.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-4 sm:flex-row">
              <Button href="/#download" icon={<Download className="h-4 w-4" strokeWidth={2.25} />}>
                Download Folio
              </Button>
              <Button
                href="/#product"
                variant="secondary-light"
                icon={<ShoppingBag className="h-4 w-4" strokeWidth={2.25} />}
              >
                Visit Products Page
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
