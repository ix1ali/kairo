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
import { CATEGORIES } from "@/lib/strategy/categories";

const IN_EVERY_POST: { icon: IconName; title: string; body: string }[] = [
  { icon: "image", title: "A finished image", body: "Sized for the platform, built from your palette. Download and post." },
  { icon: "text", title: "The caption", body: "A real hook and a reason to act, not a wall of adjectives." },
  { icon: "hash", title: "Hashtags", body: "Mixed across reach, niche and community. Counts adapt per platform." },
  { icon: "clock", title: "When to post", body: "The slot is chosen, not guessed. Morning value, evening offer." },
  { icon: "target", title: "Why it exists", body: "Every day has a job: get seen, build trust, sell, or keep them." },
  { icon: "video", title: "Video scripts", body: "On Studio: timed shot lists, sound direction and a loop cue." },
];


export default function Home() {
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
                  Meet Kai, your content koala
                </span>

                <h1 className="display mt-6 text-[2.5rem] leading-[1.02] text-balance sm:text-[3rem] lg:text-[3.5rem]">
                  <RevealHeadline text="A whole month of content." delay={80} />
                  <span className="grad-text-soft mt-1 block">
                    <RevealHeadline text="Done in a minute." delay={340} />
                  </span>
                </h1>

                <p className="mt-5 max-w-md text-[16px] leading-relaxed text-[#9B9BAE]">
                  Paste your store link. Kai learns your brand, writes a real marketing plan, and
                  hands you 30 days of posts — designed, written and ready to publish.
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
                      <p className="text-[11px] font-semibold text-white">Day 12 posted</p>
                      <p className="text-[10px] text-[#5B5B70]">18 of 30 done</p>
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
                      <p className="text-[11px] font-semibold text-white">30 days ready</p>
                      <p className="text-[10px] text-[#5B5B70]">Strategy included</p>
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
              <p className="eyebrow">The difference</p>
              <h2 className="display mt-4 text-3xl sm:text-[2.75rem]">
                Most brands post. <span className="text-[#6C6C80]">Few brands plan.</span>
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[#8A8A9E]">
                Thirty unrelated posts fill a grid. Thirty planned posts build a customer.
              </p>
            </div>

            <ChaosVsPlan />
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section id="how" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="eyebrow">How it works</p>
            <h2 className="display mt-4 text-3xl sm:text-[2.75rem]">Four steps. One finished month.</h2>
          </div>
          <HowItWorks />
        </section>

        {/* ================= SHOWCASE ================= */}
        <section className="border-y border-[#14141C] bg-[#09090F] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mb-10 max-w-2xl">
              <p className="eyebrow">Made by Kairo</p>
              <h2 className="display mt-4 text-3xl sm:text-[2.75rem]">Six brands. One engine.</h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[#8A8A9E]">
                Every card below was generated from a brand brief — palette, voice, products — with
                nothing edited afterwards. Different industry, different look, same thirty-day logic
                underneath.
              </p>
            </div>
            <Showcase cards={showcase} />
          </div>
        </section>

        {/* ================= IN EVERY POST ================= */}
        <section className="border-y border-[#14141C] bg-[#09090F] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="eyebrow">What you get</p>
              <h2 className="display mt-4 text-3xl sm:text-[2.75rem]">Every day arrives finished.</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {IN_EVERY_POST.map((f) => (
                <div
                  key={f.title}
                  className="group rounded-2xl border border-[#1E1E28] bg-white/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#3A3355] hover:bg-white/[0.045]"
                >
                  <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[#7C5CFF]/25 to-[#22D3EE]/12 text-[#A78BFA] transition-transform duration-300 group-hover:scale-110">
                    <Icon name={f.icon} size={20} />
                  </span>
                  <p className="display text-lg">{f.title}</p>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-[#7C7C90]">{f.body}</p>
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
              <p className="eyebrow">A real month, generated live</p>
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
            <p className="eyebrow mb-4">One look, all thirty days</p>
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
            <p className="eyebrow">The maths</p>
            <h2 className="display mt-4 text-3xl sm:text-[2.75rem]">
              What this replaces.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[#8A8A9E]">
              A designer, a copywriter, an editor and a strategist — for one month of content.
              Change the rates to match what you actually pay.
            </p>
          </div>
          <Savings />
        </section>

        {/* ================= PRICING ================= */}
        <section id="pricing" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="eyebrow">Pricing</p>
            <h2 className="display mt-4 text-3xl sm:text-[2.75rem]">Pick your posting volume.</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[#8A8A9E]">
              Every plan delivers a complete 30-day campaign the moment you add a brand.
            </p>
          </div>
          <PricingCards />
          <p className="mt-8 text-center text-[13px] text-[#5B5B70]">
            Need to change a post?{" "}
            <Link href="/pricing" className="text-[#A78BFA] hover:text-[#C4B5FD]">
              Credits let you rebuild anything →
            </Link>
          </p>
        </section>

        {/* ================= FAQ ================= */}
        <section id="faq" className="border-t border-[#14141C] bg-[#09090F] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="eyebrow">Questions</p>
              <h2 className="display mt-4 text-3xl sm:text-[2.75rem]">Straight answers.</h2>
            </div>
            <FAQ />
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="relative overflow-hidden py-24">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[24rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7C5CFF]/16 blur-[130px]" />
          <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 text-center sm:px-8">
            <Koala size={150} mood="wow" />
            <h2 className="display mt-6 text-4xl sm:text-5xl">Stop deciding what to post.</h2>
            <p className="mx-auto mt-4 max-w-md text-[15.5px] leading-relaxed text-[#9B9BAE]">
              Give Kai your link once. Get a strategy, a calendar and thirty finished posts.
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
