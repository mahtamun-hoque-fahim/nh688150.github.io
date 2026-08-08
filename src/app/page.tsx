import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { PeopleBelieve } from "@/components/sections/PeopleBelieve";
import { RawPerformance } from "@/components/sections/RawPerformance";
import { CTABanner } from "@/components/sections/CTABanner";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PeopleBelieve />
        <RawPerformance />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
