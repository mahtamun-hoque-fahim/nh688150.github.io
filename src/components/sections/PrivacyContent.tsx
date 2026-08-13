import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

interface PrivacySection {
  title: string;
  paragraphs: string[];
}

const sections: PrivacySection[] = [
  {
    title: "Data Collection & Processing",
    paragraphs: [
      "Falcotrix products process all files completely locally on the user's machine. No files, documents, or personal metrics are ever transmitted to an external server or collected by Falcotrix. Compression, OCR, and every other operation Folio performs happens entirely on-device.",
      "This includes every stage of a file's lifecycle inside the application — reading the source document, running MRC compression, extracting or embedding OCR text layers, merging or splitting pages, and writing the final output — all of it takes place within the local process running on your machine. At no point does Folio open a network connection to move file content off-device, whether to Falcotrix's own infrastructure or to any third party.",
      "Because processing never leaves your machine, Falcotrix has no visibility into the contents, filenames, page counts, or any other attribute of the documents you work with. There is no server-side copy, cache, or backup of your files at any stage, and none is ever created.",
    ],
  },
  {
    title: "Telemetry & Analytics",
    paragraphs: [
      "Folio does not use tracking cookies, external analytics SDKs, or background telemetry of any kind. The application does not report usage data, crash data, or file metadata back to Falcotrix.",
      "Folio does not include any third-party analytics frameworks, advertising identifiers, or crash-reporting services. No event data — such as which tools you use, how often you use them, or how long a session lasts — is collected, logged, or transmitted anywhere. The application does not require an internet connection to install, launch, activate, or run any of its features.",
      "If a future update introduces optional, user-initiated telemetry (for example, an opt-in feedback or crash report submitted manually by the user), it will be strictly opt-in, clearly disclosed at the point of use, and never enabled by default.",
    ],
  },
  {
    title: "Telemetry & Analytics",
    paragraphs: [
      "Folio does not use tracking cookies, external analytics SDKs, or background telemetry of any kind. The application does not report usage data, crash data, or file metadata back to Falcotrix.",
      "Folio does not include any third-party analytics frameworks, advertising identifiers, or crash-reporting services. No event data — such as which tools you use, how often you use them, or how long a session lasts — is collected, logged, or transmitted anywhere. The application does not require an internet connection to install, launch, activate, or run any of its features.",
      "If a future update introduces optional, user-initiated telemetry (for example, an opt-in feedback or crash report submitted manually by the user), it will be strictly opt-in, clearly disclosed at the point of use, and never enabled by default.",
    ],
  },
];

export function PrivacyContent() {
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

      <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          {sections.map((section, i) => (
            <Reveal key={`${section.title}-${i}`} delayMs={i * 100}>
              <div className="rounded-lg border border-glass-border bg-glass p-8 backdrop-blur-md transition-colors duration-300 ease-out hover:border-glass-border-strong hover:bg-glass-hover sm:p-10">
                <h2 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
                  {section.title}
                </h2>

                <div className="mt-6 flex flex-col gap-4">
                  {section.paragraphs.map((paragraph, j) => (
                    <p key={j} className="text-sm leading-relaxed text-text-muted">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
