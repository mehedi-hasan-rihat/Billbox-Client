import { Navbar } from "@/components/sections/navbar";
import { HeroSection } from "@/components/sections/hero-section";
import { ProblemSection } from "@/components/sections/problem-section";
import { LifecycleSection } from "@/components/sections/lifecycle-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { BillTypesSection } from "@/components/sections/bill-types-section";
import { CtaSection } from "@/components/sections/cta-section";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-background text-foreground font-sans">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <LifecycleSection />
      <FeaturesSection />
      <BillTypesSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
