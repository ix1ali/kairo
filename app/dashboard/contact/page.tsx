import { currentUser } from "@/lib/auth";
import ContactForm from "@/components/dashboard/ContactForm";

export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const user = (await currentUser())!;

  return (
    <main className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
      <div className="mb-8">
        <p className="eyebrow">Support</p>
        <h1 className="display mt-2 text-3xl">Talk to a human.</h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[#55556B]">
          A person reads every message. If something in your month is wrong, say which day and what
          is wrong with it and we will fix it rather than telling you to regenerate.
        </p>
      </div>

      <ContactForm name={user.name} email={user.email} />
    </main>
  );
}
