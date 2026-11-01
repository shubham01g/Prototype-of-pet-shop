import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  AuditEntry, Booking, Clinic, Consent, ConsentScope, GdprRequest, Insurer, Notification, Owner, Pet, PetDocument, Repeat, Thread, Treatment, Message,
} from '@/data/types'
import {
  ME, seedAudit, seedBookings, seedClinics, seedConsents, seedDocuments, seedGdpr, seedInsurers, seedNotifications, seedOwners, seedPets, seedThreads, seedTreatments,
} from '@/data/seed'
import { addDays, isoDay, uid } from '@/lib/utils'
import type { L, Lang } from '@/i18n'

export const STORE_KEY = 'vetly-demo-v3'

export interface Toast { id: string; title: string; body?: string; tone?: 'brand' | 'coral' | 'berry' | 'sun' }

interface Data {
  pets: Pet[]
  treatments: Treatment[]
  documents: PetDocument[]
  clinics: Clinic[]
  bookings: Booking[]
  threads: Thread[]
  notifications: Notification[]
  consents: Consent[]
  owners: Owner[]
  insurers: Insurer[]
  audit: AuditEntry[]
  gdpr: GdprRequest[]
}

interface State extends Data {
  lang: Lang
  theme: 'light' | 'dark'
  onboarded: boolean
  signedIn: boolean
  activePetId: string
  reminderPrefs: { push: boolean; email: boolean; quietHours: boolean; weekly: boolean; clinicMessages: boolean; tips: boolean }
  streakWeeks: number
  toasts: Toast[]
  deletionRequested: boolean

  setLang: (l: Lang) => void
  toggleTheme: () => void
  setOnboarded: (v: boolean) => void
  setSignedIn: (v: boolean) => void
  setActivePet: (id: string) => void
  setReminderPref: (k: keyof State['reminderPrefs'], v: boolean) => void
  toast: (t: Omit<Toast, 'id'>) => void
  dismissToast: (id: string) => void

  addPet: (p: Omit<Pet, 'id' | 'ownerId' | 'weightHistory' | 'hue'>) => string
  updatePet: (id: string, patch: Partial<Pet>) => void
  logWeight: (petId: string, kg: number) => void

  addTreatment: (t: Omit<Treatment, 'id' | 'history' | 'reminder' | 'remindDaysBefore'> & Partial<Pick<Treatment, 'reminder' | 'remindDaysBefore'>>) => void
  toggleReminder: (id: string) => void
  markDone: (id: string) => void
  deleteTreatment: (id: string) => void

  addDocument: (d: Omit<PetDocument, 'id'>) => void
  deleteDocument: (id: string) => void

  createBooking: (b: Omit<Booking, 'id' | 'status' | 'createdAt' | 'ownerId'>) => string
  clinicRespond: (id: string, action: 'accept' | 'decline' | 'propose' | 'complete' | 'noshow', proposal?: { date: string; time: string }) => void
  ownerRespondProposal: (id: string, accept: boolean) => void
  cancelBooking: (id: string) => void

  sendMessage: (threadId: string, from: Message['from'], text: string, attachment?: Message['attachment'], author?: string) => void
  startThread: (clinicId: string, petId: string, subject: string, text: string) => string
  markThreadRead: (threadId: string, side: Message['from']) => void

  clinicSendReminder: (petId: string, title: string, body: string, dueDate?: string) => void
  markNotificationsRead: () => void

  setConsent: (petId: string, partyType: Consent['partyType'], partyId: string, active: boolean, scope?: ConsentScope[], expiresAt?: string) => void

  toggleService: (clinicId: string, serviceId: string) => void
  setHours: (clinicId: string, day: number, hours: { open: string; close: string } | null) => void

  setOwnerStatus: (id: string, status: Owner['status']) => void
  advanceInsurer: (id: string) => void
  requestExport: () => void
  requestDeletion: () => void
  processGdpr: (id: string) => void
  log: (e: Omit<AuditEntry, 'id' | 'at'>) => void

  resetDemo: () => void
}

