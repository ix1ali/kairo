import Link from "next/link";
import { Logo } from "@/components/Logo";
import Koala from "@/components/Koala";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 text-center">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[24rem] w-[44rem] -translate-x-1/2 rounded-full bg-[#7C5CFF]/14 blur-[120px]" />
      <div className="relative">
        <Logo size={32} />
        <div className="mt-8 flex justify-center">
          <Koala size={160} mood="sleepy" />
        </div>
        <p className="display mt-2 text-6xl grad-text">404</p>
        <h1 className="display mt-4 text-2xl">This page is not in the plan.</h1>
        <p className="mx-auto mt-3 max-w-sm text-[14px] leading-relaxed text-[#7C7C90]">
          The link is wrong or the thing you are looking for has moved.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn btn-primary">Back to home</Link>
          <Link href="/dashboard" className="btn btn-ghost">Go to dashboard</Link>
        </div>
      </div>
    </div>
  );
}
