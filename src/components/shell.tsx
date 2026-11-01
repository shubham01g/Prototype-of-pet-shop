import { AnimatePresence, motion } from 'framer-motion'
import {
  Bell, Building2, ChevronDown, Command, FileText, LayoutGrid, Menu, Moon, PanelsTopLeft, Search, ShieldCheck, Smartphone, Sun, Umbrella, X,
} from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Logo } from '@/components/illustrations'
import { Initials } from '@/components/ui'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/utils'
import { useDemo } from '@/store/useDemoStore'

/* --------------------------------------------------------------- Lang / Theme */
export function LangToggle({ className }: { className?: string }) {
  const lang = useDemo((s) => s.lang)
  const setLang = useDemo((s) => s.setLang)
  return (
    <div className={cn('relative inline-flex h-9 items-center rounded-xl border border-line bg-surface p-0.5 text-xs font-semibold', className)}>
      {(['de', 'en'] as const).map((l) => (
        <button key={l} onClick={() => setLang(l)} className={cn('relative z-10 h-full rounded-[10px] px-2.5 uppercase transition-colors', lang === l ? 'text-brand-fg' : 'text-ink-3 hover:text-ink')}>
          {lang === l && <motion.span layoutId="lang-pill" className="absolute inset-0 -z-10 rounded-[10px] bg-brand" transition={{ type: 'spring', stiffness: 500, damping: 36 }} />}
          {l}
        </button>
      ))}
    </div>
  )
}

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useDemo((s) => s.theme)
  const toggle = useDemo((s) => s.toggleTheme)
  return (
    <button onClick={toggle} aria-label="Toggle theme" className={cn('grid h-9 w-9 place-items-center rounded-xl border border-line bg-surface text-ink-2 transition hover:text-ink', className)}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

/* ----------------------------------------------------------------- Toaster */
export function Toaster() {
  const toasts = useDemo((s) => s.toasts)
  const dismiss = useDemo((s) => s.dismissToast)
  return createPortal(
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(380px,calc(100vw-2rem))] flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.96 }}
            className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-line bg-surface/95 p-4 shadow-float backdrop-blur"
          >
            <span className={cn('mt-1 h-2.5 w-2.5 shrink-0 rounded-full', t.tone === 'coral' ? 'bg-coral' : t.tone === 'berry' ? 'bg-berry' : t.tone === 'sun' ? 'bg-sun' : 'bg-brand')} />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold">{t.title}</div>
              {t.body && <div className="mt-0.5 text-[13px] text-ink-2">{t.body}</div>}
            </div>
            <button onClick={() => dismiss(t.id)} className="text-ink-3 hover:text-ink"><X size={15} /></button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  )
}

/* ----------------------------------------------------------- Portal switcher */
export const PORTALS = [
  { to: '/', icon: LayoutGrid, en: 'Overview', de: 'Übersicht', hue: 168 },
  { to: '/app', icon: Smartphone, en: 'Owner app', de: 'Halter-App', hue: 168 },
  { to: '/clinic', icon: Building2, en: 'Clinic dashboard', de: 'Praxis-Dashboard', hue: 214 },
  { to: '/admin', icon: ShieldCheck, en: 'Admin console', de: 'Admin-Konsole', hue: 14 },
  { to: '/insurer', icon: Umbrella, en: 'Insurer portal', de: 'Versicherer-Portal', hue: 270 },
  { to: '/live', icon: PanelsTopLeft, en: 'Live side-by-side', de: 'Live nebeneinander', hue: 40 },
  { to: '/proposal', icon: FileText, en: 'Proposal', de: 'Angebot', hue: 120 },
]

