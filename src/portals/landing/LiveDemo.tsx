import { ArrowLeft, ArrowRight, Lock, RotateCcw, Smartphone, Building2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/illustrations'
import { LangToggle, ThemeToggle } from '@/components/shell'
import { Button } from '@/components/ui'
import { useI18n } from '@/i18n'
import { useDemo } from '@/store/useDemoStore'

export default function LiveDemo() {
  const { t } = useI18n()
  const reset = useDemo((s) => s.resetDemo)
  const [key, setKey] = useState(0)

  const steps = [
    t('On the phone: sign in → tap “Book” → pick a clinic, service & time → send', 'Am Handy: anmelden → „Buchen“ → Praxis, Leistung & Zeit wählen → senden'),
    t('On the right: the request appears instantly, so click Accept or Suggest new time', 'Rechts erscheint die Anfrage sofort, dann Annehmen oder Neue Zeit vorschlagen'),
    t('Watch the push notification land on the phone', 'Sehen Sie die Push-Nachricht auf dem Handy ankommen'),
  ]

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="flex h-16 items-center gap-4 border-b border-line/60 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-sm text-ink-2 hover:text-ink"><ArrowLeft size={16} /></Link>
        <Logo size={28} sub={t('Live demo', 'Live-Demo')} />
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" icon={<RotateCcw size={14} />} onClick={() => { reset(); setKey((k) => k + 1) }}>{t('Reset', 'Zurücksetzen')}</Button>
          <LangToggle />
          <ThemeToggle />
        </div>
      </header>

      <div className="border-b border-line/60 bg-muted/40 px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px]">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-ink-2">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-brand text-[11px] font-bold text-brand-fg">{i + 1}</span>
              {s}
              {i < steps.length - 1 && <ArrowRight size={14} className="hidden text-ink-3 xl:block" />}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center gap-8 overflow-x-auto p-6 xl:flex-row xl:items-start xl:justify-center">
        {/* phone */}
        <div className="flex shrink-0 flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink-3"><Smartphone size={14} /> {t('Owner app · Lena', 'Halter-App · Lena')}</div>
          <div className="rounded-[52px] bg-[#111816] p-3 shadow-float ring-1 ring-black/10">
            <div className="relative h-[780px] w-[360px] overflow-hidden rounded-[42px] bg-canvas">
              <iframe key={`a${key}`} src="/app?embed=1" title="Owner app" className="h-full w-full border-0" />
            </div>
          </div>
        </div>

        {/* clinic */}
        <div className="flex w-full min-w-[720px] max-w-[1100px] flex-1 flex-col gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink-3"><Building2 size={14} /> {t('Clinic dashboard · Praxis Lehmann', 'Praxis-Dashboard · Praxis Lehmann')}</div>
          <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-float">
            <div className="flex items-center gap-3 border-b border-line bg-muted/60 px-4 py-2.5">
              <div className="flex gap-1.5">{['#F2785C', '#F4B740', '#62A07A'].map((c) => <span key={c} className="h-3 w-3 rounded-full" style={{ background: c }} />)}</div>
              <div className="mx-auto flex items-center gap-2 rounded-lg bg-surface px-4 py-1 text-xs text-ink-3"><Lock size={11} /> clinic.vetly.de/requests</div>
            </div>
            <iframe key={`c${key}`} src="/clinic/requests?embed=1" title="Clinic dashboard" className="h-[760px] w-full border-0" />
          </div>
        </div>
      </div>
    </div>
  )
}
