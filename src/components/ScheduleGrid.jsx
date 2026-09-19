import { DAY_NAMES_SHORT, HOURS, scheduleValue } from '../lib/schedule'

export default function ScheduleGrid({ schedule, now }) {
  const currentDow = now.getDay()
  const currentHour = now.getHours()

  return (
    <div className="h-full rounded-2xl border border-blue-100 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-bold text-slate-800">Horario semanal</h3>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-sm bg-blue-600" /> Ocupado
          </span>
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-sm border border-slate-200 bg-slate-100" /> Libre
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-separate border-spacing-1 text-center text-xs">
          <thead>
            <tr>
              <th className="w-14"></th>
              {HOURS.map((h) => (
                <th
                  key={h}
                  className={`px-1 py-1 font-semibold ${
                    h === currentHour ? 'text-blue-700' : 'text-slate-400'
                  }`}
                >
                  {h}h
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAY_NAMES_SHORT.map((name, dow) => (
              <tr key={name}>
                <td
                  className={`px-2 py-1 text-left font-semibold ${
                    dow === currentDow ? 'text-blue-700' : 'text-slate-400'
                  }`}
                >
                  {name}
                </td>
                {HOURS.map((h) => {
                  const occupied = scheduleValue(schedule, dow, h) === 1
                  const isNow = dow === currentDow && h === currentHour
                  return (
                    <td key={h}>
                      <div
                        className={`h-6 w-full rounded-md transition-colors ${
                          occupied
                            ? 'bg-blue-600'
                            : 'border border-slate-200 bg-slate-100'
                        } ${isNow ? 'ring-2 ring-amber-400 ring-offset-1' : ''}`}
                        title={`${name} ${h}:00 — ${occupied ? 'Ocupado' : 'Libre'}`}
                      />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!schedule && (
        <p className="mt-4 text-sm text-slate-400">Cargando horario…</p>
      )}
    </div>
  )
}
