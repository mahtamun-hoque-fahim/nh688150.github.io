import { Navbar } from "@/components/sections/Navbar";
import { PrivacyHero } from "@/components/sections/PrivacyHero";
import { PrivacyContent } from "@/components/sections/PrivacyContent";
import { CTABanner } from "@/components/sections/CTABanner";
import { Footer } from "@/components/sections/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main>
        <PrivacyHero />
        <PrivacyContent />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
