import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, CalendarPlus, Home, MessageCircle, PawPrint, User } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Logo } from '@/components/illustrations'
import { LangToggle, PortalSwitcher, ThemeToggle } from '@/components/shell'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/utils'
import { useDemo } from '@/store/useDemoStore'
import { ME } from '@/data/seed'
import { useNav, useRoute, type Route, type Tab } from './nav'
import Onboarding from './screens/Onboarding'
import HomeScreen from './screens/Home'
import { AddPet, PetProfile, PetsList } from './screens/Pets'
import { BookingFlow, ClinicDetail, ClinicSearch } from './screens/Clinics'
import { ChatList, NewThread, ThreadView } from './screens/Chat'
import { Account, Appointments, LegalScreen, Notifications, Passport, Privacy, Profile, Reminders } from './screens/Profile'
import { SCREEN_INFO } from './screenInfo'

const W = 390
const H = 844

export default function OwnerApp() {
  const loc = useLocation()
  const embed = new URLSearchParams(loc.search).has('embed')
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640)
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  if (embed || isMobile) {
    return (
      <div className="relative h-[100dvh] w-full overflow-hidden bg-canvas">
        <PhoneScreen statusBar={embed} />
      </div>
    )
  }
  return <DesktopStage />
}

/* -------------------------------------------------------------- desktop stage */
function DesktopStage() {
  const { t } = useI18n()
  const route = useRoute()
  const nav = useNav()
  const onboarded = useDemo((s) => s.onboarded && s.signedIn)
  const info = SCREEN_INFO[onboarded ? route.name : 'onboarding']
  const wrap = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const fit = () => {
      const h = window.innerHeight - 64 - 48
      setScale(Math.min(1, h / (H + 28)))
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  const jumps: { label: string; go: () => void }[] = [
    { label: t('Home', 'Start'), go: () => nav.setTab('home') },
    { label: t('Pet profile & health record', 'Tierprofil & Gesundheitsakte'), go: () => { nav.setTab('pets'); nav.push({ name: 'pet', id: 'p1' }) } },
    { label: t('Documents', 'Dokumente'), go: () => { nav.setTab('pets'); nav.push({ name: 'pet', id: 'p1', tab: 'docs' }) } },
    { label: t('Clinic search & map', 'Praxissuche & Karte'), go: () => nav.setTab('book') },
    { label: t('Booking flow', 'Buchungsablauf'), go: () => { nav.setTab('book'); nav.push({ name: 'booking', clinicId: 'c1' }) } },
    { label: t('Chat with clinic', 'Chat mit der Praxis'), go: () => { nav.setTab('chat'); nav.push({ name: 'thread', id: 'th1' }) } },
    { label: t('Pet passport & sharing', 'Tierpass & Freigabe'), go: () => { nav.setTab('pets'); nav.push({ name: 'passport', petId: 'p1' }) } },
    { label: t('Privacy & consent center', 'Datenschutz-Center'), go: () => { nav.setTab('profile'); nav.push({ name: 'privacy' }) } },
    { label: t('Reminder settings', 'Erinnerungs-Einstellungen'), go: () => { nav.setTab('profile'); nav.push({ name: 'reminders' }) } },
  ]

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-canvas">
      <header className="flex h-16 shrink-0 items-center gap-4 border-b border-line/60 px-6">
        <Link to="/" className="text-ink-3 hover:text-ink"><ArrowLeft size={18} /></Link>
        <Logo size={28} sub={t('Owner app', 'Halter-App')} />
        <div className="ml-auto flex items-center gap-2">
          <PortalSwitcher current="/app" />
          <LangToggle />
          <ThemeToggle />
        </div>
      </header>
      <div className="relative flex flex-1 items-center justify-center gap-14 overflow-hidden px-8">
        <div className="pointer-events-none absolute inset-0 bg-grain [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-3xl" />

        {/* left info panel */}
        <div className="relative hidden w-[300px] shrink-0 xl:block">
          <AnimatePresence mode="wait">
            <motion.div key={info?.en.title ?? 'x'} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.25 }}>
              <div className="eyebrow">{t('You are viewing', 'Sie sehen')}</div>
              <h2 className="mt-2 font-display text-3xl font-semibold leading-tight">{info ? t(info.en.title, info.de.title) : ''}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{info ? t(info.en.body, info.de.body) : ''}</p>
              {info?.points && (
                <ul className="mt-5 space-y-2.5">
                  {info.points.map((p, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-ink-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />{t(p.en, p.de)}</li>
                  ))}
                </ul>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* phone */}
        <div ref={wrap} style={{ width: (W + 28) * scale, height: (H + 28) * scale }} className="relative shrink-0">
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: W + 28, height: H + 28 }}>
            <div className="relative rounded-[60px] bg-[#0f1513] p-[14px] shadow-[0_50px_100px_-30px_rgb(16_32_28/0.5),0_0_0_1px_rgb(255_255_255/0.06)_inset]">
              <div className="absolute -left-[3px] top-[150px] h-14 w-[3px] rounded-l bg-[#0f1513]" />
              <div className="absolute -left-[3px] top-[220px] h-14 w-[3px] rounded-l bg-[#0f1513]" />
              <div className="absolute -right-[3px] top-[190px] h-20 w-[3px] rounded-r bg-[#0f1513]" />
              <div className="relative overflow-hidden rounded-[46px] bg-canvas" style={{ width: W, height: H }}>
                <PhoneScreen statusBar />
              </div>
            </div>
          </div>
        </div>

        {/* right jump panel */}
        <div className="relative hidden w-[260px] shrink-0 xl:block">
          <div className="eyebrow">{t('Jump to a screen', 'Zu einem Screen springen')}</div>
          <div className="mt-3 space-y-1">
            {jumps.map((j) => (
              <button key={j.label} onClick={() => { if (!onboarded) { useDemo.getState().setOnboarded(true); useDemo.getState().setSignedIn(true) } j.go() }} className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-ink-2 transition hover:bg-surface hover:text-ink hover:shadow-soft">
                {j.label}<span className="text-ink-3">→</span>
              </button>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-dashed border-line p-4 text-xs leading-relaxed text-ink-3">
            {t('Tip: open the Clinic dashboard in another tab. Bookings and messages sync live between them.', 'Tipp: Öffnen Sie das Praxis-Dashboard in einem zweiten Tab. Buchungen und Nachrichten synchronisieren live.')}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- phone screen */
function renderRoute(r: Route) {
  switch (r.name) {
    case 'home': return <HomeScreen />
    case 'pets': return <PetsList />
    case 'book': return <ClinicSearch />
    case 'chat': return <ChatList />
    case 'profile': return <Profile />
    case 'pet': return <PetProfile id={r.id} initialTab={r.tab} />
    case 'addPet': return <AddPet />
    case 'clinic': return <ClinicDetail id={r.id} />
    case 'booking': return <BookingFlow clinicId={r.clinicId} serviceId={r.serviceId} />
    case 'thread': return <ThreadView id={r.id} />
    case 'newThread': return <NewThread />
    case 'notifications': return <Notifications />
    case 'passport': return <Passport petId={r.petId} />
    case 'privacy': return <Privacy />
    case 'reminders': return <Reminders />
    case 'appointments': return <Appointments />
    case 'legal': return <LegalScreen doc={r.doc} />
    case 'account': return <Account />
  }
}

function PhoneScreen({ statusBar }: { statusBar?: boolean }) {
  const ready = useDemo((s) => s.onboarded && s.signedIn)
  const route = useRoute()
  const stack = useNav((s) => s.stack)
  const dir = useNav((s) => s.dir)
  const scroller = useRef<HTMLDivElement>(null)
  const key = `${stack.length}-${JSON.stringify(route)}`

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 })
  }, [key])

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-canvas text-ink">
      {statusBar && <StatusBar />}
      <PushBanner />
      {!ready ? (
        <Onboarding />
      ) : (
        <>
          <div ref={scroller} className="no-scrollbar relative flex-1 overflow-y-auto overflow-x-hidden" id="phone-scroll">
            <AnimatePresence mode="popLayout" initial={false} custom={dir}>
              <motion.div
                key={key}
                custom={dir}
                initial={{ x: dir * 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: dir * -40, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 420, damping: 40 }}
                className="flex min-h-full flex-col"
              >
                {renderRoute(route)}
              </motion.div>
            </AnimatePresence>
          </div>
          {stack.length === 0 && <TabBar />}
        </>
      )}
      <div id="phone-overlay" className="pointer-events-none absolute inset-0 z-50 [&>*]:pointer-events-auto" />
      {statusBar && <div className="pointer-events-none absolute bottom-2 left-1/2 z-[60] h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-ink/80" />}
    </div>
  )
}

