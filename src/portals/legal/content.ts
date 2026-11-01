import type { L } from '@/i18n'

export type LegalDoc = 'impressum' | 'privacy' | 'terms' | 'dpa' | 'stores'
export interface LegalSection { h: L; p: L[]; list?: L[] }
export interface LegalText { title: L; sub: L; updated: string; sections: LegalSection[] }

const l = (en: string, de: string): L => ({ en, de })

export const LEGAL: Record<LegalDoc, LegalText> = {
  impressum: {
    title: l('Imprint (Impressum)', 'Impressum'),
    sub: l('Information according to § 5 DDG (Digitale-Dienste-Gesetz)', 'Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz)'),
    updated: '2026-11-01',
    sections: [
      { h: l('Provider', 'Anbieter'), p: [l('[Company name] GmbH\n[Street, No.]\n[Postcode] Berlin, Germany', '[Firmenname] GmbH\n[Straße, Nr.]\n[PLZ] Berlin, Deutschland')] },
      { h: l('Represented by', 'Vertreten durch'), p: [l('[Managing director(s)]', '[Geschäftsführer:in]')] },
      { h: l('Contact', 'Kontakt'), p: [l('Phone: [+49 …]\nE-mail: hello@vetly.de', 'Telefon: [+49 …]\nE-Mail: hallo@vetly.de')] },
      { h: l('Register entry', 'Registereintrag'), p: [l('Commercial register: Amtsgericht [Charlottenburg]\nRegistration number: HRB [……]', 'Registergericht: Amtsgericht [Charlottenburg]\nRegisternummer: HRB [……]')] },
      { h: l('VAT ID', 'Umsatzsteuer-ID'), p: [l('VAT identification number according to § 27a UStG: DE[………]', 'Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: DE[………]')] },
      { h: l('Responsible for content', 'Verantwortlich für den Inhalt'), p: [l('According to § 18 (2) MStV: [Name, address]', 'Nach § 18 Abs. 2 MStV: [Name, Anschrift]')] },
      { h: l('Consumer dispute resolution', 'Verbraucherstreitbeilegung'), p: [l('We are neither willing nor obliged to participate in dispute resolution proceedings before a consumer arbitration board.', 'Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.')] },
      { h: l('Medical disclaimer', 'Medizinischer Hinweis'), p: [l('Vetly does not provide veterinary diagnosis, prescriptions or emergency services. In an emergency, contact a veterinarian or emergency clinic immediately.', 'Vetly bietet keine tierärztliche Diagnose, keine Verschreibungen und keinen Notdienst. Im Notfall wenden Sie sich sofort an eine Tierarztpraxis oder Tierklinik.')] },
    ],
  },
  privacy: {
    title: l('Privacy policy', 'Datenschutzerklärung'),
    sub: l('How Vetly processes personal data under the GDPR', 'Wie Vetly personenbezogene Daten gemäß DSGVO verarbeitet'),
    updated: '2026-11-01',
    sections: [
      { h: l('1. Controller', '1. Verantwortlicher'), p: [l('[Company name] GmbH, [address], datenschutz@vetly.de. Data protection officer: [name / external DPO, contact].', '[Firmenname] GmbH, [Anschrift], datenschutz@vetly.de. Datenschutzbeauftragte:r: [Name / externer DSB, Kontakt].')] },
      {
        h: l('2. Data we process', '2. Welche Daten wir verarbeiten'),
        p: [l('Depending on how you use Vetly, we process:', 'Je nach Nutzung von Vetly verarbeiten wir:')],
        list: [
          l('Account data: name, e-mail, language, login method (Apple, Google, magic link)', 'Kontodaten: Name, E-Mail, Sprache, Login-Methode (Apple, Google, Magic Link)'),
          l('Pet data: species, name, breed, birth date, weight, microchip number', 'Tierdaten: Tierart, Name, Rasse, Geburtsdatum, Gewicht, Chipnummer'),
          l('Health records: vaccinations, treatments, medication, documents you upload', 'Gesundheitsdaten des Tieres: Impfungen, Behandlungen, Medikamente, hochgeladene Dokumente'),
          l('Appointments and messages with clinics, including attachments', 'Termine und Nachrichten mit Praxen inkl. Anhänge'),
          l('Device data for push notifications (push token, OS version)', 'Gerätedaten für Push-Benachrichtigungen (Push-Token, OS-Version)'),
          l('Approximate location only while you search for clinics, never stored', 'Ungefährer Standort nur während der Praxissuche, wird nicht gespeichert'),
        ],
      },
      {
        h: l('3. Purposes and legal bases', '3. Zwecke und Rechtsgrundlagen'),
        p: [l('We process data to provide the app (Art. 6(1)(b) GDPR), to send reminders you enabled (Art. 6(1)(a)), to share pet records with clinics or insurers only with your explicit consent (Art. 6(1)(a)), and to keep the service secure (Art. 6(1)(f)). Note: animal health data is not “health data” under Art. 9 GDPR, but we protect it to the same standard.', 'Wir verarbeiten Daten zur Bereitstellung der App (Art. 6 Abs. 1 lit. b DSGVO), für von Ihnen aktivierte Erinnerungen (lit. a), zur Weitergabe von Tierakten an Praxen oder Versicherer ausschließlich mit Ihrer ausdrücklichen Einwilligung (lit. a) und zur Sicherheit des Dienstes (lit. f). Hinweis: Tiergesundheitsdaten sind keine Gesundheitsdaten i. S. d. Art. 9 DSGVO, wir schützen sie aber auf gleichem Niveau.')],
      },
      { h: l('4. Hosting & processors', '4. Hosting & Auftragsverarbeiter'), p: [l('All data is stored in the EU (Frankfurt am Main, Germany) with [Supabase / AWS eu-central-1]. Push notifications are delivered via Apple Push Notification service and Firebase Cloud Messaging; only a token and the notification text are transmitted. A full list of processors is available on request.', 'Alle Daten werden in der EU (Frankfurt am Main) bei [Supabase / AWS eu-central-1] gespeichert. Push-Nachrichten werden über Apple Push Notification Service und Firebase Cloud Messaging zugestellt; übertragen werden nur ein Token und der Nachrichtentext. Eine vollständige Liste der Auftragsverarbeiter erhalten Sie auf Anfrage.')] },
      { h: l('5. Sharing with clinics & insurers', '5. Weitergabe an Praxen & Versicherer'), p: [l('Clinics and insurers only see a pet’s record if you grant access in the Privacy center, per pet and per partner, with a defined scope and optional expiry. You can revoke access at any time; revocation takes effect immediately. Every access is logged.', 'Praxen und Versicherer sehen eine Tierakte nur, wenn Sie im Datenschutz-Center den Zugriff erteilen, pro Tier und pro Partner, mit festgelegtem Umfang und optionalem Ablaufdatum. Sie können den Zugriff jederzeit widerrufen; der Widerruf wirkt sofort. Jeder Zugriff wird protokolliert.')] },
      { h: l('6. Retention', '6. Speicherdauer'), p: [l('We keep your data as long as your account exists. After deletion, data is erased within 30 days, except where statutory retention obligations apply (e.g. invoices, 10 years per § 147 AO).', 'Wir speichern Ihre Daten, solange Ihr Konto besteht. Nach Löschung werden Daten innerhalb von 30 Tagen entfernt, soweit keine gesetzlichen Aufbewahrungspflichten bestehen (z. B. Rechnungen, 10 Jahre gem. § 147 AO).')] },
      {
        h: l('7. Your rights', '7. Ihre Rechte'),
        p: [l('You can exercise these rights directly in the app under Profile → Privacy & data:', 'Diese Rechte können Sie direkt in der App unter Profil → Datenschutz & Daten ausüben:')],
        list: [l('Access & data portability (Art. 15, 20): “Export my data”', 'Auskunft & Datenübertragbarkeit (Art. 15, 20): „Meine Daten exportieren“'), l('Erasure (Art. 17): “Delete my data”', 'Löschung (Art. 17): „Meine Daten löschen“'), l('Rectification, restriction, objection (Art. 16, 18, 21)', 'Berichtigung, Einschränkung, Widerspruch (Art. 16, 18, 21)'), l('Withdraw consent at any time (Art. 7(3))', 'Widerruf erteilter Einwilligungen jederzeit (Art. 7 Abs. 3)'), l('Lodge a complaint with a supervisory authority, e.g. Berliner Beauftragte für Datenschutz und Informationsfreiheit', 'Beschwerde bei einer Aufsichtsbehörde, z. B. Berliner Beauftragte für Datenschutz und Informationsfreiheit')],
      },
      { h: l('8. No tracking for advertising', '8. Kein Werbe-Tracking'), p: [l('Vetly does not use advertising trackers and does not sell data. Optional, anonymous usage statistics are only collected with your consent.', 'Vetly nutzt keine Werbe-Tracker und verkauft keine Daten. Optionale, anonyme Nutzungsstatistiken werden nur mit Ihrer Einwilligung erhoben.')] },
    ],
  },
  terms: {
    title: l('Terms of use', 'Nutzungsbedingungen (AGB)'),
    sub: l('For pet owners using the Vetly app', 'Für Tierhalter:innen, die die Vetly-App nutzen'),
    updated: '2026-11-01',
    sections: [
      { h: l('1. Scope', '1. Geltungsbereich'), p: [l('These terms govern the use of the Vetly app and web services by pet owners. Separate terms and a data processing agreement apply to clinics and insurance partners.', 'Diese Bedingungen regeln die Nutzung der Vetly-App und Webdienste durch Tierhalter:innen. Für Praxen und Versicherungspartner gelten gesonderte Bedingungen und ein Auftragsverarbeitungsvertrag.')] },
      { h: l('2. Service description', '2. Leistungsbeschreibung'), p: [l('Vetly lets you manage pet health records, receive reminders, search for clinics, request appointments and message clinics. Vetly is a technical intermediary: the treatment contract is concluded solely between you and the clinic.', 'Vetly ermöglicht die Verwaltung von Tiergesundheitsdaten, Erinnerungen, Praxissuche, Terminanfragen und Nachrichten an Praxen. Vetly ist technischer Vermittler: Der Behandlungsvertrag kommt ausschließlich zwischen Ihnen und der Praxis zustande.')] },
      { h: l('3. Not a medical or emergency service', '3. Kein medizinischer oder Notfall-Dienst'), p: [l('Vetly does not provide diagnosis, does not sell or prescribe medication and is not suitable for emergencies. Chat messages may not be answered immediately.', 'Vetly stellt keine Diagnosen, verkauft oder verschreibt keine Medikamente und ist nicht für Notfälle geeignet. Chat-Nachrichten werden ggf. nicht sofort beantwortet.')] },
      { h: l('4. Appointments', '4. Termine'), p: [l('A booking is a request until the clinic confirms it. Please cancel in the app if you can’t attend. Clinics may apply their own cancellation policies.', 'Eine Buchung ist eine Anfrage, bis die Praxis sie bestätigt. Bitte sagen Sie in der App ab, wenn Sie nicht kommen können. Praxen können eigene Stornoregeln anwenden.')] },
      { h: l('5. Your content', '5. Ihre Inhalte'), p: [l('You remain the owner of all data and documents you upload. You grant us only the rights necessary to operate the service.', 'Sie bleiben Inhaber:in aller hochgeladenen Daten und Dokumente. Sie räumen uns nur die zum Betrieb notwendigen Rechte ein.')] },
      { h: l('6. Liability', '6. Haftung'), p: [l('We are liable without limitation for intent and gross negligence and for injury to life, body or health. For slight negligence, we are only liable for breach of essential contractual obligations, limited to foreseeable, typical damage. Reminders are a support tool; responsibility for your pet’s care remains with you.', 'Wir haften unbeschränkt bei Vorsatz und grober Fahrlässigkeit sowie bei Verletzung von Leben, Körper oder Gesundheit. Bei leichter Fahrlässigkeit haften wir nur bei Verletzung wesentlicher Vertragspflichten, begrenzt auf den vorhersehbaren, typischen Schaden. Erinnerungen sind ein Hilfsmittel; die Verantwortung für die Versorgung Ihres Tieres bleibt bei Ihnen.')] },
      { h: l('7. Termination', '7. Kündigung'), p: [l('You can delete your account at any time in the app. We may terminate with 30 days’ notice, or immediately for good cause.', 'Sie können Ihr Konto jederzeit in der App löschen. Wir können mit 30 Tagen Frist kündigen, aus wichtigem Grund fristlos.')] },
      { h: l('8. Governing law', '8. Anwendbares Recht'), p: [l('German law applies. Mandatory consumer protection provisions of your country of residence remain unaffected.', 'Es gilt deutsches Recht. Zwingende Verbraucherschutzvorschriften Ihres Wohnsitzstaates bleiben unberührt.')] },
    ],
  },
  dpa: {
    title: l('Data processing agreement (AVV), template', 'Auftragsverarbeitungsvertrag (AVV), Vorlage'),
    sub: l('Between the clinic (controller) and Vetly (processor) per Art. 28 GDPR', 'Zwischen Praxis (Verantwortliche) und Vetly (Auftragsverarbeiter) gem. Art. 28 DSGVO'),
    updated: '2026-11-01',
    sections: [
      { h: l('§ 1 Subject and duration', '§ 1 Gegenstand und Dauer'), p: [l('Vetly processes patient-owner data on behalf of the clinic for appointment management, messaging and reminders, for the term of the main contract.', 'Vetly verarbeitet im Auftrag der Praxis Halter- und Patientendaten zur Terminverwaltung, Kommunikation und Erinnerung, für die Laufzeit des Hauptvertrags.')] },
      { h: l('§ 2 Nature, purpose, data categories', '§ 2 Art, Zweck, Datenkategorien'), p: [l('Categories of data subjects: pet owners, clinic staff. Data categories: contact data, appointment data, messages, pet records shared with consent.', 'Betroffene: Tierhalter:innen, Praxispersonal. Datenkategorien: Kontaktdaten, Termindaten, Nachrichten, mit Einwilligung freigegebene Tierakten.')] },
      { h: l('§ 3 Instructions', '§ 3 Weisungsgebundenheit'), p: [l('Vetly processes data only on documented instructions from the clinic.', 'Vetly verarbeitet Daten nur auf dokumentierte Weisung der Praxis.')] },
      { h: l('§ 4 Technical & organisational measures (TOMs)', '§ 4 Technische und organisatorische Maßnahmen (TOM)'), p: [l('See annex 1. Summary:', 'Siehe Anlage 1. Zusammenfassung:')], list: [l('EU hosting (Frankfurt), encryption at rest (AES-256) and in transit (TLS 1.3)', 'EU-Hosting (Frankfurt), Verschlüsselung at rest (AES-256) und in transit (TLS 1.3)'), l('Row-level security, role-based access, 2FA for clinic accounts', 'Row-Level-Security, rollenbasierte Zugriffe, 2FA für Praxiskonten'), l('Audit logging of every record access', 'Audit-Logging jedes Aktenzugriffs'), l('Daily encrypted backups, 30-day point-in-time recovery', 'Tägliche verschlüsselte Backups, 30 Tage Point-in-Time-Recovery')] },
      { h: l('§ 5 Sub-processors', '§ 5 Unterauftragsverarbeiter'), p: [l('Annex 2 lists approved sub-processors (e.g. hosting, e-mail, push delivery). The clinic is informed of changes and may object.', 'Anlage 2 listet genehmigte Unterauftragsverarbeiter (z. B. Hosting, E-Mail, Push-Zustellung). Die Praxis wird über Änderungen informiert und kann widersprechen.')] },
      { h: l('§ 6 Support, breaches, deletion', '§ 6 Unterstützung, Datenpannen, Löschung'), p: [l('Vetly supports the clinic with data subject requests, notifies breaches without undue delay (target < 24 h) and deletes or returns data at contract end.', 'Vetly unterstützt bei Betroffenenanfragen, meldet Datenpannen unverzüglich (Ziel < 24 Std.) und löscht bzw. gibt Daten bei Vertragsende zurück.')] },
      { h: l('§ 7 Audits', '§ 7 Kontrollrechte'), p: [l('The clinic may verify compliance, primarily through certifications and audit reports provided by Vetly.', 'Die Praxis kann die Einhaltung prüfen, vorrangig anhand von Zertifikaten und Prüfberichten, die Vetly bereitstellt.')] },
    ],
  },
  stores: {
    title: l('App Store & Google Play privacy declarations', 'App-Store- & Google-Play-Datenschutzangaben'),
    sub: l('Prepared answers for Apple “App Privacy” and Google “Data safety”', 'Vorbereitete Angaben für Apple „App-Datenschutz“ und Google „Datensicherheit“'),
    updated: '2026-11-01',
    sections: [
      {
        h: l('Apple, data linked to the user', 'Apple, mit Nutzer verknüpfte Daten'),
        p: [l('Used for app functionality only. Not used for tracking.', 'Nur für App-Funktionalität verwendet. Kein Tracking.')],
        list: [l('Contact info: name, e-mail address', 'Kontaktinformationen: Name, E-Mail-Adresse'), l('User content: photos, documents, customer support messages', 'Nutzerinhalte: Fotos, Dokumente, Support-Nachrichten'), l('Identifiers: user ID', 'Kennungen: Nutzer-ID'), l('Health & fitness: none (pet data only, declared under “Other data”)', 'Gesundheit & Fitness: keine (nur Tierdaten, deklariert unter „Andere Daten“)')],
      },
      { h: l('Apple, data not collected', 'Apple, nicht erhobene Daten'), p: [l('Location (precise), browsing history, purchases, financial info, contacts, advertising data.', 'Standort (genau), Browserverlauf, Käufe, Finanzdaten, Kontakte, Werbedaten.')] },
      {
        h: l('Google Play, data safety', 'Google Play, Datensicherheit'),
        p: [l('Data is encrypted in transit. Users can request deletion in-app and via web form (required since 2024).', 'Daten werden bei der Übertragung verschlüsselt. Nutzer können die Löschung in der App und per Webformular beantragen (seit 2024 Pflicht).')],
        list: [l('Collected: personal info (name, e-mail), photos & files, app activity (in-app actions), app info & performance (crash logs)', 'Erhoben: persönliche Daten (Name, E-Mail), Fotos & Dateien, App-Aktivität, App-Infos & Leistung (Absturzberichte)'), l('Shared: with clinics/insurers only on explicit user consent (declared as user-initiated transfer)', 'Weitergegeben: an Praxen/Versicherer nur bei ausdrücklicher Einwilligung (als nutzerinitiierte Übertragung deklariert)'), l('Account deletion URL: https://vetly.de/konto-loeschen', 'URL zur Kontolöschung: https://vetly.de/konto-loeschen')],
      },
    ],
  },
}
