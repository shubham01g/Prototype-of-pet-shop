import { create } from 'zustand'

export type Tab = 'home' | 'pets' | 'book' | 'chat' | 'profile'

export type Route =
  | { name: Tab }
  | { name: 'pet'; id: string; tab?: 'health' | 'docs' | 'weight' | 'info' }
  | { name: 'addPet' }
  | { name: 'clinic'; id: string }
  | { name: 'booking'; clinicId: string; serviceId?: string }
  | { name: 'thread'; id: string }
  | { name: 'newThread' }
  | { name: 'notifications' }
  | { name: 'passport'; petId: string }
  | { name: 'privacy' }
  | { name: 'reminders' }
  | { name: 'appointments' }
  | { name: 'legal'; doc: 'impressum' | 'privacy' | 'terms' }
  | { name: 'account' }

interface NavState {
  tab: Tab
  stack: Route[]
  dir: 1 | -1
  setTab: (t: Tab) => void
  push: (r: Route) => void
  pop: () => void
  reset: () => void
}

export const useNav = create<NavState>((set) => ({
  tab: 'home',
  stack: [],
  dir: 1,
  setTab: (tab) => set({ tab, stack: [], dir: 1 }),
  push: (r) => set((s) => ({ stack: [...s.stack, r], dir: 1 })),
  pop: () => set((s) => ({ stack: s.stack.slice(0, -1), dir: -1 })),
  reset: () => set({ tab: 'home', stack: [], dir: 1 }),
}))

export const currentRoute = (s: Pick<NavState, 'stack' | 'tab'>): Route => s.stack[s.stack.length - 1] ?? { name: s.tab }

export function useRoute(): Route {
  const stack = useNav((s) => s.stack)
  const tab = useNav((s) => s.tab)
  return currentRoute({ stack, tab })
}
