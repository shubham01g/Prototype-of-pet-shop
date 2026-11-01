import { ago, isoDay, seeded } from '@/lib/utils'
import type {
  AuditEntry, Booking, Clinic, Consent, GdprRequest, Insurer, Notification, Owner, Pet, PetDocument, Service, Thread, Treatment,
} from './types'

export const ME = 'u1'
export const MY_CLINIC = 'c1'
export const MY_INSURER = 'i1'

/* ------------------------------------------------------------------ services */
const svc = (id: string, en: string, de: string, durationMin: number, priceFrom: number, icon: string): Service => ({
  id, name: { en, de }, durationMin, priceFrom, icon, enabled: true,
})

const baseServices = (): Service[] => [
  svc('s-vacc', 'Vaccination', 'Impfung', 20, 45, 'syringe'),
  svc('s-check', 'General check-up', 'Allgemeine Untersuchung', 30, 35, 'stethoscope'),
  svc('s-dental', 'Dental check', 'Zahnkontrolle', 30, 55, 'smile'),
  svc('s-lab', 'Blood test', 'Blutuntersuchung', 20, 60, 'test-tube'),
  svc('s-derm', 'Skin & allergy', 'Haut & Allergie', 40, 65, 'leaf'),
  svc('s-cast', 'Neutering consultation', 'Kastrationsberatung', 20, 30, 'scissors'),
  svc('s-senior', 'Senior pet check', 'Senioren-Check', 45, 80, 'heart-pulse'),
]

const wk = (open: string, close: string) => ({ open, close })

/* ------------------------------------------------------------------- clinics */
export const seedClinics = (): Clinic[] => [
  {
    id: 'c1', name: 'Tierarztpraxis Dr. Lehmann', short: 'Praxis Lehmann', street: 'Kastanienallee 41', district: 'Prenzlauer Berg',
    city: 'Berlin', distanceKm: 0.8, rating: 4.9, reviews: 312, phone: '+49 30 4402 1180', emergency: false,
    species: ['dog', 'cat', 'rabbit', 'guinea', 'bird'],
    hours: [wk('08:00', '18:00'), wk('08:00', '18:00'), wk('08:00', '13:00'), wk('08:00', '19:00'), wk('08:00', '16:00'), wk('10:00', '13:00'), null],
    services: baseServices(), x: 48, y: 38, onVetly: true, pms: 'easyVET', plan: 'Pro', hue: 168,
    vets: ['Dr. Katrin Lehmann', 'Dr. Tobias Engel', 'Dr. Aylin Demir'], languages: ['DE', 'EN', 'TR'],
  },
  {
    id: 'c2', name: 'Kleintierklinik an der Spree', short: 'Klinik Spree', street: 'Warschauer Str. 12', district: 'Friedrichshain',
    city: 'Berlin', distanceKm: 2.4, rating: 4.7, reviews: 1204, phone: '+49 30 2936 5500', emergency: true,
    species: ['dog', 'cat', 'rabbit', 'guinea', 'bird'],
    hours: Array(7).fill(wk('00:00', '24:00')),
    services: [...baseServices(), svc('s-emerg', 'Emergency', 'Notfall', 30, 90, 'siren'), svc('s-xray', 'X-ray & ultrasound', 'Röntgen & Ultraschall', 40, 95, 'scan')],
    x: 72, y: 62, onVetly: true, pms: 'Vetera', plan: 'Group', hue: 214,
    vets: ['Dr. Jan Fischer', 'Dr. Mia Wagner', 'Dr. Paul Becker', 'Dr. Lea Hartmann'], languages: ['DE', 'EN'],
  },
  {
    id: 'c3', name: 'Tierarzt am Mauerpark', short: 'Am Mauerpark', street: 'Bernauer Str. 63', district: 'Mitte',
    city: 'Berlin', distanceKm: 1.3, rating: 4.8, reviews: 189, phone: '+49 30 4435 8821', emergency: false,
    species: ['dog', 'cat'],
    hours: [wk('09:00', '18:00'), wk('09:00', '18:00'), wk('09:00', '18:00'), wk('09:00', '20:00'), wk('09:00', '15:00'), null, null],
    services: baseServices().slice(0, 5), x: 30, y: 30, onVetly: true, pms: 'Provet Cloud', plan: 'Starter', hue: 28,
    vets: ['Dr. Sarah Klein', 'Dr. Ben Richter'], languages: ['DE', 'EN', 'ES'],
  },
  {
    id: 'c4', name: 'Praxis Pfötchen Kreuzberg', short: 'Pfötchen', street: 'Oranienstr. 188', district: 'Kreuzberg',
    city: 'Berlin', distanceKm: 3.6, rating: 4.6, reviews: 241, phone: '+49 30 6981 4410', emergency: false,
    species: ['dog', 'cat', 'rabbit', 'guinea'],
    hours: [wk('08:30', '17:00'), wk('08:30', '17:00'), wk('08:30', '17:00'), wk('08:30', '17:00'), wk('08:30', '14:00'), wk('09:00', '12:00'), null],
    services: baseServices(), x: 58, y: 80, onVetly: true, pms: 'Animal Office', plan: 'Starter', hue: 340,
    vets: ['Dr. Nora Schulz', 'Dr. Emre Kaya'], languages: ['DE', 'EN', 'TR'],
  },
  {
    id: 'c5', name: 'Vogel- & Exotenpraxis Berlin', short: 'Exotenpraxis', street: 'Schönhauser Allee 98', district: 'Pankow',
    city: 'Berlin', distanceKm: 2.1, rating: 4.9, reviews: 96, phone: '+49 30 4471 2290', emergency: false,
    species: ['bird', 'rabbit', 'guinea'],
    hours: [wk('10:00', '18:00'), null, wk('10:00', '18:00'), wk('10:00', '18:00'), wk('10:00', '16:00'), null, null],
    services: [svc('s-check', 'General check-up', 'Allgemeine Untersuchung', 30, 40, 'stethoscope'), svc('s-vacc', 'Vaccination', 'Impfung', 20, 40, 'syringe'), svc('s-claw', 'Claw & beak care', 'Krallen- & Schnabelpflege', 15, 20, 'scissors')],
    x: 40, y: 12, onVetly: false, pms: 'Vetera', plan: 'Starter', hue: 270,
    vets: ['Dr. Ines Vogt'], languages: ['DE'],
  },
]

