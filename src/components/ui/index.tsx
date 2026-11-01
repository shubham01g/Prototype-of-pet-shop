import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

/* --------------------------------------------------------------------- Button */
type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'coral' | 'danger' | 'outline' | 'dark'
type BtnSize = 'xs' | 'sm' | 'md' | 'lg'

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; size?: BtnSize; icon?: React.ReactNode; iconRight?: React.ReactNode; block?: boolean }>(
  ({ variant = 'primary', size = 'md', icon, iconRight, block, className, children, ...rest }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40',
        size === 'xs' && 'h-7 rounded-lg px-2.5 text-xs',
        size === 'sm' && 'h-9 rounded-xl px-3.5 text-sm',
        size === 'md' && 'h-11 rounded-xl px-5 text-sm',
        size === 'lg' && 'h-[52px] rounded-2xl px-6 text-[15px]',
        variant === 'primary' && 'bg-brand text-brand-fg shadow-[0_6px_16px_-6px_rgb(var(--c-brand)/0.6)] hover:bg-brand-strong',
        variant === 'coral' && 'bg-coral text-white shadow-[0_6px_16px_-6px_rgb(var(--c-coral)/0.7)] hover:brightness-105',
        variant === 'secondary' && 'bg-brand-soft text-brand hover:bg-brand-soft/70',
        variant === 'ghost' && 'text-ink-2 hover:bg-muted hover:text-ink',
        variant === 'outline' && 'border border-line bg-surface text-ink hover:border-ink-3/50 hover:bg-muted/50',
        variant === 'danger' && 'bg-berry text-white hover:brightness-105',
        variant === 'dark' && 'bg-ink text-canvas hover:opacity-90',
        block && 'w-full',
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
      {iconRight}
    </button>
  ),
)
Button.displayName = 'Button'

/* ---------------------------------------------------------------------- Badge */
export type Tone = 'brand' | 'coral' | 'sun' | 'berry' | 'sky' | 'sage' | 'plum' | 'neutral'
const toneCls: Record<Tone, string> = {
  brand: 'bg-brand-soft text-brand',
  coral: 'bg-coral-soft text-coral',
  sun: 'bg-sun-soft text-sun',
  berry: 'bg-berry-soft text-berry',
  sky: 'bg-sky-soft text-sky',
  sage: 'bg-sage-soft text-sage',
  plum: 'bg-plum-soft text-plum',
  neutral: 'bg-muted text-ink-2',
}
export const toneText: Record<Tone, string> = {
  brand: 'text-brand', coral: 'text-coral', sun: 'text-sun', berry: 'text-berry', sky: 'text-sky', sage: 'text-sage', plum: 'text-plum', neutral: 'text-ink-2',
}
export const toneBg: Record<Tone, string> = toneCls

export function Badge({ tone = 'neutral', dot, className, children }: { tone?: Tone; dot?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold', toneCls[tone], className)}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}

/* --------------------------------------------------------------------- Switch */
export function Switch({ checked, onChange, size = 'md', label }: { checked: boolean; onChange: (v: boolean) => void; size?: 'sm' | 'md'; label?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation()
        onChange(!checked)
      }}
      className={cn(
        'relative shrink-0 rounded-full transition-colors duration-300',
        size === 'md' ? 'h-[26px] w-[44px]' : 'h-5 w-9',
        checked ? 'bg-brand' : 'bg-line dark:bg-ink-3/40',
      )}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 600, damping: 32 }}
        className={cn('absolute top-[3px] rounded-full bg-white shadow-md', size === 'md' ? 'h-5 w-5' : 'h-3.5 w-3.5')}
        style={{ left: checked ? (size === 'md' ? 21 : 19) : 3 }}
      />
    </button>
  )
}

/* ------------------------------------------------------------------ Segmented */
export function Segmented<T extends string>({ value, onChange, options, className, size = 'md' }: { value: T; onChange: (v: T) => void; options: { value: T; label: React.ReactNode }[]; className?: string; size?: 'sm' | 'md' }) {
  const id = React.useId()
  return (
    <div className={cn('inline-flex rounded-xl bg-muted p-1', className)}>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn('relative flex-1 whitespace-nowrap rounded-lg font-medium transition-colors', size === 'md' ? 'px-3.5 py-1.5 text-sm' : 'px-2.5 py-1 text-xs', value === o.value ? 'text-ink' : 'text-ink-3 hover:text-ink-2')}
        >
          {value === o.value && <motion.span layoutId={`seg-${id}`} className="absolute inset-0 rounded-lg bg-surface shadow-soft" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
          <span className="relative z-10">{o.label}</span>
        </button>
      ))}
    </div>
  )
}

