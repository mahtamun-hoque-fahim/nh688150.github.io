/**
 * One-time (idempotent) seed: migrates the site's currently-hardcoded
 * copy into real `page_section` rows, and Folio's content into `product`
 * + `product_module` rows, so nothing regresses once the marketing pages
 * switch over to reading from the database (Studio Step 7).
 *
 * Run with: npm run seed
 * Requires DATABASE_URL to be set.
 */
import { randomUUID } from "crypto";
import { eq, and } from "drizzle-orm";
import { getDb } from "../src/lib/db";
import { pageSection, product, productModule } from "../src/lib/db/schema";
import type { SectionRegistryKey } from "../src/lib/content-schemas";

const db = getDb();

async function upsertSection(key: SectionRegistryKey, content: object) {
  const [page, sectionKey] = key.split(":");

  const existing = await db
    .select()
    .from(pageSection)
    .where(and(eq(pageSection.page, page), eq(pageSection.sectionKey, sectionKey)))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(pageSection)
      .set({ content, updatedAt: new Date() })
      .where(eq(pageSection.id, existing[0].id));
    console.log(`  updated  ${key}`);
  } else {
    await db.insert(pageSection).values({
      id: randomUUID(),
      page,
      sectionKey,
      content,
    });
    console.log(`  created  ${key}`);
  }
}

async function seedPageSections() {
  console.log("Seeding page sections...");

  await upsertSection("home:hero", {
    heading: "Quality Software",
    headingLine2: "On Your Machine",
    paragraph:
      "Zero cloud uploads. Everything runs locally on your hardware. High-performance desktop tools for PDF editing, video transcoding, and more.",
  });

  await upsertSection("home:people_believe", {
    heading: "People Believes",
    subheading: "In Reason. We Give Them Hope",
    cards: [
      {
        productSlug: "folio",
        description:
          "A document workstation that never leaves your machine. Compress, OCR, and merge PDFs locally.",
        ctaLabel: "Explore Folio",
        ctaHref: "/folio",
      },
      {
        productSlug: "reelvault",
        description:
          "Native video re-encoding, tuned for your hardware. High-performance batch processing via GPU.",
        ctaLabel: "Join Beta",
        ctaHref: "/reelvault",
        badge: "BETA",
      },
      {
        productSlug: "hearth",
        description:
          "Folio: Mobile Edition. Desktop-class archiving, native to your mobile device. Coming soon.",
        status: "Finalizing local engine...",
      },
    ],
  });

  await upsertSection("home:raw_performance", {
    heading: "Raw Performance.",
    headingLine2: "Zero Cloud Latency.",
    paragraph:
      "Falcotrix bypasses the browser and the cloud to speak directly to your machine's hardware. Whether it's Apple Silicon, NVIDIA CUDA, or modern x86 instructions, we optimize every calculation to run natively on your metal.",
  });

  const ctaBanner = {
    heading: "Ready to own your software?",
    paragraph: "Download the desktop suite today. No accounts, no clouds, no nonsense.",
    primaryButtonLabel: "Download Folio",
    primaryButtonHref: "/#download",
    secondaryButtonLabel: "Visit Products Page",
    secondaryButtonHref: "/products",
  };
  await upsertSection("home:cta_banner", ctaBanner);
  await upsertSection("products:cta_banner", ctaBanner);
  await upsertSection("privacy:cta_banner", ctaBanner);
  await upsertSection("contact:cta_banner", ctaBanner);

  await upsertSection("products:hero", {
    heading: "Native Utilities",
    headingLine2: "Built To Run Fully Offline",
    paragraph:
      "Falcotrix is a studio developing a growing suite of desktop-native software — no cloud dependency, no telemetry, no subscriptions holding your files hostage. Every product below runs entirely on your machine.",
  });

  await upsertSection("products:people_believe_heading", {
    heading: "People Believes",
    subheading: "In Reason. We Give Them Hope",
  });

  await upsertSection("privacy:hero", {
    heading: "Privacy & Policy",
    paragraph:
      "Falcotrix is a studio developing a growing suite of desktop-native software — no cloud dependency, no telemetry, no subscriptions holding your files hostage. Every product below runs entirely on your machine.",
  });

  await upsertSection("privacy:card_1", {
    title: "Data Collection & Processing",
    paragraphs: [
      "Falcotrix products process all files completely locally on the user's machine. No files, documents, or personal metrics are ever transmitted to an external server or collected by Falcotrix. Compression, OCR, and every other operation Folio performs happens entirely on-device.",
      "This includes every stage of a file's lifecycle inside the application — reading the source document, running MRC compression, extracting or embedding OCR text layers, merging or splitting pages, and writing the final output — all of it takes place within the local process running on your machine. At no point does Folio open a network connection to move file content off-device, whether to Falcotrix's own infrastructure or to any third party.",
      "Because processing never leaves your machine, Falcotrix has no visibility into the contents, filenames, page counts, or any other attribute of the documents you work with. There is no server-side copy, cache, or backup of your files at any stage, and none is ever created.",
    ],
  });

  const telemetryCard = {
    title: "Telemetry & Analytics",
    paragraphs: [
      "Folio does not use tracking cookies, external analytics SDKs, or background telemetry of any kind. The application does not report usage data, crash data, or file metadata back to Falcotrix.",
      "Folio does not include any third-party analytics frameworks, advertising identifiers, or crash-reporting services. No event data — such as which tools you use, how often you use them, or how long a session lasts — is collected, logged, or transmitted anywhere. The application does not require an internet connection to install, launch, activate, or run any of its features.",
      "If a future update introduces optional, user-initiated telemetry (for example, an opt-in feedback or crash report submitted manually by the user), it will be strictly opt-in, clearly disclosed at the point of use, and never enabled by default.",
    ],
  };
  // NOTE: card_2 and card_3 are seeded as duplicates on purpose, matching
  // today's known (flagged, unfixed) mockup issue — see PLANNER.md. Now
  // that this lives in the DB, Fahim can finally fix card_3 himself via
  // Studio's Pages editor once it's built, without needing a code change.
  await upsertSection("privacy:card_2", telemetryCard);
  await upsertSection("privacy:card_3", telemetryCard);

  await upsertSection("contact:hero", {
    heading: "Support & Contact",
    paragraph:
      "Falcotrix is committed to giving customers an absolute priority and continuously seeks new ideas and feedback. Whether you have a feature request for an existing Falcotrix product or a proposal for an entirely new tool, we welcome your input. Falcotrix provides direct developer-to-customer technical support — no ticketing system, no chatbot layer. Messages are read and answered by the person who builds the software, with typical response windows of 24–48 business hours.",
  });

  await upsertSection("global:footer", {
    tagline: "Building the future of local-first utility. Powerful, private, and permanent.",
    copyright: "© 2024-26 Falcotrix. All Rights Reserved.",
  });
}