/* ----------------------------------------------------------------------- pets */
const wh = (base: number, deltas: number[]) => deltas.map((d, i) => ({ date: isoDay(-(deltas.length - 1 - i) * 30), kg: +(base + d).toFixed(1) }))

export const seedPets = (): Pet[] => [
  {
    id: 'p1', ownerId: ME, name: 'Bruno', species: 'dog', breed: 'Labrador Retriever', sex: 'm', neutered: true, birthDate: '2021-04-12',
    weightKg: 31.4, weightHistory: wh(30, [-0.6, -0.2, 0.1, 0.5, 0.9, 1.2, 1.0, 1.4]), chip: '276 0981 0654 3217', hue: 32,
    allergies: 'Chicken protein', insurerId: 'i1', clinicId: 'c1',
  },
  {
    id: 'p2', ownerId: ME, name: 'Mila', species: 'cat', breed: 'Europäisch Kurzhaar', sex: 'f', neutered: true, birthDate: '2019-09-03',
    weightKg: 4.2, weightHistory: wh(4.2, [0.3, 0.2, 0.2, 0.1, 0.0, -0.1, 0.0, 0.0]), chip: '276 0945 0012 8734', hue: 220, clinicId: 'c1',
  },
  {
    id: 'p3', ownerId: ME, name: 'Kiwi', species: 'rabbit', breed: 'Zwergkaninchen', sex: 'f', neutered: false, birthDate: '2023-02-20',
    weightKg: 1.6, weightHistory: wh(1.4, [-0.3, -0.2, -0.1, 0.0, 0.1, 0.1, 0.2, 0.2]), chip: '276 0981 0077 1029', hue: 95,
  },
  // other owners' pets (seen from the clinic side)
  { id: 'p4', ownerId: 'u2', name: 'Luna', species: 'dog', breed: 'Border Collie', sex: 'f', neutered: true, birthDate: '2020-06-01', weightKg: 18.2, weightHistory: wh(18, [0, 0.1, 0.2, 0.1, 0.2, 0.2, 0.2, 0.2]), chip: '276 0981 0612 4402', hue: 260, clinicId: 'c1' },
  { id: 'p5', ownerId: 'u3', name: 'Oskar', species: 'cat', breed: 'Maine Coon', sex: 'm', neutered: true, birthDate: '2018-11-15', weightKg: 7.9, weightHistory: wh(7.5, [0, 0.1, 0.2, 0.3, 0.3, 0.4, 0.4, 0.4]), chip: '276 0945 0055 1213', hue: 18, clinicId: 'c1' },
  { id: 'p6', ownerId: 'u4', name: 'Rocky', species: 'dog', breed: 'Französische Bulldogge', sex: 'm', neutered: false, birthDate: '2022-01-28', weightKg: 12.6, weightHistory: wh(12, [0, 0.2, 0.3, 0.4, 0.5, 0.6, 0.6, 0.6]), chip: '276 0981 0698 0071', hue: 45, clinicId: 'c1' },
  { id: 'p7', ownerId: 'u5', name: 'Pepper', species: 'bird', breed: 'Wellensittich', sex: 'm', neutered: false, birthDate: '2022-05-09', weightKg: 0.04, weightHistory: wh(0.04, [0, 0, 0, 0, 0, 0, 0, 0]), chip: '—', hue: 140, clinicId: 'c1' },
  { id: 'p8', ownerId: 'u6', name: 'Nala', species: 'cat', breed: 'Ragdoll', sex: 'f', neutered: true, birthDate: '2021-03-03', weightKg: 5.1, weightHistory: wh(5, [0, 0, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]), chip: '276 0945 0031 9981', hue: 300, clinicId: 'c1' },
  { id: 'p9', ownerId: 'u7', name: 'Frieda', species: 'guinea', breed: 'Rosettenmeerschweinchen', sex: 'f', neutered: false, birthDate: '2023-07-14', weightKg: 1.0, weightHistory: wh(1, [0, 0, 0, 0, 0, 0, 0, 0]), chip: '—', hue: 12, clinicId: 'c1' },
]

