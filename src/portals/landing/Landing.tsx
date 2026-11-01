import { motion } from 'framer-motion'
import {
  ArrowRight, BellRing, Building2, CalendarCheck2, Check, FileHeart, FileText, Globe2, Lock, MapPin, MessageCircleHeart, PanelsTopLeft, Plug, ServerCog,
  ShieldCheck, Smartphone, Sparkles, Stethoscope, Syringe, Umbrella, UserCheck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Logo, PetAvatar } from '@/components/illustrations'
import { LangToggle, ThemeToggle } from '@/components/shell'
import { Badge, Button, Ring } from '@/components/ui'
import { useI18n } from '@/i18n'

const fade = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-80px' }, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } }

export default function Landing() {
  const { t } = useI18n()
  return (
    <div className="relative overflow-x-hidden bg-canvas">
      {/* ---------------------------------------------------------------- nav */}
      <header className="sticky top-0 z-40 border-b border-line/50 bg-canvas/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
          <Link to="/"><Logo size={30} /></Link>
          <nav className="hidden items-center gap-1 text-sm font-medium text-ink-2 md:flex">
            <a href="#portals" className="rounded-lg px-3 py-1.5 hover:bg-muted hover:text-ink">{t('Platform', 'Plattform')}</a>
            <a href="#features" className="rounded-lg px-3 py-1.5 hover:bg-muted hover:text-ink">{t('Features', 'Funktionen')}</a>
            <a href="#trust" className="rounded-lg px-3 py-1.5 hover:bg-muted hover:text-ink">{t('Privacy', 'Datenschutz')}</a>
            <Link to="/proposal" className="rounded-lg px-3 py-1.5 hover:bg-muted hover:text-ink">{t('Proposal', 'Angebot')}</Link>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <LangToggle />
            <ThemeToggle />
            <Link to="/app" className="hidden sm:block"><Button size="sm" iconRight={<ArrowRight size={15} />}>{t('Open app', 'App öffnen')}</Button></Link>
          </div>
        </div>
      </header>

      {/* --------------------------------------------------------------- hero */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 bg-grain [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="pointer-events-none absolute -left-40 top-20 h-[520px] w-[520px] rounded-full bg-brand/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-40 h-[420px] w-[420px] rounded-full bg-coral/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pb-28 lg:pt-20">
          <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-3 text-xs font-medium text-ink-2 shadow-soft">
              <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-fg">{t('Prototype', 'Prototyp')}</span>
              {t('Owner app · Clinic · Admin · Insurer, all connected', 'Halter-App · Praxis · Admin · Versicherer, alles verbunden')}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.7 }}
              className="mt-6 font-display text-[44px] font-semibold leading-[1.02] tracking-[-0.02em] sm:text-6xl lg:text-[68px]"
            >
              {t('Every vaccine, every vet visit.', 'Jede Impfung, jeder Tierarzttermin.')}
              <br />
              <span className="italic text-gradient">{t('Never missed again.', 'Nie wieder vergessen.')}</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.7 }} className="mt-6 max-w-xl text-lg leading-relaxed text-ink-2">
              {t(
                'Vetly gives pet owners in Germany one calm place for health records, reminders, vet booking and clinic chat, and gives clinics a dashboard that ends phone-tag and no-shows.',
                'Vetly gibt Tierhaltern in Deutschland einen ruhigen Ort für Gesundheitsakte, Erinnerungen, Terminbuchung und Praxis-Chat und Praxen ein Dashboard, das Telefonstress und No-Shows beendet.',
              )}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="mt-8 flex flex-wrap gap-3">
              <Link to="/app"><Button size="lg" icon={<Smartphone size={18} />}>{t('Try the owner app', 'Halter-App testen')}</Button></Link>
              <Link to="/live"><Button size="lg" variant="outline" icon={<PanelsTopLeft size={18} />}>{t('Watch it live, side by side', 'Live nebeneinander ansehen')}</Button></Link>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-[13px] text-ink-2">
              {[
                [ServerCog, t('EU-hosted · Frankfurt', 'EU-gehostet · Frankfurt')],
                [ShieldCheck, t('GDPR by design', 'DSGVO by Design')],
                [Globe2, 'Deutsch · English'],
                [Smartphone, 'iOS · Android'],
              ].map(([I, l], i) => {
                const Icon = I as typeof ServerCog
                return <span key={i} className="flex items-center gap-2"><Icon size={15} className="text-brand" />{l as string}</span>
              })}
            </motion.div>
          </div>

          <HeroVisual />
        </div>
      </section>

      {/* ---------------------------------------------------------- problem */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2">
          {[
            {
              who: t('Pet owners', 'Tierhalter'), tone: 'coral' as const, icon: FileHeart,
              pain: t('“When was Mila’s last worming? Where is the vaccination booklet?”', '„Wann war Milas letzte Entwurmung? Wo ist der Impfpass?“'),
              fix: [t('One health record per pet, always in your pocket', 'Eine Gesundheitsakte pro Tier, immer dabei'), t('Reminders before anything is due, switchable one by one', 'Erinnerungen vor jeder Fälligkeit, einzeln schaltbar'), t('Book a vet at 11 pm, no phone call needed', 'Tierarzt um 23 Uhr buchen, ohne Anruf')],
            },
            {
              who: t('Vet clinics', 'Tierarztpraxen'), tone: 'brand' as const, icon: Stethoscope,
              pain: t('“The phone rings all morning, and two patients didn’t show up again.”', '„Das Telefon klingelt den ganzen Morgen, und wieder sind zwei Patienten nicht gekommen.“'),
              fix: [t('Booking requests arrive structured: pet, service, slot', 'Anfragen kommen strukturiert: Tier, Leistung, Termin'), t('Automatic reminders cut no-shows', 'Automatische Erinnerungen senken No-Shows'), t('Consented patient records & chat in one dashboard', 'Freigegebene Akten & Chat in einem Dashboard')],
            },
          ].map((c) => (
            <motion.div key={c.who} {...fade} className="card relative overflow-hidden p-7 sm:p-9">
              <div className={`absolute -right-16 -top-16 h-48 w-48 rounded-full ${c.tone === 'coral' ? 'bg-coral/10' : 'bg-brand/10'}`} />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <span className={`grid h-11 w-11 place-items-center rounded-2xl ${c.tone === 'coral' ? 'bg-coral-soft text-coral' : 'bg-brand-soft text-brand'}`}><c.icon size={21} /></span>
                  <span className="eyebrow">{c.who}</span>
                </div>
                <p className="mt-5 font-display text-2xl leading-snug text-ink">{c.pain}</p>
                <ul className="mt-6 space-y-3">
                  {c.fix.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[15px] text-ink-2">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand text-brand-fg"><Check size={12} strokeWidth={3} /></span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- portals */}
      <section id="portals" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6">
        <motion.div {...fade} className="mx-auto max-w-2xl text-center">
          <div className="eyebrow">{t('One platform · four experiences', 'Eine Plattform · vier Oberflächen')}</div>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{t('Click through every side of Vetly', 'Klicken Sie sich durch jede Seite von Vetly')}</h2>
          <p className="mt-4 text-ink-2">{t('Everything below is interactive and shares one live data model. Book on the phone and the clinic sees it instantly.', 'Alles ist interaktiv und teilt ein Live-Datenmodell. Auf dem Handy buchen, und die Praxis sieht es sofort.')}</p>
        </motion.div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <PortalCard
            to="/app" icon={Smartphone} hue={168} tag={t('Phase 1 · iOS & Android', 'Phase 1 · iOS & Android')}
            title={t('Owner app', 'Halter-App')}
            body={t('Pets, health records, reminders, documents, clinic search, booking and chat, in German & English.', 'Tiere, Gesundheitsakte, Erinnerungen, Dokumente, Praxissuche, Buchung und Chat, auf Deutsch & Englisch.')}
            preview={<OwnerPreview />}
          />
          <PortalCard
            to="/clinic" icon={Building2} hue={214} tag={t('Phase 2 · Web', 'Phase 2 · Web')}
            title={t('Clinic dashboard', 'Praxis-Dashboard')}
            body={t('Accept or reschedule requests, see consented patient records, chat, send reminders, set hours & services.', 'Anfragen annehmen oder verschieben, freigegebene Akten sehen, chatten, Erinnerungen senden, Zeiten & Leistungen pflegen.')}
            preview={<ClinicPreview />}
          />
          <PortalCard
            to="/admin" icon={ShieldCheck} hue={14} tag={t('Our addition', 'Unser Vorschlag')}
            title={t('Admin console', 'Admin-Konsole')}
            body={t('Users, clinics, plans and revenue, insurers, GDPR requests, audit log and system health, all from one place.', 'Nutzer, Praxen, Tarife & Umsatz, Versicherer, DSGVO-Anfragen, Audit-Log und Systemstatus, alles an einem Ort.')}
            preview={<AdminPreview />}
          />
          <PortalCard
            to="/insurer" icon={Umbrella} hue={270} tag={t('Insurance-ready', 'Versicherungs-ready')}
            title={t('Insurer portal', 'Versicherer-Portal')}
            body={t('Partner onboarding, API keys, and consented, scoped, time-limited access to pet health data.', 'Partner-Onboarding, API-Schlüssel und freigegebener, begrenzter, befristeter Zugriff auf Gesundheitsdaten.')}
            preview={<InsurerPreview />}
          />
        </div>

        <motion.div {...fade}>
          <Link to="/live" className="group relative mt-5 flex flex-col items-start gap-6 overflow-hidden rounded-3xl bg-ink p-8 text-canvas sm:flex-row sm:items-center sm:p-10">
            <div className="absolute -right-10 -top-24 h-72 w-72 rounded-full bg-brand/40 blur-3xl" />
            <div className="absolute -bottom-24 left-1/3 h-60 w-60 rounded-full bg-coral/30 blur-3xl" />
            <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/10"><PanelsTopLeft size={26} /></span>
            <div className="relative flex-1">
              <div className="font-display text-2xl font-semibold sm:text-3xl">{t('See the magic: phone and clinic, side by side', 'Der Aha-Moment: Handy und Praxis nebeneinander')}</div>
              <p className="mt-2 max-w-2xl text-canvas/70">{t('Request an appointment on the phone, accept it in the dashboard, and watch the push notification land, live.', 'Termin am Handy anfragen, im Dashboard annehmen und zusehen, wie die Push-Nachricht ankommt, live.')}</p>
            </div>
            <span className="relative flex items-center gap-2 rounded-full bg-canvas px-5 py-3 text-sm font-semibold text-ink transition group-hover:gap-3">{t('Start live demo', 'Live-Demo starten')} <ArrowRight size={16} /></span>
          </Link>
        </motion.div>
      </section>

      {/* ---------------------------------------------------------- features bento */}
      <section id="features" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6">
        <motion.div {...fade} className="max-w-2xl">
          <div className="eyebrow">{t('Phase 1 scope, fully designed', 'Phase-1-Umfang, komplett gestaltet')}</div>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{t('Calm by design. Complete in scope.', 'Ruhig im Design. Vollständig im Umfang.')}</h2>
        </motion.div>
        <div className="mt-10 grid auto-rows-[minmax(180px,auto)] gap-4 md:grid-cols-6">
          <Bento className="md:col-span-3 md:row-span-2" icon={Syringe} tone="brand" title={t('Health record per pet', 'Gesundheitsakte pro Tier')} body={t('Vaccinations, worming, flea & tick, medication. Each has a due date, an optional repeat and its own reminder switch.', 'Impfungen, Entwurmung, Floh & Zecke, Medikamente. Jeweils mit Fälligkeit, optionaler Wiederholung und eigenem Erinnerungs-Schalter.')}>
            <div className="mt-6 space-y-2.5">
              {[
                ['SHPPi + L4', t('in 9 days', 'in 9 Tagen'), 'sun', 72],
                ['Milbemax', t('in 4 days', 'in 4 Tagen'), 'coral', 88],
                ['Bravecto', t('in 18 days', 'in 18 Tagen'), 'brand', 40],
                [t('Rabies', 'Tollwut'), t('in 13 months', 'in 13 Monaten'), 'sage', 12],
              ].map(([n, d, tone, w]) => (
                <div key={n as string} className="flex items-center gap-3 rounded-2xl border border-line/70 bg-canvas px-4 py-3">
                  <span className={`h-2.5 w-2.5 rounded-full bg-${tone}`} />
                  <span className="flex-1 text-sm font-medium">{n}</span>
                  <div className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-muted sm:block"><div className={`h-full rounded-full bg-${tone}`} style={{ width: `${w}%` }} /></div>
                  <span className="w-24 text-right text-xs text-ink-3">{d}</span>
                </div>
              ))}
            </div>
          </Bento>
          <Bento className="md:col-span-3" icon={BellRing} tone="coral" title={t('Smart reminders', 'Smarte Erinnerungen')} body={t('Push notifications before anything is due, with quiet hours, per-item switches and clinic-sent reminders.', 'Push-Benachrichtigungen vor jeder Fälligkeit, mit Ruhezeiten, Einzelschaltern und Erinnerungen von der Praxis.')} />
          <Bento className="md:col-span-3" icon={CalendarCheck2} tone="sky" title={t('Booking in 4 taps', 'Buchung in 4 Schritten')} body={t('Clinic → service → slot → send. Confirmation arrives as a push. The clinic can accept or propose a new time.', 'Praxis → Leistung → Zeit → senden. Bestätigung kommt per Push. Die Praxis kann annehmen oder neu vorschlagen.')} />
          <Bento className="md:col-span-2" icon={MessageCircleHeart} tone="plum" title={t('Clinic chat', 'Praxis-Chat')} body={t('Photos & PDFs, push, read receipts, and a permanent “not for emergencies” notice.', 'Fotos & PDFs, Push, Lesebestätigung und dauerhafter „Kein Notfall-Chat“-Hinweis.')} />
          <Bento className="md:col-span-2" icon={MapPin} tone="sage" title={t('Clinic search', 'Praxissuche')} body={t('Distance, opening hours, “open now”, 24/7 emergency clinics and species filters.', 'Entfernung, Öffnungszeiten, „jetzt geöffnet“, 24/7-Notdienste und Tierart-Filter.')} />
          <Bento className="md:col-span-2" icon={FileText} tone="sun" title={t('Documents', 'Dokumente')} body={t('Vaccination record, reports and invoices as photo or PDF, sorted per pet.', 'Impfpass, Befunde und Rechnungen als Foto oder PDF, pro Tier sortiert.')} />
        </div>
      </section>

      {/* ---------------------------------------------------------- trust */}
      <section id="trust" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6">
        <div className="card overflow-hidden">
          <div className="grid lg:grid-cols-[1fr_1.1fr]">
            <div className="p-8 sm:p-12">
              <Badge tone="brand" dot>{t('Privacy first', 'Datenschutz zuerst')}</Badge>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight">{t('Owners decide who sees what, and for how long.', 'Halter entscheiden, wer was sieht, und wie lange.')}</h2>
              <p className="mt-4 text-ink-2">{t('Every record access is consent-gated, scoped and logged. Data lives in the EU. Export and “delete my data” are one tap away.', 'Jeder Zugriff ist einwilligungsbasiert, begrenzt und protokolliert. Daten liegen in der EU. Export und „Meine Daten löschen“ sind einen Tipp entfernt.')}</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  [ServerCog, t('EU hosting (Frankfurt)', 'EU-Hosting (Frankfurt)')],
                  [Lock, t('Row-level security', 'Row-Level-Security')],
                  [UserCheck, t('Granular consent', 'Granulare Einwilligung')],
                  [FileText, t('Impressum, privacy & AVV', 'Impressum, Datenschutz & AVV')],
                ].map(([I, l], i) => {
                  const Icon = I as typeof Lock
                  return <div key={i} className="flex items-center gap-3 rounded-2xl bg-muted/60 px-4 py-3 text-sm font-medium"><Icon size={17} className="text-brand" />{l as string}</div>
                })}
              </div>
            </div>
            <ConsentDiagram />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- proposal CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6">
        <motion.div {...fade} className="relative overflow-hidden rounded-[2rem] bg-brand px-8 py-14 text-brand-fg sm:px-14">
          <div className="absolute inset-0 bg-grain opacity-30" />
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10" />
          <div className="absolute -bottom-32 right-40 h-72 w-72 rounded-full bg-coral/40 blur-2xl" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] opacity-80"><Sparkles size={14} /> {t('Our proposal', 'Unser Angebot')}</div>
              <h2 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">{t('Stack, architecture, milestones, risks & ideas.', 'Stack, Architektur, Meilensteine, Risiken & Ideen.')}</h2>
              <p className="mt-4 max-w-xl opacity-80">{t('Every question from your brief answered on one page, including what we would add, cut or change to launch faster.', 'Jede Frage aus Ihrem Briefing auf einer Seite beantwortet, inklusive was wir ergänzen, streichen oder ändern würden, um schneller zu starten.')}</p>
            </div>
            <div className="flex flex-col gap-3 lg:items-end">
              <Link to="/proposal"><Button size="lg" variant="dark" className="!bg-canvas !text-ink" iconRight={<ArrowRight size={17} />}>{t('Read the proposal', 'Angebot lesen')}</Button></Link>
              <div className="flex items-center gap-2 text-sm opacity-80"><Plug size={15} /> {t('incl. practice-software integration research', 'inkl. Recherche zu Praxissoftware-Schnittstellen')}</div>
            </div>
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-line/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-ink-3 sm:flex-row sm:px-6">
          <Logo size={24} />
          <div className="flex flex-wrap items-center justify-center gap-5">
            <Link to="/legal/impressum" className="hover:text-ink">Impressum</Link>
            <Link to="/legal/privacy" className="hover:text-ink">{t('Privacy', 'Datenschutz')}</Link>
            <Link to="/legal/terms" className="hover:text-ink">{t('Terms', 'AGB')}</Link>
            <Link to="/legal/dpa" className="hover:text-ink">AVV / DPA</Link>
          </div>
          <div>{t('Interactive prototype · demo data only', 'Interaktiver Prototyp · nur Demodaten')}</div>
        </div>
      </footer>
    </div>
  )
}

