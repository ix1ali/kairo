import Link from "next/link";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";
import FAQ from "@/components/landing/FAQ";
import ChaosVsPlan from "@/components/landing/ChaosVsPlan";
import HowItWorks from "@/components/landing/HowItWorks";
import HeroImport from "@/components/landing/HeroImport";
import RevealHeadline from "@/components/landing/RevealHeadline";
import Savings from "@/components/landing/Savings";
import PlatformStrip from "@/components/landing/PlatformStrip";
import { PricingCards } from "@/components/landing/Pricing";
import CalendarDemo, { type DemoPost } from "@/components/landing/CalendarDemo";
import VideoWall from "@/components/landing/VideoWall";
import ImageWall from "@/components/landing/ImageWall";
import FromOnePhoto from "@/components/landing/FromOnePhoto";
import VideoOptions from "@/components/landing/VideoOptions";
import Models from "@/components/landing/Models";
import ContentTypes from "@/components/landing/ContentTypes";
import Languages from "@/components/landing/Languages";
import Koala from "@/components/Koala";
import { Section, SectionHead, GUTTER } from "@/components/landing/Section";
import { Icon, type IconName } from "@/components/icons/Ui";
import { demoPlan } from "@/lib/demoSample";
import { renderPosterSVG } from "@/lib/render/poster";
import { dict } from "@/lib/i18n";
import { getLang } from "@/lib/i18n/server";

const POST_ICONS: IconName[] = ["image", "text", "hash", "clock", "target", "video"];

