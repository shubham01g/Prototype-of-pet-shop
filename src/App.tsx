import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { LogoMark } from '@/components/illustrations'
import { Toaster } from '@/components/shell'
import { DemoGuide } from '@/components/DemoGuide'
import { useDemo } from '@/store/useDemoStore'

const Landing = lazy(() => import('@/portals/landing/Landing'))
const OwnerApp = lazy(() => import('@/portals/owner/OwnerApp'))
const Clinic = lazy(() => import('@/portals/clinic/Clinic'))
const Admin = lazy(() => import('@/portals/admin/Admin'))
const Insurer = lazy(() => import('@/portals/insurer/Insurer'))
const LiveDemo = lazy(() => import('@/portals/landing/LiveDemo'))
const Proposal = lazy(() => import('@/portals/proposal/Proposal'))
const Pricing = lazy(() => import('@/portals/proposal/Pricing'))
const Legal = lazy(() => import('@/portals/legal/Legal'))

function Loader() {
  return (
    <div className="grid min-h-screen place-items-center bg-canvas">
      <div className="flex flex-col items-center gap-4">
        <LogoMark size={52} className="animate-pulse" />
      </div>
    </div>
  )
}

export default function App() {
  const theme = useDemo((s) => s.theme)
  const lang = useDemo((s) => s.lang)
  const loc = useLocation()
  const embed = new URLSearchParams(loc.search).has('embed')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])
  useEffect(() => {
    if (!loc.hash) window.scrollTo(0, 0)
  }, [loc.pathname, loc.hash])

  return (
    <>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<OwnerApp />} />
          <Route path="/clinic/*" element={<Clinic />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/insurer/*" element={<Insurer />} />
          <Route path="/live" element={<LiveDemo />} />
          <Route path="/proposal" element={<Proposal />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/legal/:doc?" element={<Legal />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </Suspense>
      <Toaster />
      {!embed && loc.pathname !== '/live' && <DemoGuide />}
    </>
  )
}