/* ----------------------------------------------------------------- treatments */
const tr = (id: string, petId: string, type: Treatment['type'], name: string, due: number, repeat: Treatment['repeat'], extra: Partial<Treatment> = {}): Treatment => ({
  id, petId, type, name, dueDate: isoDay(due), repeat, reminder: true, remindDaysBefore: type === 'medication' ? 0 : 7, history: [], ...extra,
})

export const seedTreatments = (): Treatment[] => [
  tr('t1', 'p1', 'vaccination', 'SHPPi + L4 (Kombi)', 9, 'yearly', { lastDone: isoDay(-356), history: [isoDay(-356), isoDay(-721)], fromClinic: 'c1' }),
  tr('t2', 'p1', 'vaccination', 'Tollwut (Rabies)', 412, '3y', { lastDone: isoDay(-683), history: [isoDay(-683)], fromClinic: 'c1' }),
  tr('t3', 'p1', 'worming', 'Milbemax', 4, '3m', { lastDone: isoDay(-86), history: [isoDay(-86), isoDay(-177), isoDay(-268)] }),
  tr('t4', 'p1', 'fleatick', 'Bravecto 1000 mg', 18, '3m', { lastDone: isoDay(-72), history: [isoDay(-72), isoDay(-163)] }),
  tr('t5', 'p1', 'medication', 'Apoquel 16 mg — 1×/day', 0, 'daily', { lastDone: isoDay(-1), notes: 'With breakfast', remindDaysBefore: 0 }),
  tr('t6', 'p1', 'checkup', 'Annual health check', 62, 'yearly', { lastDone: isoDay(-303), fromClinic: 'c1' }),
  tr('t7', 'p2', 'vaccination', 'RCP (Katzenschnupfen/-seuche)', 46, 'yearly', { lastDone: isoDay(-319), history: [isoDay(-319)], fromClinic: 'c1' }),
  tr('t8', 'p2', 'worming', 'Profender Spot-on', -3, '3m', { lastDone: isoDay(-94), history: [isoDay(-94)] }),
  tr('t9', 'p2', 'fleatick', 'Broadline', 24, 'monthly', { lastDone: isoDay(-6) }),
  tr('t10', 'p3', 'vaccination', 'RHD-1 / RHD-2', 27, 'yearly', { lastDone: isoDay(-338), fromClinic: 'c1' }),
  tr('t11', 'p3', 'vaccination', 'Myxomatose', 27, '6m', { lastDone: isoDay(-155) }),
  tr('t12', 'p4', 'vaccination', 'SHPPi + L4', 21, 'yearly', { lastDone: isoDay(-344), fromClinic: 'c1' }),
  tr('t13', 'p5', 'checkup', 'Senior check & blood panel', 3, 'yearly', { fromClinic: 'c1' }),
  tr('t14', 'p6', 'vaccination', 'Tollwut (Rabies)', -12, '3y', { fromClinic: 'c1' }),
  tr('t15', 'p6', 'medication', 'Otomax ear drops', 2, 'none', { fromClinic: 'c1' }),
  tr('t16', 'p8', 'vaccination', 'RCP', 40, 'yearly', { fromClinic: 'c1' }),
]

