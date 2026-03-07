import { HeroSection } from "@/components/landing/HeroSection";
import { HeroMockup } from "@/components/landing/HeroMockup";
import { FeatureReader } from "@/components/landing/FeatureReader";
import { FeatureMemorization } from "@/components/landing/FeatureMemorization";
import { FeatureKhatam } from "@/components/landing/FeatureKhatam";
import { PricingSection } from "@/components/landing/PricingSection";
import { CommunityStats } from "@/components/landing/CommunityStats";
import { CtaSection } from "@/components/landing/CtaSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <HeroMockup />
      <FeatureReader />
      <FeatureMemorization />
      <FeatureKhatam />
      <PricingSection />
      <CommunityStats />
      <CtaSection />
    </>
  );
}
