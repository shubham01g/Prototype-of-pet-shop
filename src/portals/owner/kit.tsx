import { motion } from 'framer-motion'
import { Bug, ChevronLeft, ChevronRight, Pill, ShieldPlus, Stethoscope, Syringe } from 'lucide-react'
import React from 'react'
import type { Treatment, TreatmentType } from '@/data/types'
import type { Tone } from '@/components/ui'
import { cn, daysUntil } from '@/lib/utils'
import { useNav } from './nav'

export const TYPE_META: Record<TreatmentType, { icon: React.ElementType; en: string; de: string; tone: Tone }> = {
  vaccination: { icon: Syringe, en: 'Vaccination', de: 'Impfung', tone: 'brand' },
  worming: { icon: ShieldPlus, en: 'Worming', de: 'Entwurmung', tone: 'plum' },
  fleatick: { icon: Bug, en: 'Flea & tick', de: 'Floh & Zecke', tone: 'sage' },
  medication: { icon: Pill, en: 'Medication', de: 'Medikament', tone: 'sky' },
  checkup: { icon: Stethoscope, en: 'Check-up', de: 'Kontrolle', tone: 'sun' },
}

export function dueTone(iso: string): Tone {
  const d = daysUntil(iso)
  if (d < 0) return 'berry'
  if (d <= 7) return 'coral'
  if (d <= 30) return 'sun'
  return 'sage'
}

export function healthScore(ts: Treatment[]) {
  if (!ts.length) return 100
  let s = 100
  ts.forEach((t) => {
    const d = daysUntil(t.dueDate)
    if (t.repeat === 'daily') return
    if (d < 0) s -= 14
    else if (d <= 7) s -= 3
  })
  return Math.max(35, Math.min(100, s))
}

export function ScreenHeader({ title, right, large, transparent, onBack }: { title?: React.ReactNode; right?: React.ReactNode; large?: boolean; transparent?: boolean; onBack?: () => void }) {
  const pop = useNav((s) => s.pop)
  const depth = useNav((s) => s.stack.length)
  const canBack = depth > 0 || !!onBack
  return (
    <div className={cn('sticky top-0 z-20 px-4 pb-2 pt-1', transparent ? '' : 'bg-canvas/85 backdrop-blur-xl')}>
      <div className="flex h-11 items-center gap-2">
        {canBack && (
          <button onClick={onBack ?? pop} className="-ml-1.5 grid h-9 w-9 place-items-center rounded-full text-ink transition hover:bg-muted active:scale-90">
            <ChevronLeft size={24} />
          </button>
        )}
        {!large && <div className="flex-1 truncate text-center text-[15px] font-semibold">{title}</div>}
        {large && <div className="flex-1" />}
        <div className={cn('flex min-w-9 items-center justify-end gap-1', !canBack && !large && 'hidden')}>{right}</div>
      </div>
      {large && <h1 className="mt-0.5 font-display text-[30px] font-semibold leading-tight tracking-tight">{title}</h1>}
    </div>
  )
}

export function Group({ title, children, className, action }: { title?: string; children: React.ReactNode; className?: string; action?: React.ReactNode }) {
  return (
    <div className={cn('mt-5', className)}>
      {title && (
        <div className="mb-2 flex items-center justify-between px-1">
          <div className="text-[13px] font-semibold text-ink-2">{title}</div>
          {action}
        </div>
      )}
      <div className="overflow-hidden rounded-2xl bg-surface shadow-soft ring-1 ring-line/60">{children}</div>
    </div>
  )
}

export function Row({ icon, iconTone = 'neutral', title, sub, right, onClick, chevron = true, danger }: {
  icon?: React.ReactNode; iconTone?: Tone; title: React.ReactNode; sub?: React.ReactNode; right?: React.ReactNode; onClick?: () => void; chevron?: boolean; danger?: boolean
}) {
  const toneCls: Record<Tone, string> = {
    brand: 'bg-brand-soft text-brand', coral: 'bg-coral-soft text-coral', sun: 'bg-sun-soft text-sun', berry: 'bg-berry-soft text-berry',
    sky: 'bg-sky-soft text-sky', sage: 'bg-sage-soft text-sage', plum: 'bg-plum-soft text-plum', neutral: 'bg-muted text-ink-2',
  }
  const Comp = onClick ? 'button' : 'div'
  return (
    <Comp onClick={onClick} className={cn('flex w-full items-center gap-3 px-4 py-3 text-left [&+&]:border-t [&+&]:border-line/60', onClick && 'transition active:bg-muted/60')}>
      {icon && <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-xl', toneCls[iconTone])}>{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className={cn('block truncate text-[14.5px] font-medium', danger && 'text-berry')}>{title}</span>
        {sub && <span className="mt-0.5 block truncate text-[12.5px] text-ink-3">{sub}</span>}
      </span>
      {right}
      {onClick && chevron && <ChevronRight size={17} className="shrink-0 text-ink-3" />}
    </Comp>
  )
}

export function Chip({ active, children, onClick, className }: { active?: boolean; children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn('flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-medium transition active:scale-95', active ? 'bg-ink text-canvas' : 'bg-surface text-ink-2 ring-1 ring-line', className)}
    >
      {children}
    </button>
  )
}

export function Screen({ children, className, pad = true }: { children: React.ReactNode; className?: string; pad?: boolean }) {
  return <div className={cn('min-h-full pb-28', pad && 'px-4', className)}>{children}</div>
}

export const pressable = { whileTap: { scale: 0.97 } }

export function FadeIn({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }} className={className}>
      {children}
    </motion.div>
  )
}