/* ------------------------------------------------------------------ pieces */
function Bento({ className, icon: Icon, tone, title, body, children }: { className?: string; icon: React.ElementType; tone: string; title: string; body: string; children?: React.ReactNode }) {
  return (
    <motion.div {...fade} className={`card group relative overflow-hidden p-7 transition hover:-translate-y-1 hover:shadow-lift ${className ?? ''}`}>
      <span className={`grid h-11 w-11 place-items-center rounded-2xl bg-${tone}-soft text-${tone}`}><Icon size={21} /></span>
      <div className="mt-5 font-display text-xl font-semibold">{title}</div>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{body}</p>
      {children}
    </motion.div>
  )
}

function PortalCard({ to, icon: Icon, hue, tag, title, body, preview }: { to: string; icon: React.ElementType; hue: number; tag: string; title: string; body: string; preview: React.ReactNode }) {
  return (
    <motion.div {...fade}>
      <Link to={to} className="card group relative flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-float">
        <div className="relative h-60 overflow-hidden border-b border-line/60" style={{ background: `linear-gradient(150deg, hsl(${hue} 60% 95%), hsl(${(hue + 30) % 360} 50% 90%))` }}>
          <div className="absolute inset-0 bg-grain opacity-60" />
          <div className="absolute inset-x-8 top-8 transition duration-500 group-hover:-translate-y-1.5">{preview}</div>
        </div>
        <div className="flex flex-1 items-start gap-4 p-6">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl" style={{ background: `hsl(${hue} 60% 92%)`, color: `hsl(${hue} 55% 32%)` }}><Icon size={21} /></span>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <div className="font-display text-xl font-semibold">{title}</div>
              <Badge>{tag}</Badge>
            </div>
            <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-2">{body}</p>
          </div>
          <ArrowRight size={20} className="mt-1 shrink-0 text-ink-3 transition group-hover:translate-x-1 group-hover:text-ink" />
        </div>
      </Link>
    </motion.div>
  )
}