export default async function Home() {
  const t = dict(await getLang());
  const { project, posts } = demoPlan();

  const demoPosts: DemoPost[] = posts.map((p) => ({
    id: p.id,
    day: p.day,
    pillar: p.pillar,
    funnel: p.funnel,
    format: p.format,
    platform: p.platform,
    timeOfDay: p.timeOfDay,
    theme: p.theme,
    hook: p.hook,
    caption: p.caption,
    hashtags: p.hashtags,
    visualDirection: p.visualDirection,
    productName: p.productName,
  }));

  const previews: Record<string, string> = {};
  for (const p of posts) previews[p.id] = renderPosterSVG(p, project, null);
  // Keep the strip to one aspect ratio so the row reads as a single set.
  const gallery = posts
    .filter((p) => p.format !== "reel" && p.format !== "video" && p.format !== "story")
    .filter((_, i) => i % 2 === 0)
    .slice(0, 5);

  return (
    <>
      <Nav />
      <main className="pt-16">
        {/* ============ 1. HERO ============ */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
          <div className="pointer-events-none absolute left-1/2 top-[-16rem] h-[36rem] w-[70rem] -translate-x-1/2 rounded-full bg-[#6D4DF6]/14 blur-[140px]" />

          <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 sm:pt-16 lg:px-8 lg:pb-16 lg:pt-20">
            <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
              <div className="order-1">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#DED6F2] bg-[#F3F1EE]/80 px-3 py-1.5 text-[11px] font-medium text-[#5B3FE0] backdrop-blur sm:px-3.5 sm:text-xs">
                  <Icon name="sparkle" size={13} filled />
                  {t.hero.badge}
                </span>

                <h1 className="display mt-5 text-[2rem] leading-[1.05] text-balance sm:mt-6 sm:text-[2.75rem] lg:text-[3.5rem] lg:leading-[1.02]">
                  <RevealHeadline text={t.hero.line1} delay={80} />
                  <span className="mt-1 block">
                    <RevealHeadline text={t.hero.line2} wordClass="grad-text-soft" delay={340} />
                  </span>
                </h1>

                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#615D70] sm:mt-5 sm:text-[16px]">
                  {t.hero.sub}
                </p>

                <div className="mt-6 sm:mt-7">
                  <HeroImport />
                </div>
              </div>

              {/* koala + floating cards */}
              <div className="relative order-2 mx-auto w-full max-w-[420px] py-2 sm:py-6">
                <div className="pointer-events-none absolute inset-0 grid place-items-center">
                  <div className="h-48 w-48 rounded-full bg-[#6D4DF6]/18 blur-[80px] sm:h-72 sm:w-72" />
                </div>

                <div className="flex justify-center">
                  <Koala
                    sizeClass="h-[190px] w-[190px] sm:h-[260px] sm:w-[260px] lg:h-[320px] lg:w-[320px]"
                    mood="happy"
                    className="relative z-10"
                  />
                </div>

                <div className="absolute -left-2 top-0 z-20 hidden animate-floaty rounded-2xl border border-[#DCD7CF] bg-[#FFFFFF]/90 px-3.5 py-2.5 backdrop-blur sm:block lg:-left-6">
                  <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#357A38]/15 text-[#357A38]">
                      <Icon name="check" size={13} strokeWidth={3} />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold text-[#141220]">{t.hero.chipPosted}</p>
                      <p className="text-[10px] text-[#6E697E]">{t.hero.chipPostedSub}</p>
                    </div>
                  </div>
                </div>

                <div
                  className="absolute -right-2 bottom-0 z-20 hidden animate-floaty rounded-2xl border border-[#DCD7CF] bg-[#FFFFFF]/90 px-3.5 py-2.5 backdrop-blur sm:block lg:-right-6"
                  style={{ animationDelay: "1.4s" }}
                >
                  <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-xl bg-[#6D4DF6]/18 text-[#6D4DF6]">
                      <Icon name="calendar" size={13} />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold text-[#141220]">{t.hero.chipReady}</p>
                      <p className="text-[10px] text-[#6E697E]">{t.hero.chipReadySub}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* full-bleed ticker so the rows run edge to edge */}
          <div className="relative pb-12 pt-2 sm:pb-16 sm:pt-4">
            <PlatformStrip />
          </div>
        </section>

        {/* ============ 2. THE POINT ============ */}
        <Section tone="raised">
          <SectionHead
            eyebrow={t.difference.eyebrow}
            title={
              <>
                {t.difference.h1} <span className="text-[#6E697E]">{t.difference.h2}</span>
              </>
            }
            sub={t.difference.sub}
          />
          <ChaosVsPlan />
        </Section>

        {/* ============ 3. HOW IT WORKS ============ */}
        <Section id="how">
          <SectionHead eyebrow={t.how.eyebrow} title={t.how.h1} />
          <HowItWorks />
        </Section>

        {/* ============ 4. UGC VIDEO WALL ============ */}
        <Section tone="raised" bleed>
          <div className={GUTTER}>
            <SectionHead
              eyebrow={t.wall.videoEyebrow}
              title={t.wall.videoH1}
              sub={t.wall.videoSub}
              align="start"
            />
          </div>
          <VideoWall />
        </Section>

        {/* ============ 5. ONE PHOTO, FOUR POSTS ============ */}
        <Section>
          <FromOnePhoto />
        </Section>

        {/* ============ 6. THE STILLS, ON THEIR OWN ============ */}
        <Section tone="raised" bleed>
          <div className={GUTTER}>
            <SectionHead
              eyebrow={t.wall.stillsEyebrow}
              title={t.wall.stillsH1}
              sub={t.wall.stillsSub}
            />
          </div>
          <ImageWall />
        </Section>

        {/* ============ 7. IN EVERY POST ============ */}
        <Section>
          <SectionHead eyebrow={t.everyPost.eyebrow} title={t.everyPost.h1} />
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {t.everyPost.items.map((item, i) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-[#E6E2DC] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#C6B8F5] hover:bg-[#F3F1EE] sm:p-6"
              >
                <span className="mb-3.5 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#6D4DF6]/25 to-[#0284C7]/12 text-[#6D4DF6] transition-transform duration-300 group-hover:scale-110 sm:mb-4 sm:h-11 sm:w-11">
                  <Icon name={POST_ICONS[i]} size={19} />
                </span>
                <p className="display text-[17px] sm:text-lg">{item.title}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-[#6B6678] sm:text-[13.5px]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* ============ 8. VIDEO, YOUR WAY ============ */}
        <Section tone="raised">
          <VideoOptions />
        </Section>

        {/* ============ 9. CONTENT STRATEGIES ============ */}
        <Section>
          <ContentTypes />
        </Section>

        {/* ============ 10. LIVE DEMO ============ */}
        <Section id="plan" tone="raised">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-5 sm:mb-12">
            <SectionHead
              align="start"
              className="mb-0 max-w-xl"
              eyebrow={t.demo.eyebrow}
              title={
                <>
                  {t.demo.h1}
                  <span className="grad-text-soft"> {t.demo.h2}</span>
                </>
              }
              sub={t.demo.sub}
            />
            <div className="flex items-center gap-3 rounded-2xl border border-[#E6E2DC] bg-white px-4 py-3">
              <span className="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br from-[#E4732B] to-[#F2C14E]" />
              <div>
                <p className="text-sm font-semibold text-[#141220]">{project.name}</p>
                <p className="text-[11px] text-[#6E697E]">{project.tagline}</p>
              </div>
            </div>
          </div>

          <CalendarDemo posts={demoPosts} previews={previews} />

          <div className="mt-9 sm:mt-10">
            <p className="eyebrow mb-4">{t.demo.oneLook}</p>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
              {gallery.map((p) => (
                <div
                  key={p.id}
                  className="overflow-hidden rounded-xl border border-[#E6E2DC] bg-[#F3F1EE] transition-transform duration-300 hover:-translate-y-1 hover:border-[#C6B8F5] [&>svg]:h-auto [&>svg]:w-full"
                  dangerouslySetInnerHTML={{ __html: previews[p.id] }}
                />
              ))}
            </div>
          </div>
        </Section>

        {/* ============ 11. LANGUAGES ============ */}
        <Section>
          <Languages />
        </Section>

        {/* ============ 12. THE MODELS ============ */}
        <Section tone="raised">
          <Models />
        </Section>

        {/* ============ 13. WHAT THIS REPLACES ============ */}
        <Section>
          <SectionHead eyebrow={t.savings.eyebrow} title={t.savings.h1} sub={t.savings.sub} />
          <Savings />
        </Section>

        {/* ============ 14. PRICING ============ */}
        <Section id="pricing" tone="raised">
          <SectionHead eyebrow={t.pricing.eyebrow} title={t.pricing.h1} sub={t.pricing.sub} />
          <PricingCards />
          <p className="mt-8 text-center text-[13px] text-[#6E697E]">
            {t.pricing.creditsLink}{" "}
            <Link href="/pricing" className="text-[#6D4DF6] hover:text-[#5B3FE0]">
              {t.pricing.creditsLinkCta}
            </Link>
          </p>
        </Section>

        {/* ============ 15. FAQ ============ */}
        <Section id="faq">
          <SectionHead eyebrow={t.faq.eyebrow} title={t.faq.h1} />
          <FAQ />
        </Section>

        {/* ============ 16. CTA ============ */}
        <section className="relative overflow-hidden border-t border-[#E6E2DC] bg-[#F3F1EE] py-16 sm:py-24">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[24rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6D4DF6]/16 blur-[130px]" />
          <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
            <Koala sizeClass="h-[120px] w-[120px] sm:h-[150px] sm:w-[150px]" mood="wow" />
            <h2 className="display mt-5 text-[1.875rem] leading-[1.1] text-balance sm:mt-6 sm:text-4xl lg:text-5xl">
              {t.finalCta.h1}
            </h2>
            <p className="mx-auto mt-3.5 max-w-md text-[15px] leading-relaxed text-[#615D70] sm:mt-4 sm:text-[15.5px]">
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