export function PortalSwitcher({ current }: { current: string }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const cur = PORTALS.find((p) => p.to === current) ?? PORTALS[0]
  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} className="flex h-9 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-xs font-semibold text-ink-2 hover:text-ink">
        <cur.icon size={14} />
        <span className="hidden sm:inline">{t(cur.en, cur.de)}</span>
        <ChevronDown size={14} />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.98 }}
              className="absolute right-0 z-50 mt-2 w-60 rounded-2xl border border-line bg-surface p-1.5 shadow-float"
            >
              <div className="px-2.5 pb-1 pt-1.5 eyebrow">{t('Switch portal', 'Portal wechseln')}</div>
              {PORTALS.map((p) => (
                <Link key={p.to} to={p.to} onClick={() => setOpen(false)} className={cn('flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm hover:bg-muted', p.to === current && 'bg-muted font-semibold')}>
                  <span className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: `hsl(${p.hue} 60% 92%)`, color: `hsl(${p.hue} 50% 35%)` }}><p.icon size={15} /></span>
                  {t(p.en, p.de)}
                </Link>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ----------------------------------------------------------- Command palette */
export interface CmdItem { label: string; hint?: string; to?: string; run?: () => void; icon?: React.ElementType }

export function CommandPalette({ items, open, onClose }: { items: CmdItem[]; open: boolean; onClose: () => void }) {
  const { t } = useI18n()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [i, setI] = useState(0)
  const all = useMemo(() => [...items, ...PORTALS.map((p) => ({ label: t(p.en, p.de), hint: t('Portal', 'Portal'), to: p.to, icon: p.icon }))], [items, t])
  const res = all.filter((x) => (x.label + (x.hint ?? '')).toLowerCase().includes(q.toLowerCase())).slice(0, 9)
  useEffect(() => { setI(0) }, [q])
  useEffect(() => { if (open) setQ('') }, [open])
  const go = (x: CmdItem) => {
    if (x.to) nav(x.to)
    x.run?.()
    onClose()
  }
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-start justify-center p-4 pt-[12vh]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-ink/30 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, y: -12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12, scale: 0.98 }} className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface shadow-float">
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search size={18} className="text-ink-3" />
              <input
                autoFocus value={q} onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') { e.preventDefault(); setI((v) => Math.min(res.length - 1, v + 1)) }
                  if (e.key === 'ArrowUp') { e.preventDefault(); setI((v) => Math.max(0, v - 1)) }
                  if (e.key === 'Enter' && res[i]) go(res[i])
                  if (e.key === 'Escape') onClose()
                }}
                placeholder={t('Search pages, patients, actions…', 'Seiten, Patienten, Aktionen suchen…')}
                className="h-14 flex-1 bg-transparent text-[15px] outline-none placeholder:text-ink-3"
              />
              <kbd className="rounded-md border border-line px-1.5 py-0.5 text-[10px] text-ink-3">ESC</kbd>
            </div>
            <div className="max-h-[50vh] overflow-y-auto p-2">
              {res.length === 0 && <div className="p-6 text-center text-sm text-ink-3">{t('No results', 'Keine Ergebnisse')}</div>}
              {res.map((x, idx) => {
                const Icon = x.icon ?? Command
                return (
                  <button key={x.label + idx} onMouseEnter={() => setI(idx)} onClick={() => go(x)} className={cn('flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm', idx === i && 'bg-muted')}>
                    <Icon size={16} className="text-ink-3" />
                    <span className="flex-1">{x.label}</span>
                    {x.hint && <span className="text-xs text-ink-3">{x.hint}</span>}
                  </button>
                )
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

/* ----------------------------------------------------------- Dashboard shell */
export interface NavItem { to: string; label: string; icon: React.ElementType; badge?: number; end?: boolean }

export function DashboardShell({
  portal, sub, nav, user, children, commands = [], bellCount = 0, accentHue = 168, onBell, footer,
}: {
  portal: string
  sub: string
  nav: { section?: string; items: NavItem[] }[]
  user: { name: string; role: string; hue?: number }
  children: React.ReactNode
  commands?: CmdItem[]
  bellCount?: number
  accentHue?: number
  onBell?: () => void
  footer?: React.ReactNode
}) {
  const { t } = useI18n()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cmd, setCmd] = useState(false)
  const loc = useLocation()
  useEffect(() => setMobileOpen(false), [loc.pathname])
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCmd((v) => !v) }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  const cmdItems: CmdItem[] = [...nav.flatMap((s) => s.items.map((i) => ({ label: i.label, to: i.to, icon: i.icon, hint: t('Go to', 'Gehe zu') }))), ...commands]

  const Side = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-5">
        <Link to="/"><Logo size={30} sub={sub} /></Link>
      </div>
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-3">
        {nav.map((s, si) => (
          <div key={si}>
            {s.section && <div className="mb-1.5 px-3 eyebrow">{s.section}</div>}
            <div className="space-y-0.5">
              {s.items.map((i) => (
                <NavLink
                  key={i.to} to={i.to} end={i.end}
                  className={({ isActive }) => cn('group relative flex items-center gap-3 rounded-xl px-3 py-2 text-[13.5px] font-medium transition-colors', isActive ? 'text-ink' : 'text-ink-2 hover:bg-muted/70 hover:text-ink')}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && <motion.span layoutId={`nav-${portal}`} className="absolute inset-0 rounded-xl bg-surface shadow-soft ring-1 ring-line/70" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
                      <i.icon size={17} className={cn('relative', isActive ? 'text-brand' : 'text-ink-3 group-hover:text-ink-2')} />
                      <span className="relative flex-1">{i.label}</span>
                      {!!i.badge && <span className="relative rounded-full bg-coral px-1.5 py-px text-[10px] font-bold text-white">{i.badge}</span>}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
      {footer && <div className="px-3 pb-2">{footer}</div>}
      <div className="m-3 flex items-center gap-3 rounded-2xl border border-line/70 bg-surface p-3">
        <Initials name={user.name} hue={user.hue ?? accentHue} size={34} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-semibold">{user.name}</div>
          <div className="truncate text-[11px] text-ink-3">{user.role}</div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-canvas">
      <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 border-r border-line/60 bg-muted/40 lg:block">{Side}</aside>
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-ink/40" onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', stiffness: 400, damping: 40 }} className="absolute inset-y-0 left-0 w-[270px] bg-canvas shadow-float">{Side}</motion.aside>
          </div>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line/60 bg-canvas/80 px-4 backdrop-blur-xl sm:px-6">
          <button onClick={() => setMobileOpen(true)} className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-surface lg:hidden"><Menu size={17} /></button>
          <button onClick={() => setCmd(true)} className="flex h-9 min-w-0 flex-1 items-center gap-2.5 rounded-xl border border-line bg-surface px-3 text-sm text-ink-3 transition hover:border-ink-3/40 sm:max-w-sm">
            <Search size={15} />
            <span className="truncate">{t('Search or jump to…', 'Suchen oder springen…')}</span>
            <kbd className="ml-auto hidden rounded-md border border-line px-1.5 text-[10px] sm:block">Ctrl K</kbd>
          </button>
          <div className="ml-auto flex items-center gap-2">
            <PortalSwitcher current={`/${portal}`} />
            <LangToggle className="hidden sm:inline-flex" />
            <ThemeToggle />
            <button onClick={onBell} className="relative grid h-9 w-9 place-items-center rounded-xl border border-line bg-surface text-ink-2 hover:text-ink">
              <Bell size={16} />
              {bellCount > 0 && <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-coral px-1 text-[9px] font-bold text-white">{bellCount}</span>}
            </button>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <AnimatePresence mode="wait">
            <motion.div key={loc.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <CommandPalette items={cmdItems} open={cmd} onClose={() => setCmd(false)} />
    </div>
  )
}

export function PageHeader({ title, sub, actions, eyebrow }: { title: React.ReactNode; sub?: React.ReactNode; actions?: React.ReactNode; eyebrow?: string }) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <div className="mb-1.5 eyebrow">{eyebrow}</div>}
        <h1 className="font-display text-[28px] font-semibold leading-tight tracking-tight sm:text-[32px]">{title}</h1>
        {sub && <p className="mt-1.5 max-w-2xl text-sm text-ink-2">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}