function StatusBar() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(i)
  }, [])
  return (
    <div className="relative z-40 flex h-[50px] shrink-0 items-center justify-between bg-canvas px-8 pt-1 text-[15px] font-semibold">
      <span>{now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</span>
      <span className="absolute left-1/2 top-[11px] h-[32px] w-[120px] -translate-x-1/2 rounded-full bg-black" />
      <span className="flex items-center gap-1.5">
        <svg width="18" height="11" viewBox="0 0 18 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1" /><rect x="5" y="5" width="3" height="6" rx="1" /><rect x="10" y="2.5" width="3" height="8.5" rx="1" /><rect x="15" y="0" width="3" height="11" rx="1" /></svg>
        <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor"><path d="M8 2.2c2.3 0 4.4.9 6 2.4l1.2-1.3A10.3 10.3 0 0 0 8 .4 10.3 10.3 0 0 0 .8 3.3L2 4.6a8.5 8.5 0 0 1 6-2.4Zm0 3.6c1.3 0 2.5.5 3.4 1.3l1.2-1.3A6.7 6.7 0 0 0 8 4a6.7 6.7 0 0 0-4.6 1.8l1.2 1.3c.9-.8 2.1-1.3 3.4-1.3Zm0 3.6c.5 0 .9.2 1.2.5L8 11 6.8 9.9c.3-.3.7-.5 1.2-.5Z" /></svg>
        <span className="relative ml-0.5 h-[12px] w-[25px] rounded-[4px] border border-current/40 p-[1.5px]"><span className="block h-full w-[80%] rounded-[2px] bg-current" /></span>
      </span>
    </div>
  )
}

