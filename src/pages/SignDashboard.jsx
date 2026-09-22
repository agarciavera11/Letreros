import { useEffect, useState } from 'react'
import CountersPanel from '../components/CountersPanel'
import Footer from '../components/Footer'
import Header from '../components/Header'
import ScheduleGrid from '../components/ScheduleGrid'
import SignSwitcher from '../components/SignSwitcher'
import StatusHero from '../components/StatusHero'
import TrendChart from '../components/TrendChart'
import { usePolling } from '../hooks/usePolling'
import { fetchCounts, fetchSchedule } from '../lib/api'
import { labStatus } from '../lib/schedule'
import { SIGNS } from '../lib/signs'

const SCHEDULE_REFRESH_MS = 5 * 60 * 1000
const COUNTS_REFRESH_MS = 8 * 1000
const CLOCK_TICK_MS = 30 * 1000

// Pagina de UN letrero especifico, en su propia URL (ver lib/signs.js).
export default function SignDashboard({ signId }) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), CLOCK_TICK_MS)
    return () => clearInterval(id)
  }, [])

  const schedule = usePolling(fetchSchedule, SCHEDULE_REFRESH_MS, [])
  const counts = usePolling(() => fetchCounts(signId), COUNTS_REFRESH_MS, [signId])

  const activeSign = SIGNS.find((s) => s.id === signId)
  const status = labStatus(schedule.data, now)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
      <Header sign={activeSign} />

      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <SignSwitcher signs={SIGNS} active={signId} />

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
