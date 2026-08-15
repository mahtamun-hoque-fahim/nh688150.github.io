import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { WaveBg } from "@/components/ui/WaveBg";

interface ProductHeaderProps {
  logoSrc: string;
  logoAlt: string;
  name: string;
  tagline: string;
}

export function ProductHeader({ logoSrc, logoAlt, name, tagline }: ProductHeaderProps) {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-bg">
      <WaveBg variant="grayscale" parallax />

      <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-32 sm:pt-24 lg:px-6">
        <Reveal>
          <div className="flex items-center gap-5">
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={85}
              height={85}
              className="h-16 w-16 sm:h-20 sm:w-20"
            />
            <div>
              <h1 className="font-display text-4xl font-medium tracking-tight text-white sm:text-5xl">
                {name}
                <sup className="ml-0.5 text-xs font-normal text-text-faint">TM</sup>
              </h1>
              <p className="mt-1 text-base text-text-muted sm:text-lg">{tagline}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
