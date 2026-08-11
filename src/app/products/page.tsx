import { Navbar } from "@/components/sections/Navbar";
import { ProductsHero } from "@/components/sections/ProductsHero";
import { Footer } from "@/components/sections/Footer";

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <main>
        <ProductsHero />
      </main>
      <Footer />
    </>
  );
}
