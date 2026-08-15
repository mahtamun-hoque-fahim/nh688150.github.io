import { Navbar } from "@/components/sections/Navbar";
import { ProductHeader } from "@/components/ui/ProductHeader";
import { ProductDetail } from "@/components/sections/ProductDetail";
import { CTABanner } from "@/components/sections/CTABanner";
import { Footer } from "@/components/sections/Footer";

const aboutParagraphs = [
  "Folio is Falcotrix's complete PDF toolkit, engineered for scanned documents. At its core is Folio's MRC (Mixed Raster Content) compression engine — separating text, images, and background onto independent layers so each compresses at its optimal setting, cutting file sizes by up to 98% without softening text or muddying scanned pages. Quality presets range from archival-grade fidelity to maximum space savings, giving you full control over the size-versus-quality tradeoff, page by page or across an entire batch.*",
  "*Beyond compression, Folio handles the everyday work of a digitization workflow: converting PDFs to images and back, merging files, removing pages, and running OCR to make scanned documents searchable. Built for flatbed and production scanner output — the standard for archives, libraries, and institutional digitization — Folio delivers consistent, predictable results on the documents professionals actually work with. Every tool runs entirely on your device: no cloud upload, no internet connection, no data collected. Folio is a one-time purchase — buy it once, own it for good.",
];

const aboutTagline = "Fully local · No data collected · No internet required";

const aboutClosing =
  "Check the Modules page to see details of Folio's tools, or check the Interface page to see instances of Folio working.";

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

export default function FolioPage() {
  return (
    <>
      <Navbar />
      <main>
        <ProductHeader
          logoSrc="/images/products/folio-logo.png"
          logoAlt="Folio logo"
          name="Folio"
          tagline="By Falcotrix"
        />
        <ProductDetail
          aboutParagraphs={aboutParagraphs}
          aboutTagline={aboutTagline}
          aboutClosing={aboutClosing}
          modules={modules}
          screenshotBrief="Folio interface screenshot"
        />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
