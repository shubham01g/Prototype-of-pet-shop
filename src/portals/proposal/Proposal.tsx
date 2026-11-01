import { motion } from 'framer-motion'
import {
  AlertTriangle, ArrowRight, BellRing, Boxes, Building2, Check, Cloud, Code2, Database, FileCheck2, Flame, GitBranch, Globe2, HeartHandshake, KeyRound,
  Layers, Lock, Minus, Plus, Rocket, Scale, ServerCog, ShieldCheck, Smartphone, Sparkles, Stethoscope, ThumbsDown, ThumbsUp, Umbrella, Users, Wrench,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/illustrations'
import { LangToggle, ThemeToggle } from '@/components/shell'
import { Badge, Button } from '@/components/ui'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ editable plan data
   Adjust weeks here before sending. Everything on the page is derived from these arrays. */
const PHASE1 = [
  { id: 'M0', weeks: [1, 1], en: 'Discovery & design sign-off', de: 'Discovery & Design-Freigabe', items: { en: ['Final screens from this prototype', 'Data model & access rules', 'Accounts set up in your name'], de: ['Finale Screens auf Basis dieses Prototyps', 'Datenmodell & Zugriffsregeln', 'Accounts auf Ihren Namen angelegt'] } },
  { id: 'M1', weeks: [2, 6], en: 'Core app → first test build', de: 'Kern-App → erster Test-Build', items: { en: ['Login (Apple, Google, magic link)', 'Pets, health records, repeat logic', 'Push reminders with per-item switch', 'Documents (photo/PDF), DE/EN', 'TestFlight + Play internal test build ✓'], de: ['Login (Apple, Google, Magic Link)', 'Tiere, Gesundheitsakte, Wiederholungen', 'Push-Erinnerungen mit Einzelschalter', 'Dokumente (Foto/PDF), DE/EN', 'TestFlight + Play-Testbuild ✓'] }, highlight: true },
  { id: 'M2', weeks: [7, 10], en: 'Clinics, booking & chat', de: 'Praxen, Buchung & Chat', items: { en: ['Clinic search with distance & hours', 'Booking request → confirmation push', 'Chat with attachments + emergency notice', 'Lite clinic inbox (web) to answer requests'], de: ['Praxissuche mit Entfernung & Zeiten', 'Buchungsanfrage → Bestätigungs-Push', 'Chat mit Anhängen + Notfall-Hinweis', 'Schlanke Praxis-Inbox (Web) zur Beantwortung'] } },
  { id: 'M3', weeks: [11, 12], en: 'GDPR, security & store launch', de: 'DSGVO, Sicherheit & Store-Launch', items: { en: ['Consent flows, export, delete my data', 'Legal texts built in (lawyer-ready)', 'Security review & fixes', 'App Store & Play submission'], de: ['Einwilligungen, Export, Daten löschen', 'Rechtstexte integriert (anwaltsfertig)', 'Sicherheitsprüfung & Fixes', 'App-Store- & Play-Einreichung'] } },
]
const PHASE2 = [
  { id: 'M4', weeks: [13, 16], en: 'Full clinic dashboard', de: 'Vollständiges Praxis-Dashboard', items: { en: ['Hours & services', 'Accept / change bookings, calendar', 'Consented patient records', 'Clinic → owner reminders'], de: ['Zeiten & Leistungen', 'Buchungen annehmen / ändern, Kalender', 'Freigegebene Patientenakten', 'Erinnerungen Praxis → Halter'] } },
  { id: 'M5', weeks: [17, 19], en: 'Sharing, admin & first PMS link', de: 'Freigaben, Admin & erste PVS-Anbindung', items: { en: ['Share record with a new vet', 'Admin console', 'Provet Cloud API + universal iCal/CSV sync'], de: ['Akte mit neuer Praxis teilen', 'Admin-Konsole', 'Provet-Cloud-API + Universal-iCal/CSV-Sync'] } },
  { id: 'M6', weeks: [20, 22], en: 'Insurance-ready & launch', de: 'Versicherungs-ready & Launch', items: { en: ['Insurer onboarding & partner API', 'Scoped, expiring consents + webhooks', 'Pen-test, handover documentation'], de: ['Versicherer-Onboarding & Partner-API', 'Begrenzte, ablaufende Freigaben + Webhooks', 'Pentest, Übergabe-Dokumentation'] } },
]
const TOTAL_WEEKS = 22

const fade = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.5 } }