/* ---------------------------------------------------------------------- Modal */
export function Modal({ open, onClose, title, children, width = 'max-w-lg', footer }: { open: boolean; onClose: () => void; title?: React.ReactNode; children: React.ReactNode; width?: string; footer?: React.ReactNode }) {
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className={cn('relative max-h-[92vh] w-full overflow-hidden rounded-t-3xl bg-surface shadow-float sm:rounded-3xl', width)}
          >
            {title && (
              <div className="flex items-center justify-between border-b border-line/70 px-6 py-4">
                <div className="font-display text-lg font-semibold">{title}</div>
                <button onClick={onClose} className="rounded-full p-1.5 text-ink-3 hover:bg-muted hover:text-ink"><X size={18} /></button>
              </div>
            )}
            <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
            {footer && <div className="flex justify-end gap-2 border-t border-line/70 bg-muted/40 px-6 py-3.5">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

/* ---------------------------------------------------- Sheet (inside the phone) */
export function Sheet({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: React.ReactNode; title?: React.ReactNode }) {
  const host = typeof document !== 'undefined' ? document.getElementById('phone-overlay') : null
  const node = (
    <AnimatePresence>
      {open && (
        <div className="absolute inset-0 z-50 flex items-end">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/35" onClick={onClose} />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, i) => i.offset.y > 120 && onClose()}
            className="relative max-h-[88%] w-full overflow-hidden rounded-t-[28px] bg-surface shadow-float"
          >
            <div className="flex justify-center pb-1 pt-2.5"><div className="h-1.5 w-10 rounded-full bg-line" /></div>
            {title && <div className="px-5 pb-2 pt-1 font-display text-xl font-semibold">{title}</div>}
            <div className="no-scrollbar max-h-[70vh] overflow-y-auto px-5 pb-8">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
  return host ? createPortal(node, host) : node
}

/* --------------------------------------------------------------- ProgressRing */
export function Ring({ value, size = 64, stroke = 7, color = 'rgb(var(--c-brand))', track = 'rgb(var(--c-line))', children }: { value: number; size?: number; stroke?: number; color?: string; track?: string; children?: React.ReactNode }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - value / 100) }} transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  )
}

/* ------------------------------------------------------------------ Sparkline */
export function Sparkline({ data, color = 'rgb(var(--c-brand))', height = 36, width = 120, fill = true }: { data: number[]; color?: string; height?: number; width?: number; fill?: boolean }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const pts = data.map((d, i) => [(i / (data.length - 1)) * width, height - 3 - ((d - min) / (max - min || 1)) * (height - 6)])
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const id = React.useId().replace(/:/g, '')
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
      <defs>
        <linearGradient id={`sg${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={`${path} L${width},${height} L0,${height} Z`} fill={`url(#sg${id})`} />}
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

/* ------------------------------------------------------------------- StatCard */
export function StatCard({ label, value, delta, icon, tone = 'brand', spark, hint, invert }: { label: string; value: React.ReactNode; delta?: number; icon?: React.ReactNode; tone?: Tone; spark?: number[]; hint?: string; invert?: boolean }) {
  const colorVar: Record<Tone, string> = { brand: '--c-brand', coral: '--c-coral', sun: '--c-sun', berry: '--c-berry', sky: '--c-sky', sage: '--c-sage', plum: '--c-plum', neutral: '--c-ink-3' }
  return (
    <div className="card group relative overflow-hidden p-5 transition hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-start justify-between">
        <div className="text-[13px] font-medium text-ink-2">{label}</div>
        {icon && <div className={cn('grid h-9 w-9 place-items-center rounded-xl', toneCls[tone])}>{icon}</div>}
      </div>
      <div className="mt-2 font-display text-[28px] font-semibold leading-none tracking-tight">{value}</div>
      <div className="mt-2 flex items-center gap-2 text-xs">
        {delta !== undefined && (
          <span className={cn('rounded-md px-1.5 py-0.5 font-semibold', (delta >= 0) !== !!invert ? 'bg-sage-soft text-sage' : 'bg-berry-soft text-berry')}>
            {delta >= 0 ? '▲' : '▼'} {Math.abs(delta)}%
          </span>
        )}
        {hint && <span className="text-ink-3">{hint}</span>}
      </div>
      {spark && <div className="-mx-1 mt-3"><Sparkline data={spark} color={`rgb(var(${colorVar[tone]}))`} /></div>}
    </div>
  )
}

/* ------------------------------------------------------------------ EmptyState */
export function EmptyState({ icon, title, body, action }: { icon: React.ReactNode; title: string; body?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      <div className="mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-brand-soft text-brand">{icon}</div>
      <div className="font-display text-lg font-semibold">{title}</div>
      {body && <p className="mt-1 max-w-xs text-sm text-ink-2">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

/* ---------------------------------------------------------------------- Field */
export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-ink-3">{hint}</span>}
    </label>
  )
}

/* -------------------------------------------------------------------- Avatar */
export function Initials({ name, hue = 168, size = 36, className }: { name: string; hue?: number; size?: number; className?: string }) {
  const init = name.split(' ').filter((p) => !p.startsWith('Dr')).map((p) => p[0]).slice(0, 2).join('')
  return (
    <div
      className={cn('grid shrink-0 place-items-center rounded-full font-semibold text-white', className)}
      style={{ width: size, height: size, fontSize: size * 0.38, background: `linear-gradient(135deg, hsl(${hue} 55% 55%), hsl(${(hue + 40) % 360} 60% 42%))` }}
    >
      {init}
    </div>
  )
}

/* -------------------------------------------------------------------- Section */
export function SectionTitle({ children, action, className }: { children: React.ReactNode; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn('mb-3 flex items-center justify-between', className)}>
      <h3 className="font-display text-[17px] font-semibold tracking-tight">{children}</h3>
      {action}
    </div>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('relative overflow-hidden rounded-lg bg-muted', className)}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </div>
  )
}
