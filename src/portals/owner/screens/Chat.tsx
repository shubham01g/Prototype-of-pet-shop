import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Camera, CheckCheck, FileText, Paperclip, Phone, Plus, SendHorizonal, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { PetAvatar } from '@/components/illustrations'
import { Button } from '@/components/ui'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/utils'
import { useDemo } from '@/store/useDemoStore'
import { ME } from '@/data/seed'
import type { Message } from '@/data/types'
import { Chip, FadeIn, ScreenHeader } from '../kit'
import { useNav } from '../nav'

export function ChatList() {
  const { t, relTime } = useI18n()
  const s = useDemo()
  const nav = useNav()
  const threads = s.threads.filter((th) => th.ownerId === ME).sort((a, b) => (b.messages.at(-1)?.at ?? 0) - (a.messages.at(-1)?.at ?? 0))
  return (
    <div className="min-h-full px-5 pb-32">
      <div className="flex items-end justify-between pt-3">
        <h1 className="font-display text-[30px] font-semibold">{t('Messages', 'Nachrichten')}</h1>
        <button onClick={() => nav.push({ name: 'newThread' })} className="grid h-10 w-10 place-items-center rounded-full bg-brand text-brand-fg shadow-lift active:scale-95"><Plus size={20} /></button>
      </div>
      <EmergencyNotice compact />
      <div className="mt-4 space-y-2.5">
        {threads.map((th, i) => {
          const c = s.clinics.find((x) => x.id === th.clinicId)!
          const p = s.pets.find((x) => x.id === th.petId)
          const last = th.messages.at(-1)
          const unread = th.messages.filter((m) => m.from === 'clinic' && !m.read).length
          return (
            <FadeIn key={th.id} delay={i * 0.04}>
              <button onClick={() => nav.push({ name: 'thread', id: th.id })} className="flex w-full items-center gap-3 rounded-3xl bg-surface p-3.5 text-left shadow-soft ring-1 ring-line/60 active:scale-[0.99]">
                <div className="relative">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl text-lg font-bold text-white" style={{ background: `linear-gradient(135deg, hsl(${c.hue} 50% 48%), hsl(${c.hue + 30} 50% 36%))` }}>{c.short[0]}</span>
                  {p && <PetAvatar species={p.species} hue={p.hue} size={24} className="absolute -bottom-1 -right-1 ring-2 ring-surface" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[14.5px] font-semibold">{c.short}</span>
                    <span className="shrink-0 text-[11px] text-ink-3">{last && relTime(last.at)}</span>
                  </div>
                  <div className="truncate text-[12.5px] font-medium text-ink-2">{th.subject}</div>
                  <div className={cn('truncate text-[12.5px]', unread ? 'font-semibold text-ink' : 'text-ink-3')}>
                    {last?.from === 'owner' && t('You: ', 'Du: ')}{last?.attachment && '📎 '}{last?.text}
                  </div>
                </div>
                {unread > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-coral px-1.5 text-[11px] font-bold text-white">{unread}</span>}
              </button>
            </FadeIn>
          )
        })}
      </div>
    </div>
  )
}

export function EmergencyNotice({ compact }: { compact?: boolean }) {
  const { t } = useI18n()
  const toast = useDemo((s) => s.toast)
  return (
    <div className={cn('flex items-start gap-3 rounded-2xl border border-berry/20 bg-berry-soft text-berry', compact ? 'mt-4 p-3' : 'p-3')}>
      <AlertTriangle size={18} className="mt-0.5 shrink-0" />
      <div className="flex-1 text-[12.5px] leading-snug">
        <span className="font-bold">{t('Not for emergencies.', 'Kein Notfall-Chat.')}</span>{' '}
        {t('Replies can take hours. In an emergency, call your vet or the 24/7 emergency clinic.', 'Antworten können Stunden dauern. Im Notfall rufen Sie Ihre Praxis oder den 24/7-Notdienst an.')}
      </div>
      <button onClick={() => toast({ title: '+49 30 2936 5500', body: t('Kleintierklinik an der Spree · 24/7', 'Kleintierklinik an der Spree · 24/7'), tone: 'berry' })} className="flex shrink-0 items-center gap-1 rounded-full bg-berry px-2.5 py-1.5 text-[11px] font-bold text-white">
        <Phone size={12} />{t('Call', 'Anrufen')}
      </button>
    </div>
  )
}

export function ThreadView({ id }: { id: string }) {
  const { t, fmtTime, locale } = useI18n()
  const s = useDemo()
  const th = s.threads.find((x) => x.id === id)
  const c = s.clinics.find((x) => x.id === th?.clinicId)
  const p = s.pets.find((x) => x.id === th?.petId)
  const [text, setText] = useState('')
  const [att, setAtt] = useState<Message['attachment']>()
  const [typing, setTyping] = useState(false)
  const file = useRef<HTMLInputElement>(null)
  const end = useRef<HTMLDivElement>(null)
  const count = th?.messages.length ?? 0

  useEffect(() => { s.markThreadRead(id, 'owner') }, [id, count]) // eslint-disable-line
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [count, typing])

  if (!th || !c) return null

  const send = () => {
    if (!text.trim() && !att) return
    s.sendMessage(id, 'owner', text.trim() || (att?.kind === 'pdf' ? '📄' : '📷'), att)
    setText('')
    setAtt(undefined)
    // simulated clinic reply for the demo
    setTimeout(() => setTyping(true), 900)
    setTimeout(() => {
      setTyping(false)
      s.sendMessage(id, 'clinic', t('Thanks for your message! Dr. Lehmann will get back to you today. If it gets worse, please call us.', 'Danke für Ihre Nachricht! Dr. Lehmann meldet sich heute noch. Bei Verschlechterung bitte anrufen.'), undefined, 'Praxis-Team')
    }, 3200)
  }
  const onFile = (f?: File) => {
    if (!f) return
    const kind = f.type === 'application/pdf' ? 'pdf' : 'image'
    if (kind === 'image' && f.size < 1_500_000) {
      const r = new FileReader()
      r.onload = () => setAtt({ name: f.name, kind, dataUrl: r.result as string })
      r.readAsDataURL(f)
    } else setAtt({ name: f.name, kind })
  }

  let lastDay = ''
  return (
    <div className="flex flex-1 flex-col">
      <div className="sticky top-0 z-20 bg-canvas/90 backdrop-blur-xl">
        <ScreenHeader
          title={
            <div className="flex flex-col items-center leading-tight">
              <span>{c.short}</span>
              <span className="flex items-center gap-1 text-[11px] font-medium text-sage"><span className="h-1.5 w-1.5 rounded-full bg-sage" />{t('Usually replies within 2 h', 'Antwortet meist in 2 Std.')}</span>
            </div>
          }
          right={<button onClick={() => s.toast({ title: c.phone })} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted"><Phone size={18} /></button>}
        />
        <div className="px-4 pb-2"><EmergencyNotice /></div>
      </div>

      <div className="flex-1 space-y-2 px-4 pb-4 pt-2">
        <div className="mx-auto my-2 flex w-fit items-center gap-2 rounded-full bg-muted px-3 py-1 text-[11px] text-ink-3">
          {p && <PetAvatar species={p.species} hue={p.hue} size={16} />}{th.subject}
        </div>
        {th.messages.map((m) => {
          const day = new Date(m.at).toDateString()
          const showDay = day !== lastDay
          lastDay = day
          const mine = m.from === 'owner'
          return (
            <div key={m.id}>
              {showDay && <div className="my-3 text-center text-[11px] font-semibold text-ink-3">{new Date(m.at).toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short' })}</div>}
              <motion.div initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
                <div className={cn('max-w-[78%] rounded-[20px] px-3.5 py-2.5 shadow-soft', mine ? 'rounded-br-md bg-brand text-brand-fg' : 'rounded-bl-md bg-surface ring-1 ring-line/60')}>
                  {!mine && m.author && <div className="mb-0.5 text-[11px] font-bold text-brand">{m.author}</div>}
                  {m.attachment && (
                    m.attachment.kind === 'image' ? (
                      <div className="mb-1.5 overflow-hidden rounded-xl">
                        {m.attachment.dataUrl ? <img src={m.attachment.dataUrl} alt="" className="max-h-44 w-full object-cover" /> : <div className="grid h-28 w-44 place-items-center bg-black/10 text-[11px]"><Camera size={20} /></div>}
                      </div>
                    ) : (
                      <div className={cn('mb-1.5 flex items-center gap-2 rounded-xl px-2.5 py-2', mine ? 'bg-white/15' : 'bg-muted')}><FileText size={16} /><span className="truncate text-[12px] font-semibold">{m.attachment.name}</span></div>
                    )
                  )}
                  <div className="whitespace-pre-wrap text-[14px] leading-snug">{m.text}</div>
                  <div className={cn('mt-1 flex items-center justify-end gap-1 text-[10px]', mine ? 'text-brand-fg/70' : 'text-ink-3')}>
                    {fmtTime(m.at)}{mine && <CheckCheck size={13} className={m.read ? 'text-sky-200' : ''} />}
                  </div>
                </div>
              </motion.div>
            </div>
          )
        })}
        <AnimatePresence>
          {typing && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex">
              <div className="flex gap-1 rounded-[20px] rounded-bl-md bg-surface px-4 py-3.5 ring-1 ring-line/60">
                {[0, 1, 2].map((i) => <motion.span key={i} className="h-2 w-2 rounded-full bg-ink-3" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={end} />
      </div>

      <div className="sticky bottom-0 z-20 border-t border-line/60 bg-canvas/95 px-3 pb-7 pt-2.5 backdrop-blur-xl">
        <input ref={file} type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        {att && (
          <div className="mb-2 flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-[12px]">
            {att.kind === 'image' ? <Camera size={15} /> : <FileText size={15} />}<span className="flex-1 truncate font-medium">{att.name}</span>
            <button onClick={() => setAtt(undefined)}><X size={15} /></button>
          </div>
        )}
        <div className="flex items-end gap-2">
          <button onClick={() => file.current?.click()} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-muted text-ink-2 active:scale-95"><Paperclip size={19} /></button>
          <textarea
            rows={1} value={text} onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder={t('Write a message…', 'Nachricht schreiben…')}
            className="max-h-28 min-h-[44px] flex-1 resize-none rounded-[22px] bg-surface px-4 py-3 text-[14px] outline-none ring-1 ring-line focus:ring-brand"
          />
          <button onClick={send} disabled={!text.trim() && !att} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand text-brand-fg shadow-lift transition disabled:opacity-30 active:scale-95"><SendHorizonal size={18} /></button>
        </div>
      </div>
    </div>
  )
}

export function NewThread() {
  const { t } = useI18n()
  const s = useDemo()
  const nav = useNav()
  const pets = s.pets.filter((p) => p.ownerId === ME)
  const clinics = s.clinics.filter((c) => c.onVetly)
  const [clinicId, setClinicId] = useState('c1')
  const [petId, setPetId] = useState(s.activePetId)
  const topics = [t('Question about medication', 'Frage zu Medikament'), t('Lab results', 'Laborergebnisse'), t('Follow-up after visit', 'Nachfrage nach Termin'), t('Prescription refill', 'Folgerezept'), t('Other', 'Sonstiges')]
  const [topic, setTopic] = useState(topics[0])
  const [text, setText] = useState('')
  const start = () => {
    const p = pets.find((x) => x.id === petId)
    const id = s.startThread(clinicId, petId, `${p?.name} · ${topic}`, text)
    nav.pop()
    nav.push({ name: 'thread', id })
  }
  return (
    <div className="min-h-full pb-10">
      <ScreenHeader title={t('New message', 'Neue Nachricht')} />
      <div className="px-5">
        <label className="label mt-2">{t('Clinic', 'Praxis')}</label>
        <div className="space-y-2">
          {clinics.map((c) => (
            <button key={c.id} onClick={() => setClinicId(c.id)} className={cn('flex w-full items-center gap-3 rounded-2xl border-2 bg-surface p-2.5 text-left', clinicId === c.id ? 'border-brand' : 'border-transparent ring-1 ring-line')}>
              <span className="grid h-9 w-9 place-items-center rounded-xl text-sm font-bold text-white" style={{ background: `hsl(${c.hue} 50% 45%)` }}>{c.short[0]}</span>
              <span className="text-[14px] font-semibold">{c.name}</span>
            </button>
          ))}
        </div>
        <label className="label mt-5">{t('About', 'Betrifft')}</label>
        <div className="flex gap-2">
          {pets.map((p) => <Chip key={p.id} active={petId === p.id} onClick={() => setPetId(p.id)}><PetAvatar species={p.species} hue={p.hue} size={18} />{p.name}</Chip>)}
        </div>
        <label className="label mt-5">{t('Topic', 'Thema')}</label>
        <div className="flex flex-wrap gap-2">
          {topics.map((x) => <Chip key={x} active={topic === x} onClick={() => setTopic(x)}>{x}</Chip>)}
        </div>
        <label className="label mt-5">{t('Message', 'Nachricht')}</label>
        <textarea className="input min-h-[110px] resize-none" value={text} onChange={(e) => setText(e.target.value)} placeholder={t('Describe your question…', 'Beschreiben Sie Ihre Frage…')} />
        <div className="mt-4"><EmergencyNotice /></div>
        <Button block size="lg" className="mt-5" disabled={!text.trim()} onClick={start}>{t('Send', 'Senden')}</Button>
      </div>
    </div>
  )
}