/* ------------------------------------------------------------------ documents */
export const seedDocuments = (): PetDocument[] => [
  { id: 'd1', petId: 'p1', title: 'EU-Heimtierausweis', category: 'vaccination', kind: 'image', date: isoDay(-356), sizeKb: 842 },
  { id: 'd2', petId: 'p1', title: 'Blutbild — Laborbefund', category: 'lab', kind: 'pdf', date: isoDay(-120), sizeKb: 214 },
  { id: 'd3', petId: 'p1', title: 'Rechnung Impfung', category: 'invoice', kind: 'pdf', date: isoDay(-356), sizeKb: 96 },
  { id: 'd4', petId: 'p1', title: 'Röntgen Hüfte', category: 'report', kind: 'image', date: isoDay(-210), sizeKb: 1630 },
  { id: 'd5', petId: 'p2', title: 'Impfpass Mila', category: 'vaccination', kind: 'image', date: isoDay(-319), sizeKb: 701 },
  { id: 'd6', petId: 'p2', title: 'Zahnbefund', category: 'report', kind: 'pdf', date: isoDay(-58), sizeKb: 188 },
  { id: 'd7', petId: 'p3', title: 'Kaufvertrag & Gesundheitszeugnis', category: 'other', kind: 'pdf', date: isoDay(-600), sizeKb: 302 },
]

