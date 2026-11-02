import { motion } from 'framer-motion'
import { ArrowRight, Building2, CalendarCheck, Check, LifeBuoy, Coins, Globe2, KeyRound, Moon, PawPrint, Rocket, ShieldCheck, Smartphone, TrendingUp, Umbrella, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Logo } from '@/components/illustrations'
import { LangToggle, ThemeToggle } from '@/components/shell'
import { Badge, Button, Segmented, StatCard } from '@/components/ui'
import { useI18n } from '@/i18n'
import { cn, num } from '@/lib/utils'

/* ------------------------------------------------------------------ editable pricing data
   All amounts in USD. LIST_PRICE is the regular price, BUILD_PRICE the offer for this month. */
const LIST_PRICE = 8500
const BUILD_PRICE = 6900
const CARE_PLAN = 450 // optional monthly maintenance retainer
const SPOTS = { total: 3, taken: 2 } // client spots per month
const PARTS = [
  { icon: Smartphone, price: 4500, en: 'Owner mobile app', de: 'Halter-App', sub: { en: 'iOS + Android, one codebase', de: 'iOS + Android, eine Codebasis' } },
  { icon: Building2, price: 2400, en: 'Clinic dashboard', de: 'Praxis-Dashboard', sub: { en: 'Bookings, chat, patients, reminders', de: 'Buchungen, Chat, Patienten, Erinnerungen' } },
  { icon: ShieldCheck, price: 1600, en: 'Admin console', de: 'Admin-Konsole', sub: { en: 'Users, clinics, plans, revenue, GDPR', de: 'Nutzer, Praxen, Tarife, Umsatz, DSGVO' } },
  { icon: Umbrella, price: 1200, bonus: true, en: 'Insurer partner portal', de: 'Versicherer-Portal', sub: { en: 'You asked for insurance later; we build it in now at no extra cost', de: 'Versicherung war für später geplant; wir bauen es jetzt ohne Aufpreis ein' } },
]
const MILESTONE_PAY = [1150, 1150, 1150, 1150, 1150, 1150]

/* What the client charges once live. Owner app stays free (no owner payments). */
const CLINIC_PLANS = [
  { id: 'Starter', price: 49 },
  { id: 'Pro', price: 129 },
  { id: 'Group', price: 349 },
] as const
const INSURER_FEE = 800
const DE_PRACTICES = 10500 // approx. veterinary practices in Germany

type ScenarioId = 'conservative' | 'expected' | 'ambitious'
const SCENARIOS: Record<ScenarioId, { owners: number; mix: [number, number, number]; insurers: number }> = {
  conservative: { owners: 4000, mix: [22, 20, 3], insurers: 1 },
  expected: { owners: 10000, mix: [38, 44, 8], insurers: 2 },
  ambitious: { owners: 18000, mix: [62, 71, 15], insurers: 4 },
}
const PILOT_MONTHS = 2 // first clinics onboard free
const INSURER_START = 7 // insurers sign after the platform has traction

const usd = (n: number, lang: 'en' | 'de') => new Intl.NumberFormat(lang === 'de' ? 'de-DE' : 'en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

function model(id: ScenarioId) {
  const s = SCENARIOS[id]
  const clinics = s.mix.reduce((a, b) => a + b, 0)
  const clinicMrr = s.mix.reduce((a, n, i) => a + n * CLINIC_PLANS[i].price, 0)
  const insurerMrr = s.insurers * INSURER_FEE
  const mrr = clinicMrr + insurerMrr
  let cum = 0
  let payback = 0
  const months = Array.from({ length: 12 }, (_, i) => {
    const m = i + 1
    const cf = m <= PILOT_MONTHS ? 0 : Math.pow((m - PILOT_MONTHS) / (12 - PILOT_MONTHS), 1.3)
    const inf = m < INSURER_START ? 0 : (m - INSURER_START + 1) / (12 - INSURER_START + 1)
    const c = Math.round(clinicMrr * cf)
    const ins = Math.round(insurerMrr * inf)
    cum += c + ins
    if (!payback && cum >= BUILD_PRICE) payback = m
    return { m: `M${m}`, clinics: c, insurers: ins }
  })
  return { ...s, clinics, clinicMrr, insurerMrr, mrr, arr: mrr * 12, year1: cum, payback, months }
}

const fade = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.5 } }
const tip = { contentStyle: { borderRadius: 12, border: '1px solid rgb(var(--c-line))', background: 'rgb(var(--c-surface))', fontSize: 12 }, cursor: { stroke: 'rgb(var(--c-line))' } }
const axis = { tickLine: false, axisLine: false, tick: { fontSize: 11, fill: 'rgb(var(--c-ink-3))' } }

