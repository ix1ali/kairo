import Nav from "@/components/landing/Nav";
import Footer from "@/components/landing/Footer";
import { LEGAL_UPDATED } from "@/lib/legal";

/**
 * Shared shell for the policy pages.
 *
 * These are read by two audiences with opposite needs: a customer skimming for
 * one answer, and a payment-gateway reviewer checking that required clauses
 * exist. Both are served by plain headings and short paragraphs, so the prose
 * styles here stay deliberately unstyled beyond spacing and contrast.
 */

export function Clause({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10 scroll-mt-24" id={slug(title)}>
      <h2 className="display text-xl text-[#0B0B12] sm:text-2xl">{title}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-[#55556B]">{children}</div>
    </section>
  );
}

export function slug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function LegalPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <div className="relative overflow-hidden border-b border-[#E7E7EF]">
          <div className="pointer-events-none absolute inset-0 grid-bg opacity-50" />
          <div className="pointer-events-none absolute left-1/2 top-[-14rem] h-[26rem] w-[46rem] -translate-x-1/2 rounded-full bg-[#7C5CFF]/14 blur-[130px]" />
          <div className="relative mx-auto max-w-3xl px-5 pb-12 pt-16 sm:px-8">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="display mt-3 text-3xl sm:text-4xl">{title}</h1>
            <p className="mt-4 text-[15px] leading-relaxed text-[#55556B]">{intro}</p>
            <p className="mt-5 text-[13px] text-[#6E6E85]">Last updated {LEGAL_UPDATED}</p>
          </div>
        </div>

        <article className="mx-auto max-w-3xl px-5 pb-24 pt-4 sm:px-8">{children}</article>
      </main>
      <Footer />
    </>
  );
}