/* ------------------------------------------------------------------- bookings */
export const seedBookings = (): Booking[] => [
  { id: 'b1', petId: 'p1', ownerId: ME, clinicId: 'c1', serviceId: 's-vacc', date: isoDay(9), time: '10:30', status: 'confirmed', createdAt: ago(60 * 26), vet: 'Dr. Katrin Lehmann', note: 'Yearly booster' },
  { id: 'b2', petId: 'p2', ownerId: ME, clinicId: 'c1', serviceId: 's-dental', date: isoDay(-58), time: '15:00', status: 'completed', createdAt: ago(60 * 24 * 64), vet: 'Dr. Tobias Engel' },
  { id: 'b3', petId: 'p4', ownerId: 'u2', clinicId: 'c1', serviceId: 's-check', date: isoDay(1), time: '09:00', status: 'pending', createdAt: ago(35), note: 'Limping on the front left leg since yesterday.' },
  { id: 'b4', petId: 'p5', ownerId: 'u3', clinicId: 'c1', serviceId: 's-senior', date: isoDay(3), time: '11:15', status: 'pending', createdAt: ago(140), note: 'Drinks a lot more water lately.' },
  { id: 'b5', petId: 'p6', ownerId: 'u4', clinicId: 'c1', serviceId: 's-vacc', date: isoDay(0), time: '14:30', status: 'confirmed', createdAt: ago(60 * 30), vet: 'Dr. Aylin Demir' },
  { id: 'b6', petId: 'p7', ownerId: 'u5', clinicId: 'c1', serviceId: 's-check', date: isoDay(0), time: '09:30', status: 'completed', createdAt: ago(60 * 50), vet: 'Dr. Tobias Engel' },
  { id: 'b7', petId: 'p8', ownerId: 'u6', clinicId: 'c1', serviceId: 's-derm', date: isoDay(0), time: '16:00', status: 'confirmed', createdAt: ago(60 * 70), vet: 'Dr. Katrin Lehmann' },
  { id: 'b8', petId: 'p9', ownerId: 'u7', clinicId: 'c1', serviceId: 's-check', date: isoDay(2), time: '12:00', status: 'confirmed', createdAt: ago(60 * 20), vet: 'Dr. Aylin Demir' },
  { id: 'b9', petId: 'p4', ownerId: 'u2', clinicId: 'c1', serviceId: 's-lab', date: isoDay(4), time: '08:30', status: 'confirmed', createdAt: ago(60 * 90), vet: 'Dr. Tobias Engel' },
  { id: 'b10', petId: 'p5', ownerId: 'u3', clinicId: 'c1', serviceId: 's-check', date: isoDay(-7), time: '10:00', status: 'noshow', createdAt: ago(60 * 24 * 12) },
]

/* ---------------------------------------------------------------------- chats */
export const seedThreads = (): Thread[] => [
  {
    id: 'th1', clinicId: 'c1', ownerId: ME, petId: 'p1', subject: 'Bruno — Apoquel dosage',
    messages: [
      { id: 'm1', from: 'owner', text: 'Hallo! Bruno is scratching less since starting Apoquel. Should we keep the dose at 16 mg?', at: ago(60 * 27), read: true },
      { id: 'm2', from: 'clinic', author: 'Dr. Katrin Lehmann', text: 'Great to hear! Please keep 16 mg once daily for another 3 weeks, then we review at the vaccination appointment.', at: ago(60 * 26), read: true },
      { id: 'm3', from: 'clinic', author: 'Praxis-Team', text: 'Your appointment on the day of the booster is confirmed. Please bring the EU pet passport 🐾', at: ago(60 * 3), read: false },
    ],
  },
  {
    id: 'th2', clinicId: 'c1', ownerId: ME, petId: 'p2', subject: 'Mila — dental follow-up',
    messages: [
      { id: 'm4', from: 'clinic', author: 'Dr. Tobias Engel', text: 'Mila’s dental report is now in her documents. Everything looks good, see you next year!', at: ago(60 * 24 * 57), read: true },
      { id: 'm5', from: 'owner', text: 'Thank you so much! 🙏', at: ago(60 * 24 * 57 - 20), read: true },
    ],
  },
  {
    id: 'th3', clinicId: 'c1', ownerId: 'u4', petId: 'p6', subject: 'Rocky — ear infection',
    messages: [
      { id: 'm6', from: 'owner', text: 'Rocky keeps shaking his head after the drops, is that normal?', at: ago(18), read: false, attachment: { name: 'rocky_ear.jpg', kind: 'image' } },
    ],
  },
  {
    id: 'th4', clinicId: 'c1', ownerId: 'u3', petId: 'p5', subject: 'Oskar — blood results',
    messages: [
      { id: 'm7', from: 'owner', text: 'Could you send me the lab results from last time as PDF?', at: ago(95), read: false },
    ],
  },
]

