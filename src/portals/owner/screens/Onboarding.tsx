import { AnimatePresence, motion } from 'framer-motion'
import { BellRing, CalendarCheck2, Check, ChevronLeft, FileHeart, Mail, ScanFace, ServerCog } from 'lucide-react'
import { useEffect, useState } from 'react'
import { LogoMark, PetAvatar } from '@/components/illustrations'
import { Button, Switch } from '@/components/ui'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/utils'
import { useDemo } from '@/store/useDemoStore'
import { useNav } from '../nav'

type Step = 'splash' | 'intro' | 'lang' | 'auth' | 'consent' | 'login'

export default function Onboarding() {
  const onboarded = useDemo((s) => s.onboarded)
  const [step, setStep] = useState<Step>(onboarded ? 'login' : 'splash')
  useEffect(() => {
    if (step === 'splash') {
      const t = setTimeout(() => setStep('intro'), 1500)
      return () => clearTimeout(t)
    }
  }, [step])

  return (
    <div className="relative flex-1 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} className="absolute inset-0 flex flex-col">
          {step === 'splash' && <Splash />}
          {step === 'intro' && <Intro onDone={() => setStep('lang')} />}
          {step === 'lang' && <LangPick onNext={() => setStep('auth')} onBack={() => setStep('intro')} />}
          {step === 'auth' && <Auth onNext={() => setStep('consent')} onBack={() => setStep('lang')} />}
          {step === 'consent' && <Consent onBack={() => setStep('auth')} />}
          {step === 'login' && <Login onSwitch={() => setStep('splash')} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function Splash() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-brand text-brand-fg">
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }}>
        <div className="rounded-[28px] bg-white/10 p-3 ring-1 ring-white/20"><LogoMark size={84} /></div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6 font-display text-4xl font-semibold">Vetly</motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.5 }} className="mt-1 text-sm">Pet health, beautifully organised</motion.div>
    </div>
  )
}

function Intro({ onDone }: { onDone: () => void }) {
  const { t } = useI18n()
  const [i, setI] = useState(0)
  const slides = [
    { icon: FileHeart, tone: 'brand', title: t('Every record in one place', 'Alle Daten an einem Ort'), body: t('Vaccinations, treatments, medication and documents for all your pets. No more lost booklets.', 'Impfungen, Behandlungen, Medikamente und Dokumente für alle Tiere. Kein verlorener Impfpass mehr.'), pets: ['dog', 'cat', 'rabbit'] as const },
    { icon: BellRing, tone: 'coral', title: t('Reminded, never stressed', 'Erinnert statt gestresst'), body: t('A gentle nudge before anything is due. You decide which reminders you want.', 'Ein sanfter Hinweis, bevor etwas fällig ist. Sie entscheiden, welche Erinnerungen Sie möchten.'), pets: ['cat'] as const },
    { icon: CalendarCheck2, tone: 'sky', title: t('Book your vet in seconds', 'Tierarzt in Sekunden buchen'), body: t('Find clinics nearby, book a slot at any time of day and chat with your practice.', 'Praxen in der Nähe finden, rund um die Uhr Termine anfragen und mit der Praxis chatten.'), pets: ['dog'] as const },
  ]
  const s = slides[i]
  return (
    <div className="flex flex-1 flex-col px-6 pb-10 pt-4">
      <div className="flex justify-end"><button onClick={onDone} className="text-sm font-medium text-ink-3">{t('Skip', 'Überspringen')}</button></div>
      <div className="relative mt-4 flex flex-1 flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.35 }} className="flex flex-col items-center">
            <div className="relative grid h-64 w-64 place-items-center">
              <div className={`absolute inset-0 rounded-full bg-${s.tone}-soft`} />
              <div className={`absolute inset-8 rounded-full bg-${s.tone}/15`} />
              <div className="relative flex -space-x-5">
                {s.pets.map((p, k) => (
                  <motion.div key={p} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 + k * 0.08 }}>
                    <PetAvatar species={p} hue={[32, 220, 95][k]} size={s.pets.length > 1 ? 88 : 120} ring className="shadow-lift" />
                  </motion.div>
                ))}
              </div>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }} className={`absolute right-6 top-8 grid h-14 w-14 place-items-center rounded-2xl bg-surface text-${s.tone} shadow-lift`}>
                <s.icon size={26} />
              </motion.div>
            </div>
            <h2 className="mt-10 text-center font-display text-[28px] font-semibold leading-tight">{s.title}</h2>
            <p className="mt-3 text-center text-[15px] leading-relaxed text-ink-2">{s.body}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mb-6 flex justify-center gap-2">
        {slides.map((_, k) => <motion.span key={k} animate={{ width: k === i ? 24 : 8 }} className={cn('h-2 rounded-full', k === i ? 'bg-brand' : 'bg-line')} />)}
      </div>
      <Button size="lg" block onClick={() => (i < slides.length - 1 ? setI(i + 1) : onDone())}>{i < slides.length - 1 ? t('Next', 'Weiter') : t('Get started', 'Los geht’s')}</Button>
    </div>
  )
}

