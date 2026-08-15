import { Reveal } from "@/components/ui/Reveal";
import { ProductCard } from "@/components/ui/ProductCard";

const products = [
  {
    name: "Folio",
    description:
      "A document workstation that never leaves your machine. Compress, OCR, and merge PDFs locally.",
    cta: { label: "Explore Folio", href: "/folio" },
  },
  {
    name: "ReelVault",
    badge: "BETA",
    description:
      "Native video re-encoding, tuned for your hardware. High-performance batch processing via GPU.",
    cta: { label: "Join Beta", href: "/reelvault" },
  },
  {
    name: "Hearth",
    description:
      "Folio: Mobile Edition. Desktop-class archiving, native to your mobile device. Coming soon.",
    status: "Finalizing local engine...",
  },
];

export function PeopleBelieve() {
  return (
    <section id="product" className="relative bg-[#0c0d11] py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-6">
        <Reveal className="text-center">
          <h2 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">
            People Believes
          </h2>
          <p className="mt-3 text-lg text-text-muted">In Reason. We Give Them Hope</p>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {products.map((product, i) => (
            <Reveal key={product.name} delayMs={i * 100}>
              <ProductCard {...product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