export default function Pricing() {
  const { t, lang } = useI18n()
  const [sc, setSc] = useState<ScenarioId>('expected')
  const r = useMemo(() => model(sc), [sc])
  const month = new Date().toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US', { month: 'long' })

  const included = [
    [Globe2, t('German & English', 'Deutsch & Englisch')],
    [Moon, t('Light & dark mode', 'Hell- & Dunkelmodus')],
    [ShieldCheck, t('GDPR: consent, export, deletion', 'DSGVO: Einwilligung, Export, Löschung')],
    [KeyRound, t('Code & accounts 100% yours', 'Code & Accounts 100 % Ihres')],
    [Rocket, t('App Store & Play submission', 'App-Store- & Play-Einreichung')],
    [CalendarCheck, t('Weekly demo + testable build', 'Wöchentliche Demo + testbarer Build')],
  ] as const

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-40 border-b border-line/50 bg-canvas/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Link to="/"><Logo size={28} sub={t('Pricing', 'Preise')} /></Link>
          <div className="ml-auto flex items-center gap-2">
            <LangToggle /><ThemeToggle />
            <Link to="/proposal" className="hidden sm:block"><Button size="sm" variant="outline">{t('Proposal', 'Angebot')}</Button></Link>
          </div>
        </div>
      </header>

      {/* hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grain [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6">
          <Badge tone="brand" dot>{t('Pricing · November 2026', 'Preise · November 2026')}</Badge>
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">{t('One fixed price. A finished platform in 6 weeks.', 'Ein Festpreis. Eine fertige Plattform in 6 Wochen.')}</h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-2">{t('What it costs to build Vetly, what it can earn in its first year, and how quickly the build pays for itself.', 'Was der Bau von Vetly kostet, was die Plattform im ersten Jahr einbringen kann und wie schnell sich der Bau bezahlt macht.')}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-24 px-4 pb-24 sm:px-6">
        {/* ------------------------------------------------------------ our price */}
        <section>
          <SectionHead n="01" title={t('Our price to build it', 'Unser Preis für den Bau')} sub={t('Owner app, clinic dashboard, admin console and insurer portal, delivered in six weekly milestones.', 'Halter-App, Praxis-Dashboard, Admin-Konsole und Versicherer-Portal, geliefert in sechs wöchentlichen Meilensteinen.')} />
          <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
            <motion.div {...fade} className="relative overflow-hidden rounded-[2rem] bg-ink p-8 text-canvas sm:p-10">
              <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-brand/50 blur-3xl" />
              <div className="absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-coral/40 blur-3xl" />
              <div className="relative">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm font-semibold uppercase tracking-wider text-canvas/60">{t('This month’s offer · fixed price', 'Angebot diesen Monat · Festpreis')}</div>
                  <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
                    <span className="flex gap-1">{Array.from({ length: SPOTS.total }, (_, i) => <span key={i} className={cn('h-2 w-2 rounded-full', i < SPOTS.taken ? 'bg-white/25' : 'bg-coral')} />)}</span>
                    {t(`${SPOTS.total - SPOTS.taken} of ${SPOTS.total} spots left in ${month}`, `${SPOTS.total - SPOTS.taken} von ${SPOTS.total} Plätzen frei im ${month}`)}
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span className="font-display text-2xl text-canvas/50 line-through decoration-coral decoration-2">{usd(LIST_PRICE, lang)}</span>
                  <span className="rounded-full bg-coral px-2.5 py-0.5 text-xs font-bold text-white">{t(`Save ${usd(LIST_PRICE - BUILD_PRICE, lang)}`, `${usd(LIST_PRICE - BUILD_PRICE, lang)} sparen`)}</span>
                </div>
                <div className="mt-1 flex items-end gap-3">
                  <span className="font-display text-6xl font-semibold tracking-tight sm:text-7xl">{usd(BUILD_PRICE, lang)}</span>
                  <span className="mb-2 text-canvas/60">{t('one-time', 'einmalig')}</span>
                </div>
                <div className="mt-2 text-canvas/70">{t('6 weeks · 6 milestones · 4 products', '6 Wochen · 6 Meilensteine · 4 Produkte')}</div>
                <p className="mt-4 max-w-md text-sm text-canvas/70">{t(`We take on a maximum of ${SPOTS.total} clients per month so every build gets our full attention. ${SPOTS.taken} spots are already taken; this price holds when you confirm now.`, `Wir nehmen maximal ${SPOTS.total} Kunden pro Monat an, damit jedes Projekt unsere volle Aufmerksamkeit bekommt. ${SPOTS.taken} Plätze sind bereits vergeben; dieser Preis gilt bei Zusage jetzt.`)}</p>
                <div className="mt-8 grid gap-2.5 sm:grid-cols-2">
                  {included.map(([I, l]) => <div key={l} className="flex items-center gap-2.5 text-sm"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/10"><I size={15} /></span>{l}</div>)}
                </div>
              </div>
            </motion.div>
            <motion.div {...fade} className="card p-6">
              <div className="eyebrow">{t('What you get', 'Was Sie bekommen')}</div>
              <div className="mt-4 divide-y divide-line">
                {PARTS.map((p) => (
                  <div key={p.en} className="flex items-center gap-4 py-3.5">
                    <span className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-xl', 'bonus' in p ? 'bg-coral-soft text-coral' : 'bg-brand-soft text-brand')}><p.icon size={20} /></span>
                    <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2 font-semibold">{lang === 'de' ? p.de : p.en}{'bonus' in p && <Badge tone="coral">{t('Free bonus', 'Gratis-Bonus')}</Badge>}</div><div className="text-sm text-ink-3">{p.sub[lang]}</div></div>
                    {'bonus' in p
                      ? <div className="text-right"><div className="text-sm text-ink-3 line-through">{usd(p.price, lang)}</div><div className="font-display text-lg font-semibold text-coral">{usd(0, lang)}</div></div>
                      : <div className="font-display text-lg font-semibold">{usd(p.price, lang)}</div>}
                  </div>
                ))}
                <div className="flex items-center justify-between py-3"><span className="text-ink-2">{t('Regular price', 'Regulärer Preis')}</span><span className="font-display text-lg font-semibold text-ink-3 line-through">{usd(LIST_PRICE, lang)}</span></div>
                <div className="flex items-center justify-between pt-3"><span className="font-semibold">{t('Your price this month', 'Ihr Preis diesen Monat')}</span><span className="font-display text-2xl font-semibold text-brand">{usd(BUILD_PRICE, lang)}</span></div>
              </div>
            </motion.div>
          </div>

          <motion.div {...fade} className="card mt-4 p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="font-display text-lg font-semibold">{t('Pay per milestone', 'Zahlung pro Meilenstein')}</div>
              <div className="text-sm text-ink-3">{t('You only pay for weeks that are delivered and approved.', 'Sie zahlen nur für gelieferte und abgenommene Wochen.')}</div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {MILESTONE_PAY.map((amt, i) => (
                <div key={i} className={cn('rounded-2xl border p-3.5', i === 5 ? 'border-brand/40 bg-brand-soft' : 'border-line bg-muted/40')}>
                  <div className="text-xs font-semibold text-ink-3">M{i + 1} · {t(`Week ${i + 1}`, `Woche ${i + 1}`)}</div>
                  <div className="mt-1 font-display text-xl font-semibold">{usd(amt, lang)}</div>
                </div>
              ))}
            </div>
            <Link to="/proposal#milestones" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">{t('See what each milestone delivers', 'Was jeder Meilenstein liefert')}<ArrowRight size={15} /></Link>
          </motion.div>
        </section>

        {/* ---------------------------------------------------------- earnings */}
        <section>
          <SectionHead n="02" title={t('Earning potential in year one', 'Umsatzpotenzial im ersten Jahr')} sub={t('A realistic model, not a hockey stick. The owner app stays free; clinics pay a monthly subscription and insurers a partner fee. Pick a scenario.', 'Ein realistisches Modell, kein Hockeyschläger. Die Halter-App bleibt kostenlos; Praxen zahlen ein Monatsabo, Versicherer eine Partnergebühr. Wählen Sie ein Szenario.')} />
          <Segmented
            value={sc}
            onChange={setSc}
            className="mb-5"
            options={[
              { value: 'conservative', label: t('Conservative', 'Vorsichtig') },
              { value: 'expected', label: t('Expected', 'Erwartet') },
              { value: 'ambitious', label: t('Ambitious', 'Ambitioniert') },
            ]}
          />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label={t('Pet owners using the app', 'Halter in der App')} value={num(r.owners, lang)} tone="sage" icon={<PawPrint size={18} />} hint={t('free, after 12 months', 'kostenlos, nach 12 Monaten')} />
            <StatCard label={t('Paying clinics', 'Zahlende Praxen')} value={num(r.clinics, lang)} tone="sky" icon={<Building2 size={18} />} hint={t(`${((r.clinics / DE_PRACTICES) * 100).toFixed(1)}% of German practices`, `${((r.clinics / DE_PRACTICES) * 100).toFixed(1).replace('.', ',')} % der Praxen in DE`)} />
            <StatCard label={t('MRR at month 12', 'MRR in Monat 12')} value={usd(r.mrr, lang)} tone="brand" icon={<TrendingUp size={18} />} hint={t('monthly recurring revenue', 'monatlich wiederkehrend')} />
            <StatCard label={t('ARR run-rate', 'ARR (hochgerechnet)')} value={usd(r.arr, lang)} tone="coral" icon={<Coins size={18} />} hint={t('MRR × 12, going into year 2', 'MRR × 12, Start in Jahr 2')} />
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
            <motion.div {...fade} className="card p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="font-display text-lg font-semibold">{t('Monthly revenue, first 12 months', 'Monatsumsatz, erste 12 Monate')}</div>
                <div className="flex items-center gap-4 text-xs text-ink-3">
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-brand" />{t('Clinics', 'Praxen')}</span>
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-plum" />{t('Insurers', 'Versicherer')}</span>
                </div>
              </div>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={r.months} margin={{ left: -8, right: 8, top: 8 }}>
                    <defs>
                      <linearGradient id="pc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgb(var(--c-brand))" stopOpacity={0.35} /><stop offset="100%" stopColor="rgb(var(--c-brand))" stopOpacity={0.02} /></linearGradient>
                      <linearGradient id="pi" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgb(var(--c-plum))" stopOpacity={0.4} /><stop offset="100%" stopColor="rgb(var(--c-plum))" stopOpacity={0.05} /></linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="rgb(var(--c-line))" strokeDasharray="3 3" />
                    <XAxis dataKey="m" {...axis} />
                    <YAxis {...axis} tickFormatter={(v) => `$${v >= 1000 ? `${Math.round(v / 1000)}k` : v}`} />
                    <Tooltip {...tip} formatter={(v: number, k: string) => [usd(v, lang), k === 'clinics' ? t('Clinics', 'Praxen') : t('Insurers', 'Versicherer')]} />
                    <Area type="monotone" dataKey="insurers" stackId="1" stroke="rgb(var(--c-plum))" strokeWidth={2} fill="url(#pi)" />
                    <Area type="monotone" dataKey="clinics" stackId="1" stroke="rgb(var(--c-brand))" strokeWidth={2} fill="url(#pc)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 text-xs text-ink-3">{t(`Months 1–${PILOT_MONTHS}: free pilot for the first clinics. Insurers join from month ${INSURER_START}.`, `Monate 1–${PILOT_MONTHS}: kostenloser Pilot für die ersten Praxen. Versicherer ab Monat ${INSURER_START}.`)}</div>
            </motion.div>

            <motion.div {...fade} className="card flex flex-col p-6">
              <div className="eyebrow">{t('Revenue at month 12', 'Umsatz in Monat 12')}</div>
              <div className="mt-3 divide-y divide-line text-sm">
                {CLINIC_PLANS.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-2 py-2.5">
                    <span className="flex-1"><b>{p.id}</b> <span className="text-ink-3">· {usd(p.price, lang)}/{t('mo', 'Mon.')}</span></span>
                    <span className="text-ink-3">{r.mix[i]} ×</span>
                    <span className="w-20 text-right font-semibold">{usd(r.mix[i] * p.price, lang)}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 py-2.5">
                  <span className="flex-1"><b>{t('Insurer partners', 'Versicherer-Partner')}</b> <span className="text-ink-3">· {usd(INSURER_FEE, lang)}/{t('mo', 'Mon.')}</span></span>
                  <span className="text-ink-3">{r.insurers} ×</span>
                  <span className="w-20 text-right font-semibold">{usd(r.insurerMrr, lang)}</span>
                </div>
                <div className="flex items-center justify-between py-2.5"><span className="font-semibold">MRR</span><span className="font-display text-lg font-semibold text-brand">{usd(r.mrr, lang)}</span></div>
              </div>
              <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
                <div className="rounded-2xl bg-muted/60 p-3.5"><div className="text-xs text-ink-3">{t('Revenue in year 1', 'Umsatz in Jahr 1')}</div><div className="mt-0.5 font-display text-xl font-semibold">{usd(r.year1, lang)}</div></div>
                <div className="rounded-2xl bg-brand-soft p-3.5"><div className="text-xs text-brand">{t('Build paid back', 'Bau refinanziert')}</div><div className="mt-0.5 font-display text-xl font-semibold text-brand">{t(`Month ${r.payback}`, `Monat ${r.payback}`)}</div></div>
              </div>
            </motion.div>
          </div>

          <motion.div {...fade} className="mt-4 rounded-2xl border border-dashed border-line p-5">
            <div className="text-sm font-semibold">{t('Assumptions behind these numbers', 'Annahmen hinter diesen Zahlen')}</div>
            <ul className="mt-3 grid gap-2 text-sm text-ink-2 md:grid-cols-2">
              {[
                t('Owner app is free. No payments from pet owners, as in your brief.', 'Die Halter-App ist kostenlos. Keine Zahlungen von Haltern, wie im Briefing.'),
                t(`About ${num(DE_PRACTICES, lang)} vet practices in Germany; launch city by city, clinics first.`, `Rund ${num(DE_PRACTICES, lang)} Tierarztpraxen in Deutschland; Start Stadt für Stadt, Praxen zuerst.`),
                t('Clinic plans: Starter $49, Pro $129, Group $349 per month (you set the final prices).', 'Praxis-Tarife: Starter 49 $, Pro 129 $, Group 349 $ pro Monat (finale Preise legen Sie fest).'),
                t(`Insurers pay a $${INSURER_FEE} monthly partner fee for API access and consented leads.`, `Versicherer zahlen ${INSURER_FEE} $ Partnergebühr pro Monat für API-Zugang und freigegebene Leads.`),
                t('About 110 active owners per paying clinic, driven by clinic invites and reminders.', 'Rund 110 aktive Halter pro zahlender Praxis, getrieben durch Praxis-Einladungen und Erinnerungen.'),
                t('Projection only, not a guarantee. Marketing and sales effort decide the real curve.', 'Nur eine Prognose, keine Garantie. Marketing und Vertrieb bestimmen die echte Kurve.'),
              ].map((x) => <li key={x} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-brand" />{x}</li>)}
            </ul>
          </motion.div>
        </section>

        {/* ------------------------------------------------------- running costs */}
        <section>
          <SectionHead n="03" title={t('After launch: running costs & care', 'Nach dem Launch: laufende Kosten & Betreuung')} sub={t('Third-party services are paid directly by you, on accounts in your name, with no markup from us. Our care plan is optional.', 'Drittanbieter zahlen Sie direkt, auf Accounts in Ihrem Namen, ohne Aufschlag von uns. Unser Betreuungsplan ist optional.')} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [t('Apple Developer', 'Apple Developer'), t('$99 / year', '99 $ / Jahr')],
              [t('Google Play', 'Google Play'), t('$25 one-time', '25 $ einmalig')],
              [t('Supabase (EU, Frankfurt)', 'Supabase (EU, Frankfurt)'), t('from $25 / month', 'ab 25 $ / Monat')],
              [t('Expo, e-mail, monitoring', 'Expo, E-Mail, Monitoring'), t('free tiers to start', 'Gratis-Tarife zum Start')],
            ].map(([l, v]) => <motion.div {...fade} key={l} className="card p-5"><div className="text-sm text-ink-3">{l}</div><div className="mt-1 font-display text-xl font-semibold">{v}</div></motion.div>)}
          </div>
          <motion.div {...fade} className="card mt-4 flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand"><LifeBuoy size={22} /></span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2"><span className="font-display text-lg font-semibold">{t('Optional care plan', 'Optionaler Betreuungsplan')}</span><Badge tone="brand">{t('After launch', 'Nach dem Launch')}</Badge></div>
              <div className="mt-1 text-sm text-ink-2">{t('Hosting set-up and monitoring, OS and library updates, bug fixes, store re-submissions and small improvements. Cancel any month.', 'Hosting-Einrichtung und Monitoring, OS- und Bibliotheks-Updates, Bugfixes, Store-Neueinreichungen und kleine Verbesserungen. Monatlich kündbar.')}</div>
            </div>
            <div className="shrink-0 sm:text-right"><span className="font-display text-3xl font-semibold">{usd(CARE_PLAN, lang)}</span><span className="text-sm text-ink-3"> / {t('month', 'Monat')}</span></div>
          </motion.div>
        </section>

        {/* cta */}
        <motion.div {...fade} className="relative overflow-hidden rounded-[2rem] bg-ink p-10 text-canvas sm:p-14">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand/50 blur-3xl" />
          <div className="absolute -bottom-24 left-20 h-60 w-60 rounded-full bg-coral/40 blur-3xl" />
          <div className="relative">
            <h2 className="font-display text-4xl font-semibold leading-tight">{t(`${usd(BUILD_PRICE, 'en')}, 6 weeks, everything yours.`, `${usd(BUILD_PRICE, 'de')}, 6 Wochen, alles Ihres.`)}</h2>
            <p className="mt-3 max-w-xl text-canvas/70">{t('Start this week and your finished owner app, clinic dashboard, admin console and insurer portal are ready six weeks later.', 'Start diese Woche, und Ihre fertige Halter-App, Praxis-Dashboard, Admin-Konsole und Versicherer-Portal sind sechs Wochen später bereit.')}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/proposal"><Button size="lg" className="!bg-canvas !text-ink" iconRight={<ArrowRight size={17} />}>{t('Read the proposal', 'Angebot lesen')}</Button></Link>
              <Link to="/live"><Button size="lg" variant="outline" className="!border-white/20 !bg-transparent !text-canvas" icon={<Users size={17} />}>{t('See the live demo', 'Live-Demo ansehen')}</Button></Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function SectionHead({ n, title, sub }: { n: string; title: string; sub?: string }) {
  return (
    <motion.div {...fade} className="mb-7">
      <div className="font-display text-sm font-semibold text-coral">{n}</div>
      <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {sub && <p className="mt-3 max-w-3xl text-ink-2">{sub}</p>}
    </motion.div>
  )
}
