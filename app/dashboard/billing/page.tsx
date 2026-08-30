import { Suspense } from "react";
import BillingClient from "@/components/dashboard/BillingClient";
import { currentUser } from "@/lib/auth";
import { read } from "@/lib/db";

export const metadata = { title: "Billing" };

export default async function BillingPage() {
  const user = (await currentUser())!;
  const db = read();
  const projectCount = db.projects.filter((p) => p.userId === user.id).length;
  const transactions = db.transactions
    .filter((t) => t.userId === user.id)
    .slice(-12)
    .reverse();

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <div className="mb-8">
        <p className="eyebrow">Billing</p>
        <h1 className="display mt-2 text-3xl">Plans and payments</h1>
      </div>

      <Suspense>
        <BillingClient
          currentPackage={user.packageId}
          status={user.subscriptionStatus}
          renewsAt={user.renewsAt}
          credits={user.credits}
          projectCount={projectCount}
        />
      </Suspense>

      {transactions.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#6E697E]">
            History
          </h2>
          <div className="panel divide-y divide-[#EDEAE4]">
            {transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <div>
                  <p className="text-[14px] font-medium text-[#141220]">{t.label}</p>
                  <p className="text-[12px] text-[#6E697E]">
                    {new Date(t.createdAt).toLocaleString()}
                    {t.credits > 0 ? ` · +${t.credits} credits` : ""}
                  </p>
                </div>
                <span className="text-[14px] font-semibold text-[#141220]">${t.amount}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
