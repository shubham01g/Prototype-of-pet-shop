import { cn } from '@/lib/utils'
import type { Species } from '@/data/types'

/* ------------------------------------------------------------------------ Logo */
export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <linearGradient id="vl-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgb(var(--c-brand))" />
          <stop offset="1" stopColor="rgb(var(--c-brand-strong))" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill="url(#vl-g)" />
      <g fill="#FBF8F3">
        <ellipse cx="22" cy="23" rx="5" ry="6.5" />
        <ellipse cx="42" cy="23" rx="5" ry="6.5" />
        <ellipse cx="13.5" cy="34.5" rx="4.5" ry="5.5" />
        <ellipse cx="50.5" cy="34.5" rx="4.5" ry="5.5" />
        <path d="M32 32c-8 0-14 8-14 13 0 4 3 6 7 6 3 0 4.5-1.5 7-1.5s4 1.5 7 1.5c4 0 7-2 7-6 0-5-6-13-14-13z" />
      </g>
      <circle cx="51" cy="13" r="6" fill="rgb(var(--c-coral))" stroke="#FBF8F3" strokeWidth="2.5" />
    </svg>
  )
}

export function Logo({ size = 30, className, sub }: { size?: number; className?: string; sub?: string }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <LogoMark size={size} />
      <div className="leading-none">
        <div className="font-display font-semibold tracking-tight" style={{ fontSize: size * 0.72 }}>Vetly</div>
        {sub && <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-3">{sub}</div>}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ Pet faces */
function PetFace({ species, hue }: { species: Species; hue: number }) {
  const fur = `hsl(${hue} 42% 60%)`
  const dark = `hsl(${hue} 38% 38%)`
  const light = `hsl(${hue} 55% 86%)`
  const eye = '#1d2522'
  switch (species) {
    case 'dog':
      return (
        <g>
          <path d="M14 22c-5 3-7 16-3 23 2 3 6 2 7-1l3-15z" fill={dark} />
          <path d="M50 22c5 3 7 16 3 23-2 3-6 2-7-1l-3-15z" fill={dark} />
          <ellipse cx="32" cy="33" rx="17" ry="18" fill={fur} />
          <ellipse cx="32" cy="42" rx="10" ry="8" fill={light} />
          <ellipse cx="32" cy="38" rx="4" ry="3" fill={eye} />
          <path d="M32 41v3m-3 0c1.5 1.5 4.5 1.5 6 0" stroke={eye} strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <circle cx="25" cy="30" r="2.4" fill={eye} /><circle cx="39" cy="30" r="2.4" fill={eye} />
          <circle cx="25.8" cy="29.2" r=".8" fill="#fff" /><circle cx="39.8" cy="29.2" r=".8" fill="#fff" />
          <path d="M33 51c0 3 4 4 4 1" fill="#EE7054" />
        </g>
      )
    case 'cat':
      return (
        <g>
          <path d="M15 14l4 17 12-8z" fill={fur} /><path d="M49 14l-4 17-12-8z" fill={fur} />
          <path d="M17.5 18l2.5 9 6-4z" fill={light} /><path d="M46.5 18l-2.5 9-6-4z" fill={light} />
          <ellipse cx="32" cy="35" rx="17" ry="15" fill={fur} />
          <path d="M26 21c2 3 4 4 6 4s4-1 6-4" stroke={dark} strokeWidth="2" fill="none" opacity=".5" />
          <ellipse cx="32" cy="42" rx="8" ry="5.5" fill={light} />
          <ellipse cx="25" cy="33" rx="2.4" ry="3" fill={eye} /><ellipse cx="39" cy="33" rx="2.4" ry="3" fill={eye} />
          <circle cx="25.8" cy="32" r=".8" fill="#fff" /><circle cx="39.8" cy="32" r=".8" fill="#fff" />
          <path d="M30.5 39h3l-1.5 2z" fill="#EE7054" />
          <path d="M32 41c0 2-2 3-3 2m3-2c0 2 2 3 3 2" stroke={eye} strokeWidth="1.1" fill="none" strokeLinecap="round" />
          <path d="M22 40l-9-1m9 3l-8 2m28-4l9-1m-9 3l8 2" stroke={dark} strokeWidth=".9" strokeLinecap="round" opacity=".6" />
        </g>
      )
    case 'rabbit':
      return (
        <g>
          <ellipse cx="25" cy="15" rx="5" ry="13" fill={fur} transform="rotate(-10 25 15)" />
          <ellipse cx="39" cy="15" rx="5" ry="13" fill={fur} transform="rotate(10 39 15)" />
          <ellipse cx="25" cy="15" rx="2.2" ry="9" fill={light} transform="rotate(-10 25 15)" />
          <ellipse cx="39" cy="15" rx="2.2" ry="9" fill={light} transform="rotate(10 39 15)" />
          <ellipse cx="32" cy="38" rx="15" ry="14" fill={fur} />
          <ellipse cx="32" cy="44" rx="7" ry="5" fill={light} />
          <circle cx="26" cy="35" r="2.3" fill={eye} /><circle cx="38" cy="35" r="2.3" fill={eye} />
          <circle cx="26.7" cy="34.3" r=".7" fill="#fff" /><circle cx="38.7" cy="34.3" r=".7" fill="#fff" />
          <ellipse cx="32" cy="41" rx="2" ry="1.4" fill="#EE7054" />
          <rect x="30.4" y="44" width="3.2" height="3" rx=".6" fill="#fff" />
        </g>
      )
    case 'bird':
      return (
        <g>
          <ellipse cx="32" cy="36" rx="15" ry="17" fill={fur} />
          <ellipse cx="32" cy="42" rx="10" ry="10" fill={light} />
          <path d="M20 30c-6 6-5 16 2 19" fill={dark} opacity=".8" />
          <path d="M28 20c2-6 6-7 9-4-3 0-5 2-6 5" fill={dark} />
          <circle cx="27" cy="31" r="2.4" fill={eye} /><circle cx="37" cy="31" r="2.4" fill={eye} />
          <circle cx="27.7" cy="30.3" r=".7" fill="#fff" /><circle cx="37.7" cy="30.3" r=".7" fill="#fff" />
          <path d="M29 35h6l-3 5z" fill="#F2B544" />
        </g>
      )
    case 'guinea':
      return (
        <g>
          <ellipse cx="32" cy="38" rx="20" ry="14" fill={fur} />
          <path d="M24 28c4-5 12-5 16 0" fill={dark} />
          <ellipse cx="17" cy="28" rx="4" ry="3" fill={dark} /><ellipse cx="47" cy="28" rx="4" ry="3" fill={dark} />
          <ellipse cx="32" cy="43" rx="9" ry="6" fill={light} />
          <circle cx="24" cy="36" r="2.4" fill={eye} /><circle cx="40" cy="36" r="2.4" fill={eye} />
          <circle cx="24.7" cy="35.3" r=".7" fill="#fff" /><circle cx="40.7" cy="35.3" r=".7" fill="#fff" />
          <ellipse cx="32" cy="41" rx="2" ry="1.3" fill="#EE7054" />
        </g>
      )
    default:
      return (
        <g>
          <path d="M22 16l3 8m17-8l-3 8" stroke={dark} strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="32" cy="34" rx="12" ry="18" fill={fur} />
          <path d="M28 16c4-3 8-3 10 2-3 0-6 2-8 6z" fill={dark} />
          <ellipse cx="32" cy="45" rx="9" ry="7" fill={light} />
          <circle cx="25" cy="30" r="2.2" fill={eye} /><circle cx="39" cy="30" r="2.2" fill={eye} />
          <circle cx="29" cy="46" r="1.2" fill={eye} /><circle cx="35" cy="46" r="1.2" fill={eye} />
        </g>
      )
  }
}

export function PetAvatar({ species, hue, size = 48, className, ring }: { species: Species; hue: number; size?: number; className?: string; ring?: boolean }) {
  return (
    <div
      className={cn('relative shrink-0 overflow-hidden rounded-[30%]', ring && 'ring-2 ring-surface', className)}
      style={{ width: size, height: size, background: `linear-gradient(145deg, hsl(${hue} 70% 93%), hsl(${(hue + 30) % 360} 55% 82%))` }}
    >
      <svg viewBox="0 0 64 64" width="100%" height="100%"><PetFace species={species} hue={hue} /></svg>
    </div>
  )
}

export const SPECIES_LABEL: Record<Species, { en: string; de: string; emoji: string }> = {
  dog: { en: 'Dog', de: 'Hund', emoji: '🐕' },
  cat: { en: 'Cat', de: 'Katze', emoji: '🐈' },
  rabbit: { en: 'Rabbit', de: 'Kaninchen', emoji: '🐇' },
  bird: { en: 'Bird', de: 'Vogel', emoji: '🦜' },
  guinea: { en: 'Guinea pig', de: 'Meerschweinchen', emoji: '🐹' },
  horse: { en: 'Horse', de: 'Pferd', emoji: '🐴' },
}

/* ------------------------------------------------------------------- City map */
export function CityMap({ pins, active, onPin, className, me = { x: 44, y: 46 } }: {
  pins: { id: string; x: number; y: number; label: string; hue: number; emergency?: boolean; muted?: boolean }[]
  active?: string
  onPin?: (id: string) => void
  className?: string
  me?: { x: number; y: number }
}) {
  return (
    <div className={cn('relative overflow-hidden bg-[#EEF0E6] dark:bg-[#18221F]', className)}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        {/* parks */}
        <path d="M5 8c8-4 18-2 22 5s-2 14-10 14S0 18 5 8z" className="fill-[#D3E4C8] dark:fill-[#1F3328]" />
        <path d="M70 6c10 0 20 6 18 14s-14 8-20 3-8-17 2-17z" className="fill-[#D3E4C8] dark:fill-[#1F3328]" />
        <path d="M8 70c6-6 16-4 18 4s-6 14-13 12-9-12-5-16z" className="fill-[#D3E4C8] dark:fill-[#1F3328]" />
        <circle cx="86" cy="86" r="9" className="fill-[#D3E4C8] dark:fill-[#1F3328]" />
        {/* river */}
        <path d="M-5 58c15 4 22-6 36-2s18 14 32 12 22-10 42-6" fill="none" strokeWidth="5.5" strokeLinecap="round" className="stroke-[#BFD7E8] dark:stroke-[#1B3346]" />
        {/* major roads */}
        <g className="stroke-white dark:stroke-[#2A3833]" strokeWidth="2.2" fill="none" strokeLinecap="round">
          <path d="M0 30h100" /><path d="M0 76h100" /><path d="M34 0v100" /><path d="M66 0v100" />
          <path d="M0 4l100 92" /><path d="M100 18L18 100" />
        </g>
        <g className="stroke-white/80 dark:stroke-[#24312D]" strokeWidth="0.9" fill="none">
          {[12, 20, 40, 48, 88].map((y) => <path key={y} d={`M0 ${y}h100`} />)}
          {[8, 18, 26, 44, 54, 76, 84, 92].map((x) => <path key={x} d={`M${x} 0v100`} />)}
        </g>
        {/* blocks texture */}
        <g className="fill-[#E3E5D9] dark:fill-[#1C2724]">
          {[[36, 32, 8, 6], [56, 32, 8, 6], [68, 34, 6, 5], [10, 32, 6, 6], [20, 42, 12, 4], [68, 42, 14, 4], [36, 78, 10, 8], [56, 80, 8, 6], [76, 78, 6, 8], [36, 14, 6, 5], [46, 22, 8, 6]].map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx="1" />
          ))}
        </g>
      </svg>

      {/* me */}
      <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${me.x}%`, top: `${me.y}%` }}>
        <span className="absolute inset-0 animate-pulseRing rounded-full bg-sky/50" />
        <span className="relative block h-4 w-4 rounded-full border-[3px] border-white bg-sky shadow-lg" />
      </div>

      {pins.map((p) => {
        const on = p.id === active
        return (
          <button
            key={p.id}
            onClick={() => onPin?.(p.id)}
            className={cn('absolute -translate-x-1/2 -translate-y-full transition-all duration-300', on ? 'z-20 scale-110' : 'z-10 hover:scale-105', p.muted && 'opacity-60')}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <div className={cn('flex items-center gap-1.5 whitespace-nowrap rounded-full py-1 pl-1 pr-2.5 text-[10px] font-semibold shadow-lift', on ? 'bg-ink text-canvas' : 'bg-surface text-ink')}>
              <span className="grid h-5 w-5 place-items-center rounded-full text-[10px] text-white" style={{ background: p.emergency ? 'rgb(var(--c-berry))' : `hsl(${p.hue} 50% 42%)` }}>
                {p.emergency ? '+' : '✚'}
              </span>
              {p.label}
            </div>
            <div className={cn('mx-auto h-2 w-2 -translate-y-1 rotate-45', on ? 'bg-ink' : 'bg-surface')} />
          </button>
        )
      })}
    </div>
  )
}

/* -------------------------------------------------------------- Doc thumbnail */
export function DocThumb({ kind, category, dataUrl, className }: { kind: 'pdf' | 'image'; category: string; dataUrl?: string; className?: string }) {
  if (dataUrl && kind === 'image') return <img src={dataUrl} className={cn('h-full w-full object-cover', className)} alt="" />
  const tint: Record<string, number> = { vaccination: 168, report: 214, invoice: 32, lab: 280, other: 120 }
  const h = tint[category] ?? 168
  return (
    <div className={cn('relative h-full w-full overflow-hidden', className)} style={{ background: `linear-gradient(160deg, hsl(${h} 50% 95%), hsl(${h} 40% 88%))` }}>
      {kind === 'image' ? (
        <svg viewBox="0 0 100 80" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
          <rect x="12" y="10" width="76" height="60" rx="4" fill="white" opacity=".85" transform="rotate(-4 50 40)" />
          <rect x="20" y="18" width="30" height="20" rx="2" fill={`hsl(${h} 45% 70%)`} transform="rotate(-4 50 40)" />
          {[44, 50, 56].map((y) => <rect key={y} x="20" y={y} width="56" height="3" rx="1.5" fill={`hsl(${h} 20% 80%)`} transform="rotate(-4 50 40)" />)}
          <rect x="56" y="20" width="22" height="3" rx="1.5" fill={`hsl(${h} 20% 75%)`} transform="rotate(-4 50 40)" />
          <rect x="56" y="27" width="16" height="3" rx="1.5" fill={`hsl(${h} 20% 80%)`} transform="rotate(-4 50 40)" />
        </svg>
      ) : (
        <svg viewBox="0 0 100 80" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
          <rect x="26" y="8" width="48" height="64" rx="3" fill="white" />
          <rect x="32" y="16" width="22" height="4" rx="2" fill={`hsl(${h} 45% 55%)`} />
          {[26, 32, 38, 44, 50, 56].map((y, i) => <rect key={y} x="32" y={y} width={i % 2 ? 28 : 36} height="2.6" rx="1.3" fill={`hsl(${h} 15% 82%)`} />)}
          <rect x="58" y="60" width="12" height="7" rx="1.5" fill="rgb(214 69 91)" />
          <text x="64" y="65.5" fontSize="4.5" fill="white" textAnchor="middle" fontWeight="700">PDF</text>
        </svg>
      )}
    </div>
  )
}