/* -------------------------------------------------------------- notifications */
export const seedNotifications = (): Notification[] => [
  { id: 'n1', ownerId: ME, kind: 'reminder', title: { en: 'Apoquel for Bruno', de: 'Apoquel für Bruno' }, body: { en: 'Time for today’s dose: 16 mg with breakfast.', de: 'Zeit für die heutige Dosis: 16 mg zum Frühstück.' }, at: ago(42), read: false },
  { id: 'n2', ownerId: ME, kind: 'reminder', title: { en: 'Mila’s worming is overdue', de: 'Milas Entwurmung ist überfällig' }, body: { en: 'Profender was due 3 days ago. Mark as done or book a visit.', de: 'Profender war vor 3 Tagen fällig. Als erledigt markieren oder Termin buchen.' }, at: ago(60 * 5), read: false },
  { id: 'n3', ownerId: ME, kind: 'chat', title: { en: 'Praxis Lehmann replied', de: 'Praxis Lehmann hat geantwortet' }, body: { en: 'Your appointment on the day of the booster is confirmed…', de: 'Ihr Termin zur Auffrischung ist bestätigt…' }, at: ago(60 * 3), read: false },
  { id: 'n4', ownerId: ME, kind: 'booking', title: { en: 'Appointment confirmed', de: 'Termin bestätigt' }, body: { en: 'Bruno · Vaccination · Praxis Lehmann', de: 'Bruno · Impfung · Praxis Lehmann' }, at: ago(60 * 26), read: true },
  { id: 'n5', ownerId: ME, kind: 'system', title: { en: 'Welcome to Vetly 🐾', de: 'Willkommen bei Vetly 🐾' }, body: { en: 'Your data is stored in the EU (Frankfurt) and only shared with your consent.', de: 'Deine Daten liegen in der EU (Frankfurt) und werden nur mit deiner Zustimmung geteilt.' }, at: ago(60 * 24 * 40), read: true },
]

/* ------------------------------------------------------------------- consents */
export const seedConsents = (): Consent[] => [
  { id: 'cs1', petId: 'p1', partyType: 'clinic', partyId: 'c1', scope: ['profile', 'vaccinations', 'treatments', 'documents', 'weight'], grantedAt: isoDay(-400), active: true },
  { id: 'cs2', petId: 'p2', partyType: 'clinic', partyId: 'c1', scope: ['profile', 'vaccinations', 'treatments', 'documents', 'weight'], grantedAt: isoDay(-380), active: true },
  { id: 'cs3', petId: 'p1', partyType: 'insurer', partyId: 'i1', scope: ['profile', 'vaccinations', 'treatments'], grantedAt: isoDay(-90), expiresAt: isoDay(275), active: true },
  { id: 'cs4', petId: 'p4', partyType: 'clinic', partyId: 'c1', scope: ['profile', 'vaccinations', 'treatments', 'documents', 'weight'], grantedAt: isoDay(-200), active: true },
  { id: 'cs5', petId: 'p5', partyType: 'clinic', partyId: 'c1', scope: ['profile', 'vaccinations', 'treatments', 'weight'], grantedAt: isoDay(-500), active: true },
  { id: 'cs6', petId: 'p6', partyType: 'clinic', partyId: 'c1', scope: ['profile', 'vaccinations', 'treatments', 'documents', 'weight'], grantedAt: isoDay(-120), active: true },
  { id: 'cs7', petId: 'p7', partyType: 'clinic', partyId: 'c1', scope: ['profile', 'vaccinations'], grantedAt: isoDay(-60), active: true },
  { id: 'cs8', petId: 'p8', partyType: 'clinic', partyId: 'c1', scope: ['profile'], grantedAt: isoDay(-300), active: false },
  { id: 'cs9', petId: 'p9', partyType: 'clinic', partyId: 'c1', scope: ['profile', 'vaccinations', 'treatments'], grantedAt: isoDay(-30), active: true },
  { id: 'cs10', petId: 'p5', partyType: 'insurer', partyId: 'i1', scope: ['profile', 'vaccinations', 'treatments'], grantedAt: isoDay(-40), expiresAt: isoDay(325), active: true },
  { id: 'cs11', petId: 'p4', partyType: 'insurer', partyId: 'i1', scope: ['profile', 'vaccinations'], grantedAt: isoDay(-12), expiresAt: isoDay(353), active: true },
]

