import LegalLayout from '../../components/layout/LegalLayout';

const TermsPage = () => (
  <LegalLayout
    title="Terms of Service"
    subtitle="These terms govern your use of the Edenly platform. By creating an account, you agree to these terms."
    lastUpdated="March 14, 2026"
  >
    <h2>1. Acceptance of Terms</h2>
    <p>
      By accessing or using the Edenly platform ("Platform"), you agree to be bound by these Terms of Service
      ("Terms") and our Privacy Policy. If you do not agree, you may not use the Platform.
      These Terms constitute a legally binding agreement between you and <strong>Edenly GmbH</strong>, Berlin, Germany.
    </p>

    <h2>2. Description of Service</h2>
    <p>
      Edenly is an online marketplace that connects customers ("Customers") with independent beauty and wellness
      service providers ("Providers"). Edenly facilitates the discovery, booking, and payment process but
      is not itself a beauty or wellness service provider.
    </p>

    <h2>3. User Accounts</h2>
    <h3>3.1 Registration</h3>
    <p>
      To use the Platform, you must create an account. You must provide accurate and complete information
      and keep it up to date. You are responsible for maintaining the security of your account credentials.
    </p>
    <h3>3.2 Age requirement</h3>
    <p>You must be at least 18 years old to create an account and use the Platform.</p>
    <h3>3.3 Account termination</h3>
    <p>
      We reserve the right to suspend or terminate accounts that violate these Terms, engage in fraudulent
      activity, or misuse the Platform.
    </p>

    <h2>4. Provider Obligations</h2>
    <p>Providers who list services on Edenly agree to:</p>
    <ul>
      <li>Be legally authorised to provide the services they offer</li>
      <li>Comply with all applicable German laws, tax obligations, and professional regulations</li>
      <li>Maintain appropriate professional qualifications and insurance where required</li>
      <li>Honour confirmed bookings and provide services as described</li>
      <li>Set fair prices and clearly communicate their cancellation policies</li>
      <li>Treat customers with professionalism and respect</li>
    </ul>
    <p>
      <strong>Important:</strong> Providers are independent contractors, not employees of Edenly.
      Edenly is not responsible for the quality, safety, or legality of services provided.
    </p>

    <h2>5. Customer Obligations</h2>
    <p>Customers who book services on Edenly agree to:</p>
    <ul>
      <li>Provide accurate personal and contact information</li>
      <li>Arrive on time for booked appointments or cancel in accordance with the provider's policy</li>
      <li>Treat providers with respect and professionalism</li>
      <li>Pay all applicable fees as agreed at the time of booking</li>
    </ul>

    <h2>6. Payments and Fees</h2>
    <h3>6.1 Payment processing</h3>
    <p>All payments are processed securely via Stripe. Edenly charges a platform commission on each booking.</p>
    <h3>6.2 Deposits</h3>
    <p>Providers may require a deposit at the time of booking. Deposits are non-refundable unless the provider cancels.</p>
    <h3>6.3 Currency</h3>
    <p>All prices on the Platform are displayed and charged in Euros (EUR).</p>
    <h3>6.4 Subscription fees</h3>
    <p>Provider subscription plans (Basic, Premium, Pro) are billed monthly or annually. Fees are non-refundable except where required by law.</p>

    <h2>7. Cancellations and Refunds</h2>
    <p>
      Cancellation and refund policies are set individually by each Provider.
      Please review the Provider's cancellation policy before confirming a booking.
      See our <a href="/cancellation">Cancellation Policy</a> for further details.
    </p>

    <h2>8. Reviews and Content</h2>
    <p>
      Users may submit reviews and other content to the Platform. You are solely responsible for your content.
      You grant Edenly a non-exclusive, royalty-free licence to use, display, and distribute your content
      on the Platform. Edenly reserves the right to remove content that violates these Terms or applicable law.
    </p>

    <h2>9. Prohibited Conduct</h2>
    <p>You may not:</p>
    <ul>
      <li>Use the Platform for any unlawful purpose</li>
      <li>Attempt to circumvent the Platform by arranging payments outside of Edenly</li>
      <li>Impersonate another person or entity</li>
      <li>Upload malicious code or attempt to disrupt the Platform</li>
      <li>Post false, misleading, or defamatory reviews</li>
      <li>Scrape or collect data from the Platform without permission</li>
    </ul>

    <h2>10. Limitation of Liability</h2>
    <p>
      To the maximum extent permitted by law, Edenly shall not be liable for any indirect, incidental,
      special, or consequential damages arising from your use of the Platform. Edenly's total liability
      shall not exceed the fees paid by you in the 3 months preceding the claim.
    </p>

    <h2>11. Governing Law</h2>
    <p>
      These Terms are governed by and construed in accordance with the laws of the Federal Republic of Germany.
      The exclusive place of jurisdiction for all disputes is Berlin, Germany, to the extent permitted by law.
    </p>

    <h2>12. Changes to Terms</h2>
    <p>
      We may update these Terms from time to time. We will notify registered users at least 30 days before
      material changes take effect. Continued use of the Platform after changes constitutes acceptance.
    </p>

    <h2>13. Contact</h2>
    <p>
      Questions about these Terms: <a href="mailto:legal@edenly.de">legal@edenly.de</a>
    </p>
  </LegalLayout>
);

export default TermsPage;
