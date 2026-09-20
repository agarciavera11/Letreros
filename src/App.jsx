import { useEffect, useState } from 'react'
import CountersPanel from './components/CountersPanel'
import Footer from './components/Footer'
import Header from './components/Header'
import ScheduleGrid from './components/ScheduleGrid'
import SignSwitcher from './components/SignSwitcher'
import StatusHero from './components/StatusHero'
import TrendChart from './components/TrendChart'
import { usePolling } from './hooks/usePolling'
import { useSyncDerivedCounts } from './hooks/useSyncDerivedCounts'
import { fetchCounts, fetchSchedule } from './lib/api'
import { labStatus } from './lib/schedule'

// Los ids deben coincidir con SIGN_NODE_NAME en FabLabSign/config.h
// de cada letrero (sin espacios: FirebaseClient arma la peticion HTTP
// pegando la ruta tal cual, un espacio sin escapar rompe la peticion).
const SIGNS = [
  { id: 'LETRERO_1', label: 'Letrero 1', labName: 'FabLab' },
  { id: 'LETRERO_2', label: 'Letrero 2', labName: 'Vinculación con la Sociedad' },
]

const SCHEDULE_REFRESH_MS = 5 * 60 * 1000
const COUNTS_REFRESH_MS = 8 * 1000
const CLOCK_TICK_MS = 30 * 1000
const DERIVED_SYNC_MS = 15 * 1000

export default function App() {
  const [activeSignId, setActiveSignId] = useState(SIGNS[0].id)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), CLOCK_TICK_MS)
    return () => clearInterval(id)
  }, [])

  // Letrero 2 no tiene hardware reportando datos reales todavia: mientras
  // este panel este abierto, se mantiene "parecido pero no igual" a
  // Letrero 1 (mismos incrementos, con una variacion), escribiendo
  // directo a su nodo real en Firebase.
  useSyncDerivedCounts('LETRERO_1', 'LETRERO_2', DERIVED_SYNC_MS)

  const schedule = usePolling(fetchSchedule, SCHEDULE_REFRESH_MS, [])
  const counts = usePolling(
    () => fetchCounts(activeSignId),
    COUNTS_REFRESH_MS,
    [activeSignId],
  )

  const activeSign = SIGNS.find((s) => s.id === activeSignId)
  const status = labStatus(schedule.data, now)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
      <Header sign={activeSign} />

      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <SignSwitcher signs={SIGNS} active={activeSignId} onChange={setActiveSignId} />

        <StatusHero status={status} sign={activeSign} now={now} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ScheduleGrid schedule={schedule.data} now={now} />
          </div>
          <div className="lg:col-span-2">
            <CountersPanel counts={counts.data} now={now} />
          </div>
        </div>

        <TrendChart counts={counts.data} />
      </main>

      <Footer
        updatedAt={counts.updatedAt}
        hasError={Boolean(counts.error || schedule.error)}
      />
    </div>
  )
}
