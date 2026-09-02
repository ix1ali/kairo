import LegalPage, { Clause } from "@/components/legal/LegalPage";
import { COMPANY, show } from "@/lib/legal";
import { PACKAGES } from "@/lib/plans";

export const metadata = {
  title: "Terms of Service",
  description: "The agreement between you and Koala when you use the service.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      intro="These terms are the agreement between you and us when you use Koala. We have written them in plain language on purpose. If something here is unclear, ask us before you subscribe."
    >
      <Clause title="Who you are dealing with">
        <p>
          Koala is operated by {show(COMPANY.legalName)}, a company registered in {COMPANY.country}{" "}
          under commercial licence {show(COMPANY.licenceNumber)}, with its registered office at{" "}
          {show(COMPANY.address)}.
        </p>
        <p>
          In these terms, &ldquo;we&rdquo;, &ldquo;us&rdquo; and &ldquo;Koala&rdquo; mean that
          company. &ldquo;You&rdquo; means the person or business using the service.
        </p>
        <p>
          You can reach us at {show(COMPANY.supportEmail)} or through the contact form in your
          dashboard.
        </p>
      </Clause>

      <Clause title="What Koala does">
        <p>
          Koala builds a 30-day marketing plan for your brand and produces the content to go with
          it: images, short videos and captions, arranged into a calendar you can download and post.
        </p>
        <p>
          Koala <strong>does not post to your social accounts for you</strong>, and does not connect
          to them. You download what we produce and publish it yourself, wherever you choose.
        </p>
        <p>
          Content is produced using artificial intelligence. That means results vary between
          generations, and you should review everything before you publish it. See{" "}
          <a className="text-[#5B3FE0] underline" href="#ai-generated-content">
            AI-generated content
          </a>{" "}
          below.
        </p>
      </Clause>

      <Clause title="Your account">
        <p>
          You need an account to use Koala. You must give accurate details, keep your password
          private, and tell us promptly if you think someone else has access.
        </p>
        <p>
          You are responsible for everything that happens under your account. You must be at least
          18 years old, and if you are signing up for a business you must be authorised to accept
          these terms on its behalf.
        </p>
        <p>One account per customer. Do not share, sell or transfer your account.</p>
      </Clause>

      <Clause title="Plans, billing and renewal">
        <p>
          Koala is sold as a monthly subscription. Current plans are{" "}
          {PACKAGES.map((p, i) => (
            <span key={p.id}>
              {i > 0 ? (i === PACKAGES.length - 1 ? " and " : ", ") : ""}
              <strong>
                {p.name} at ${p.price} per month
              </strong>
            </span>
          ))}
          . Prices are shown on the pricing page and are exclusive of any taxes that may apply.
        </p>
        <p>
          <strong>There is no free trial.</strong> Your first full 30-day calendar is generated as
          soon as you add a brand, which is why the service is paid from the start.
        </p>
        <p>
          Your subscription renews automatically every month until you cancel. We charge the payment
          method on file on each renewal date. If a charge fails, we may retry it and may suspend
          your access until payment succeeds.
        </p>
        <p>
          Each plan includes a monthly allowance of credits. Credits are only needed when you ask us
          to rebuild something differently — never to receive the calendar your plan already
          includes. Credits included with a plan expire at the end of each billing month. Credits
          bought separately as a top-up pack do not expire while your account is active.
        </p>
        <p>
          We may change our prices. If we do, we will tell you at least 30 days before the change
          affects you, and you may cancel before it takes effect.
        </p>
      </Clause>

      <Clause title="Cancelling and refunds">
        <p>
          You can cancel at any time from the billing page in your dashboard. Cancelling stops the
          next renewal. You keep access until the end of the period you have already paid for.
        </p>
        <p>
          Refunds are covered by our{" "}
          <a className="text-[#5B3FE0] underline" href="/legal/refund">
            Refund Policy
          </a>
          , which forms part of these terms.
        </p>
      </Clause>

      <Clause title="Who owns the content">
        <p>
          <strong>You own the content Koala produces for you.</strong> Once your subscription is
          paid, you may use the images, videos and captions we generate for your brand commercially:
          post them, advertise with them, print them, edit them.
        </p>
        <p>
          You keep ownership of everything you give us — your logo, product photos, brand name and
          any other material you upload. You grant us permission to use those materials only to
          produce your content and run the service.
        </p>
        <p>
          We own Koala itself: the software, the strategy engine, the designs of the product, and
          our brand. Nothing here gives you rights to those.
        </p>
        <p>
          We may show anonymised examples of output in our marketing. We will not use your brand
          name, logo or recognisable products for that without asking you first.
        </p>
      </Clause>

      <Clause title="AI-generated content">
        <p>
          Koala uses third-party AI models to generate images, video and text. This has consequences
          you should understand before you publish anything:
        </p>
        <p>
          <strong>Review everything.</strong> AI output can contain factual errors, awkward text,
          distorted details in images, or claims about your product that are not true. You are
          responsible for what you publish. Check every post before it goes out.
        </p>
        <p>
          <strong>Similar output is possible.</strong> AI models can produce similar results for
          similar inputs. We cannot guarantee that content generated for you is unique, and we
          cannot guarantee it is eligible for copyright protection in every country.
        </p>
        <p>
          <strong>You are responsible for compliance.</strong> If your industry regulates
          advertising claims — health, medical, financial, food, cosmetics — you must confirm that
          the content meets those rules before publishing. Koala does not provide legal, medical or
          financial advice.
        </p>
        <p>
          <strong>Platform rules still apply.</strong> Instagram, TikTok, Snapchat and others have
          their own rules, including rules about labelling AI-generated content. Following them is
          your responsibility.
        </p>
      </Clause>

      <Clause title="What you may not do">
        <p>You agree not to use Koala to:</p>
        <p>
          Create content that is illegal, hateful, harassing, sexually explicit, or that promotes
          violence or self-harm. Impersonate a real person or business you do not represent. Produce
          misleading claims, fake reviews or fake endorsements. Infringe someone else&rsquo;s
          trademark, copyright or likeness. Generate content involving minors in any sexual or
          exploitative context.
        </p>
        <p>
          You also agree not to resell or white-label Koala without a written agreement with us, not
          to attempt to extract our prompts, models or strategy logic, not to use automated tools to
          scrape the service, and not to work around usage limits.
        </p>
        <p>
          We may suspend or close an account that breaks these rules. Where the breach is serious or
          illegal, we may do so without notice and without a refund.
        </p>
      </Clause>

      <Clause title="Availability">
        <p>
          We work to keep Koala running, but we do not promise uninterrupted service. We may take
          the service down for maintenance, and parts of it depend on third-party providers whose
          outages are outside our control.
        </p>
        <p>
          Generation depends on external AI providers. If a provider is unavailable, generation may
          fail or be delayed. Where a generation fails, we do not charge credits for it.
        </p>
      </Clause>

      <Clause title="Our liability">
        <p>
          Koala is a content production tool. We do not promise that using it will increase your
          sales, followers, reach or engagement. Marketing results depend on factors well outside
          our control.
        </p>
        <p>
          To the fullest extent the law allows, we are not liable for lost profits, lost revenue,
          lost data, or indirect or consequential losses. Where we are found liable, our total
          liability to you is limited to the amount you paid us in the three months before the event
          that caused the claim.
        </p>
        <p>Nothing in these terms limits liability that cannot legally be limited.</p>
      </Clause>

      <Clause title="Changes to these terms">
        <p>
          We may update these terms. If a change materially affects your rights, we will tell you by
          email or in the dashboard at least 30 days beforehand. Continuing to use Koala after a
          change takes effect means you accept the updated terms.
        </p>
      </Clause>

      <Clause title="Governing law">
        <p>
          These terms are governed by the laws of {COMPANY.jurisdiction}. Any dispute that cannot be
          settled between us will be handled by the competent courts of {COMPANY.jurisdiction}.
        </p>
      </Clause>

      <Clause title="Contact">
        <p>
          {show(COMPANY.legalName)}
          <br />
          {show(COMPANY.address)}
          <br />
          {show(COMPANY.supportEmail)}
          <br />
          {show(COMPANY.phone)}
        </p>
      </Clause>
    </LegalPage>
  );
}
