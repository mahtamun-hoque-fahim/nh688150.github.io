import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { WaveBg } from "@/components/ui/WaveBg";

interface Product {
  name: string;
  badge?: string;
  description: string;
  cta?: { label: string; href: string };
  status?: string;
  imageBrief: string;
  imageFirst: boolean;
}

const products: Product[] = [
  {
    name: "Folio",
    description:
      "A document workstation that never leaves your machine. Compress, convert, merge, trim, and OCR your PDFs and images entirely offline. Six modules, one workstation — MRC compression, image-to-PDF, merging, page removal, PDF-to-image extraction, and searchable OCR, all running locally with zero cloud uploads.",
    cta: { label: "Explore Folio", href: "/folio" },
    imageBrief: "Folio workstation UI — document/PDF module grid screenshot",
    imageFirst: true,
  },
  {
    name: "ReelVault",
    badge: "BETA",
    description:
      "Native video re-encoding, tuned for your hardware. High-performance batch processing via GPU.",
    cta: { label: "Join Beta", href: "/reelvault" },
    imageBrief: "ReelVault batch queue UI — GPU encode progress screenshot",
    imageFirst: false,
  },
  {
    name: "Hearth",
    description:
      'Desktop-class archiving, native to your mobile device. Introducing "Mobile Mode"—a specialized MRC (Mixed Raster Content) engine engineered to transform standard smartphone captures into perfectly optimized, scanner-grade digital assets. Achieve professional-quality document digitization entirely offline, with zero cloud reliance.',
    status: "Finalizing local engine...",
    imageBrief: "Hearth mobile-mode scan capture UI screenshot",
    imageFirst: true,
  },
];

export function ProductListing() {
  return (
    <section className="relative overflow-hidden bg-[#0c0d11] py-28">
      <WaveBg variant="rotated" className="opacity-[0.12]" />
      <WaveBg
        variant="normal"
        position="right bottom"
        opacity={0.85}
        bounds="inset-x-0 bottom-0 h-[520px]"
      />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <Reveal className="text-center">
          <h2 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">
            People Believes
          </h2>
          <p className="mt-3 text-lg text-text-muted">In Reason. We Give Them Hope</p>
        </Reveal>

        <div className="mt-16 flex flex-col gap-6">
          {products.map((product, i) => (
            <Reveal key={product.name} delayMs={i * 100}>
              <div className="rounded-lg border border-border bg-surface/80 p-8 backdrop-blur-sm transition-colors duration-300 ease-out hover:border-border-strong sm:p-10">
                <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
                  <div className={product.imageFirst ? "md:order-1" : "md:order-2"}>
                    <PlaceholderImage brief={product.imageBrief} />
                  </div>

                  <div className={product.imageFirst ? "md:order-2" : "md:order-1"}>
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-display text-3xl font-medium tracking-tight">
                        {product.name}
                      </h3>
                      {product.badge && (
                        <span className="inline-flex items-center rounded-sm bg-accent px-2 py-0.5 text-xs font-semibold text-white">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-text-muted">
                      {product.description}
                    </p>

                    {product.cta && (
                      <Button
                        href={product.cta.href}
                        variant="secondary"
                        icon={<ArrowRight className="h-3.5 w-3.5" strokeWidth={2.25} />}
                        className="mt-6 flex-row-reverse"
                      >
                        {product.cta.label}
                      </Button>
                    )}

                    {product.status && (
                      <p className="mt-6 text-xs italic text-text-faint">
                        <span className="font-mono not-italic">Status:</span> {product.status}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