export default function Proposal() {
  const { t, lang } = useI18n()
  const toc = [
    ['stack', t('Tech stack', 'Tech-Stack')], ['architecture', t('Architecture', 'Architektur')], ['milestones', t('Milestones', 'Meilensteine')],
    ['changes', t('Add · cut · change', 'Ergänzen · Streichen · Ändern')], ['learnings', t('What works / fails', 'Was funktioniert / scheitert')], ['risks', t('Risks', 'Risiken')],
    ['retention', t('Retention', 'Bindung')], ['handover', t('Handover', 'Übergabe')],
  ]
  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-40 border-b border-line/50 bg-canvas/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Link to="/"><Logo size={28} sub={t('Proposal', 'Angebot')} /></Link>
          <div className="ml-auto flex items-center gap-2"><LangToggle /><ThemeToggle /><Link to="/app" className="hidden sm:block"><Button size="sm" variant="outline">{t('Open prototype', 'Prototyp öffnen')}</Button></Link></div>
        </div>
      </header>

      {/* hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grain [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6">
          <Badge tone="brand" dot>{t('Proposal · November 2026', 'Angebot · November 2026')}</Badge>
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">{t('How we’d build Vetly, and make it better.', 'Wie wir Vetly bauen würden, und besser machen.')}</h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-2">{t('Your brief, answered point by point: recommended stack, architecture, two phased milestones with timelines, our honest suggestions, the risks we see and how owners keep coming back.', 'Ihr Briefing, Punkt für Punkt beantwortet: empfohlener Stack, Architektur, zwei Phasen mit Zeitplan, ehrliche Vorschläge, die Risiken, die wir sehen, und wie Halter wiederkommen.')}</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [Smartphone, t('One codebase', 'Eine Codebasis'), 'iOS + Android'],
              [Rocket, t('First test build', 'Erster Test-Build'), t('after week 6', 'nach Woche 6')],
              [ServerCog, t('Hosting', 'Hosting'), t('EU · Frankfurt', 'EU · Frankfurt')],
              [KeyRound, t('Ownership', 'Eigentum'), t('100% yours: code & accounts', '100 % Ihres: Code & Accounts')],
            ].map(([I, l, v]) => {
              const Icon = I as typeof Rocket
              return <div key={l as string} className="card flex items-center gap-4 p-5"><span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand"><Icon size={20} /></span><div><div className="text-xs text-ink-3">{l as string}</div><div className="font-display text-lg font-semibold">{v as string}</div></div></div>
            })}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-24 sm:px-6 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <nav className="sticky top-24 space-y-1">
            <div className="eyebrow mb-3">{t('Contents', 'Inhalt')}</div>
            {toc.map(([id, l], i) => <a key={id} href={`#${id}`} className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm text-ink-2 hover:bg-muted hover:text-ink"><span className="w-5 text-xs text-ink-3">{String(i + 1).padStart(2, '0')}</span>{l}</a>)}
          </nav>
        </aside>

        <div className="min-w-0 space-y-24">
          {/* ------------------------------------------------------------- stack */}
          <Section id="stack" n="01" title={t('Recommended tech stack', 'Empfohlener Tech-Stack')} sub={t('We recommend React Native (Expo) over Flutter for one reason: your clinic, admin and insurer web tools share the same language, types and validation as the app. One team, one codebase style, cheaper to maintain and easier to hand over.', 'Wir empfehlen React Native (Expo) statt Flutter aus einem Grund: Praxis-, Admin- und Versicherer-Web teilen dieselbe Sprache, Typen und Validierung wie die App. Ein Team, ein Code-Stil, günstiger in der Wartung und leichter zu übergeben.')}>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                [Smartphone, t('Owner app', 'Halter-App'), 'React Native · Expo · TypeScript', [t('Expo Router, EAS Build & Submit', 'Expo Router, EAS Build & Submit'), t('Over-the-air bug fixes (EAS Update)', 'Bugfixes over-the-air (EAS Update)'), 'i18next (DE/EN)', t('Expo Notifications → APNs / FCM', 'Expo Notifications → APNs / FCM')]],
                [Globe2, t('Clinic, admin & insurer web', 'Praxis-, Admin- & Versicherer-Web'), 'Next.js · React · Tailwind', [t('Shared UI tokens with the app', 'Gemeinsame UI-Tokens mit der App'), t('Hosted in EU region (Frankfurt)', 'Gehostet in EU-Region (Frankfurt)'), t('Realtime booking inbox', 'Echtzeit-Buchungs-Inbox')]],
                [Database, t('Backend', 'Backend'), 'Supabase · eu-central-1 (Frankfurt)', [t('Postgres + Row-Level Security = strict access rules in the database', 'Postgres + Row-Level-Security = strenge Zugriffsregeln in der Datenbank'), t('Auth, Storage (documents), Realtime (chat)', 'Auth, Storage (Dokumente), Realtime (Chat)'), t('Edge Functions + pg_cron for reminders', 'Edge Functions + pg_cron für Erinnerungen')]],
                [ShieldCheck, t('Quality & operations', 'Qualität & Betrieb'), t('EU-resident tooling', 'Tools mit EU-Datenhaltung'), [t('Sentry (EU) for crashes', 'Sentry (EU) für Abstürze'), t('Opt-in analytics: PostHog EU', 'Opt-in-Analytics: PostHog EU'), t('Transactional e-mail via EU provider', 'Transaktionale E-Mails über EU-Anbieter'), t('CI: GitHub Actions, automated RLS tests', 'CI: GitHub Actions, automatisierte RLS-Tests')]],
              ].map(([I, title, sub, list]) => {
                const Icon = I as typeof Database
                return (
                  <motion.div {...fade} key={title as string} className="card p-6">
                    <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand"><Icon size={20} /></span><div><div className="font-display text-lg font-semibold">{title as string}</div><div className="text-sm text-ink-3">{sub as string}</div></div></div>
                    <ul className="mt-4 space-y-2">{(list as string[]).map((x) => <li key={x} className="flex gap-2 text-sm text-ink-2"><Check size={16} className="mt-0.5 shrink-0 text-brand" />{x}</li>)}</ul>
                  </motion.div>
                )
              })}
            </div>
            <div className="mt-4 rounded-2xl border border-dashed border-line p-4 text-sm text-ink-2">
              <b>{t('Why not Firebase?', 'Warum nicht Firebase?')}</b> {t('It works in an EU region too, but Postgres with row-level security models “clinics only see patients who agreed to share” more cleanly and auditably than NoSQL rules, and avoids lock-in.', 'Es läuft auch in einer EU-Region, aber Postgres mit Row-Level-Security bildet „Praxen sehen nur Patienten mit Freigabe“ sauberer und prüfbarer ab als NoSQL-Regeln und vermeidet Lock-in.')}
            </div>
          </Section>

          {/* ------------------------------------------------------- architecture */}
          <Section id="architecture" n="02" title={t('Architecture outline', 'Architektur-Überblick')} sub={t('All personal data stays in Frankfurt. Every read of a pet record passes the consent check in the database itself.', 'Alle personenbezogenen Daten bleiben in Frankfurt. Jeder Zugriff auf eine Tierakte durchläuft die Einwilligungsprüfung direkt in der Datenbank.')}>
            <motion.div {...fade} className="card overflow-x-auto p-6"><ArchDiagram /></motion.div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <motion.div {...fade} className="card p-6">
                <h4 className="font-display text-lg font-semibold">{t('Core data model', 'Kern-Datenmodell')}</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['owners', 'households', 'pets', 'health_entries', 'documents', 'clinics', 'services', 'opening_hours', 'bookings', 'threads', 'messages', 'consents', 'notifications', 'audit_log', 'insurers', 'api_clients'].map((x) => <code key={x} className="rounded-lg bg-muted px-2 py-1 font-mono text-xs">{x}</code>)}
                </div>
                <p className="mt-4 text-sm text-ink-2">{t('consents = (pet, party, scope[], expires_at). The same table powers clinic access, “share with a new vet” and insurers, so one model covers Phase 1, Phase 2 and insurance.', 'consents = (Tier, Partner, Umfang[], Ablauf). Dieselbe Tabelle steuert Praxiszugriff, „mit neuer Praxis teilen“ und Versicherer: ein Modell für Phase 1, Phase 2 und Versicherung.')}</p>
              </motion.div>
              <motion.div {...fade} className="card overflow-hidden">
                <div className="border-b border-line px-5 py-3 text-sm font-semibold">{t('Access rule, enforced in Postgres', 'Zugriffsregel, in Postgres durchgesetzt')}</div>
                <pre className="overflow-x-auto bg-[#0f1714] p-5 text-[12px] leading-relaxed text-[#cfe3dc]">{`create policy "clinic reads consented pets"
on health_entries for select using (
  exists (
    select 1 from consents c
    where c.pet_id     = health_entries.pet_id
      and c.party_id   = auth.clinic_id()
      and c.active
      and 'treatments' = any (c.scope)
      and (c.expires_at is null
           or c.expires_at > now())
  )
);`}</pre>
              </motion.div>
            </div>
          </Section>

          {/* --------------------------------------------------------- milestones */}
          <Section id="milestones" n="03" title={t('Milestones & timeline', 'Meilensteine & Zeitplan')} sub={t('Estimate for a focused team of 2–3 (lead developer + designer/QA), to be confirmed after discovery. Each milestone ends with a demo and a build you can test.', 'Schätzung für ein fokussiertes Team von 2–3 Personen (Lead-Entwicklung + Design/QA), Bestätigung nach Discovery. Jeder Meilenstein endet mit Demo und testbarem Build.')}>
            <motion.div {...fade} className="card overflow-x-auto p-6">
              <div className="min-w-[760px]">
                <div className="mb-2 grid gap-1 pl-[220px]" style={{ gridTemplateColumns: `repeat(${TOTAL_WEEKS}, 1fr)` }}>
                  {Array.from({ length: TOTAL_WEEKS }, (_, i) => <div key={i} className="text-center text-[10px] text-ink-3">{i + 1}</div>)}
                </div>
                {[{ label: t('Phase 1: Owner app', 'Phase 1: Halter-App'), items: PHASE1, tone: 'brand' }, { label: t('Phase 2: Clinic & extras', 'Phase 2: Praxis & Extras'), items: PHASE2, tone: 'plum' }].map((ph) => (
                  <div key={ph.label} className="mb-4">
                    <div className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-3">{ph.label}</div>
                    {ph.items.map((m) => (
                      <div key={m.id} className="mb-1.5 flex items-center">
                        <div className="w-[220px] shrink-0 pr-3 text-sm"><b className="mr-1.5 text-ink-3">{m.id}</b>{lang === 'de' ? m.de : m.en}</div>
                        <div className="grid flex-1 gap-1" style={{ gridTemplateColumns: `repeat(${TOTAL_WEEKS}, 1fr)` }}>
                          <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }} style={{ gridColumn: `${m.weeks[0]} / ${m.weeks[1] + 1}`, transformOrigin: 'left' }} className={cn('flex h-8 items-center overflow-visible whitespace-nowrap rounded-lg px-2 text-[11px] font-semibold text-white', ph.tone === 'brand' ? 'bg-brand' : 'bg-plum', 'highlight' in m && !!m.highlight && 'ring-2 ring-coral ring-offset-2 ring-offset-surface')}>
                            {m.weeks[0] === m.weeks[1] ? t(`wk ${m.weeks[0]}`, `W ${m.weeks[0]}`) : t(`wk ${m.weeks[0]}–${m.weeks[1]}`, `W ${m.weeks[0]}–${m.weeks[1]}`)}
                          </motion.div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[...PHASE1, ...PHASE2].map((m) => (
                <motion.div {...fade} key={m.id} className={cn('card p-5', 'highlight' in m && !!m.highlight && 'ring-2 ring-coral')}>
                  <div className="flex items-center justify-between"><Badge tone={PHASE1.includes(m) ? 'brand' : 'plum'}>{m.id}</Badge><span className="text-xs text-ink-3">{t(`Weeks ${m.weeks[0]}–${m.weeks[1]}`, `Wochen ${m.weeks[0]}–${m.weeks[1]}`)}</span></div>
                  <div className="mt-3 font-semibold">{lang === 'de' ? m.de : m.en}</div>
                  <ul className="mt-2 space-y-1.5">{m.items[lang].map((x) => <li key={x} className="flex gap-2 text-[13px] text-ink-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink-3" />{x}</li>)}</ul>
                </motion.div>
              ))}
            </div>
          </Section>

          {/* ------------------------------------------------------------ changes */}
          <Section id="changes" n="04" title={t('What we’d add, cut or change', 'Was wir ergänzen, streichen oder ändern würden')} sub={t('To launch faster without losing what makes the product valuable.', 'Um schneller zu starten, ohne den Kernnutzen zu verlieren.')}>
            <div className="grid gap-4 lg:grid-cols-3">
              <ListCard icon={Plus} tone="sage" title={t('Add', 'Ergänzen')} items={[
                [t('A lite clinic inbox in Phase 1', 'Schlanke Praxis-Inbox in Phase 1'), t('Booking requests need someone to answer them. Without it, Phase 1 bookings dead-end.', 'Buchungsanfragen brauchen jemanden, der antwortet. Ohne sie laufen Phase-1-Buchungen ins Leere.')],
                [t('Household sharing', 'Haushalt teilen'), t('Partners and family manage the same pets. A top request in pet apps.', 'Partner:innen und Familie verwalten dieselben Tiere. Häufig gewünscht in Tier-Apps.')],
                [t('Admin console (this prototype)', 'Admin-Konsole (dieser Prototyp)'), t('Users, clinics, plans, revenue, GDPR requests and audit log in one place.', 'Nutzer, Praxen, Tarife, Umsatz, DSGVO-Anfragen und Audit-Log an einem Ort.')],
                [t('Pet passport with QR', 'Tierpass mit QR'), t('Instant, consent-based sharing with a new vet, sitter or boarding kennel.', 'Sofortiges, einwilligungsbasiertes Teilen mit neuer Praxis, Sitter oder Pension.')],
              ]} />
              <ListCard icon={Minus} tone="coral" title={t('Cut or defer', 'Streichen oder verschieben')} items={[
                [t('Deep PMS integrations at launch', 'Tiefe PVS-Integrationen zum Start'), t('Start with iCal/CSV for every clinic + one API partner (Provet Cloud). Add others on demand.', 'Start mit iCal/CSV für jede Praxis + einem API-Partner (Provet Cloud). Weitere nach Bedarf.')],
                [t('Live insurer data exchange', 'Live-Datenaustausch mit Versicherern'), t('Build the consent model and API now; connect once you have chosen the partner.', 'Einwilligungsmodell und API jetzt bauen; anbinden, sobald der Partner gewählt ist.')],
                [t('Multi-location clinic chains', 'Praxisketten mit mehreren Standorten'), t('Single location first; groups in a later release.', 'Zuerst Einzelpraxen; Gruppen in einem späteren Release.')],
              ]} />
              <ListCard icon={Wrench} tone="sky" title={t('Change', 'Ändern')} items={[
                [t('Booking = request, not instant slot', 'Buchung = Anfrage, kein Sofort-Termin'), t('Avoids double-bookings while there is no PMS sync. Clinics confirm in one click.', 'Vermeidet Doppelbuchungen ohne PVS-Sync. Praxen bestätigen mit einem Klick.')],
                [t('Passwordless login', 'Login ohne Passwort'), t('Apple / Google / magic link + Face ID. Fewer support tickets, more secure.', 'Apple / Google / Magic Link + Face ID. Weniger Support, mehr Sicherheit.')],
                [t('Chat with office hours', 'Chat mit Sprechzeiten'), t('Auto-reply outside hours + emergency notice protects clinics from overload.', 'Auto-Antwort außerhalb der Zeiten + Notfall-Hinweis schützt Praxen vor Überlastung.')],
              ]} />
            </div>
          </Section>

          {/* ---------------------------------------------------------- learnings */}
          <Section id="learnings" n="05" title={t('What we’ve seen work and fail', 'Was funktioniert und was scheitert')}>
            <div className="grid gap-4 lg:grid-cols-2">
              <ListCard icon={ThumbsUp} tone="sage" title={t('Works', 'Funktioniert')} items={[
                [t('Reminders are the retention engine', 'Erinnerungen sind der Bindungsmotor'), t('Owners open the app because it reminds them, so this must be flawless and switchable.', 'Halter öffnen die App, weil sie erinnert. Das muss fehlerfrei und abschaltbar sein.')],
                [t('Value before sign-up effort', 'Nutzen vor Aufwand'), t('Add the first pet in under 30 seconds; details later.', 'Erstes Tier in unter 30 Sekunden anlegen, Details später.')],
                [t('Reminders sent by the clinic', 'Erinnerungen von der Praxis'), t('A message from “my vet” gets far more trust and action than a generic push.', 'Eine Nachricht von „meiner Praxis“ erzeugt viel mehr Vertrauen und Handlung als ein generischer Push.')],
              ]} />
              <ListCard icon={ThumbsDown} tone="berry" title={t('Fails', 'Scheitert')} items={[
                [t('Empty marketplace', 'Leerer Marktplatz'), t('If no nearby clinic is bookable, owners churn. Launch city by city, clinics first.', 'Ist keine Praxis in der Nähe buchbar, springen Halter ab. Stadt für Stadt starten, Praxen zuerst.')],
                [t('Typing everything by hand', 'Alles von Hand eintippen'), t('Long forms kill activation. Offer a photo of the vaccination booklet, and later clinic-synced data.', 'Lange Formulare töten die Aktivierung. Foto vom Impfpass anbieten, später Praxis-Daten synchronisieren.')],
                [t('Notification spam', 'Benachrichtigungs-Spam'), t('Too many pushes lead to uninstalls. Quiet hours, weekly digest, and per-item control.', 'Zu viele Pushes führen zu Deinstallationen. Ruhezeiten, Wochenübersicht und Einzelsteuerung.')],
              ]} />
            </div>
          </Section>

          {/* -------------------------------------------------------------- risks */}
          <Section id="risks" n="06" title={t('Risks & how we handle them', 'Risiken & wie wir sie behandeln')}>
            <div className="grid gap-4 lg:grid-cols-3">
              <RiskCard icon={Code2} title={t('Technical', 'Technisch')} items={[
                [t('Closed PMS vendors', 'Geschlossene PVS-Hersteller'), t('Universal iCal/CSV fallback; API partners added one by one.', 'Universal-Fallback iCal/CSV; API-Partner schrittweise.')],
                [t('Push delivery on iOS/Android', 'Push-Zustellung iOS/Android'), t('Server-side scheduling, delivery tracking, e-mail fallback.', 'Serverseitige Planung, Zustell-Tracking, E-Mail-Fallback.')],
                [t('Large documents', 'Große Dokumente'), t('Client-side compression, size limits, EU object storage.', 'Komprimierung auf dem Gerät, Größenlimits, EU-Objektspeicher.')],
              ]} />
              <RiskCard icon={Scale} title={t('Legal', 'Rechtlich')} items={[
                [t('Chat drifting into remote diagnosis', 'Chat wird zur Ferndiagnose'), t('Clear notice, no symptom checker, clinic-side guidance per professional rules.', 'Klarer Hinweis, kein Symptom-Checker, Leitfaden für Praxen gemäß Berufsordnung.')],
                [t('Data sharing with insurers', 'Datenweitergabe an Versicherer'), t('Explicit, per-pet, scoped and expiring consent; purpose limitation in the contract.', 'Ausdrückliche, tierbezogene, begrenzte und ablaufende Einwilligung; Zweckbindung im Vertrag.')],
                [t('Store rules', 'Store-Vorgaben'), t('Sign in with Apple, in-app account deletion and data-safety forms are prepared.', 'Sign in with Apple, Kontolöschung in der App und Data-Safety-Angaben sind vorbereitet.')],
              ]} />
              <RiskCard icon={Building2} title={t('Clinic adoption', 'Praxis-Akzeptanz')} items={[
                [t('Busy, cautious practices', 'Ausgelastete, vorsichtige Praxen'), t('Zero setup: we onboard them, one-click accept, works next to their PMS.', 'Kein Aufwand: Wir onboarden, Ein-Klick-Annahme, läuft neben dem PVS.')],
                [t('Unclear value', 'Unklarer Nutzen'), t('Show saved calls and no-show reduction in their dashboard from week one.', 'Eingesparte Anrufe und weniger No-Shows ab Woche 1 im Dashboard zeigen.')],
                [t('Chicken-and-egg', 'Henne-Ei-Problem'), t('Free pilot for the first clinics in one city; owners can “invite my vet”.', 'Kostenloser Pilot für die ersten Praxen einer Stadt; Halter können „meine Praxis einladen“.')],
              ]} />
            </div>
          </Section>

          {/* ---------------------------------------------------------- retention */}
          <Section id="retention" n="07" title={t('Ideas to bring owners back regularly', 'Ideen, damit Halter regelmäßig wiederkommen')} sub={t('Several of these are already clickable in the prototype.', 'Einige davon sind im Prototyp bereits klickbar.')}>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[
                [BellRing, t('Smart reminders + weekly digest', 'Smarte Erinnerungen + Wochenübersicht'), t('A calm Sunday summary: “Next week: Bruno’s worming.”', 'Ruhige Sonntags-Übersicht: „Nächste Woche: Brunos Entwurmung.“'), true],
                [Flame, t('Care streaks & health score', 'Pflege-Serie & Gesundheits-Score'), t('Gentle gamification for doing things on time.', 'Sanfte Gamification für pünktliche Pflege.'), true],
                [Sparkles, t('Seasonal, local tips', 'Saisonale, lokale Tipps'), t('Tick season, summer heat, New Year’s Eve fireworks stress, travel rules.', 'Zeckensaison, Sommerhitze, Silvester-Stress, Reiseregeln.'), true],
                [HeartHandshake, t('Pet birthdays & milestones', 'Tier-Geburtstage & Meilensteine'), t('Emotional moments owners love to share.', 'Emotionale Momente, die Halter gern teilen.'), false],
                [Users, t('Household sharing', 'Haushalt teilen'), t('More people per pet means more opens and less churn.', 'Mehr Personen pro Tier: mehr Nutzung, weniger Abwanderung.'), false],
                [Stethoscope, t('Clinic follow-ups', 'Nachsorge der Praxis'), t('“How is Mila after the dental?” three days later.', '„Wie geht es Mila nach der Zahnbehandlung?“ drei Tage später.'), true],
              ].map(([I, l, d, live]) => {
                const Icon = I as typeof Flame
                return (
                  <motion.div {...fade} key={l as string} className="card p-5">
                    <div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl bg-coral-soft text-coral"><Icon size={19} /></span>{live && <Badge tone="brand">{t('In prototype', 'Im Prototyp')}</Badge>}</div>
                    <div className="mt-3 font-semibold">{l as string}</div>
                    <div className="mt-1 text-sm text-ink-2">{d as string}</div>
                  </motion.div>
                )
              })}
            </div>
          </Section>

          {/* ----------------------------------------------------------- handover */}
          <Section id="handover" n="08" title={t('Deliverables & handover', 'Lieferumfang & Übergabe')}>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                [GitBranch, t('Source code & repositories', 'Quellcode & Repositories'), t('In your GitHub organisation from day one. You own everything.', 'Ab Tag 1 in Ihrer GitHub-Organisation. Alles gehört Ihnen.')],
                [KeyRound, t('All accounts in your name', 'Alle Accounts auf Ihren Namen'), t('Apple Developer, Google Play, Supabase, Expo, hosting and e-mail.', 'Apple Developer, Google Play, Supabase, Expo, Hosting und E-Mail.')],
                [FileCheck2, t('Documentation for takeover', 'Dokumentation zur Übernahme'), t('Setup guide, architecture, data model, runbooks, decision records.', 'Setup-Anleitung, Architektur, Datenmodell, Runbooks, Entscheidungsprotokolle.')],
                [Lock, t('Security review before launch', 'Sicherheitsprüfung vor Launch'), t('OWASP MASVS checklist, automated RLS tests, dependency audit, optional external pen-test.', 'OWASP-MASVS-Checkliste, automatisierte RLS-Tests, Dependency-Audit, optional externer Pentest.')],
                [Rocket, t('Store submission support', 'Unterstützung bei Store-Einreichung'), t('Listings, screenshots, privacy declarations and review replies.', 'Einträge, Screenshots, Datenschutzangaben und Review-Antworten.')],
                [Scale, t('Lawyer-ready legal texts', 'Anwaltsfertige Rechtstexte'), t('Impressum, privacy, terms, AVV and store declarations in DE/EN, exportable as Markdown.', 'Impressum, Datenschutz, AGB, AVV und Store-Angaben in DE/EN, als Markdown exportierbar.')],
              ].map(([I, l, d]) => {
                const Icon = I as typeof Lock
                return <motion.div {...fade} key={l as string} className="card flex gap-4 p-5"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand"><Icon size={20} /></span><div><div className="font-semibold">{l as string}</div><div className="mt-1 text-sm text-ink-2">{d as string}</div></div></motion.div>
              })}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link to="/legal/privacy"><Button variant="outline" icon={<Scale size={16} />}>{t('Read the legal drafts', 'Rechtstexte ansehen')}</Button></Link>
            </div>
          </Section>

          {/* cta */}
          <motion.div {...fade} className="relative overflow-hidden rounded-[2rem] bg-ink p-10 text-canvas sm:p-14">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand/50 blur-3xl" />
            <div className="absolute -bottom-24 left-20 h-60 w-60 rounded-full bg-coral/40 blur-3xl" />
            <div className="relative">
              <h2 className="font-display text-4xl font-semibold leading-tight">{t('Next step: a 30-minute call.', 'Nächster Schritt: ein 30-minütiges Gespräch.')}</h2>
              <p className="mt-3 max-w-xl text-canvas/70">{t('We walk through this prototype together, adjust the scope to your priorities and lock the Phase 1 plan.', 'Wir gehen den Prototyp gemeinsam durch, passen den Umfang an Ihre Prioritäten an und fixieren den Phase-1-Plan.')}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/live"><Button size="lg" className="!bg-canvas !text-ink" iconRight={<ArrowRight size={17} />}>{t('See the live demo', 'Live-Demo ansehen')}</Button></Link>
                <Link to="/app"><Button size="lg" variant="outline" className="!border-white/20 !bg-transparent !text-canvas">{t('Open the owner app', 'Halter-App öffnen')}</Button></Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function Section({ id, n, title, sub, children }: { id: string; n: string; title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <motion.div {...fade} className="mb-7">
        <div className="font-display text-sm font-semibold text-coral">{n}</div>
        <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
        {sub && <p className="mt-3 max-w-3xl text-ink-2">{sub}</p>}
      </motion.div>
      {children}
    </section>
  )
}

