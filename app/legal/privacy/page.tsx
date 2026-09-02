import LegalPage, { Clause } from "@/components/legal/LegalPage";
import { COMPANY, show } from "@/lib/legal";

export const metadata = {
  title: "Privacy Policy",
  description: "What data Koala collects, why we collect it, and who we share it with.",
};

function Row({ what, why }: { what: string; why: string }) {
  return (
    <div className="flex flex-col gap-1 border-t border-[#E7E7EF] py-3 sm:flex-row sm:gap-6">
      <p className="shrink-0 text-[14px] font-medium text-[#0B0B12] sm:w-56">{what}</p>
      <p className="text-[14px] leading-relaxed text-[#55556B]">{why}</p>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro="This explains what we collect, why we collect it, and who else sees it. We have kept it specific rather than vague — you should be able to tell exactly what happens to your data."
    >
      <Clause title="Who is responsible for your data">
        <p>
          {show(COMPANY.legalName)}, registered in {COMPANY.country} under commercial licence{" "}
          {show(COMPANY.licenceNumber)}, at {show(COMPANY.address)}, decides how your data is used
          and is responsible for it.
        </p>
        <p>For any privacy question, write to {show(COMPANY.privacyEmail)}.</p>
      </Clause>

      <Clause title="What we collect and why">
        <div className="mt-4">
          <Row
            what="Name and email"
            why="To create your account, sign you in, and send you service messages such as receipts and password resets."
          />
          <Row
            what="Password"
            why="Stored only as a scrypt hash. We cannot read your password, and we cannot recover it for you — only reset it."
          />
          <Row
            what="Brand details you enter"
            why="Your brand name, products, tone of voice, colours, goals and target audience. This is the input the strategy engine works from. Without it there is no calendar."
          />
          <Row
            what="Files you upload"
            why="Logos and product photos, used to produce your content. Stored in our file storage and referenced by your project."
          />
          <Row
            what="Generated content"
            why="The calendar, images, videos and captions we produce for you, kept in your account so you can come back to them."
          />
          <Row
            what="Payment records"
            why="Which plan you are on, renewal date, and a history of transactions. We record that a payment happened and for how much."
          />
          <Row
            what="Support messages"
            why="What you send us through the contact form, so we can answer you."
          />
          <Row
            what="Basic technical data"
            why="IP address and browser information from server logs, used to keep the service secure and to diagnose faults."
          />
        </div>
        <p className="mt-5">
          We do not sell your data. We do not use it to build advertising profiles. We do not share
          it with anyone except the providers listed below.
        </p>
      </Clause>

      <Clause title="Card details">
        <p>
          <strong>We never see or store your card number.</strong> Payments are handled by our
          payment provider on their own hosted page. We receive only a confirmation that a payment
          succeeded, the amount, and a reference — never the card itself.
        </p>
      </Clause>

      <Clause title="Who else processes your data">
        <p>
          Running Koala means using specialist providers. Each one only receives what it needs to do
          its job:
        </p>
        <div className="mt-4">
          <Row
            what="Hosting"
            why="Vercel Inc. hosts the application and runs the code that serves your requests."
          />
          <Row
            what="Database"
            why="Neon stores your account, projects, calendar and transaction records."
          />
          <Row
            what="File storage"
            why="Vercel Blob stores the logos and images you upload and the media we generate."
          />
          <Row
            what="Payments"
            why="Stripe processes card payments and holds the payment details we never see."
          />
          <Row
            what="AI providers"
            why="Your brand brief and prompts are sent to third-party AI models to generate images, video and captions. This is unavoidable — it is how the content gets made."
          />
          <Row
            what="Email"
            why="An email provider delivers account emails such as receipts and password resets."
          />
        </div>
      </Clause>

      <Clause title="Where your data goes">
        <p>
          Our hosting, storage and AI providers operate outside {COMPANY.country}, mainly in the
          United States and the European Union. Using Koala means your data is transferred to and
          processed in those countries.
        </p>
        <p>
          We choose providers that offer recognised safeguards for international transfers, such as
          standard contractual clauses.
        </p>
      </Clause>

      <Clause title="How long we keep it">
        <p>
          While your account is open, we keep your projects and generated content so you can use
          them.
        </p>
        <p>
          If you close your account, we delete your projects, uploads and generated content within
          30 days. We keep transaction records for as long as tax and accounting law requires, which
          is typically several years, because we are legally obliged to.
        </p>
      </Clause>

      <Clause title="Your rights">
        <p>You can ask us to:</p>
        <p>
          Show you the data we hold about you. Correct anything that is wrong. Delete your account
          and its content. Give you a copy of your data in a portable format. Stop processing your
          data in certain circumstances.
        </p>
        <p>
          Write to {show(COMPANY.privacyEmail)} and we will respond within 30 days. We may need to
          confirm your identity first.
        </p>
      </Clause>

      <Clause title="Cookies">
        <p>
          We use a small number of cookies, and none of them are for advertising or cross-site
          tracking:
        </p>
        <div className="mt-4">
          <Row
            what="Session cookie"
            why="Keeps you signed in. Signed, httpOnly, and required — the service cannot work without it."
          />
          <Row
            what="Language cookie"
            why="Remembers whether you chose English or Arabic."
          />
        </div>
      </Clause>

      <Clause title="Security">
        <p>
          Passwords are hashed with scrypt. Session cookies are signed, httpOnly, and unreadable by
          scripts in your browser. Traffic is encrypted with HTTPS. Data access is scoped per
          account, so one customer&rsquo;s requests cannot read another customer&rsquo;s records.
        </p>
        <p>
          No system is perfectly secure. If a breach affects your data, we will tell you and the
          relevant authority as the law requires.
        </p>
      </Clause>

      <Clause title="Children">
        <p>
          Koala is a business tool and is not intended for anyone under 18. We do not knowingly
          collect data from children. If you believe a child has given us data, contact us and we
          will delete it.
        </p>
      </Clause>

      <Clause title="Changes to this policy">
        <p>
          If we change how we use your data in a way that matters, we will tell you by email or in
          the dashboard before the change takes effect.
        </p>
      </Clause>

      <Clause title="Contact">
        <p>
          {show(COMPANY.legalName)}
          <br />
          {show(COMPANY.address)}
          <br />
          {show(COMPANY.privacyEmail)}
        </p>
      </Clause>
    </LegalPage>
  );
}
