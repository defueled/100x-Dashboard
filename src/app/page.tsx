import { Header } from "@/components/Header";
import { HeroCanvas } from "@/components/HeroCanvas";
import { DashboardSection } from "@/components/DashboardSection";
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
import { SocialProofRibbon } from "@/components/SocialProofRibbon";
import { InitialScroll } from "@/components/InitialScroll";
import { DashboardButton } from "@/components/DashboardButton";

export default function Home() {
  return (
    <main className="bg-[var(--color-background)] text-[var(--color-foreground)] min-h-screen selection:bg-brand-blue/30 selection:text-brand-dark relative">
      {/* Global Background Particles/Clouds */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[5%] left-[-5%] w-[50vw] h-[50vw] bg-brand-green/10 blur-[130px] rounded-full animate-float" />
        <div className="absolute bottom-[10%] right-[-10%] w-[60vw] h-[60vw] bg-brand-blue/10 blur-[150px] rounded-full animate-float-delayed" />
        <div className="fixed inset-0 bg-gradient-to-br from-brand-blue/5 via-transparent to-brand-green/5 animate-pulse-slow -z-10" />
      </div>

      <InitialScroll />
      <DashboardSection />

      <header id="main-nav" className="sticky top-0 z-50 flex justify-between items-center w-full px-4 md:px-6 py-4 bg-[var(--color-background)]/80 backdrop-blur-md border-b border-black/5">
        <div className="flex items-center gap-4 md:gap-6">
          <img src="/assets/logos/100x-refined-logo.png" alt="100X Logo" className="h-8 md:h-10 w-auto" />

          <DashboardButton />
        </div>

        <LoginButton />
      </header>
      <HeroCanvas />

      <SocialProofRibbon />

      <Description />

      {/* Endless Educational Scroll Sections */}
      <CurriculumScroll />
      <CommunityScroll />
      <GamificationScroll />
      <PainToPowerScroll />

      {/* Tech Evolution — interaktīva laika skalas sekcija */}
      <TechEvolution />

      <Testimonials />
      <FAQ />
      <CheckoutSection />
      <CTA />
      <Footer />
    </main>
  );
}
