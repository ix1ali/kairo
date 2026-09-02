import LegalPage, { Clause } from "@/components/legal/LegalPage";
import { COMPANY, show } from "@/lib/legal";

export const metadata = {
  title: "Refund and Cancellation Policy",
  description: "When you can cancel, when you get a refund, and how to ask for one.",
};

export default function RefundPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Refund and Cancellation Policy"
      intro="Koala delivers a full month of finished content the moment you add a brand. That shapes this policy, so we have written it clearly rather than burying it. Read it before you subscribe."
    >
      <Clause title="Cancelling">
        <p>
          You can cancel your subscription at any time from the billing page in your dashboard. It
          takes one click and you do not need to email us or explain why.
        </p>
        <p>
          Cancelling stops the next renewal. You keep full access, and everything already generated,
          until the end of the period you have already paid for. We do not cut you off early.
        </p>
        <p>
          Your projects and calendars stay in your account if you subscribe again later, unless you
          ask us to delete them.
        </p>
      </Clause>

      <Clause title="The general rule on refunds">
        <p>
          Koala is a digital service that is delivered immediately. When you subscribe and add a
          brand, we generate your strategy and a complete 30-day calendar within about a minute, and
          that work costs us real money in AI generation the moment it runs.
        </p>
        <p>
          <strong>
            Because of that, monthly subscription fees are not refundable once content has been
            generated on your account for that billing period.
          </strong>{" "}
          Cancel before your next renewal date if you do not want to be charged again.
        </p>
      </Clause>

      <Clause title="When we do refund you">
        <p>We will refund you in these situations, and you do not have to argue for it:</p>
        <p>
          <strong>You were charged but got nothing.</strong> If you paid and no content was ever
          generated on your account for that period, we refund it in full.
        </p>
        <p>
          <strong>You were charged twice.</strong> Duplicate charges for the same period are
          refunded in full.
        </p>
        <p>
          <strong>You were charged after cancelling.</strong> If a renewal is taken after you
          cancelled, we refund it in full.
        </p>
        <p>
          <strong>The service was broken.</strong> If a fault on our side stopped you from using
          Koala for a significant part of your billing period, and we could not fix it, we refund
          that period in full or in part depending on how long it lasted.
        </p>
        <p>
          <strong>An unauthorised payment.</strong> If someone used your card without permission,
          contact us and your bank immediately. We refund confirmed unauthorised charges.
        </p>
      </Clause>

      <Clause title="When we do not refund">
        <p>
          <strong>You changed your mind after content was generated.</strong> The month was
          produced, and the cost of producing it was incurred.
        </p>
        <p>
          <strong>You did not use what you paid for.</strong> Not downloading or not posting the
          content does not make the period refundable.
        </p>
        <p>
          <strong>You did not like the creative direction.</strong> This is what credits are for —
          rewrite a caption, change the angle, or redesign a visual. Tell us what is wrong through
          the contact form and we will help you get it right.
        </p>
        <p>
          <strong>Results were not what you hoped.</strong> Koala produces content. It cannot promise
          sales, followers or reach, and those outcomes are not grounds for a refund.
        </p>
        <p>
          <strong>Your account was closed for breaking the Terms.</strong> Serious or illegal misuse
          ends the subscription without a refund.
        </p>
      </Clause>

      <Clause title="Credits">
        <p>
          Credits included with your plan are part of the subscription and are not refundable
          separately. They expire at the end of each billing month.
        </p>
        <p>
          Top-up credit packs bought separately are refundable only if unused. Once credits have been
          spent on a generation, that generation has already cost us money and cannot be refunded.
        </p>
        <p>
          <strong>A failed generation never costs you credits.</strong> If a generation produces
          nothing, we do not charge for it. If you were charged for one that failed, tell us and we
          will return the credits.
        </p>
      </Clause>

      <Clause title="How to ask for a refund">
        <p>
          Email {show(COMPANY.supportEmail)} or use the contact form in your dashboard. Include the
          email on your account and the date of the charge.
        </p>
        <p>
          We reply within <strong>2 business days</strong> and decide within{" "}
          <strong>7 business days</strong>. If we approve it, the refund is sent back to the
          original payment method. Your bank usually takes a further 5 to 14 business days to show
          it, which is outside our control.
        </p>
        <p>Refunds are issued in the original currency of the charge.</p>
      </Clause>

      <Clause title="Chargebacks">
        <p>
          Please contact us before asking your bank to reverse a charge. Almost every dispute we see
          is a misunderstanding we could have fixed the same day.
        </p>
        <p>
          If you raise a chargeback while we are still investigating your request, we may suspend
          your account until the dispute is resolved.
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
