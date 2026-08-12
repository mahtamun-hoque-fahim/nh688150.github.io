import { Navbar } from "@/components/sections/Navbar";
import { ProductsHero } from "@/components/sections/ProductsHero";
import { ProductListing } from "@/components/sections/ProductListing";
import { CTABanner } from "@/components/sections/CTABanner";
import { Footer } from "@/components/sections/Footer";

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <main>
        <ProductsHero />
        <ProductListing />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
