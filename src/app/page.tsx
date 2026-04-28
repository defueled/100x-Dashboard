import Image from "next/image";
import { HeroCanvas } from "@/components/HeroCanvas";
// DashboardSection removed — auth handled in header
import { Description } from "@/components/Description";
import { CurriculumScroll } from "@/components/CurriculumScroll";
import { CommunityScroll } from "@/components/CommunityScroll";
import { GamificationScroll } from "@/components/GamificationScroll";
import { PainToPowerScroll } from "@/components/PainToPowerScroll";
import { TechEvolution } from "@/components/TechEvolution";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { CheckoutSection } from "@/components/CheckoutSection";
import { Footer } from "@/components/Footer";
import { LoginButton } from "@/components/auth/LoginButton";
import { LangToggle } from "@/components/LangToggle";
import { SocialProofRibbon } from "@/components/SocialProofRibbon";
// InitialScroll removed — was only needed to skip DashboardSection
import { DashboardButton } from "@/components/DashboardButton";
import { SectionDivider } from "@/components/scroll";

export default function Home() {
  return (
    <main className="bg-[var(--color-background)] text-[var(--color-foreground)] min-h-screen selection:bg-brand-blue/30 selection:text-brand-dark relative">
      {/* Global Background Particles/Clouds */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[5%] left-[-5%] w-[50vw] h-[50vw] bg-brand-green/10 blur-[130px] rounded-full animate-float" />
        <div className="absolute bottom-[10%] right-[-10%] w-[60vw] h-[60vw] bg-brand-blue/10 blur-[150px] rounded-full animate-float-delayed" />
        <div className="fixed inset-0 bg-gradient-to-br from-brand-blue/5 via-transparent to-brand-green/5 animate-pulse-slow -z-10" />
      </div>

      <header id="main-nav" className="sticky top-0 z-50 flex justify-between items-center w-full px-4 md:px-6 py-4 bg-[var(--color-background)]/80 backdrop-blur-md border-b border-black/5">
        <div className="flex items-center gap-4 md:gap-6">
          <Image
            src="/assets/logos/100x-refined-logo.png"
            alt="100X Logo"
            width={40}
            height={40}
            priority
            className="h-8 md:h-10 w-auto"
          />

          <DashboardButton />
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <LangToggle />
          <LoginButton />
        </div>
      </header>
      <HeroCanvas />

      <SocialProofRibbon />

      <Description />

      <SectionDivider color="rgba(24, 139, 246, 0.15)" />

      {/* Endless Educational Scroll Sections */}
      <CurriculumScroll />
      <SectionDivider color="rgba(246, 173, 85, 0.15)" />
      <CommunityScroll />
      <SectionDivider color="rgba(89, 182, 135, 0.15)" />
      <GamificationScroll />

      <SectionDivider color="rgba(44, 51, 69, 0.1)" />

      <PainToPowerScroll />

      <SectionDivider color="rgba(89, 182, 135, 0.15)" />

      {/* Tech Evolution — interaktīva laika skalas sekcija */}
      <TechEvolution />

      <SectionDivider color="rgba(246, 173, 85, 0.12)" />

      <Testimonials />
      <FAQ />
      <CheckoutSection />
      <CTA />
      <Footer />
    </main>
  );
}