/* --------------------------------------------------------------------- owners */
const FIRST = ['Lena', 'Jonas', 'Sophie', 'Murat', 'Anna', 'Felix', 'Clara', 'Lukas', 'Marie', 'Leon', 'Emilia', 'Paul', 'Hannah', 'Elias', 'Mia', 'Noah', 'Lea', 'Ben', 'Laura', 'Finn', 'Zeynep', 'David', 'Julia', 'Tim', 'Sara', 'Max', 'Nina', 'Moritz', 'Ella', 'Jan', 'Amira', 'Erik', 'Lina', 'Tom', 'Ida', 'Ali', 'Greta', 'Karl', 'Frieda', 'Oskar']
const LAST = ['Hoffmann', 'Weber', 'Krüger', 'Yılmaz', 'Schmidt', 'Braun', 'Neumann', 'Schwarz', 'Zimmermann', 'Wolf', 'Schröder', 'Koch', 'Richter', 'Klein', 'Bauer', 'Lange', 'Werner', 'Krause', 'Meier', 'Lehmann', 'Kaya', 'Huber', 'Fuchs', 'Vogel', 'Keller', 'Roth', 'Frank', 'Berger', 'Arslan', 'Winter']
const CITIES = ['Berlin', 'Berlin', 'Berlin', 'München', 'Hamburg', 'Köln', 'Frankfurt', 'Leipzig', 'Stuttgart', 'Düsseldorf', 'Dresden', 'Hannover']

export const seedOwners = (): Owner[] => {
  const r = seeded(42)
  const fixed: Owner[] = [
    { id: 'u1', name: 'Lena Hoffmann', email: 'lena.hoffmann@example.de', city: 'Berlin', joined: isoDay(-412), status: 'active', lastActive: ago(2), pets: 3, platform: 'iOS', lang: 'de' },
    { id: 'u2', name: 'Jonas Weber', email: 'jonas.weber@example.de', city: 'Berlin', joined: isoDay(-210), status: 'active', lastActive: ago(35), pets: 1, platform: 'Android', lang: 'de' },
    { id: 'u3', name: 'Sophie Krüger', email: 's.krueger@example.de', city: 'Berlin', joined: isoDay(-520), status: 'active', lastActive: ago(140), pets: 1, platform: 'iOS', lang: 'de' },
    { id: 'u4', name: 'Murat Yılmaz', email: 'murat.y@example.de', city: 'Berlin', joined: isoDay(-130), status: 'active', lastActive: ago(18), pets: 1, platform: 'Android', lang: 'en' },
    { id: 'u5', name: 'Anna Schmidt', email: 'anna.schmidt@example.de', city: 'Berlin', joined: isoDay(-66), status: 'active', lastActive: ago(60 * 9), pets: 1, platform: 'iOS', lang: 'de' },
    { id: 'u6', name: 'Felix Braun', email: 'felix.braun@example.de', city: 'Berlin', joined: isoDay(-305), status: 'active', lastActive: ago(60 * 50), pets: 1, platform: 'iOS', lang: 'de' },
    { id: 'u7', name: 'Clara Neumann', email: 'clara.n@example.de', city: 'Berlin', joined: isoDay(-31), status: 'active', lastActive: ago(60 * 4), pets: 2, platform: 'Android', lang: 'en' },
  ]
  const gen: Owner[] = Array.from({ length: 53 }, (_, i) => {
    const f = FIRST[Math.floor(r() * FIRST.length)]
    const l = LAST[Math.floor(r() * LAST.length)]
    const status: Owner['status'] = r() > 0.96 ? 'suspended' : r() > 0.97 ? 'pending_deletion' : 'active'
    return {
      id: `u${i + 8}`, name: `${f} ${l}`, email: `${f.toLowerCase()}.${l.toLowerCase().replace(/[^a-z]/g, '')}@example.de`,
      city: CITIES[Math.floor(r() * CITIES.length)], joined: isoDay(-Math.floor(r() * 700)), status,
      lastActive: ago(Math.floor(r() * 60 * 24 * 20)), pets: 1 + Math.floor(r() * 3), platform: r() > 0.48 ? 'iOS' : 'Android', lang: r() > 0.22 ? 'de' : 'en',
    }
  })
  return [...fixed, ...gen]
}