function Back({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick} className="-ml-2 grid h-10 w-10 place-items-center rounded-full hover:bg-muted"><ChevronLeft size={24} /></button>
}

function LangPick({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { t, lang } = useI18n()
  const setLang = useDemo((s) => s.setLang)
  return (
    <div className="flex flex-1 flex-col px-6 pb-10 pt-2">
      <Back onClick={onBack} />
      <h2 className="mt-4 font-display text-[30px] font-semibold leading-tight">{t('Which language do you prefer?', 'Welche Sprache bevorzugen Sie?')}</h2>
      <p className="mt-2 text-[15px] text-ink-2">{t('You can change this anytime in your profile.', 'Sie können das jederzeit im Profil ändern.')}</p>
      <div className="mt-8 space-y-3">
        {([['de', 'Deutsch', 'Hallo! Schön, dass du da bist.', '🇩🇪'], ['en', 'English', 'Hello! Great to have you here.', '🇬🇧']] as const).map(([l, name, sample, flag]) => (
          <button key={l} onClick={() => setLang(l)} className={cn('flex w-full items-center gap-4 rounded-3xl border-2 p-4 text-left transition', lang === l ? 'border-brand bg-brand-soft/60' : 'border-line bg-surface')}>
            <span className="text-3xl">{flag}</span>
            <span className="flex-1"><span className="block font-semibold">{name}</span><span className="text-sm text-ink-3">{sample}</span></span>
            <span className={cn('grid h-6 w-6 place-items-center rounded-full border-2', lang === l ? 'border-brand bg-brand text-brand-fg' : 'border-line')}>{lang === l && <Check size={14} strokeWidth={3} />}</span>
          </button>
        ))}
      </div>
      <div className="flex-1" />
      <Button size="lg" block onClick={onNext}>{t('Continue', 'Weiter')}</Button>
    </div>
  )
}

function Auth({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { t } = useI18n()
  const [email, setEmail] = useState('lena.hoffmann@example.de')
  const [loading, setLoading] = useState<string | null>(null)
  const go = (k: string) => {
    setLoading(k)
    setTimeout(() => { setLoading(null); onNext() }, 900)
  }
  return (
    <div className="flex flex-1 flex-col px-6 pb-10 pt-2">
      <Back onClick={onBack} />
      <h2 className="mt-4 font-display text-[30px] font-semibold leading-tight">{t('Create your account', 'Konto erstellen')}</h2>
      <p className="mt-2 text-[15px] text-ink-2">{t('Secure sign-in. Your data stays in the EU.', 'Sichere Anmeldung. Ihre Daten bleiben in der EU.')}</p>
      <div className="mt-8 space-y-3">
        <button onClick={() => go('apple')} className="flex h-[52px] w-full items-center justify-center gap-2.5 rounded-2xl bg-black text-[15px] font-semibold text-white active:scale-[0.98] dark:bg-white dark:text-black">
          {loading === 'apple' ? <Spinner /> : <><svg width="17" height="20" viewBox="0 0 17 20" fill="currentColor"><path d="M14.1 10.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2.1-.9-3.4-.9-1.7 0-3.3 1-4.3 2.6-1.8 3.1-.5 7.8 1.3 10.3.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9 0 0-2.6-1-2.6-4.2ZM11.6 3c.7-.9 1.2-2 1-3.2-1 0-2.3.7-3 1.6-.7.8-1.2 2-1.1 3.1 1.2.1 2.3-.6 3.1-1.5Z" /></svg>{t('Continue with Apple', 'Mit Apple fortfahren')}</>}
        </button>
        <button onClick={() => go('google')} className="flex h-[52px] w-full items-center justify-center gap-2.5 rounded-2xl border border-line bg-surface text-[15px] font-semibold active:scale-[0.98]">
          {loading === 'google' ? <Spinner /> : <><svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" /><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" /><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" /><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" /></svg>{t('Continue with Google', 'Mit Google fortfahren')}</>}
        </button>
      </div>
      <div className="my-6 flex items-center gap-3 text-xs text-ink-3"><span className="h-px flex-1 bg-line" />{t('or with e-mail', 'oder per E-Mail')}<span className="h-px flex-1 bg-line" /></div>
      <label className="label">{t('E-mail', 'E-Mail')}</label>
      <div className="relative">
        <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
        <input className="input h-[52px] rounded-2xl pl-10 text-[15px]" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <p className="mt-2 text-xs text-ink-3">{t('We’ll send you a secure magic link. No password to remember.', 'Wir senden Ihnen einen sicheren Magic Link. Kein Passwort nötig.')}</p>
      <div className="flex-1" />
      <Button size="lg" block onClick={() => go('mail')} disabled={!email.includes('@')}>{loading === 'mail' ? <Spinner /> : t('Send magic link', 'Magic Link senden')}</Button>
    </div>
  )
}

function Consent({ onBack }: { onBack: () => void }) {
  const { t } = useI18n()
  const [c, setC] = useState({ terms: false, push: true, analytics: false })
  const s = useDemo()
  const nav = useNav()
  const finish = () => {
    s.setOnboarded(true)
    s.setSignedIn(true)
    nav.reset()
    s.toast({ title: t('Welcome to Vetly, Lena! 🐾', 'Willkommen bei Vetly, Lena! 🐾'), body: t('Your 3 pets are ready.', 'Deine 3 Tiere sind bereit.') })
  }
  const Item = ({ k, title, sub, required }: { k: keyof typeof c; title: string; sub: string; required?: boolean }) => (
    <div className="flex items-start gap-3 rounded-2xl bg-surface p-4 ring-1 ring-line/70">
      <div className="flex-1">
        <div className="flex items-center gap-2 text-[14.5px] font-semibold">{title}{required && <span className="rounded-md bg-coral-soft px-1.5 text-[10px] font-bold text-coral">{t('Required', 'Pflicht')}</span>}</div>
        <div className="mt-1 text-[12.5px] leading-relaxed text-ink-3">{sub}</div>
      </div>
      <Switch checked={c[k]} onChange={(v) => setC({ ...c, [k]: v })} />
    </div>
  )
  return (
    <div className="flex flex-1 flex-col px-6 pb-10 pt-2">
      <Back onClick={onBack} />
      <h2 className="mt-4 font-display text-[30px] font-semibold leading-tight">{t('Your data, your choice', 'Ihre Daten, Ihre Wahl')}</h2>
      <div className="mt-3 flex items-center gap-2 rounded-2xl bg-brand-soft px-3.5 py-2.5 text-[12.5px] font-medium text-brand"><ServerCog size={16} />{t('Stored encrypted in Frankfurt, Germany (EU)', 'Verschlüsselt gespeichert in Frankfurt (EU)')}</div>
      <div className="mt-5 space-y-3">
        <Item k="terms" required title={t('Terms & privacy policy', 'AGB & Datenschutzerklärung')} sub={t('I accept the terms of use and have read the privacy policy.', 'Ich akzeptiere die Nutzungsbedingungen und habe die Datenschutzerklärung gelesen.')} />
        <Item k="push" title={t('Reminders via push', 'Erinnerungen per Push')} sub={t('Due dates, booking updates and clinic messages. Each can be switched off later.', 'Fälligkeiten, Buchungs-Updates und Praxis-Nachrichten. Einzeln abschaltbar.')} />
        <Item k="analytics" title={t('Anonymous usage statistics', 'Anonyme Nutzungsstatistik')} sub={t('Helps us improve Vetly. No health data is included.', 'Hilft uns, Vetly zu verbessern. Ohne Gesundheitsdaten.')} />
      </div>
      <p className="mt-4 text-xs leading-relaxed text-ink-3">{t('Record sharing with clinics or insurers is always asked separately, per pet.', 'Das Teilen von Akten mit Praxen oder Versicherern wird immer separat und pro Tier erfragt.')}</p>
      <div className="flex-1" />
      <Button size="lg" block disabled={!c.terms} onClick={finish}>{t('Agree & continue', 'Zustimmen & weiter')}</Button>
    </div>
  )
}

function Login({ onSwitch }: { onSwitch: () => void }) {
  const { t } = useI18n()
  const s = useDemo()
  const nav = useNav()
  const [scanning, setScanning] = useState(false)
  const unlock = () => {
    setScanning(true)
    setTimeout(() => { s.setSignedIn(true); nav.reset() }, 1100)
  }
  return (
    <div className="flex flex-1 flex-col items-center px-6 pb-12 pt-16">
      <LogoMark size={64} />
      <h2 className="mt-6 font-display text-[28px] font-semibold">{t('Welcome back', 'Willkommen zurück')}</h2>
      <p className="mt-1 text-ink-2">lena.hoffmann@example.de</p>
      <div className="flex flex-1 items-center">
        <motion.button onClick={unlock} whileTap={{ scale: 0.95 }} className="relative grid h-32 w-32 place-items-center rounded-[36px] bg-surface shadow-lift ring-1 ring-line">
          {scanning && <motion.span className="absolute inset-0 rounded-[36px] ring-4 ring-brand" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.4, 1] }} transition={{ duration: 1 }} />}
          <ScanFace size={56} strokeWidth={1.4} className={scanning ? 'text-brand' : 'text-ink-2'} />
        </motion.button>
      </div>
      <Button size="lg" block onClick={unlock}>{t('Unlock with Face ID', 'Mit Face ID entsperren')}</Button>
      <button onClick={() => { s.setOnboarded(false); onSwitch() }} className="mt-4 text-sm font-medium text-ink-3">{t('Use another account', 'Anderes Konto verwenden')}</button>
    </div>
  )
}

function Spinner() {
  return <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
}
