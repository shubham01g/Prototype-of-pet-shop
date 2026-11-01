import { motion } from 'framer-motion'
import { ArrowLeft, Copy, Download, FileText, Scale } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Logo } from '@/components/illustrations'
import { LangToggle, ThemeToggle } from '@/components/shell'
import { Button } from '@/components/ui'
import { useI18n, type Lang } from '@/i18n'
import { cn } from '@/lib/utils'
import { useDemo } from '@/store/useDemoStore'
import { LEGAL, type LegalDoc } from './content'

const ORDER: LegalDoc[] = ['impressum', 'privacy', 'terms', 'dpa', 'stores']

function toMarkdown(doc: LegalDoc, lang: Lang) {
  const d = LEGAL[doc]
  const lines = [`# ${d.title[lang]}`, '', `_${d.sub[lang]}. ${lang === 'de' ? 'Stand' : 'Updated'}: ${d.updated}_`, '', lang === 'de' ? '> ENTWURF, zur anwaltlichen Prüfung. Platzhalter in [eckigen Klammern] ergänzen.' : '> DRAFT for lawyer review. Fill in placeholders in [square brackets].', '']
  d.sections.forEach((s) => {
    lines.push(`## ${s.h[lang]}`, '')
    s.p.forEach((p) => lines.push(p[lang].split('\n').join('  \n'), ''))
    s.list?.forEach((li) => lines.push(`- ${li[lang]}`))
    if (s.list) lines.push('')
  })
  return lines.join('\n')
}

export default function Legal() {
  const { doc } = useParams()
  const { t, tl, lang, fmtDate } = useI18n()
  const toast = useDemo((s) => s.toast)
  if (!doc || !ORDER.includes(doc as LegalDoc)) return <Navigate to="/legal/impressum" replace />
  const key = doc as LegalDoc
  const d = LEGAL[key]

  const copy = async () => {
    await navigator.clipboard?.writeText(toMarkdown(key, lang))
    toast({ title: t('Markdown copied', 'Markdown kopiert') })
  }
  const download = () => {
    const all = ORDER.map((k) => toMarkdown(k, lang)).join('\n\n---\n\n')
    const url = URL.createObjectURL(new Blob([all], { type: 'text/markdown' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `vetly-legal-drafts-${lang}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-40 border-b border-line/50 bg-canvas/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
          <Link to="/" className="text-ink-3 hover:text-ink"><ArrowLeft size={18} /></Link>
          <Logo size={28} sub={t('Legal', 'Rechtliches')} />
          <div className="ml-auto flex items-center gap-2"><LangToggle /><ThemeToggle /></div>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[240px_1fr]">
        <aside>
          <div className="sticky top-24 space-y-1">
            {ORDER.map((k) => (
              <Link key={k} to={`/legal/${k}`} className={cn('flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition', k === key ? 'bg-surface font-semibold shadow-soft ring-1 ring-line' : 'text-ink-2 hover:bg-muted')}>
                <FileText size={16} className={k === key ? 'text-brand' : 'text-ink-3'} />{tl(LEGAL[k].title)}
              </Link>
            ))}
            <div className="mt-4 rounded-2xl border border-dashed border-line p-4 text-xs leading-relaxed text-ink-3">
              {t('All texts exist in German and English, structured for easy lawyer review, and are exportable in one click.', 'Alle Texte liegen auf Deutsch und Englisch vor, strukturiert für die anwaltliche Prüfung, mit einem Klick exportierbar.')}
              <Button size="sm" variant="secondary" className="mt-3 w-full" icon={<Download size={14} />} onClick={download}>{t('Download all (.md)', 'Alle herunterladen (.md)')}</Button>
            </div>
          </div>
        </aside>
        <motion.article key={key + lang} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-7 sm:p-10">
          <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-sun-soft px-4 py-3 text-sm text-ink">
            <Scale size={18} className="text-sun" />
            <span className="flex-1">{t('Draft for lawyer review. Placeholders in [brackets] are filled in during onboarding.', 'Entwurf zur anwaltlichen Prüfung. Platzhalter in [Klammern] werden beim Onboarding ergänzt.')}</span>
            <Button size="xs" variant="outline" icon={<Copy size={13} />} onClick={copy}>Markdown</Button>
          </div>
          <h1 className="mt-7 font-display text-4xl font-semibold tracking-tight">{tl(d.title)}</h1>
          <p className="mt-2 text-ink-3">{tl(d.sub)} · {t('Updated', 'Stand')} {fmtDate(d.updated)}</p>
          <div className="mt-8 space-y-7">
            {d.sections.map((s) => (
              <section key={s.h.en}>
                <h2 className="font-display text-xl font-semibold">{tl(s.h)}</h2>
                {s.p.map((p, i) => <p key={i} className="mt-2 whitespace-pre-line leading-relaxed text-ink-2">{tl(p)}</p>)}
                {s.list && <ul className="mt-3 space-y-2">{s.list.map((li, i) => <li key={i} className="flex gap-3 text-ink-2"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />{tl(li)}</li>)}</ul>}
              </section>
            ))}
          </div>
        </motion.article>
      </div>
    </div>
  )
}
