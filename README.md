# Vetly: interactive prototype

A clickable, front-end-only prototype of **Vetly**, a pet health platform for Germany (DE/EN). All four sides of the product run in one web app and share one live data model.

| Route | What it is |
| --- | --- |
| `/` | Showcase landing page |
| `/app` | Owner app (iOS/Android) in a phone frame on desktop, full screen on mobile |
| `/clinic` | Clinic web dashboard: requests, calendar, patients, chat, reminders, hours & services, integrations |
| `/admin` | Admin console: users, clinics, plans & revenue, insurers, bookings, campaigns, GDPR & audit log, roles, system health |
| `/insurer` | Insurance partner portal: shared records, onboarding, API & webhooks |
| `/live` | Owner app and clinic dashboard side by side, synced in real time |
| `/proposal` | Tech stack, architecture, milestones, suggestions, risks, retention ideas, handover |
| `/legal/*` | Impressum, privacy policy, terms, AVV/DPA template, store declarations (drafts for lawyer review, Markdown export) |

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve the production build
```

## Deploy (free)

- **Vercel:** import the folder or repo and keep the defaults (framework: Vite). `vercel.json` already rewrites all routes to `index.html`.
- **Netlify:** build command `npm run build`, publish directory `dist`. `public/_redirects` handles SPA routing.

## How the demo works

- All data is mock data (`src/data/seed.ts`). There is no backend. State lives in `localStorage` (`src/store/useDemoStore.ts`).
- Open tabs and iframes sync through the `storage` event, which is what makes `/live` work.
- The **Demo guide** (bottom right) walks through the cross-portal flow and has a **Reset** button.
- Language (DE/EN) and light/dark mode switch live on every screen.

## Editing before you send it

- Milestones and weeks: the `PHASE1` / `PHASE2` arrays at the top of `src/portals/proposal/Proposal.tsx`
- Plans and prices: `PLANS` in `src/portals/admin/Admin.tsx`
- Legal texts: `src/portals/legal/content.ts` (placeholders in `[brackets]`)
- Brand colors: CSS variables in `src/index.css`

Stack: Vite, React 18, TypeScript, Tailwind CSS, Framer Motion, Recharts, Zustand, lucide-react.
