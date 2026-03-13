import LegalLayout from '../../components/layout/LegalLayout';

const PrivacyPage = () => (
  <LegalLayout
    title="Privacy Policy"
    subtitle="We take your privacy seriously. This policy explains how Edenly collects, uses, and protects your personal data."
    lastUpdated="March 14, 2026"
  >
    <h2>1. Controller</h2>
    <p>
      The controller responsible for data processing on this platform is:<br />
      <strong>Edenly GmbH</strong>, Berlin, Germany<br />
      Email: <a href="mailto:privacy@edenly.de">privacy@edenly.de</a>
    </p>

    <h2>2. Data We Collect</h2>
    <p>We collect the following categories of personal data when you use Edenly:</p>
    <ul>
      <li><strong>Account data:</strong> Name, email address, phone number, password (hashed)</li>
      <li><strong>Provider data:</strong> Business name, address, service descriptions, portfolio images</li>
      <li><strong>Booking data:</strong> Appointment details, preferences, booking history</li>
      <li><strong>Payment data:</strong> Processed by Stripe — we do not store card details</li>
      <li><strong>Usage data:</strong> IP address, browser type, pages visited, session duration</li>
      <li><strong>Communication data:</strong> Messages sent through the platform chat</li>
    </ul>

    <h2>3. Legal Basis for Processing (GDPR Art. 6)</h2>
    <ul>
      <li><strong>Art. 6(1)(b):</strong> Processing necessary to perform our contract with you</li>
      <li><strong>Art. 6(1)(a):</strong> Your consent (e.g. marketing emails, optional cookies)</li>
      <li><strong>Art. 6(1)(c):</strong> Legal obligations (e.g. invoicing, tax records)</li>
      <li><strong>Art. 6(1)(f):</strong> Legitimate interests (e.g. fraud prevention, platform security)</li>
    </ul>

    <h2>4. How We Use Your Data</h2>
    <ul>
      <li>To provide and operate the Edenly platform and its services</li>
      <li>To process bookings and payments between customers and providers</li>
      <li>To send booking confirmations, reminders, and service updates</li>
      <li>To improve platform functionality and user experience</li>
      <li>To comply with legal and regulatory obligations</li>
      <li>To prevent fraud, abuse, and platform misuse</li>
    </ul>

    <h2>5. Data Sharing</h2>
    <p>We do not sell your personal data. We share data only in the following circumstances:</p>
    <ul>
      <li><strong>Service providers:</strong> Stripe (payments), hosting providers in the EU</li>
      <li><strong>Between users:</strong> Provider profiles and contact details are shared with customers as part of the booking process</li>
      <li><strong>Legal requirements:</strong> If required by German or EU law, court order, or governmental authority</li>
    </ul>

    <h2>6. Data Retention</h2>
    <p>
      We retain your personal data for as long as your account is active and as required by law.
      Account data is deleted within 30 days of account closure. Financial records are retained
      for 10 years as required by German commercial law (§ 257 HGB).
    </p>

    <h2>7. Cookies</h2>
    <p>
      We use technically necessary cookies to operate the platform (session management, authentication).
      We do not use tracking or advertising cookies without your explicit consent.
      You can manage cookie preferences via your browser settings.
    </p>

    <h2>8. Your Rights (GDPR)</h2>
    <p>Under GDPR, you have the following rights:</p>
    <ul>
      <li><strong>Right of access</strong> (Art. 15): Obtain a copy of your personal data</li>
      <li><strong>Right to rectification</strong> (Art. 16): Correct inaccurate data</li>
      <li><strong>Right to erasure</strong> (Art. 17): Request deletion of your data ("right to be forgotten")</li>
      <li><strong>Right to restriction</strong> (Art. 18): Restrict how we process your data</li>
      <li><strong>Right to data portability</strong> (Art. 20): Receive your data in a machine-readable format</li>
      <li><strong>Right to object</strong> (Art. 21): Object to processing based on legitimate interests</li>
      <li><strong>Right to withdraw consent</strong> (Art. 7(3)): At any time, without affecting prior processing</li>
    </ul>
    <p>To exercise your rights, contact: <a href="mailto:privacy@edenly.de">privacy@edenly.de</a></p>

    <h2>9. Data Security</h2>
    <p>
      We implement appropriate technical and organisational security measures including encryption (TLS),
      hashed passwords (bcrypt), access control, and regular security audits.
      All data is stored on servers located within the European Union.
    </p>

    <h2>10. Right to Lodge a Complaint</h2>
    <p>
      You have the right to lodge a complaint with the competent data protection supervisory authority.
      In Germany, this is the <strong>Berliner Beauftragte für Datenschutz und Informationsfreiheit</strong>
      or the supervisory authority in your place of residence.
    </p>

    <h2>11. Changes to This Policy</h2>
    <p>
      We may update this policy from time to time. We will notify registered users of material changes
      by email at least 14 days before the changes take effect.
    </p>
  </LegalLayout>
);

export default PrivacyPage;