async function seedFolio() {
  console.log("Seeding Folio product...");

  const existing = await db.select().from(product).where(eq(product.slug, "folio")).limit(1);
  let folioId: string;

  const aboutParagraphs = [
    "Folio is Falcotrix's complete PDF toolkit, engineered for scanned documents. At its core is Folio's MRC (Mixed Raster Content) compression engine — separating text, images, and background onto independent layers so each compresses at its optimal setting, cutting file sizes by up to 98% without softening text or muddying scanned pages. Quality presets range from archival-grade fidelity to maximum space savings, giving you full control over the size-versus-quality tradeoff, page by page or across an entire batch.*",
    "*Beyond compression, Folio handles the everyday work of a digitization workflow: converting PDFs to images and back, merging files, removing pages, and running OCR to make scanned documents searchable. Built for flatbed and production scanner output — the standard for archives, libraries, and institutional digitization — Folio delivers consistent, predictable results on the documents professionals actually work with. Every tool runs entirely on your device: no cloud upload, no internet connection, no data collected. Folio is a one-time purchase — buy it once, own it for good.",
  ];
  const aboutTagline = "Fully local · No data collected · No internet required";
  const aboutClosing =
    "Check the Modules page to see details of Folio's tools, or check the Interface page to see instances of Folio working.";

  if (existing.length > 0) {
    folioId = existing[0].id;
    await db
      .update(product)
      .set({ aboutParagraphs, aboutTagline, aboutClosing, updatedAt: new Date() })
      .where(eq(product.id, folioId));
    console.log("  updated  folio");
  } else {
    folioId = randomUUID();
    await db.insert(product).values({
      id: folioId,
      slug: "folio",
      name: "Folio",
      tagline: "By Falcotrix",
      published: true,
      order: 0,
      aboutParagraphs,
      aboutTagline,
      aboutClosing,
    });
    console.log("  created  folio");
  }

  const modules = [
    {
      title: "MRC Document Compression",
      description:
        "Separates readable text from background imagery, compressing backgrounds heavily while keeping text edges sharp. Four presets—Archival, Balanced, Max, Ultra—span 32% to 98% savings. Smart cover detection preserves book covers in HD. Supports batch processing, thread control, and drag-and-drop folders.",
    },
    {
      title: "High-Fidelity PDF to Image Extraction",
      description:
        "Extracts photos and graphics directly from any PDF in their native formats. Pulling raw imagery straight from the document structure preserves the exact digital quality of the original assets, with zero quality loss.",
    },
    {
      title: "Lossless Image to PDF Compilation",
      description:
        "Converts collections of images—JPEGs, PNGs, or scans—into a single, perfectly formatted PDF. Preserves exact alignment and resolution while giving full control over orientation, page size, and margins through an interactive panel.",
    },
    {
      title: "Structural Document Merger",
      description:
        "Combines separate, scattered PDF files into one seamless document. Securely compiles pages while keeping all internal formatting intact, making it effortless to organize multi-part reports, book chapters, or long documentation sets.",
    },
    {
      title: "Smart Page Removal & Layer Stripping",
      description:
        "Gives precise control over document structure by letting you purge unwanted pages or strip unnecessary overhead from a PDF. This lightens file size, speeds up page-flipping, and keeps documents focused—managed through an interactive panel.",
    },
    {
      title: "Searchable OCR Layer Generation",
      description:
        "Scans flat, static images to identify printed words and embeds an invisible, searchable text layer beneath them. This transforms unselectable scanned paperwork into fully interactive documents you can highlight, search, and copy freely.",
    },
  ];

  const existingModules = await db
    .select()
    .from(productModule)
    .where(eq(productModule.productId, folioId));

  if (existingModules.length === 0) {
    for (let i = 0; i < modules.length; i++) {
      await db.insert(productModule).values({
        id: randomUUID(),
        productId: folioId,
        title: modules[i].title,
        description: modules[i].description,
        order: i,
      });
    }
    console.log(`  created  ${modules.length} folio modules`);
  } else {
    console.log(`  skipped  folio modules (${existingModules.length} already exist)`);
  }
}

async function main() {
  if (!db) {
    console.error("DATABASE_URL is not set. Add it to .env.local and try again.");
    process.exit(1);
  }

  await seedPageSections();
  await seedFolio();

  console.log("\nSeed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
