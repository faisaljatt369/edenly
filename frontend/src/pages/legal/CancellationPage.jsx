import LegalLayout from '../../components/layout/LegalLayout';

const CancellationPage = () => (
  <LegalLayout
    title="Cancellation Policy"
    subtitle="Clear rules for cancellations and refunds for both customers and providers on the Edenly platform."
    lastUpdated="March 14, 2026"
  >
    <h2>1. Overview</h2>
    <p>
      Edenly operates as a marketplace. Cancellation terms are governed by a combination of:
      (1) the individual Provider's cancellation policy, and (2) Edenly's platform-wide baseline rules
      described in this document. In case of conflict, the Provider's policy takes precedence
      unless it violates applicable law.
    </p>

    <h2>2. Customer Cancellations</h2>
    <h3>2.1 Standard cancellation window</h3>
    <p>
      Unless a Provider specifies otherwise, customers may cancel a confirmed booking free of charge
      up to <strong>24 hours before the scheduled appointment start time</strong>.
    </p>
    <h3>2.2 Late cancellations</h3>
    <p>
      Cancellations made less than 24 hours before the appointment may be subject to a cancellation fee
      as set by the Provider. This fee will be clearly displayed on the Provider's profile and at checkout.
    </p>
    <h3>2.3 No-shows</h3>
    <p>
      If a customer does not attend a booked appointment without cancelling, the full booking amount
      (or deposit if applicable) may be retained by the Provider.
    </p>
    <h3>2.4 How to cancel</h3>
    <p>
      Bookings can be cancelled through your Edenly dashboard under "My Bookings".
      Cancellations must be submitted through the Platform to be valid.
    </p>

    <h2>3. Provider Cancellations</h2>
    <h3>3.1 Provider-initiated cancellations</h3>
    <p>
      If a Provider cancels a confirmed booking, the Customer will receive a full refund
      including any deposit paid. Providers who repeatedly cancel may have their accounts reviewed
      or suspended.
    </p>
    <h3>3.2 Emergency cancellations</h3>
    <p>
      In cases of documented emergency (illness, family emergency), Providers must notify Edenly support
      as soon as possible. Edenly will facilitate rescheduling or refunds on a case-by-case basis.
    </p>

    <h2>4. Deposits</h2>
    <p>
      Some Providers require a deposit at the time of booking to confirm an appointment. Deposit amounts
      and conditions are set by each Provider and displayed clearly before checkout.
    </p>
    <ul>
      <li>Deposits are <strong>fully refunded</strong> if the Provider cancels</li>
      <li>Deposits are <strong>non-refundable</strong> if the Customer cancels within the Provider's no-cancellation window</li>
      <li>Deposits are <strong>fully refunded</strong> if the Customer cancels outside the required notice period</li>
    </ul>

    <h2>5. Statutory Right of Withdrawal (EU / German Law)</h2>
    <p>
      In accordance with § 312g Abs. 2 Nr. 9 BGB, the statutory right of withdrawal does not apply to
      contracts for the provision of services related to leisure activities where a specific date or period
      has been agreed (i.e. booked appointments). However, this does not affect any cancellation rights
      agreed upon between the Provider and Customer.
    </p>
    <p>
      For subscription plans (Provider subscriptions), you have a 14-day statutory right of withdrawal
      from the date of purchase, unless the service has already been used.
    </p>

    <h2>6. Refund Processing</h2>
    <p>
      Approved refunds are processed to the original payment method within <strong>5–10 business days</strong>
      depending on your bank or card issuer. Edenly will send an email confirmation once a refund is initiated.
    </p>

    <h2>7. Disputes</h2>
    <p>
      If you have a dispute regarding a cancellation or refund, please contact our support team at{' '}
      <a href="mailto:support@edenly.de">support@edenly.de</a> within 14 days of the booking date.
      Edenly will review the case and may request documentation from both parties.
    </p>

    <h2>8. Changes to This Policy</h2>
    <p>
      Edenly reserves the right to update this Cancellation Policy. Changes will be communicated
      via email and posted on this page. Continued use of the Platform constitutes acceptance.
    </p>
  </LegalLayout>
);

export default CancellationPage;
