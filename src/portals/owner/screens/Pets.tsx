import { motion } from 'framer-motion'
import { Camera, Check, ChevronRight, Copy, FileText, Image as ImageIcon, Plus, QrCode, Scale, Share2, Trash2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { DocThumb, PetAvatar, SPECIES_LABEL } from '@/components/illustrations'
import { Badge, Button, Segmented, Sheet, Switch } from '@/components/ui'
import { useI18n } from '@/i18n'
import { ageFrom, cn, daysUntil, isoDay } from '@/lib/utils'
import { REPEAT_LABEL, useDemo } from '@/store/useDemoStore'
import { ME } from '@/data/seed'
import type { DocCategory, PetDocument, Repeat, Species, Treatment, TreatmentType } from '@/data/types'
import { Chip, FadeIn, ScreenHeader, TYPE_META, dueTone, healthScore } from '../kit'
import { useNav } from '../nav'
import { DueSheet } from './Home'

/* ===================================================================== list */
export function PetsList() {
  const { t, tl } = useI18n()
  const s = useDemo()
  const nav = useNav()
  const pets = s.pets.filter((p) => p.ownerId === ME)
  return (
    <div className="min-h-full px-5 pb-32">
      <div className="flex items-end justify-between pt-3">
        <h1 className="font-display text-[30px] font-semibold">{t('My pets', 'Meine Tiere')}</h1>
        <button onClick={() => nav.push({ name: 'addPet' })} className="grid h-10 w-10 place-items-center rounded-full bg-brand text-brand-fg shadow-lift active:scale-95"><Plus size={20} /></button>
      </div>
      <div className="mt-5 space-y-3">
        {pets.map((p, i) => {
          const ts = s.treatments.filter((x) => x.petId === p.id)
          const overdue = ts.filter((x) => daysUntil(x.dueDate) < 0 && x.repeat !== 'daily').length
          const soon = ts.filter((x) => daysUntil(x.dueDate) >= 0 && daysUntil(x.dueDate) <= 14).length
          const age = ageFrom(p.birthDate)
          return (
            <FadeIn key={p.id} delay={i * 0.05}>
              <button onClick={() => nav.push({ name: 'pet', id: p.id })} className="relative flex w-full items-center gap-4 overflow-hidden rounded-[26px] bg-surface p-4 text-left shadow-soft ring-1 ring-line/60 active:scale-[0.99]">
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-50" style={{ background: `hsl(${p.hue} 70% 90%)` }} />
                <PetAvatar species={p.species} hue={p.hue} size={68} />
                <div className="relative min-w-0 flex-1">
                  <div className="font-display text-xl font-semibold">{p.name}</div>
                  <div className="truncate text-[13px] text-ink-3">{tl(SPECIES_LABEL[p.species])} · {p.breed}</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge>{age.years > 0 ? t(`${age.years} yrs`, `${age.years} J.`) : t(`${age.months} mo`, `${age.months} Mon.`)}</Badge>
                    {overdue > 0 && <Badge tone="berry" dot>{t(`${overdue} overdue`, `${overdue} überfällig`)}</Badge>}
                    {soon > 0 && <Badge tone="sun" dot>{t(`${soon} due soon`, `${soon} bald fällig`)}</Badge>}
                    {!overdue && !soon && <Badge tone="sage" dot>{t('All good', 'Alles gut')}</Badge>}
                  </div>
                </div>
                <ChevronRight size={18} className="relative text-ink-3" />
              </button>
            </FadeIn>
          )
        })}
        <button onClick={() => nav.push({ name: 'addPet' })} className="flex w-full items-center justify-center gap-2 rounded-[26px] border-2 border-dashed border-line py-6 text-sm font-semibold text-ink-3">
          <Plus size={18} /> {t('Add another pet', 'Weiteres Tier hinzufügen')}
        </button>
      </div>
    </div>
  )
}

/* ================================================================== profile */
export function PetProfile({ id, initialTab }: { id: string; initialTab?: 'health' | 'docs' | 'weight' | 'info' }) {
  const { t, tl, fmtDate, lang } = useI18n()
  const s = useDemo()
  const nav = useNav()
  const pet = s.pets.find((p) => p.id === id)
  const [tab, setTab] = useState<'health' | 'docs' | 'weight' | 'info'>(initialTab ?? 'health')
  const dark = useDemo((st) => st.theme === 'dark')
  if (!pet) return null
  const ts = s.treatments.filter((x) => x.petId === id)
  const age = ageFrom(pet.birthDate)
  const score = healthScore(ts)

  return (
    <div className="min-h-full pb-16">
      <div className="relative overflow-hidden pb-6" style={{ background: dark ? `linear-gradient(170deg, hsl(${pet.hue} 30% 22%), rgb(var(--c-canvas)) 95%)` : `linear-gradient(170deg, hsl(${pet.hue} 60% 90%), rgb(var(--c-canvas)) 95%)` }}>
        <ScreenHeader transparent right={<button onClick={() => nav.push({ name: 'passport', petId: id })} className="grid h-9 w-9 place-items-center rounded-full bg-surface/70 backdrop-blur"><QrCode size={18} /></button>} />
        <div className="flex flex-col items-center px-5">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
            <PetAvatar species={pet.species} hue={pet.hue} size={104} className="shadow-lift ring-4 ring-surface" />
          </motion.div>
          <h1 className="mt-3 font-display text-[30px] font-semibold leading-none text-ink">{pet.name}</h1>
          <div className="mt-1.5 text-[13px] text-ink-2">{pet.breed}</div>
          <div className="mt-4 grid w-full grid-cols-4 gap-2">
            {[
              [t('Age', 'Alter'), age.years > 0 ? t(`${age.years} y ${age.months} m`, `${age.years} J. ${age.months} M.`) : t(`${age.months} mo`, `${age.months} Mon.`)],
              [t('Weight', 'Gewicht'), `${pet.weightKg.toLocaleString(lang === 'de' ? 'de-DE' : 'en-GB')} kg`],
              [t('Sex', 'Geschl.'), pet.sex === 'm' ? t('Male', 'Rüde/♂') : t('Female', 'Hündin/♀')],
              [t('Score', 'Score'), `${score}`],
            ].map(([l, v]) => (
              <div key={l} className="rounded-2xl bg-surface/80 px-2 py-2.5 text-center shadow-soft backdrop-blur">
                <div className="text-[10.5px] text-ink-3">{l}</div>
                <div className="mt-0.5 truncate text-[13px] font-semibold">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-10 bg-canvas/90 px-5 py-2 backdrop-blur-xl">
        <Segmented
          className="w-full" size="sm" value={tab} onChange={setTab}
          options={[{ value: 'health', label: t('Health', 'Gesundheit') }, { value: 'docs', label: t('Docs', 'Dokumente') }, { value: 'weight', label: t('Weight', 'Gewicht') }, { value: 'info', label: 'Info' }]}
        />
      </div>

      <div className="px-5 pt-2">
        {tab === 'health' && <HealthTab petId={id} ts={ts} />}
        {tab === 'docs' && <DocsTab petId={id} />}
        {tab === 'weight' && <WeightTab petId={id} />}
        {tab === 'info' && (
          <div className="space-y-2.5 pt-2">
            {[
              [t('Species', 'Tierart'), tl(SPECIES_LABEL[pet.species])],
              [t('Breed', 'Rasse'), pet.breed],
              [t('Birth date', 'Geburtsdatum'), fmtDate(pet.birthDate, { day: 'numeric', month: 'long', year: 'numeric' })],
              [t('Neutered', 'Kastriert'), pet.neutered ? t('Yes', 'Ja') : t('No', 'Nein')],
              [t('Allergies', 'Allergien'), pet.allergies ?? '—'],
              [t('Primary vet', 'Haustierarzt'), s.clinics.find((c) => c.id === pet.clinicId)?.name ?? '—'],
              [t('Insurance', 'Versicherung'), pet.insurerId ? 'Pfotenschutz · OP-Schutz Plus' : '—'],
            ].map(([l, v]) => (
              <div key={l} className="flex items-center justify-between rounded-2xl bg-surface px-4 py-3 shadow-soft ring-1 ring-line/60">
                <span className="text-[13px] text-ink-3">{l}</span><span className="max-w-[60%] truncate text-right text-[14px] font-medium">{v}</span>
              </div>
            ))}
            <div className="flex items-center justify-between rounded-2xl bg-surface px-4 py-3 shadow-soft ring-1 ring-line/60">
              <span className="text-[13px] text-ink-3">{t('Microchip', 'Chipnummer')}</span>
              <button onClick={() => { navigator.clipboard?.writeText(pet.chip); s.toast({ title: t('Chip number copied', 'Chipnummer kopiert') }) }} className="flex items-center gap-2 font-mono text-[13px] font-medium">{pet.chip}<Copy size={13} className="text-ink-3" /></button>
            </div>
            <Button block size="lg" variant="secondary" icon={<Share2 size={18} />} onClick={() => nav.push({ name: 'passport', petId: id })} className="!mt-5">{t('Share record with a vet', 'Akte mit Praxis teilen')}</Button>
          </div>
        )}
      </div>
    </div>
  )
}

function HealthTab({ petId, ts }: { petId: string; ts: Treatment[] }) {
  const { t, tl, relDays } = useI18n()
  const s = useDemo()
  const [sel, setSel] = useState<Treatment | null>(null)
  const [add, setAdd] = useState(false)
  const [filter, setFilter] = useState<TreatmentType | 'all'>('all')
  const types: TreatmentType[] = ['vaccination', 'worming', 'fleatick', 'medication', 'checkup']
  const shown = types.filter((ty) => filter === 'all' || filter === ty)
  return (
    <div className="pt-2">
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
        <Chip active={filter === 'all'} onClick={() => setFilter('all')}>{t('All', 'Alle')}</Chip>
        {types.map((ty) => <Chip key={ty} active={filter === ty} onClick={() => setFilter(ty)}>{t(TYPE_META[ty].en, TYPE_META[ty].de)}</Chip>)}
      </div>
      {shown.map((ty) => {
        const items = ts.filter((x) => x.type === ty).sort((a, b) => a.dueDate.localeCompare(b.dueDate))
        if (!items.length && filter === 'all') return null
        const m = TYPE_META[ty]
        return (
          <div key={ty} className="mt-4">
            <div className="mb-2 flex items-center gap-2 px-1 text-[13px] font-semibold text-ink-2"><m.icon size={15} className={`text-${m.tone}`} />{t(m.en, m.de)}</div>
            <div className="overflow-hidden rounded-2xl bg-surface shadow-soft ring-1 ring-line/60">
              {items.length === 0 && <div className="px-4 py-5 text-center text-[13px] text-ink-3">{t('No entries yet', 'Noch keine Einträge')}</div>}
              {items.map((x) => {
                const tone = dueTone(x.dueDate)
                return (
                  <div key={x.id} className="flex items-center gap-3 px-4 py-3 [&+&]:border-t [&+&]:border-line/60">
                    <button onClick={() => setSel(x)} className="min-w-0 flex-1 text-left">
                      <div className="truncate text-[14px] font-semibold">{x.name}</div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-[12px]">
                        <span className={`font-semibold text-${tone}`}>{relDays(x.dueDate)}</span>
                        <span className="text-ink-3">· {tl(REPEAT_LABEL[x.repeat])}</span>
                        {x.fromClinic && <span className="rounded bg-brand-soft px-1 text-[10px] font-semibold text-brand">{t('Vet', 'Praxis')}</span>}
                      </div>
                    </button>
                    <Switch size="sm" checked={x.reminder} onChange={() => { s.toggleReminder(x.id); s.toast({ title: x.reminder ? t('Reminder off', 'Erinnerung aus') : t('Reminder on 🔔', 'Erinnerung an 🔔'), body: x.name }) }} />
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
      <Button block size="lg" variant="secondary" icon={<Plus size={18} />} onClick={() => setAdd(true)} className="mt-5">{t('Add entry', 'Eintrag hinzufügen')}</Button>
      <DueSheet item={sel} onClose={() => setSel(null)} />
      <AddTreatmentSheet open={add} onClose={() => setAdd(false)} petId={petId} defaultType={filter === 'all' ? undefined : filter} />
    </div>
  )
}

const DOC_CATS: { id: DocCategory; en: string; de: string }[] = [
  { id: 'vaccination', en: 'Vaccination record', de: 'Impfpass' },
  { id: 'report', en: 'Report', de: 'Befund' },
  { id: 'lab', en: 'Lab', de: 'Labor' },
  { id: 'invoice', en: 'Invoice', de: 'Rechnung' },
  { id: 'other', en: 'Other', de: 'Sonstiges' },
]

function DocsTab({ petId }: { petId: string }) {
  const { t, fmtDate } = useI18n()
  const allDocs = useDemo((s) => s.documents)
  const docs = allDocs.filter((d) => d.petId === petId)
  const [cat, setCat] = useState<DocCategory | 'all'>('all')
  const [up, setUp] = useState(false)
  const [preview, setPreview] = useState<PetDocument | null>(null)
  const shown = docs.filter((d) => cat === 'all' || d.category === cat)
  return (
    <div className="pt-2">
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
        <Chip active={cat === 'all'} onClick={() => setCat('all')}>{t('All', 'Alle')} · {docs.length}</Chip>
        {DOC_CATS.map((c) => <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>{t(c.en, c.de)}</Chip>)}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button onClick={() => setUp(true)} className="flex aspect-[4/5] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line text-ink-3 active:scale-[0.98]">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-soft text-brand"><Upload size={20} /></span>
          <span className="text-[13px] font-semibold">{t('Upload', 'Hochladen')}</span>
          <span className="text-[11px]">{t('Photo or PDF', 'Foto oder PDF')}</span>
        </button>
        {shown.map((d, i) => (
          <motion.button key={d.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }} onClick={() => setPreview(d)} className="overflow-hidden rounded-2xl bg-surface text-left shadow-soft ring-1 ring-line/60 active:scale-[0.98]">
            <div className="aspect-[4/3]"><DocThumb kind={d.kind} category={d.category} dataUrl={d.dataUrl} /></div>
            <div className="p-2.5">
              <div className="truncate text-[12.5px] font-semibold">{d.title}</div>
              <div className="mt-0.5 flex items-center gap-1 text-[11px] text-ink-3">{d.kind === 'pdf' ? <FileText size={11} /> : <ImageIcon size={11} />}{fmtDate(d.date)}</div>
            </div>
          </motion.button>
        ))}
      </div>
      <UploadSheet open={up} onClose={() => setUp(false)} petId={petId} />
      <DocPreview doc={preview} onClose={() => setPreview(null)} />
    </div>
  )
}

function DocPreview({ doc, onClose }: { doc: PetDocument | null; onClose: () => void }) {
  const { t, fmtDate } = useI18n()
  const del = useDemo((s) => s.deleteDocument)
  const cat = DOC_CATS.find((c) => c.id === doc?.category)
  return (
    <Sheet open={!!doc} onClose={onClose}>
      {doc && (
        <>
          <div className="mt-1 aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-line"><DocThumb kind={doc.kind} category={doc.category} dataUrl={doc.dataUrl} /></div>
          <div className="mt-4 font-display text-xl font-semibold">{doc.title}</div>
          <div className="mt-1 flex items-center gap-2 text-[13px] text-ink-3">
            {cat && <Badge tone="brand">{t(cat.en, cat.de)}</Badge>}
            {fmtDate(doc.date)} · {doc.kind.toUpperCase()} · {doc.sizeKb > 1000 ? `${(doc.sizeKb / 1000).toFixed(1)} MB` : `${doc.sizeKb} KB`}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <Button variant="secondary" icon={<Share2 size={16} />}>{t('Share', 'Teilen')}</Button>
            <Button variant="outline" icon={<Trash2 size={16} />} onClick={() => { del(doc.id); onClose() }} className="!text-berry">{t('Delete', 'Löschen')}</Button>
          </div>
        </>
      )}
    </Sheet>
  )
}

export function UploadSheet({ open, onClose, petId }: { open: boolean; onClose: () => void; petId: string }) {
  const { t } = useI18n()
  const s = useDemo()
  const input = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<{ name: string; kind: 'pdf' | 'image'; dataUrl?: string; size: number } | null>(null)
  const [title, setTitle] = useState('')
  const [cat, setCat] = useState<DocCategory>('vaccination')
  const [progress, setProgress] = useState(0)

  const pick = (accept: string) => {
    if (!input.current) return
    input.current.accept = accept
    input.current.click()
  }
  const onFile = (f?: File) => {
    if (!f) return
    const kind = f.type === 'application/pdf' ? 'pdf' : 'image'
    setTitle(f.name.replace(/\.[^.]+$/, ''))
    if (kind === 'image' && f.size < 1_500_000) {
      const r = new FileReader()
      r.onload = () => setFile({ name: f.name, kind, dataUrl: r.result as string, size: Math.round(f.size / 1000) })
      r.readAsDataURL(f)
    } else setFile({ name: f.name, kind, size: Math.round(f.size / 1000) })
  }
  const demoFile = () => { setFile({ name: 'Impfpass_Seite3.jpg', kind: 'image', size: 640 }); setTitle(t('Vaccination record p.3', 'Impfpass Seite 3')) }
  const save = () => {
    if (!file) return
    let p = 0
    const iv = setInterval(() => {
      p += 20
      setProgress(p)
      if (p >= 100) {
        clearInterval(iv)
        s.addDocument({ petId, title: title || file.name, category: cat, kind: file.kind, date: isoDay(0), sizeKb: file.size, dataUrl: file.dataUrl })
        s.toast({ title: t('Document saved', 'Dokument gespeichert'), body: t('Encrypted & stored in the EU.', 'Verschlüsselt & in der EU gespeichert.') })
        setFile(null); setTitle(''); setProgress(0); onClose()
      }
    }, 140)
  }

  return (
    <Sheet open={open} onClose={() => { setFile(null); setProgress(0); onClose() }} title={t('Add document', 'Dokument hinzufügen')}>
      <input ref={input} type="file" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      {!file ? (
        <div className="grid grid-cols-3 gap-2.5 pt-2">
          {[
            { icon: Camera, l: t('Camera', 'Kamera'), go: () => pick('image/*') },
            { icon: ImageIcon, l: t('Photos', 'Fotos'), go: () => pick('image/*') },
            { icon: FileText, l: 'PDF', go: () => pick('application/pdf') },
          ].map((o) => (
            <button key={o.l} onClick={o.go} className="flex flex-col items-center gap-2 rounded-2xl bg-muted/70 py-5 active:scale-95">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-surface text-brand shadow-soft"><o.icon size={20} /></span>
              <span className="text-[12.5px] font-semibold">{o.l}</span>
            </button>
          ))}
          <button onClick={demoFile} className="col-span-3 mt-1 text-[12.5px] font-semibold text-brand">{t('No file at hand? Use a sample document', 'Keine Datei zur Hand? Beispieldokument nutzen')}</button>
        </div>
      ) : (
        <div className="pt-2">
          <div className="flex items-center gap-3 rounded-2xl bg-muted/70 p-3">
            <div className="h-14 w-14 overflow-hidden rounded-xl"><DocThumb kind={file.kind} category={cat} dataUrl={file.dataUrl} /></div>
            <div className="min-w-0 flex-1"><div className="truncate text-[13.5px] font-semibold">{file.name}</div><div className="text-[12px] text-ink-3">{file.size} KB</div></div>
            <Check size={18} className="text-sage" />
          </div>
          <label className="label mt-4">{t('Title', 'Titel')}</label>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
          <label className="label mt-4">{t('Category', 'Kategorie')}</label>
          <div className="flex flex-wrap gap-2">
            {DOC_CATS.map((c) => <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>{t(c.en, c.de)}</Chip>)}
          </div>
          <Button block size="lg" className="relative mt-6 overflow-hidden" onClick={save} disabled={progress > 0}>
            {progress > 0 && <span className="absolute inset-y-0 left-0 bg-white/20 transition-all" style={{ width: `${progress}%` }} />}
            <span className="relative">{progress > 0 ? t('Encrypting & uploading…', 'Verschlüsseln & hochladen…') : t('Save document', 'Dokument speichern')}</span>
          </Button>
        </div>
      )}
    </Sheet>
  )
}

function WeightTab({ petId }: { petId: string }) {
  const { t, fmtShort, lang } = useI18n()
  const s = useDemo()
  const pet = s.pets.find((p) => p.id === petId)!
  const [kg, setKg] = useState(String(pet.weightKg))
  const data = pet.weightHistory.map((w) => ({ d: fmtShort(w.date), kg: w.kg }))
  const first = pet.weightHistory[0]?.kg ?? pet.weightKg
  const diff = +(pet.weightKg - first).toFixed(1)
  return (
    <div className="pt-3">
      <div className="rounded-3xl bg-surface p-4 shadow-soft ring-1 ring-line/60">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[12px] text-ink-3">{t('Current weight', 'Aktuelles Gewicht')}</div>
            <div className="font-display text-3xl font-semibold">{pet.weightKg.toLocaleString(lang === 'de' ? 'de-DE' : 'en-GB')} <span className="text-lg text-ink-3">kg</span></div>
          </div>
          <Badge tone={Math.abs(diff) < 1 ? 'sage' : 'sun'}>{diff >= 0 ? '+' : ''}{diff} kg · 8 {t('mo', 'Mon.')}</Badge>
        </div>
        <div className="-mx-2 mt-3 h-44">
          <ResponsiveContainer>
            <AreaChart data={data} margin={{ top: 6, right: 8, left: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="wg" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="rgb(var(--c-brand))" stopOpacity={0.3} /><stop offset="100%" stopColor="rgb(var(--c-brand))" stopOpacity={0} /></linearGradient>
              </defs>
              <XAxis dataKey="d" tick={{ fontSize: 10, fill: 'rgb(var(--c-ink-3))' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis hide domain={['dataMin - 0.5', 'dataMax + 0.5']} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,.12)', fontSize: 12 }} formatter={(v) => [`${v} kg`, t('Weight', 'Gewicht')]} />
              <Area type="monotone" dataKey="kg" stroke="rgb(var(--c-brand))" strokeWidth={2.5} fill="url(#wg)" dot={{ r: 3, fill: 'rgb(var(--c-brand))' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-3 flex gap-2.5">
        <div className="relative flex-1">
          <Scale size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3" />
          <input className="input h-12 pl-10" inputMode="decimal" value={kg} onChange={(e) => setKg(e.target.value)} />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-ink-3">kg</span>
        </div>
        <Button size="lg" onClick={() => { const v = parseFloat(kg.replace(',', '.')); if (v > 0) { s.logWeight(petId, v); s.toast({ title: t('Weight logged', 'Gewicht eingetragen') }) } }}>{t('Log', 'Eintragen')}</Button>
      </div>
      <p className="mt-3 px-1 text-[12px] leading-relaxed text-ink-3">{t('Tip: weigh monthly. Gradual changes are easy to miss and the chart makes them obvious for your vet.', 'Tipp: monatlich wiegen. Schleichende Veränderungen fallen sonst kaum auf, und Ihre Praxis sieht den Verlauf.')}</p>
    </div>
  )
}

/* =============================================================== add entry */
export function AddTreatmentSheet({ open, onClose, petId, defaultType }: { open: boolean; onClose: () => void; petId: string; defaultType?: TreatmentType }) {
  const { t, tl } = useI18n()
  const s = useDemo()
  const [type, setType] = useState<TreatmentType>(defaultType ?? 'vaccination')
  const [name, setName] = useState('')
  const [due, setDue] = useState(isoDay(14))
  const [repeat, setRepeat] = useState<Repeat>('yearly')
  const [reminder, setReminder] = useState(true)
  const [before, setBefore] = useState(7)
  const suggestions: Record<TreatmentType, string[]> = {
    vaccination: ['SHPPi + L4', 'Tollwut', 'RCP', 'FeLV', 'RHD-2'],
    worming: ['Milbemax', 'Drontal', 'Profender'],
    fleatick: ['Bravecto', 'NexGard', 'Seresto'],
    medication: ['Apoquel', 'Metacam', 'Vetmedin'],
    checkup: [t('Annual check', 'Jahrescheck'), t('Dental check', 'Zahnkontrolle')],
  }
  const save = () => {
    s.addTreatment({ petId, type, name: name || suggestions[type][0], dueDate: due, repeat, reminder, remindDaysBefore: before })
    s.toast({ title: t('Entry added', 'Eintrag gespeichert'), body: reminder ? t(`We’ll remind you ${before ? `${before} days before` : 'on the day'}.`, `Wir erinnern ${before ? `${before} Tage vorher` : 'am Tag'}.`) : undefined })
    setName('')
    onClose()
  }
  return (
    <Sheet open={open} onClose={onClose} title={t('New entry', 'Neuer Eintrag')}>
      <div className="grid grid-cols-5 gap-1.5 pt-1">
        {(Object.keys(TYPE_META) as TreatmentType[]).map((ty) => {
          const m = TYPE_META[ty]
          return (
            <button key={ty} onClick={() => setType(ty)} className={cn('flex flex-col items-center gap-1.5 rounded-2xl py-2.5 transition', type === ty ? `bg-${m.tone}-soft ring-2 ring-${m.tone}` : 'bg-muted/60')}>
              <m.icon size={19} className={`text-${m.tone}`} />
              <span className="text-[10px] font-semibold leading-tight">{t(m.en, m.de).split(' ')[0]}</span>
            </button>
          )
        })}
      </div>
      <label className="label mt-4">{t('Name / product', 'Name / Präparat')}</label>
      <input className="input" placeholder={suggestions[type][0]} value={name} onChange={(e) => setName(e.target.value)} />
      <div className="no-scrollbar mt-2 flex gap-1.5 overflow-x-auto">
        {suggestions[type].map((x) => <button key={x} onClick={() => setName(x)} className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-[11.5px] font-medium text-ink-2">{x}</button>)}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <div><label className="label">{t('Due date', 'Fällig am')}</label><input type="date" className="input" value={due} onChange={(e) => setDue(e.target.value)} /></div>
        <div>
          <label className="label">{t('Repeat', 'Wiederholen')}</label>
          <select className="input" value={repeat} onChange={(e) => setRepeat(e.target.value as Repeat)}>
            {(Object.keys(REPEAT_LABEL) as Repeat[]).map((r) => <option key={r} value={r}>{tl(REPEAT_LABEL[r])}</option>)}
          </select>
        </div>
      </div>
      <div className="mt-4 rounded-2xl bg-muted/60 p-3.5">
        <div className="flex items-center justify-between">
          <div><div className="text-[14px] font-semibold">{t('Push reminder', 'Push-Erinnerung')}</div><div className="text-[12px] text-ink-3">{t('Before it’s due', 'Vor der Fälligkeit')}</div></div>
          <Switch checked={reminder} onChange={setReminder} />
        </div>
        {reminder && (
          <div className="mt-3 flex gap-1.5">
            {[0, 1, 3, 7, 14].map((d) => (
              <button key={d} onClick={() => setBefore(d)} className={cn('flex-1 rounded-xl py-1.5 text-[12px] font-semibold', before === d ? 'bg-brand text-brand-fg' : 'bg-surface text-ink-2')}>
                {d === 0 ? t('Day', 'Tag') : `${d}d`}
              </button>
            ))}
          </div>
        )}
      </div>
      <Button block size="lg" className="mt-5" onClick={save}>{t('Save', 'Speichern')}</Button>
    </Sheet>
  )
}

/* ================================================================== add pet */
export function AddPet() {
  const { t, tl } = useI18n()
  const s = useDemo()
  const nav = useNav()
  const [f, setF] = useState({ species: 'dog' as Species, name: '', breed: '', sex: 'f' as 'm' | 'f', birthDate: '2024-05-01', weightKg: '', chip: '', neutered: false })
  const save = () => {
    const id = s.addPet({ species: f.species, name: f.name || 'Neo', breed: f.breed || '—', sex: f.sex, birthDate: f.birthDate, weightKg: parseFloat(f.weightKg.replace(',', '.')) || 1, chip: f.chip || '—', neutered: f.neutered })
    s.toast({ title: t(`Welcome, ${f.name || 'Neo'}! 🎉`, `Willkommen, ${f.name || 'Neo'}! 🎉`), body: t('Add vaccinations to get reminders.', 'Impfungen eintragen, um erinnert zu werden.') })
    nav.pop()
    nav.push({ name: 'pet', id })
  }
  const species: Species[] = ['dog', 'cat', 'rabbit', 'guinea', 'bird', 'horse']
  return (
    <div className="min-h-full pb-16">
      <ScreenHeader title={t('New pet', 'Neues Tier')} />
      <div className="px-5">
        <div className="flex justify-center py-3">
          <motion.div key={f.species} initial={{ scale: 0.8, rotate: -8 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring' }}>
            <PetAvatar species={f.species} hue={f.species === 'cat' ? 220 : f.species === 'rabbit' ? 95 : 32} size={96} className="shadow-lift" />
          </motion.div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {species.map((sp) => (
            <button key={sp} onClick={() => setF({ ...f, species: sp })} className={cn('flex items-center justify-center gap-1.5 rounded-2xl py-2.5 text-[13px] font-semibold transition', f.species === sp ? 'bg-brand text-brand-fg' : 'bg-surface ring-1 ring-line')}>
              <span>{SPECIES_LABEL[sp].emoji}</span>{tl(SPECIES_LABEL[sp])}
            </button>
          ))}
        </div>
        <div className="mt-5 space-y-3.5">
          <div><label className="label">{t('Name', 'Name')} *</label><input className="input h-12 text-[15px]" placeholder="z. B. Luna" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
          <div><label className="label">{t('Breed', 'Rasse')}</label><input className="input" placeholder={f.species === 'dog' ? 'Golden Retriever' : f.species === 'cat' ? 'Britisch Kurzhaar' : ''} value={f.breed} onChange={(e) => setF({ ...f, breed: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-2.5">
            <div><label className="label">{t('Birth date', 'Geburtsdatum')}</label><input type="date" className="input" value={f.birthDate} onChange={(e) => setF({ ...f, birthDate: e.target.value })} /></div>
            <div><label className="label">{t('Weight (kg)', 'Gewicht (kg)')}</label><input className="input" inputMode="decimal" placeholder="4,5" value={f.weightKg} onChange={(e) => setF({ ...f, weightKg: e.target.value })} /></div>
          </div>
          <div>
            <label className="label">{t('Sex', 'Geschlecht')}</label>
            <Segmented className="w-full" value={f.sex} onChange={(v) => setF({ ...f, sex: v })} options={[{ value: 'f', label: t('Female ♀', 'Weiblich ♀') }, { value: 'm', label: t('Male ♂', 'Männlich ♂') }]} />
          </div>
          <div><label className="label">{t('Microchip number', 'Chipnummer')}</label><input className="input font-mono" placeholder="276 0981 …" value={f.chip} onChange={(e) => setF({ ...f, chip: e.target.value })} /></div>
          <div className="flex items-center justify-between rounded-2xl bg-surface px-4 py-3 ring-1 ring-line"><span className="text-[14px] font-medium">{t('Neutered / spayed', 'Kastriert')}</span><Switch checked={f.neutered} onChange={(v) => setF({ ...f, neutered: v })} /></div>
        </div>
        <Button block size="lg" className="mt-6" onClick={save} disabled={!f.name}>{t('Save pet', 'Tier speichern')}</Button>
      </div>
    </div>
  )
}
