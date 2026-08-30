import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { dict } from "@/lib/i18n";
import { getLang } from "@/lib/i18n/server";
import { LangProvider } from "@/components/LangProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Kairo — 30 days of content, planned and produced",
    template: "%s · Kairo",
  },
  description:
    "Kairo turns your brand, products and goals into a complete 30-day marketing calendar. Strategy first, then every post designed, written and ready to download.",
  keywords: [
    "social media content calendar",
    "AI marketing plan",
    "brand content generator",
    "30 day content plan",
    "social media automation",
  ],
  openGraph: {
    title: "Kairo — 30 days of content, planned and produced",
    description:
      "A real marketing plan, not random posts. Kairo builds your 30-day calendar, designs every asset and writes every caption.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#07070B",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  const d = dict(lang);

  return (
    <html lang={lang} dir={d.dir} className={`${inter.variable} ${sora.variable}`}>
      <body className="antialiased">
        <LangProvider lang={lang}>{children}</LangProvider>
      </body>
    </html>
  );
}