const miniCard = 'rounded-2xl bg-white/90 shadow-lift ring-1 ring-black/5 dark:bg-surface/95'

function OwnerPreview() {
  return (
    <div className="flex justify-center gap-4">
      <div className={`${miniCard} w-52 p-4`}>
        <div className="flex items-center gap-2.5">
          <PetAvatar species="dog" hue={32} size={38} />
          <div><div className="text-sm font-semibold text-ink">Bruno</div><div className="text-[10px] text-ink-3">Labrador · 5 J.</div></div>
          <Ring value={86} size={40} stroke={5}><span className="text-[10px] font-bold">86</span></Ring>
        </div>
        <div className="mt-3 space-y-1.5">
          {['SHPPi + L4', 'Milbemax', 'Bravecto'].map((x, i) => (
            <div key={x} className="flex items-center justify-between rounded-lg bg-muted/70 px-2.5 py-1.5 text-[10px]"><span className="font-medium text-ink">{x}</span><span className="text-ink-3">{[9, 4, 18][i]} d</span></div>
          ))}
        </div>
      </div>
      <div className={`${miniCard} mt-10 hidden w-44 p-3 sm:block`}>
        <div className="flex items-center gap-2 text-[10px] font-semibold text-coral"><BellRing size={12} /> Vetly · now</div>
        <div className="mt-1 text-xs font-semibold text-ink">Apoquel for Bruno</div>
        <div className="text-[10px] text-ink-3">16 mg with breakfast</div>
      </div>
    </div>
  )
}