function ListCard({ icon: Icon, tone, title, items }: { icon: React.ElementType; tone: string; title: string; items: [string, string][] }) {
  return (
    <motion.div {...fade} className="card p-6">
      <div className="flex items-center gap-3"><span className={`grid h-10 w-10 place-items-center rounded-xl bg-${tone}-soft text-${tone}`}><Icon size={19} /></span><div className="font-display text-xl font-semibold">{title}</div></div>
      <div className="mt-4 space-y-4">{items.map(([h, d]) => <div key={h}><div className="text-[15px] font-semibold">{h}</div><div className="mt-0.5 text-sm text-ink-2">{d}</div></div>)}</div>
    </motion.div>
  )
}

function RiskCard({ icon: Icon, title, items }: { icon: React.ElementType; title: string; items: [string, string][] }) {
  const { t } = useI18n()
  return (
    <motion.div {...fade} className="card p-6">
      <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-sun-soft text-sun"><Icon size={19} /></span><div className="font-display text-xl font-semibold">{title}</div></div>
      <div className="mt-4 space-y-3">
        {items.map(([r, m]) => (
          <div key={r} className="rounded-2xl bg-muted/60 p-3.5">
            <div className="flex items-start gap-2 text-sm font-semibold"><AlertTriangle size={15} className="mt-0.5 shrink-0 text-sun" />{r}</div>
            <div className="mt-1 flex items-start gap-2 text-[13px] text-ink-2"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-sage" /><span><b className="text-ink">{t('Mitigation:', 'Maßnahme:')}</b> {m}</span></div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function ArchDiagram() {
  const { t } = useI18n()
  const box = (x: number, y: number, w: number, h: number, title: string, sub: string, tone: string, icon?: React.ReactNode) => (
    <g transform={`translate(${x},${y})`}>
      <rect width={w} height={h} rx="14" fill={`rgb(var(--c-${tone}-soft))`} stroke={`rgb(var(--c-${tone}) / 0.35)`} />
      <foreignObject width={w} height={h}>
        <div className="flex h-full flex-col justify-center px-3">
          <div className={`flex items-center gap-1.5 text-[12.5px] font-semibold text-${tone}`}>{icon}{title}</div>
          <div className="mt-0.5 text-[11px] leading-snug text-ink-2">{sub}</div>
        </div>
      </foreignObject>
    </g>
  )
  return (
    <svg viewBox="0 0 900 400" className="mx-auto w-full min-w-[720px] max-w-4xl">
      <defs><marker id="ar" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="rgb(var(--c-ink-3))" /></marker></defs>
      {/* clients */}
      {box(20, 30, 180, 64, t('Owner app', 'Halter-App'), 'React Native · iOS/Android', 'brand', <Smartphone size={13} />)}
      {box(20, 116, 180, 64, t('Clinic dashboard', 'Praxis-Dashboard'), 'Next.js · web', 'sky', <Building2 size={13} />)}
      {box(20, 202, 180, 64, t('Admin console', 'Admin-Konsole'), 'Next.js · internal', 'coral', <ShieldCheck size={13} />)}
      {box(20, 288, 180, 64, t('Insurer partners', 'Versicherer'), 'REST API + webhooks', 'plum', <Umbrella size={13} />)}
      {/* eu region */}
      <rect x="270" y="14" width="380" height="372" rx="22" fill="none" stroke="rgb(var(--c-brand))" strokeDasharray="6 6" strokeOpacity="0.5" />
      <text x="290" y="40" fontSize="12" fontWeight="700" fill="rgb(var(--c-brand))">EU · FRANKFURT (eu-central-1)</text>
      {box(295, 56, 330, 56, 'Auth', t('Apple / Google / magic link · 2FA for staff', 'Apple / Google / Magic Link · 2FA für Personal'), 'sage', <KeyRound size={13} />)}
      {box(295, 126, 330, 76, t('Postgres + Row-Level Security', 'Postgres + Row-Level-Security'), t('pets · health · bookings · messages · consents · audit_log. Consent checked on every read.', 'Tiere · Akte · Buchungen · Nachrichten · Einwilligungen · Audit-Log. Einwilligung bei jedem Zugriff geprüft.'), 'brand', <Database size={13} />)}
      {box(295, 216, 160, 60, 'Storage', t('Documents, encrypted', 'Dokumente, verschlüsselt'), 'sun', <Boxes size={13} />)}
      {box(465, 216, 160, 60, 'Realtime', t('Chat & booking inbox', 'Chat & Buchungs-Inbox'), 'sky', <Layers size={13} />)}
      {box(295, 290, 330, 70, 'Edge Functions + pg_cron', t('Reminder scheduler · PMS adapters · insurer API · export/delete jobs', 'Erinnerungs-Planer · PVS-Adapter · Versicherer-API · Export/Lösch-Jobs'), 'plum', <Cloud size={13} />)}
      {/* external */}
      {box(710, 56, 170, 64, 'APNs / FCM', t('Push delivery', 'Push-Zustellung'), 'coral', <BellRing size={13} />)}
      {box(710, 150, 170, 64, t('E-mail (EU)', 'E-Mail (EU)'), t('Magic links, digests', 'Magic Links, Übersichten'), 'sage', <Globe2 size={13} />)}
      {box(710, 244, 170, 64, t('Practice software', 'Praxissoftware'), 'Provet API · Vetera · iCal/CSV', 'sky', <Stethoscope size={13} />)}
      {/* arrows */}
      {[62, 148, 234, 320].map((y) => <line key={y} x1="200" y1={y} x2="290" y2={y < 200 ? 160 : 200} stroke="rgb(var(--c-ink-3))" strokeWidth="1.5" markerEnd="url(#ar)" />)}
      <line x1="625" y1="320" x2="706" y2="90" stroke="rgb(var(--c-ink-3))" strokeWidth="1.5" markerEnd="url(#ar)" />
      <line x1="625" y1="325" x2="706" y2="182" stroke="rgb(var(--c-ink-3))" strokeWidth="1.5" markerEnd="url(#ar)" />
      <line x1="625" y1="330" x2="706" y2="276" stroke="rgb(var(--c-ink-3))" strokeWidth="1.5" markerEnd="url(#ar)" />
    </svg>
  )
}

