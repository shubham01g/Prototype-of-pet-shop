import type { L } from '@/i18n'

export type Species = 'dog' | 'cat' | 'rabbit' | 'bird' | 'guinea' | 'horse'

export interface Pet {
  id: string
  ownerId: string
  name: string
  species: Species
  breed: string
  sex: 'm' | 'f'
  neutered: boolean
  birthDate: string
  weightKg: number
  weightHistory: { date: string; kg: number }[]
  chip: string
  hue: number
  allergies?: string
  insurerId?: string
  clinicId?: string
}

export type TreatmentType = 'vaccination' | 'worming' | 'fleatick' | 'medication' | 'checkup'
export type Repeat = 'none' | 'daily' | 'monthly' | '3m' | '6m' | 'yearly' | '3y'

export interface Treatment {
  id: string
  petId: string
  type: TreatmentType
  name: string
  lastDone?: string
  dueDate: string
  repeat: Repeat
  reminder: boolean
  remindDaysBefore: number
  notes?: string
  history: string[]
  fromClinic?: string
}

export type DocCategory = 'vaccination' | 'report' | 'invoice' | 'lab' | 'other'

export interface PetDocument {
  id: string
  petId: string
  title: string
  category: DocCategory
  kind: 'pdf' | 'image'
  date: string
  sizeKb: number
  dataUrl?: string
}

export interface Service {
  id: string
  name: L
  durationMin: number
  priceFrom: number
  icon: string
  enabled: boolean
}

export interface Clinic {
  id: string
  name: string
  short: string
  street: string
  district: string
  city: string
  distanceKm: number
  rating: number
  reviews: number
  phone: string
  emergency: boolean
  species: Species[]
  /** index 0 = Monday … 6 = Sunday */
  hours: ({ open: string; close: string } | null)[]
  services: Service[]
  x: number
  y: number
  onVetly: boolean
  pms: string
  plan: 'Starter' | 'Pro' | 'Group'
  hue: number
  vets: string[]
  languages: string[]
}

export type BookingStatus = 'pending' | 'confirmed' | 'proposed' | 'declined' | 'completed' | 'noshow' | 'cancelled'

export interface Booking {
  id: string
  petId: string
  ownerId: string
  clinicId: string
  serviceId: string
  date: string
  time: string
  note?: string
  status: BookingStatus
  proposedDate?: string
  proposedTime?: string
  createdAt: number
  vet?: string
}

export interface Message {
  id: string
  from: 'owner' | 'clinic'
  text: string
  at: number
  attachment?: { name: string; kind: 'image' | 'pdf'; dataUrl?: string }
  read: boolean
  author?: string
}

export interface Thread {
  id: string
  clinicId: string
  ownerId: string
  petId: string
  subject: string
  messages: Message[]
}

export type NotifKind = 'reminder' | 'booking' | 'chat' | 'clinic' | 'system'

export interface Notification {
  id: string
  ownerId: string
  kind: NotifKind
  title: L
  body: L
  at: number
  read: boolean
}

export type ConsentScope = 'vaccinations' | 'treatments' | 'documents' | 'weight' | 'profile'

export interface Consent {
  id: string
  petId: string
  partyType: 'clinic' | 'insurer'
  partyId: string
  scope: ConsentScope[]
  grantedAt: string
  expiresAt?: string
  active: boolean
}

export interface Owner {
  id: string
  name: string
  email: string
  city: string
  joined: string
  status: 'active' | 'suspended' | 'pending_deletion'
  lastActive: number
  pets: number
  platform: 'iOS' | 'Android'
  lang: 'de' | 'en'
}

export interface Insurer {
  id: string
  name: string
  status: 'live' | 'onboarding' | 'invited'
  policies: number
  hue: number
  since: string
  step: number
}

export interface AuditEntry {
  id: string
  at: number
  actor: string
  actorRole: 'owner' | 'clinic' | 'admin' | 'insurer' | 'system'
  action: L
  target: string
  severity: 'info' | 'success' | 'warning' | 'danger'
}

export interface GdprRequest {
  id: string
  ownerId: string
  ownerName: string
  type: 'export' | 'delete'
  status: 'received' | 'processing' | 'completed'
  at: number
}
