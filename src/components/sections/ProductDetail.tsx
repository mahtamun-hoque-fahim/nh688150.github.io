import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

interface ProductModule {
  title: string;
  description: string;
}

interface ProductDetailProps {
  aboutParagraphs: string[];
  aboutTagline?: string;
  aboutClosing?: string;
  modules: ProductModule[];
  screenshotCount?: number;
  screenshotBrief?: string;
}

const panelClasses =
  "rounded-lg border border-glass-border bg-glass p-8 backdrop-blur-md transition-colors duration-300 ease-out hover:border-glass-border-strong hover:bg-glass-hover sm:p-10";

export function ProductDetail({
  aboutParagraphs,
  aboutTagline,
  aboutClosing,
  modules,
  screenshotCount = 6,
  screenshotBrief = "Product screenshot",
}: ProductDetailProps) {
  return (
    <section className="relative overflow-hidden bg-[#0c0d11] py-28">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <Image
          src="/images/products-listing-bg.png"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-6">
        <div className="flex flex-col gap-10">
          {/* About */}
          <Reveal>
            <div className={panelClasses}>
              <h2 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
                About
              </h2>

              <div className="mt-6 flex flex-col gap-4">
                {aboutParagraphs.map((paragraph, i) => (
                  <p key={i} className="text-sm leading-relaxed text-text-muted">
                    {paragraph}
                  </p>
                ))}
              </div>

              {aboutTagline && (
                <p className="mt-4 font-mono text-xs text-text-faint">{aboutTagline}</p>
              )}

              {aboutClosing && (
                <p className="mt-6 text-sm leading-relaxed text-text-muted">{aboutClosing}</p>
              )}
            </div>
          </Reveal>

          {/* Modules */}
          <Reveal delayMs={100}>
            <div className={panelClasses}>
              <h2 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
                Modules
              </h2>
              <div className="mt-3 h-px w-16 bg-accent" />

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {modules.map((module) => (
                  <div
                    key={module.title}
                    className="rounded-lg border border-glass-border bg-black/20 p-6"
                  >
                    <h3 className="font-display text-lg font-medium tracking-tight text-white">
                      {module.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-text-muted">
                      {module.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Screenshots */}
          <Reveal delayMs={200}>
            <div className={panelClasses}>
              <h2 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
                Screenshots
              </h2>
              <div className="mt-3 h-px w-16 bg-accent" />

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {Array.from({ length: screenshotCount }).map((_, i) => (
                  <PlaceholderImage
                    key={i}
                    brief={`${screenshotBrief} ${i + 1}`}
                    className="rounded-lg border border-glass-border"
                  />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
