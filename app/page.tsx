import Link from "next/link";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";
import FAQ from "@/components/landing/FAQ";
import ChaosVsPlan from "@/components/landing/ChaosVsPlan";
import HowItWorks from "@/components/landing/HowItWorks";
import HeroImport from "@/components/landing/HeroImport";
import HeroStage from "@/components/landing/HeroStage";
import RevealHeadline from "@/components/landing/RevealHeadline";
import Savings from "@/components/landing/Savings";
import PlatformStrip from "@/components/landing/PlatformStrip";
import { PricingCards } from "@/components/landing/Pricing";
import Showcase from "@/components/landing/Showcase";
import Platforms from "@/components/landing/Platforms";
import Rivals from "@/components/landing/Rivals";
import Models from "@/components/landing/Models";
import Languages from "@/components/landing/Languages";
import Koala from "@/components/Koala";
import { Section, SectionHead, GUTTER } from "@/components/landing/Section";
import { Icon } from "@/components/icons/Ui";
import { dict } from "@/lib/i18n";
import { getLang } from "@/lib/i18n/server";

export default async function Home() {
  const t = dict(await getLang());

  return (
    <>
      <Nav />
      <main className="pt-16">
        {/* ============ 1. HERO ============ */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
          <div className="noise pointer-events-none absolute inset-0" />

          <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 sm:pt-16 lg:px-8 lg:pb-16 lg:pt-20">
            <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
              <div className="order-1">
                <span className="animate-rise inline-flex items-center gap-2 rounded-full border border-[#2A2438] bg-white/[0.05]/80 px-3 py-1.5 text-[11px] font-medium text-[#C9BEFF] backdrop-blur sm:px-3.5 sm:text-xs">
                  <Icon name="sparkle" size={13} filled />
                  {t.hero.badge}
                </span>

                <h1 className="display mt-5 text-[clamp(2.4rem,6.4vw,5rem)] leading-[0.98] text-balance sm:mt-6">
                  <RevealHeadline text={t.hero.line1} delay={80} />
                  <span className="mt-1 block">
                    <RevealHeadline text={t.hero.line2} wordClass="grad-text-soft" delay={340} />
                  </span>
                </h1>

                <p
                  className="animate-rise mt-4 max-w-md text-[15px] leading-relaxed text-[#9B9BAE] sm:mt-5 sm:text-[16px]"
                  style={{ animationDelay: "220ms" }}
                >
                  {t.hero.sub}
                </p>

                <div className="animate-rise mt-6 sm:mt-7" style={{ animationDelay: "340ms" }}>
                  <HeroImport />
                </div>
              </div>

              <div className="order-2">
                <HeroStage
                  chipPosted={t.hero.chipPosted}
                  chipPostedSub={t.hero.chipPostedSub}
                  chipReady={t.hero.chipReady}
                  chipReadySub={t.hero.chipReadySub}
                />
              </div>
            </div>
          </div>

          {/* full-bleed ticker so the rows run edge to edge */}
          <div className="relative pb-12 pt-2 sm:pb-16 sm:pt-4">
            <PlatformStrip />
          </div>
        </section>

        {/* ============ 2. WHERE IT GETS POSTED ============ */}
        <Section tone="raised">
          <Platforms />
        </Section>

        {/* ============ 3. THE POINT ============ */}
        <Section>
          <SectionHead
            eyebrow={t.difference.eyebrow}
            title={
              <>
                {t.difference.h1} <span className="text-[#7E7E93]">{t.difference.h2}</span>
              </>
            }
            sub={t.difference.sub}
          />
          <ChaosVsPlan />
        </Section>

        {/* ============ 4. HOW IT WORKS ============ */}
        <Section tone="raised" id="how">
          <SectionHead eyebrow={t.how.eyebrow} title={t.how.h1} />
          <HowItWorks />
          <div className="mt-14 border-t border-[#16161F] pt-12 sm:mt-16 sm:pt-14">
            <Rivals />
          </div>
        </Section>

        {/* ============ 5. PICK A FORMAT ============ */}
        <Section>
          <SectionHead
            eyebrow={t.showcase.eyebrow}
            title={t.showcase.h1}
            sub={t.showcase.sub}
          />
          <Showcase />
        </Section>

        {/* ============ 6. LANGUAGES ============ */}
        <Section tone="raised">
          <Languages />
        </Section>

        {/* ============ 7. THE MODELS ============ */}
        <Section>
          <Models />
        </Section>

        {/* ============ 8. WHAT THIS REPLACES ============ */}
        <Section tone="raised">
          <SectionHead eyebrow={t.savings.eyebrow} title={t.savings.h1} sub={t.savings.sub} />
          <Savings />
        </Section>

        {/* ============ 9. PRICING ============ */}
        <Section id="pricing">
          <SectionHead eyebrow={t.pricing.eyebrow} title={t.pricing.h1} sub={t.pricing.sub} />
          <PricingCards />
          <p className="mt-8 text-center text-[13px] text-[#7E7E93]">
            {t.pricing.creditsLink}{" "}
            <Link href="/pricing" className="text-[#7C5CFF] hover:text-[#C9BEFF]">
              {t.pricing.creditsLinkCta}
            </Link>
          </p>
        </Section>

        {/* ============ 10. FAQ ============ */}
        <Section tone="raised" id="faq">
          <SectionHead eyebrow={t.faq.eyebrow} title={t.faq.h1} />
          <FAQ />
        </Section>

        {/* ============ 11. CTA ============ */}
        <section className="relative overflow-hidden py-16 sm:py-24">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[24rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7C5CFF]/16 blur-[130px]" />
          <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
            <Koala sizeClass="h-[120px] w-[120px] sm:h-[150px] sm:w-[150px]" mood="wow" />
            <h2 className="display mt-5 text-[1.875rem] leading-[1.1] text-balance sm:mt-6 sm:text-4xl lg:text-5xl">
              {t.finalCta.h1}
            </h2>
            <p className="mx-auto mt-3.5 max-w-md text-[15px] leading-relaxed text-[#9B9BAE] sm:mt-4 sm:text-[15.5px]">
              {t.finalCta.sub}
            </p>
            <div className="mt-7 w-full sm:mt-8">
              <HeroImport compact />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
