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
import Showcase, { type ShowcaseCard } from "@/components/landing/Showcase";
import ContentTypes from "@/components/landing/ContentTypes";
import Languages from "@/components/landing/Languages";
import Koala from "@/components/Koala";
import { Icon, type IconName } from "@/components/icons/Ui";
import { demoPlan, showcaseSamples } from "@/lib/demoSample";
import { renderPosterSVG } from "@/lib/render/poster";
import { dict } from "@/lib/i18n";
import { getLang } from "@/lib/i18n/server";
import { CATEGORIES } from "@/lib/strategy/categories";

const IN_EVERY_POST: { icon: IconName; title: string; body: string }[] = [
  { icon: "image", title: "A finished image", body: "Sized for the platform, built from your palette. Download and post." },
  { icon: "text", title: "The caption", body: "A real hook and a reason to act, not a wall of adjectives." },
  { icon: "hash", title: "Hashtags", body: "Mixed across reach, niche and community. Counts adapt per platform." },
  { icon: "clock", title: "When to post", body: "The slot is chosen, not guessed. Morning value, evening offer." },
  { icon: "target", title: "Why it exists", body: "Every day has a job: get seen, build trust, sell, or keep them." },
  { icon: "video", title: "Video scripts", body: "On Studio: timed shot lists, sound direction and a loop cue." },
];


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

  const showcase: ShowcaseCard[] = showcaseSamples().flatMap(({ project: brand, posts: brandPosts }) =>
    brandPosts.map((post) => ({
      id: post.id,
      brand: brand.name,
      tagline: brand.tagline,
      category: CATEGORIES[brand.category]?.label ?? brand.category,
      contentType: post.contentTypeName,
      accent: brand.colors.primary,
      svg: renderPosterSVG(post, brand, null),
    }))
  );

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
        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
          <div className="pointer-events-none absolute left-1/2 top-[-16rem] h-[36rem] w-[70rem] -translate-x-1/2 rounded-full bg-[#7C5CFF]/14 blur-[140px]" />

          <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-14 sm:px-8 sm:pt-20">
            <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#2A2438] bg-[#12101C]/80 px-3.5 py-1.5 text-xs font-medium text-[#B9AEE8] backdrop-blur">
                  <Icon name="sparkle" size={13} filled />
                  {t.hero.badge}
                </span>

                <h1 className="display mt-6 text-[2.5rem] leading-[1.02] text-balance sm:text-[3rem] lg:text-[3.5rem]">
                  <RevealHeadline text={t.hero.line1} delay={80} />
                  <span className="mt-1 block">
                    <RevealHeadline text={t.hero.line2} wordClass="grad-text-soft" delay={340} />
                  </span>
                </h1>

                <p className="mt-5 max-w-md text-[16px] leading-relaxed text-[#9B9BAE]">
                  {t.hero.sub}
                </p>

                <div className="mt-7">
                  <HeroImport />
                </div>

              </div>

              {/* koala + floating cards */}
              <div className="relative mx-auto w-full max-w-[420px] py-6">
                <div className="pointer-events-none absolute inset-0 grid place-items-center">
                  <div className="h-72 w-72 rounded-full bg-[#7C5CFF]/18 blur-[80px]" />
                </div>

                <div className="flex justify-center">
                  <Koala size={320} mood="happy" className="relative z-10" />
                </div>

                {/* floating proof chips */}
                <div className="absolute -left-6 top-0 z-20 hidden animate-floaty rounded-2xl border border-[#22222E] bg-[#0C0C13]/90 px-3.5 py-2.5 backdrop-blur sm:block">
                  <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#C8F751]/15 text-[#C8F751]">
                      <Icon name="check" size={13} strokeWidth={3} />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold text-white">{t.hero.chipPosted}</p>
                      <p className="text-[10px] text-[#5B5B70]">{t.hero.chipPostedSub}</p>
                    </div>
                  </div>
                </div>

                <div
                  className="absolute -right-6 bottom-0 z-20 hidden animate-floaty rounded-2xl border border-[#22222E] bg-[#0C0C13]/90 px-3.5 py-2.5 backdrop-blur sm:block"
                  style={{ animationDelay: "1.4s" }}
                >
                  <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#7C5CFF]/18 text-[#A78BFA]">
                      <Icon name="calendar" size={13} />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold text-white">{t.hero.chipReady}</p>
                      <p className="text-[10px] text-[#5B5B70]">{t.hero.chipReadySub}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* full-bleed ticker so the rows run edge to edge */}
          <div className="relative pb-16 pt-4">
            <PlatformStrip />
          </div>
        </section>

        {/* ================= THE POINT ================= */}
        <section className="border-y border-[#14141C] bg-[#09090F] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="eyebrow">{t.difference.eyebrow}</p>
              <h2 className="display mt-4 text-3xl sm:text-[2.75rem]">
                {t.difference.h1} <span className="text-[#6C6C80]">{t.difference.h2}</span>
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[#8A8A9E]">
                {t.difference.sub}
              </p>
            </div>

            <ChaosVsPlan />
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section id="how" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="eyebrow">{t.how.eyebrow}</p>
            <h2 className="display mt-4 text-3xl sm:text-[2.75rem]">{t.how.h1}</h2>
          </div>
          <HowItWorks />
        </section>

        {/* ================= SHOWCASE ================= */}
        <section className="border-y border-[#14141C] bg-[#09090F] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mb-10 max-w-2xl">
              <p className="eyebrow">{t.showcase.eyebrow}</p>
              <h2 className="display mt-4 text-3xl sm:text-[2.75rem]">{t.showcase.h1}</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[#8A8A9E]">
                {t.showcase.sub}
              </p>
            </div>
            <Showcase cards={showcase} />
          </div>
        </section>

        {/* ================= IN EVERY POST ================= */}
        <section className="border-y border-[#14141C] bg-[#09090F] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="eyebrow">{t.everyPost.eyebrow}</p>
              <h2 className="display mt-4 text-3xl sm:text-[2.75rem]">{t.everyPost.h1}</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {IN_EVERY_POST.map((f, i) => (
                <div
                  key={f.title}
                  className="group rounded-2xl border border-[#1E1E28] bg-white/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#3A3355] hover:bg-white/[0.045]"
                >
                  <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[#7C5CFF]/25 to-[#22D3EE]/12 text-[#A78BFA] transition-transform duration-300 group-hover:scale-110">
                    <Icon name={f.icon} size={20} />
                  </span>
                  <p className="display text-lg">{t.everyPost.items[i].title}</p>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-[#7C7C90]">
                    {t.everyPost.items[i].body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= CONTENT STRATEGIES ================= */}
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <ContentTypes />
        </section>

        {/* ================= LIVE DEMO ================= */}
        <section id="plan" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <p className="eyebrow">{t.demo.eyebrow}</p>
              <h2 className="display mt-4 text-3xl sm:text-[2.75rem]">Click any day.</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[#8A8A9E]">
                This is a genuine plan for a sample coffee brand, built by the same engine that runs
                your account.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-[#1E1E28] bg-white/[0.02] px-4 py-3">
              <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#E4732B] to-[#F2C14E]" />
              <div>
                <p className="text-sm font-semibold text-white">{project.name}</p>
                <p className="text-[11px] text-[#5B5B70]">{project.tagline}</p>
              </div>
            </div>
          </div>

          <CalendarDemo posts={demoPosts} previews={previews} />

          <div className="mt-10">
            <p className="eyebrow mb-4">{t.demo.oneLook}</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {gallery.map((p) => (
                <div
                  key={p.id}
                  className="overflow-hidden rounded-xl border border-[#1E1E28] bg-black transition-transform duration-300 hover:-translate-y-1 hover:border-[#3A3355] [&>svg]:h-auto [&>svg]:w-full"
                  dangerouslySetInnerHTML={{ __html: previews[p.id] }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ================= LANGUAGES ================= */}
        <section className="border-y border-[#14141C] bg-[#09090F] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Languages />
          </div>
        </section>

        {/* ================= SAVINGS ================= */}
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="eyebrow">{t.savings.eyebrow}</p>
            <h2 className="display mt-4 text-3xl sm:text-[2.75rem]">
              {t.savings.h1}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[#8A8A9E]">
              {t.savings.sub}
            </p>
          </div>
          <Savings />
        </section>

        {/* ================= PRICING ================= */}
        <section id="pricing" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="eyebrow">{t.pricing.eyebrow}</p>
            <h2 className="display mt-4 text-3xl sm:text-[2.75rem]">{t.pricing.h1}</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[#8A8A9E]">
              {t.pricing.sub}
            </p>
          </div>
          <PricingCards />
          <p className="mt-8 text-center text-[13px] text-[#5B5B70]">
            {t.pricing.creditsLink}{" "}
            <Link href="/pricing" className="text-[#A78BFA] hover:text-[#C4B5FD]">
              {t.pricing.creditsLinkCta}
            </Link>
          </p>
        </section>

        {/* ================= FAQ ================= */}
        <section id="faq" className="border-t border-[#14141C] bg-[#09090F] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="eyebrow">{t.faq.eyebrow}</p>
              <h2 className="display mt-4 text-3xl sm:text-[2.75rem]">{t.faq.h1}</h2>
            </div>
            <FAQ />
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="relative overflow-hidden py-24">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[24rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7C5CFF]/16 blur-[130px]" />
          <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 text-center sm:px-8">
            <Koala size={150} mood="wow" />
            <h2 className="display mt-6 text-4xl sm:text-5xl">{t.finalCta.h1}</h2>
            <p className="mx-auto mt-4 max-w-md text-[15.5px] leading-relaxed text-[#9B9BAE]">
              {t.finalCta.sub}
            </p>
            <div className="mt-8">
              <HeroImport compact />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