function ClinicPreview() {
  return (
    <div className={`${miniCard} mx-auto max-w-sm p-4`}>
      <div className="flex items-center justify-between"><div className="text-xs font-semibold text-ink">Booking requests</div><Badge tone="coral">2 new</Badge></div>
      {[['Luna', 'Border Collie', 'Check-up · 09:00', 260], ['Oskar', 'Maine Coon', 'Senior check · 11:15', 18]].map(([n, b, s, h]) => (
        <div key={n as string} className="mt-2.5 flex items-center gap-2.5 rounded-xl bg-muted/60 p-2">
          <PetAvatar species={n === 'Luna' ? 'dog' : 'cat'} hue={h as number} size={30} />
          <div className="flex-1"><div className="text-[11px] font-semibold text-ink">{n} <span className="font-normal text-ink-3">· {b}</span></div><div className="text-[10px] text-ink-3">{s}</div></div>
          <span className="rounded-lg bg-brand px-2 py-1 text-[10px] font-semibold text-brand-fg">Accept</span>
        </div>
      ))}
    </div>
  )
}

function AdminPreview() {
  const bars = [32, 40, 38, 52, 58, 64, 70, 78, 74, 88, 94, 100]
  return (
    <div className={`${miniCard} mx-auto max-w-sm p-4`}>
      <div className="grid grid-cols-3 gap-2">
        {[['Users', '18.4k'], ['MRR', '€21.4k'], ['Clinics', '148']].map(([l, v]) => (
          <div key={l} className="rounded-xl bg-muted/60 p-2"><div className="text-[9px] text-ink-3">{l}</div><div className="font-display text-sm font-semibold text-ink">{v}</div></div>
        ))}
      </div>
      <div className="mt-3 flex h-16 items-end gap-1">
        {bars.map((b, i) => <div key={i} className="flex-1 rounded-t bg-coral/80" style={{ height: `${b}%`, opacity: 0.4 + i * 0.05 }} />)}
      </div>
    </div>
  )
}