const REPEAT_DAYS: Record<Repeat, number> = { none: 0, daily: 1, monthly: 30, '3m': 91, '6m': 182, yearly: 365, '3y': 1095 }

const seedData = (): Data => ({
  pets: seedPets(), treatments: seedTreatments(), documents: seedDocuments(), clinics: seedClinics(), bookings: seedBookings(),
  threads: seedThreads(), notifications: seedNotifications(), consents: seedConsents(), owners: seedOwners(), insurers: seedInsurers(),
  audit: seedAudit(), gdpr: seedGdpr(),
})

const notif = (kind: Notification['kind'], title: L, body: L): Notification => ({ id: uid('n'), ownerId: ME, kind, title, body, at: Date.now(), read: false })

export const useDemo = create<State>()(
  persist(
    (set, get) => {
      const log: State['log'] = (e) => set((s) => ({ audit: [{ ...e, id: uid('a'), at: Date.now() }, ...s.audit].slice(0, 200) }))
      const ownerName = (id: string) => get().owners.find((o) => o.id === id)?.name ?? 'Owner'
      const petName = (id: string) => get().pets.find((p) => p.id === id)?.name ?? 'Pet'
      const clinicName = (id: string) => get().clinics.find((c) => c.id === id)?.short ?? 'Clinic'

      return {
        ...seedData(),
        lang: 'en',
        theme: 'light',
        onboarded: false,
        signedIn: false,
        activePetId: 'p1',
        reminderPrefs: { push: true, email: false, quietHours: true, weekly: true, clinicMessages: true, tips: false },
        streakWeeks: 7,
        toasts: [],
        deletionRequested: false,

        setLang: (lang) => set({ lang }),
        toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
        setOnboarded: (onboarded) => set({ onboarded }),
        setSignedIn: (signedIn) => {
          set({ signedIn })
          if (signedIn) log({ actor: 'Lena Hoffmann', actorRole: 'owner', action: { en: 'Signed in', de: 'Angemeldet' }, target: 'Vetly app', severity: 'info' })
        },
        setActivePet: (activePetId) => set({ activePetId }),
        setReminderPref: (k, v) => set((s) => ({ reminderPrefs: { ...s.reminderPrefs, [k]: v } })),
        toast: (t) => {
          const id = uid('toast')
          set((s) => ({ toasts: [...s.toasts, { ...t, id }] }))
          setTimeout(() => get().dismissToast(id), 4200)
        },
        dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

        addPet: (p) => {
          const id = uid('p')
          const hue = Math.floor(Math.random() * 360)
          set((s) => ({ pets: [...s.pets, { ...p, id, ownerId: ME, hue, weightHistory: [{ date: isoDay(0), kg: p.weightKg }] }], activePetId: id }))
          log({ actor: 'Lena Hoffmann', actorRole: 'owner', action: { en: 'Added a new pet', de: 'Neues Haustier angelegt' }, target: p.name, severity: 'success' })
          return id
        },
        updatePet: (id, patch) => set((s) => ({ pets: s.pets.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
        logWeight: (petId, kg) =>
          set((s) => ({
            pets: s.pets.map((p) => (p.id === petId ? { ...p, weightKg: kg, weightHistory: [...p.weightHistory.filter((w) => w.date !== isoDay(0)), { date: isoDay(0), kg }] } : p)),
          })),

        addTreatment: (t) => {
          set((s) => ({ treatments: [...s.treatments, { reminder: true, remindDaysBefore: t.type === 'medication' ? 0 : 7, ...t, id: uid('t'), history: [] }] }))
        },
        toggleReminder: (id) => set((s) => ({ treatments: s.treatments.map((t) => (t.id === id ? { ...t, reminder: !t.reminder } : t)) })),
        markDone: (id) =>
          set((s) => ({
            treatments: s.treatments.map((t) => {
              if (t.id !== id) return t
              const today = isoDay(0)
              const next = t.repeat === 'none' ? t.dueDate : addDays(today, REPEAT_DAYS[t.repeat])
              return { ...t, lastDone: today, history: [today, ...t.history], dueDate: next }
            }),
          })),
        deleteTreatment: (id) => set((s) => ({ treatments: s.treatments.filter((t) => t.id !== id) })),

        addDocument: (d) => {
          set((s) => ({ documents: [{ ...d, id: uid('d') }, ...s.documents] }))
          log({ actor: 'Lena Hoffmann', actorRole: 'owner', action: { en: 'Uploaded a document', de: 'Dokument hochgeladen' }, target: `${d.title} · ${petName(d.petId)}`, severity: 'info' })
        },
        deleteDocument: (id) => set((s) => ({ documents: s.documents.filter((d) => d.id !== id) })),

        createBooking: (b) => {
          const id = uid('b')
          set((s) => ({ bookings: [{ ...b, id, ownerId: ME, status: 'pending', createdAt: Date.now() }, ...s.bookings] }))
          log({ actor: 'Lena Hoffmann', actorRole: 'owner', action: { en: 'Requested appointment', de: 'Termin angefragt' }, target: `${petName(b.petId)} · ${clinicName(b.clinicId)}`, severity: 'info' })
          return id
        },
        clinicRespond: (id, action, proposal) => {
          const b = get().bookings.find((x) => x.id === id)
          if (!b) return
          const c = get().clinics.find((x) => x.id === b.clinicId)
          const svc = c?.services.find((x) => x.id === b.serviceId)
          const pn = petName(b.petId)
          const status: Booking['status'] =
            action === 'accept' ? 'confirmed' : action === 'decline' ? 'declined' : action === 'propose' ? 'proposed' : action === 'complete' ? 'completed' : 'noshow'
          set((s) => ({
            bookings: s.bookings.map((x) =>
              x.id === id ? { ...x, status, proposedDate: proposal?.date, proposedTime: proposal?.time, vet: action === 'accept' ? x.vet ?? c?.vets[0] : x.vet } : x),
          }))
          if (b.ownerId === ME) {
            const n =
              action === 'accept'
                ? notif('booking', { en: 'Appointment confirmed ✓', de: 'Termin bestätigt ✓' }, { en: `${pn} · ${svc?.name.en} · ${c?.short} — ${b.time}`, de: `${pn} · ${svc?.name.de} · ${c?.short} — ${b.time} Uhr` })
                : action === 'propose'
                  ? notif('booking', { en: 'New time suggested', de: 'Neuer Termin vorgeschlagen' }, { en: `${c?.short} suggests ${proposal?.time} for ${pn}. Tap to respond.`, de: `${c?.short} schlägt ${proposal?.time} Uhr für ${pn} vor. Tippe zum Antworten.` })
                  : action === 'decline'
                    ? notif('booking', { en: 'Request declined', de: 'Anfrage abgelehnt' }, { en: `${c?.short} can’t take this slot. Try another time.`, de: `${c?.short} kann den Termin nicht annehmen. Bitte andere Zeit wählen.` })
                    : null
            if (n) set((s) => ({ notifications: [n, ...s.notifications] }))
          }
          log({
            actor: 'Praxis Lehmann', actorRole: 'clinic',
            action: { en: `Booking ${status}`, de: `Buchung ${status === 'confirmed' ? 'bestätigt' : status === 'proposed' ? 'umgeplant' : status === 'declined' ? 'abgelehnt' : status === 'completed' ? 'abgeschlossen' : 'nicht erschienen'}` },
            target: `${pn} · ${ownerName(b.ownerId)}`, severity: status === 'declined' || status === 'noshow' ? 'warning' : 'success',
          })
        },
        ownerRespondProposal: (id, accept) => {
          set((s) => ({
            bookings: s.bookings.map((x) =>
              x.id === id ? (accept ? { ...x, status: 'confirmed', date: x.proposedDate ?? x.date, time: x.proposedTime ?? x.time, proposedDate: undefined, proposedTime: undefined } : { ...x, status: 'cancelled' }) : x),
          }))
          log({ actor: 'Lena Hoffmann', actorRole: 'owner', action: accept ? { en: 'Accepted new time', de: 'Neuen Termin angenommen' } : { en: 'Rejected new time', de: 'Neuen Termin abgelehnt' }, target: id, severity: 'info' })
        },
        cancelBooking: (id) => {
          set((s) => ({ bookings: s.bookings.map((x) => (x.id === id ? { ...x, status: 'cancelled' } : x)) }))
          log({ actor: 'Lena Hoffmann', actorRole: 'owner', action: { en: 'Cancelled appointment', de: 'Termin storniert' }, target: id, severity: 'warning' })
        },

        sendMessage: (threadId, from, text, attachment, author) => {
          const m: Message = { id: uid('m'), from, text, at: Date.now(), attachment, read: false, author }
          set((s) => ({ threads: s.threads.map((t) => (t.id === threadId ? { ...t, messages: [...t.messages, m] } : t)) }))
          const th = get().threads.find((t) => t.id === threadId)
          if (from === 'clinic' && th?.ownerId === ME) {
            set((s) => ({ notifications: [notif('chat', { en: `${clinicName(th.clinicId)} sent a message`, de: `${clinicName(th.clinicId)} hat geschrieben` }, { en: text.slice(0, 80), de: text.slice(0, 80) }), ...s.notifications] }))
          }
        },
        startThread: (clinicId, petId, subject, text) => {
          const id = uid('th')
          set((s) => ({ threads: [{ id, clinicId, ownerId: ME, petId, subject, messages: [{ id: uid('m'), from: 'owner', text, at: Date.now(), read: false }] }, ...s.threads] }))
          return id
        },
        markThreadRead: (threadId, side) =>
          set((s) => ({ threads: s.threads.map((t) => (t.id === threadId ? { ...t, messages: t.messages.map((m) => (m.from !== side ? { ...m, read: true } : m)) } : t)) })),

        clinicSendReminder: (petId, title, body, dueDate) => {
          const p = get().pets.find((x) => x.id === petId)
          if (dueDate && p) {
            set((s) => ({ treatments: [...s.treatments, { id: uid('t'), petId, type: 'checkup', name: title, dueDate, repeat: 'none', reminder: true, remindDaysBefore: 3, history: [], fromClinic: 'c1' }] }))
          }
          if (p?.ownerId === ME) {
            set((s) => ({ notifications: [notif('clinic', { en: `Praxis Lehmann: ${title}`, de: `Praxis Lehmann: ${title}` }, { en: body, de: body }), ...s.notifications] }))
          }
          log({ actor: 'Praxis Lehmann', actorRole: 'clinic', action: { en: 'Sent reminder to owner', de: 'Erinnerung an Halter gesendet' }, target: `${p?.name} · ${ownerName(p?.ownerId ?? '')}`, severity: 'info' })
        },
        markNotificationsRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),

        setConsent: (petId, partyType, partyId, active, scope, expiresAt) => {
          const existing = get().consents.find((c) => c.petId === petId && c.partyType === partyType && c.partyId === partyId)
          if (existing) {
            set((s) => ({ consents: s.consents.map((c) => (c.id === existing.id ? { ...c, active, scope: scope ?? c.scope, expiresAt: expiresAt ?? c.expiresAt, grantedAt: active ? isoDay(0) : c.grantedAt } : c)) }))
          } else {
            set((s) => ({ consents: [...s.consents, { id: uid('cs'), petId, partyType, partyId, scope: scope ?? ['profile', 'vaccinations', 'treatments'], grantedAt: isoDay(0), expiresAt, active }] }))
          }
          const party = partyType === 'clinic' ? clinicName(partyId) : get().insurers.find((i) => i.id === partyId)?.name
          log({
            actor: ownerName(get().pets.find((p) => p.id === petId)?.ownerId ?? ME), actorRole: 'owner',
            action: active ? { en: 'Granted record access', de: 'Zugriff auf Akte erteilt' } : { en: 'Revoked record access', de: 'Zugriff auf Akte widerrufen' },
            target: `${petName(petId)} → ${party}`, severity: active ? 'success' : 'warning',
          })
        },

        toggleService: (clinicId, serviceId) =>
          set((s) => ({ clinics: s.clinics.map((c) => (c.id === clinicId ? { ...c, services: c.services.map((x) => (x.id === serviceId ? { ...x, enabled: !x.enabled } : x)) } : c)) })),
        setHours: (clinicId, day, hours) =>
          set((s) => ({ clinics: s.clinics.map((c) => (c.id === clinicId ? { ...c, hours: c.hours.map((h, i) => (i === day ? hours : h)) } : c)) })),

        setOwnerStatus: (id, status) => {
          set((s) => ({ owners: s.owners.map((o) => (o.id === id ? { ...o, status } : o)) }))
          log({ actor: 'admin@vetly.de', actorRole: 'admin', action: { en: `Set user status: ${status}`, de: `Nutzerstatus gesetzt: ${status}` }, target: ownerName(id), severity: status === 'active' ? 'success' : 'warning' })
        },
        advanceInsurer: (id) => {
          set((s) => ({ insurers: s.insurers.map((i) => (i.id === id ? { ...i, step: Math.min(5, i.step + 1), status: i.step + 1 >= 5 ? 'live' : 'onboarding' } : i)) }))
          log({ actor: 'admin@vetly.de', actorRole: 'admin', action: { en: 'Advanced insurer onboarding', de: 'Versicherer-Onboarding fortgesetzt' }, target: get().insurers.find((i) => i.id === id)?.name ?? '', severity: 'success' })
        },
        requestExport: () => {
          set((s) => ({ gdpr: [{ id: uid('g'), ownerId: ME, ownerName: 'Lena Hoffmann', type: 'export', status: 'received', at: Date.now() }, ...s.gdpr] }))
          log({ actor: 'Lena Hoffmann', actorRole: 'owner', action: { en: 'Requested data export (Art. 20 GDPR)', de: 'Datenexport angefordert (Art. 20 DSGVO)' }, target: 'JSON + PDF', severity: 'info' })
        },
        requestDeletion: () => {
          set((s) => ({
            deletionRequested: true,
            gdpr: [{ id: uid('g'), ownerId: ME, ownerName: 'Lena Hoffmann', type: 'delete', status: 'received', at: Date.now() }, ...s.gdpr],
            owners: s.owners.map((o) => (o.id === ME ? { ...o, status: 'pending_deletion' } : o)),
          }))
          log({ actor: 'Lena Hoffmann', actorRole: 'owner', action: { en: 'Requested account deletion (Art. 17 GDPR)', de: 'Kontolöschung beantragt (Art. 17 DSGVO)' }, target: 'All personal data', severity: 'danger' })
        },
        processGdpr: (id) =>
          set((s) => ({ gdpr: s.gdpr.map((g) => (g.id === id ? { ...g, status: g.status === 'received' ? 'processing' : 'completed' } : g)) })),
        log,

        resetDemo: () => set({ ...seedData(), onboarded: false, signedIn: false, activePetId: 'p1', deletionRequested: false, streakWeeks: 7, toasts: [] }),
      }
    },
    {
      name: STORE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => {
        const { toasts, ...rest } = s
        return rest
      },
    },
  ),
)

/** Keep every open tab / iframe in sync — the live side-by-side demo relies on this. */
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORE_KEY) useDemo.persist.rehydrate()
  })
}

/* ------------------------------------------------------------------ selectors */
export const REPEAT_LABEL: Record<Repeat, L> = {
  none: { en: 'One-time', de: 'Einmalig' },
  daily: { en: 'Daily', de: 'Täglich' },
  monthly: { en: 'Monthly', de: 'Monatlich' },
  '3m': { en: 'Every 3 months', de: 'Alle 3 Monate' },
  '6m': { en: 'Every 6 months', de: 'Alle 6 Monate' },
  yearly: { en: 'Yearly', de: 'Jährlich' },
  '3y': { en: 'Every 3 years', de: 'Alle 3 Jahre' },
}