/* ------------------------------------------------------------------- insurers */
export const seedInsurers = (): Insurer[] => [
  { id: 'i1', name: 'Pfotenschutz Versicherung', status: 'live', policies: 3412, hue: 200, since: isoDay(-160), step: 5 },
  { id: 'i2', name: 'Tierwohl Direkt', status: 'onboarding', policies: 0, hue: 150, since: isoDay(-21), step: 3 },
  { id: 'i3', name: 'Nordlicht Tierkranken', status: 'invited', policies: 0, hue: 18, since: isoDay(-4), step: 1 },
]

/* ---------------------------------------------------------------------- audit */
export const seedAudit = (): AuditEntry[] => [
  { id: 'a1', at: ago(2), actor: 'Lena Hoffmann', actorRole: 'owner', action: { en: 'Signed in with Face ID', de: 'Angemeldet mit Face ID' }, target: 'iOS 18 · Berlin', severity: 'info' },
  { id: 'a2', at: ago(18), actor: 'Murat Yılmaz', actorRole: 'owner', action: { en: 'Sent message with photo', de: 'Nachricht mit Foto gesendet' }, target: 'Praxis Lehmann', severity: 'info' },
  { id: 'a3', at: ago(35), actor: 'Jonas Weber', actorRole: 'owner', action: { en: 'Requested appointment', de: 'Termin angefragt' }, target: 'Luna · Praxis Lehmann', severity: 'info' },
  { id: 'a4', at: ago(64), actor: 'Dr. Katrin Lehmann', actorRole: 'clinic', action: { en: 'Viewed patient record', de: 'Patientenakte angesehen' }, target: 'Bruno (consent ✓)', severity: 'info' },
  { id: 'a5', at: ago(120), actor: 'system', actorRole: 'system', action: { en: 'Nightly encrypted backup completed', de: 'Nächtliches verschlüsseltes Backup abgeschlossen' }, target: 'eu-central-1 (Frankfurt)', severity: 'success' },
  { id: 'a6', at: ago(190), actor: 'Felix Braun', actorRole: 'owner', action: { en: 'Revoked record sharing', de: 'Freigabe der Akte widerrufen' }, target: 'Nala → Praxis Lehmann', severity: 'warning' },
  { id: 'a7', at: ago(260), actor: 'Pfotenschutz Versicherung', actorRole: 'insurer', action: { en: 'Fetched vaccination status via API', de: 'Impfstatus per API abgerufen' }, target: '3 consented pets', severity: 'info' },
  { id: 'a8', at: ago(400), actor: 'admin@vetly.de', actorRole: 'admin', action: { en: 'Approved clinic onboarding', de: 'Klinik-Onboarding freigegeben' }, target: 'Praxis Pfötchen Kreuzberg', severity: 'success' },
  { id: 'a9', at: ago(620), actor: 'system', actorRole: 'system', action: { en: 'Blocked 5 failed login attempts', de: '5 fehlgeschlagene Logins blockiert' }, target: 'IP 185.xx.xx.12', severity: 'danger' },
]

export const seedGdpr = (): GdprRequest[] => [
  { id: 'g1', ownerId: 'u21', ownerName: 'Erik Schröder', type: 'export', status: 'completed', at: ago(60 * 30) },
  { id: 'g2', ownerId: 'u33', ownerName: 'Nina Wolf', type: 'delete', status: 'processing', at: ago(60 * 11) },
  { id: 'g3', ownerId: 'u14', ownerName: 'Ali Kaya', type: 'export', status: 'received', at: ago(48) },
]