function TabBar() {
  const { t } = useI18n()
  const tab = useNav((s) => s.tab)
  const setTab = useNav((s) => s.setTab)
  const unreadChat = useDemo((s) => s.threads.filter((th) => th.ownerId === ME).reduce((a, th) => a + th.messages.filter((m) => m.from === 'clinic' && !m.read).length, 0))
  const items: { id: Tab; icon: React.ElementType; label: string; badge?: number }[] = [
    { id: 'home', icon: Home, label: t('Home', 'Start') },
    { id: 'pets', icon: PawPrint, label: t('Pets', 'Tiere') },
    { id: 'book', icon: CalendarPlus, label: t('Book', 'Buchen') },
    { id: 'chat', icon: MessageCircle, label: 'Chat', badge: unreadChat },
    { id: 'profile', icon: User, label: t('Profile', 'Profil') },
  ]
  return (
    <div className="absolute inset-x-0 bottom-0 z-30 px-3 pb-5">
      <div className="glass flex items-center justify-around rounded-[26px] px-2 py-1.5 shadow-lift">
        {items.map((i) => {
          const on = tab === i.id
          return (
            <button key={i.id} onClick={() => setTab(i.id)} className="relative flex flex-1 flex-col items-center gap-0.5 py-1.5">
              {on && <motion.span layoutId="tab-pill" className="absolute inset-x-1.5 inset-y-0 rounded-[18px] bg-brand-soft" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
              <span className="relative">
                <i.icon size={21} strokeWidth={on ? 2.4 : 1.9} className={cn('transition-colors', on ? 'text-brand' : 'text-ink-3')} />
                {!!i.badge && <span className="absolute -right-2 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-coral px-1 text-[9px] font-bold text-white ring-2 ring-surface">{i.badge}</span>}
              </span>
              <span className={cn('relative text-[10px] font-semibold', on ? 'text-brand' : 'text-ink-3')}>{i.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------- push notifications */
function PushBanner() {
  const { tl, t } = useI18n()
  const notes = useDemo((s) => s.notifications)
  const ready = useDemo((s) => s.onboarded && s.signedIn)
  const push = useNav((s) => s.push)
  const latest = notes[0]
  const seen = useRef<string | undefined>(latest && !latest.read && Date.now() - latest.at < 15000 ? undefined : latest?.id)
  const [show, setShow] = useState<typeof latest | null>(null)

  useEffect(() => {
    if (!latest || latest.id === seen.current) return
    seen.current = latest.id
    if (Date.now() - latest.at < 15000 && ready) {
      setShow(latest)
      const tm = setTimeout(() => setShow(null), 5200)
      return () => clearTimeout(tm)
    }
  }, [latest, ready])

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ y: -120, scale: 0.9 }} animate={{ y: 0, scale: 1 }} exit={{ y: -120, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          onClick={() => { setShow(null); push({ name: 'notifications' }) }}
          className="absolute inset-x-2.5 top-2.5 z-[70] flex items-start gap-3 rounded-[22px] bg-surface/90 p-3 text-left shadow-float ring-1 ring-black/5 backdrop-blur-2xl"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-brand text-sm font-bold text-brand-fg">V</span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center justify-between text-[11px] text-ink-3"><span className="font-semibold uppercase tracking-wide">Vetly</span>{t('now', 'jetzt')}</span>
            <span className="block text-[13.5px] font-semibold">{tl(show.title)}</span>
            <span className="line-clamp-2 block text-[12.5px] text-ink-2">{tl(show.body)}</span>
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
