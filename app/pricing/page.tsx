import Link from "next/link";
import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";
import FAQ from "@/components/landing/FAQ";
import Comparison from "@/components/landing/Comparison";
import { CreditsExplainer, PricingCards } from "@/components/landing/Pricing";
import { PACKAGES } from "@/lib/plans";

export const metadata = {
  title: "Pricing",
  description:
    "Three plans, three posting volumes. Every plan delivers a complete 30-day marketing campaign. No free trial.",
};

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
          <div className="pointer-events-none absolute left-1/2 top-[-12rem] h-[30rem] w-[60rem] -translate-x-1/2 rounded-full bg-[#6D4DF6]/16 blur-[130px]" />

          <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">Pricing</p>
              <h1 className="display mt-4 text-4xl sm:text-5xl lg:text-6xl">
                Pick your <span className="grad-text">posting volume</span>.
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-[#615D70]">
                Every plan includes the full strategy document, the competitor teardown and a
                complete 30-day calendar. The difference is how much you post — and whether you
                need video.
              </p>
            </div>

            <div className="mt-14">
              <PricingCards />
            </div>

            <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-[#E6E2DC] bg-white p-5 text-center">
              <p className="text-[13px] leading-relaxed text-[#6B6678]">
                <span className="font-semibold text-[#141220]">Why no free trial?</span> Koala does not
                hand you a sample — it hands you a finished month the moment you add a project.
                There is no meaningful half version. Cancel before your renewal if it is not for you.
              </p>
            </div>
          </div>
        </section>

        {/* volume comparison */}
        <section className="border-y border-[#E6E2DC] bg-[#F3F1EE] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 max-w-2xl">
              <p className="eyebrow">Daily rhythm</p>
              <h2 className="display mt-4 text-3xl sm:text-4xl">What each plan posts, day by day.</h2>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {PACKAGES.map((pkg) => (
                <div key={pkg.id} className="panel p-6">
                  <div className="flex items-baseline justify-between">
                    <h3 className="display text-xl">{pkg.name}</h3>
                    <span className="text-sm text-[#6E697E]">${pkg.price}/mo</span>
                  </div>
                  <div className="mt-5 space-y-2.5">
                    {pkg.slots.map((s, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-[#E6E2DC] bg-[#F3F1EE] px-4 py-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-[#141220]">{s.label}</span>
                          <span className="chip">{s.time}</span>
                        </div>
                        <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#6E697E]">
                          {s.intent}
                        </p>
                      </div>
                    ))}
                    {pkg.videosPerMonth > 0 && (
                      <div className="rounded-xl border border-[#0284C7]/30 bg-[#0284C7]/[0.06] px-4 py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-[#0E7490]">Video</span>
                          <span className="chip">every {pkg.videoEveryNDays} days</span>
                        </div>
                        <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#4B6E78]">
                          {pkg.videosPerMonth} scripted videos with shot lists and sound direction.
                        </p>
                      </div>
                    )}
                  </div>
                  <p className="mt-5 border-t border-[#EDEAE4] pt-4 text-[12px] text-[#6E697E]">
                    {pkg.totalPosts} posts + {pkg.videosPerMonth} videos per 30-day cycle across{" "}
                    {pkg.projects} project{pkg.projects > 1 ? "s" : ""}.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* comparison table */}
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="eyebrow">The honest comparison</p>
            <h2 className="display mt-4 text-3xl sm:text-4xl">One tool instead of five.</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[#615D70]">
              An agency does this well and charges accordingly. A generic AI tool is cheap and
              forgets your brand between chats. Koala sits deliberately in the middle.
            </p>
          </div>
          <Comparison />
        </section>

        {/* credits */}
        <section className="border-y border-[#E6E2DC] bg-[#F3F1EE] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 max-w-2xl">
              <p className="eyebrow">Credits</p>
              <h2 className="display mt-4 text-3xl sm:text-4xl">Change anything you want.</h2>
            </div>
            <CreditsExplainer />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="eyebrow">Questions</p>
            <h2 className="display mt-4 text-3xl sm:text-4xl">Straight answers.</h2>
          </div>
          <FAQ />

          <div className="mt-16 text-center">
            <Link href="/signup" className="btn btn-primary px-7 py-3.5 text-base">
              Start building your month
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