function InsurerPreview() {
  return (
    <div className={`${miniCard} mx-auto max-w-sm p-4`}>
      <div className="text-xs font-semibold text-ink">Partner onboarding</div>
      <div className="mt-3 space-y-2">
        {['Company verified', 'AVV signed', 'API keys issued', 'Webhooks live'].map((s, i) => (
          <div key={s} className="flex items-center gap-2 text-[11px]">
            <span className={`grid h-4 w-4 place-items-center rounded-full ${i < 3 ? 'bg-plum text-white' : 'bg-muted ring-1 ring-line'}`}>{i < 3 && <Check size={10} strokeWidth={3} />}</span>
            <span className={i < 3 ? 'text-ink' : 'text-ink-3'}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ConsentDiagram() {
  const { t } = useI18n()
  return (
    <div className="relative min-h-[340px] overflow-hidden bg-muted/50 p-8">
      <div className="absolute inset-0 bg-grain" />
      <div className="relative flex h-full flex-col items-center justify-center gap-6">
        <div className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 shadow-lift">
          <PetAvatar species="dog" hue={32} size={40} />
          <div><div className="text-sm font-semibold">Bruno</div><div className="text-xs text-ink-3">{t('Owner: Lena H.', 'Halterin: Lena H.')}</div></div>
        </div>
        <svg width="280" height="50" viewBox="0 0 280 50" className="text-line">
          <path d="M140 0v14M140 14C140 30 40 22 40 50M140 14c0 16 100 8 100 36M140 14v36" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="4 4" />
        </svg>
        <div className="-mt-6 grid w-full max-w-md grid-cols-3 gap-3">
          {[
            { l: t('Praxis Lehmann', 'Praxis Lehmann'), s: t('Full record', 'Volle Akte'), on: true, icon: Stethoscope },
            { l: t('New vet', 'Neue Praxis'), s: t('Vaccines · 30 days', 'Impfungen · 30 Tage'), on: true, icon: Building2 },
            { l: t('Insurer', 'Versicherer'), s: t('Not shared', 'Nicht geteilt'), on: false, icon: Umbrella },
          ].map((n) => (
            <div key={n.l} className={`rounded-2xl p-3 text-center shadow-soft ${n.on ? 'bg-surface' : 'bg-surface/60 opacity-70'}`}>
              <span className={`mx-auto grid h-9 w-9 place-items-center rounded-xl ${n.on ? 'bg-brand-soft text-brand' : 'bg-muted text-ink-3'}`}>{n.on ? <n.icon size={17} /> : <Lock size={16} />}</span>
              <div className="mt-2 text-[11px] font-semibold">{n.l}</div>
              <div className={`mt-0.5 text-[10px] ${n.on ? 'text-brand' : 'text-ink-3'}`}>{n.s}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ hero visual */
function HeroVisual() {
  const { t } = useI18n()
  return (
    <div className="relative mx-auto h-[560px] w-full max-w-[560px]">
      {/* phone */}
      <motion.div initial={{ opacity: 0, y: 40, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: -3 }} transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }} className="absolute left-1/2 top-2 w-[270px] -translate-x-1/2">
        <div className="rounded-[46px] bg-[#111816] p-2.5 shadow-float ring-1 ring-black/10">
          <div className="relative overflow-hidden rounded-[38px] bg-canvas">
            <div className="flex items-center justify-between px-6 pt-3 text-[10px] font-semibold"><span>9:41</span><span className="h-5 w-20 rounded-full bg-[#111816]" /><span>100%</span></div>
            <div className="px-4 pb-5 pt-3">
              <div className="text-[11px] text-ink-3">{t('Good morning, Lena', 'Guten Morgen, Lena')}</div>
              <div className="font-display text-lg font-semibold">{t('Bruno is doing great', 'Bruno geht es prima')}</div>
              <div className="mt-3 rounded-3xl bg-brand p-4 text-brand-fg">
                <div className="flex items-center gap-3">
                  <PetAvatar species="dog" hue={32} size={46} />
                  <div className="flex-1"><div className="font-semibold">Bruno</div><div className="text-[10px] opacity-75">Labrador · 31.4 kg</div></div>
                  <Ring value={86} size={50} stroke={5} color="#fff" track="rgba(255,255,255,.2)"><span className="text-xs font-bold">86</span></Ring>
                </div>
              </div>
              <div className="mt-3 text-[11px] font-semibold">{t('Due soon', 'Bald fällig')}</div>
              {[
                [Syringe, 'SHPPi + L4', t('9 days', '9 Tage'), 'bg-sun-soft text-sun'],
                [Sparkles, 'Milbemax', t('4 days', '4 Tage'), 'bg-coral-soft text-coral'],
                [CalendarCheck2, t('Vet · Lehmann', 'Praxis Lehmann'), '10:30', 'bg-brand-soft text-brand'],
              ].map(([I, n, d, c], i) => {
                const Icon = I as typeof Syringe
                return (
                  <div key={i} className="mt-2 flex items-center gap-2.5 rounded-2xl bg-surface p-2.5 shadow-soft">
                    <span className={`grid h-8 w-8 place-items-center rounded-xl ${c}`}><Icon size={14} /></span>
                    <span className="flex-1 text-[11px] font-semibold">{n as string}</span>
                    <span className="text-[10px] text-ink-3">{d as string}</span>
                  </div>
                )
              })}
              <div className="mt-3 flex justify-around rounded-2xl bg-surface py-2 shadow-soft">
                {[0, 1, 2, 3, 4].map((i) => <span key={i} className={`h-1.5 w-6 rounded-full ${i === 0 ? 'bg-brand' : 'bg-line'}`} />)}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* floating: push */}
      <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.7 }} className="absolute left-0 top-16 w-60 animate-floaty">
        <div className="glass rounded-2xl p-3.5 shadow-float">
          <div className="flex items-center gap-2 text-[11px] text-ink-3"><span className="grid h-5 w-5 place-items-center rounded-md bg-brand text-[9px] font-bold text-brand-fg">V</span> Vetly · {t('now', 'jetzt')}</div>
          <div className="mt-1.5 text-[13px] font-semibold">{t('Appointment confirmed ✓', 'Termin bestätigt ✓')}</div>
          <div className="text-xs text-ink-2">{t('Bruno · Vaccination · Tue 10:30', 'Bruno · Impfung · Di 10:30')}</div>
        </div>
      </motion.div>

      {/* floating: clinic request */}
      <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7, duration: 0.7 }} className="absolute right-0 top-[44%] w-64 animate-floaty [animation-delay:1.5s]">
        <div className="rounded-2xl bg-surface p-4 shadow-float ring-1 ring-line/60">
          <div className="flex items-center justify-between"><span className="eyebrow !text-[9px]">{t('Clinic dashboard', 'Praxis-Dashboard')}</span><Badge tone="coral" dot>{t('New', 'Neu')}</Badge></div>
          <div className="mt-2.5 flex items-center gap-2.5">
            <PetAvatar species="dog" hue={260} size={34} />
            <div className="flex-1"><div className="text-[13px] font-semibold">Luna · Check-up</div><div className="text-[11px] text-ink-3">{t('Tomorrow 09:00', 'Morgen 09:00')}</div></div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <span className="rounded-lg bg-brand py-1.5 text-center text-[11px] font-semibold text-brand-fg">{t('Accept', 'Annehmen')}</span>
            <span className="rounded-lg bg-muted py-1.5 text-center text-[11px] font-semibold text-ink-2">{t('New time', 'Neue Zeit')}</span>
          </div>
        </div>
      </motion.div>

      {/* floating: stat */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.7 }} className="absolute bottom-6 left-6 w-52 animate-floaty [animation-delay:3s]">
        <div className="rounded-2xl bg-ink p-4 text-canvas shadow-float">
          <div className="text-[11px] opacity-60">{t('Data location', 'Datenstandort')}</div>
          <div className="mt-1 flex items-center gap-2 font-display text-lg font-semibold"><ServerCog size={17} /> EU · Frankfurt</div>
          <div className="mt-1 text-[11px] opacity-60">{t('Shared only with consent', 'Nur mit Einwilligung geteilt')}</div>
        </div>
      </motion.div>
    </div>
  )
}
