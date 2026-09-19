import { Eye, Users } from 'lucide-react'
import { todayDateKey } from '../lib/schedule'

function StatTile({ icon: Icon, label, value, accent }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${accent}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  )
}

export default function CountersPanel({ counts, now }) {
  const dateKey = todayDateKey(now)
  const days = counts
    ? Object.entries(counts).sort((a, b) => (a[0] < b[0] ? 1 : -1))
    : []
  const today = counts?.[dateKey] ?? { people: 0, blind: 0 }

  const totals = days.reduce(
    (acc, [, v]) => ({
      people: acc.people + (v?.people ?? 0),
      blind: acc.blind + (v?.blind ?? 0),
    }),
    { people: 0, blind: 0 },
  )

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <StatTile
          icon={Users}
          label="Personas hoy"
          value={today.people ?? 0}
          accent="bg-blue-600"
        />
        <StatTile
          icon={Eye}
          label="Personas no videntes hoy"
          value={today.blind ?? 0}
          accent="bg-sky-500"
        />
      </div>

      <div className="flex-1 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="text-lg font-bold text-slate-800">Historial reciente</h3>
        </div>
        <p className="mb-3 text-xs text-slate-400">
          Acumulado: <span className="font-semibold text-blue-700">{totals.people}</span>{' '}
          personas · <span className="font-semibold text-sky-600">{totals.blind}</span> no
          videntes
        </p>

        {days.length === 0 ? (
          <p className="text-sm text-slate-400">
            Aun no hay lecturas registradas para este letrero.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100 text-sm">
            {days.slice(0, 7).map(([date, v]) => (
              <li key={date} className="flex items-center justify-between gap-2 py-2">
                <span className="text-slate-600">{date}</span>
                <span className="flex gap-3 text-xs sm:text-sm">
                  <span className="font-semibold text-blue-700">{v?.people ?? 0} pers.</span>
                  <span className="font-semibold text-sky-600">{v?.blind ?? 0} no vid.</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
