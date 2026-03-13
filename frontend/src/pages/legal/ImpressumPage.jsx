import LegalLayout from '../../components/layout/LegalLayout';

const ImpressumPage = () => (
  <LegalLayout
    title="Impressum"
    subtitle="Legal notice as required under § 5 TMG (German Telemedia Act) and § 55 RStV."
    lastUpdated="March 14, 2026"
  >
    <h2>Angaben gemäß § 5 TMG</h2>

    <h3>Unternehmensbezeichnung</h3>
    <p>
      <strong>Edenly GmbH</strong><br />
      [Straße und Hausnummer]<br />
      [PLZ] Berlin<br />
      Deutschland
    </p>

    <h3>Kontakt</h3>
    <p>
      Telefon: +49 30 000 000 00<br />
      E-Mail: <a href="mailto:hello@edenly.de">hello@edenly.de</a>
    </p>

    <h3>Vertreten durch</h3>
    <p>
      Geschäftsführer: [Vollständiger Name des Geschäftsführers]
    </p>

    <h3>Registereintrag</h3>
    <p>
      Eingetragen im Handelsregister.<br />
      Registergericht: Amtsgericht Berlin-Charlottenburg<br />
      Registernummer: HRB [Nummer]
    </p>

    <h3>Umsatzsteuer-Identifikationsnummer</h3>
    <p>
      Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:<br />
      DE [Steuernummer]
    </p>

    <h2>Responsible for Editorial Content</h2>
    <p>
      Responsible for the content pursuant to § 55 Abs. 2 RStV:<br />
      [Vollständiger Name]<br />
      [Adresse wie oben]
    </p>

    <h2>Dispute Resolution</h2>
    <h3>EU Online Dispute Resolution</h3>
    <p>
      The European Commission provides an Online Dispute Resolution (ODR) platform at:{' '}
      <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
        https://ec.europa.eu/consumers/odr
      </a><br />
      Our email address for this purpose: <a href="mailto:legal@edenly.de">legal@edenly.de</a>
    </p>
    <h3>Consumer Dispute Resolution (§ 36 VSBG)</h3>
    <p>
      We are not willing or obliged to participate in dispute resolution proceedings before a
      consumer arbitration board (Verbraucherschlichtungsstelle).
    </p>

    <h2>Liability for Content (Haftung für Inhalte)</h2>
    <p>
      As a service provider, we are responsible for our own content on these pages in accordance
      with § 7 Abs.1 TMG and general laws. According to §§ 8 to 10 TMG, however, we are not obligated
      to monitor transmitted or stored third-party information or to investigate circumstances that
      indicate illegal activity.
    </p>
    <p>
      Obligations to remove or block the use of information under general laws remain unaffected by this.
      However, liability in this regard is only possible from the point in time at which a concrete
      infringement of the law becomes known. Upon becoming aware of corresponding legal violations,
      we will remove this content immediately.
    </p>

    <h2>Liability for Links (Haftung für Links)</h2>
    <p>
      Our website contains links to external websites of third parties over whose content we have no influence.
      Therefore, we cannot assume any liability for this external content. The respective provider or operator
      of the linked pages is always responsible for the content of the linked pages.
    </p>

    <h2>Copyright (Urheberrecht)</h2>
    <p>
      The content and works created by the site operators on these pages are subject to German copyright law.
      Duplication, processing, distribution, or any form of commercialisation of such material beyond the
      scope of the copyright law shall require the prior written consent of its respective author or creator.
      Downloads and copies of this site are only permitted for private, non-commercial use.
    </p>
    <p>
      Insofar as the content on this site was not created by the operator, the copyrights of third parties
      are respected. In particular, third-party content is marked as such. Should you nevertheless become
      aware of a copyright infringement, please inform us accordingly. Upon becoming aware of legal violations,
      we will remove such content immediately.
    </p>

    <h2>Data Protection Officer</h2>
    <p>
      Questions regarding data protection:<br />
      <a href="mailto:privacy@edenly.de">privacy@edenly.de</a>
    </p>
  </LegalLayout>
);

export default ImpressumPage;
