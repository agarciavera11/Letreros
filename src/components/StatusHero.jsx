import { CircleAlert, CircleCheck, Moon } from 'lucide-react'

const STATUS_META = {
  occupied: {
    label: 'Ocupado',
    detail: 'Hay una actividad en curso ahora mismo.',
    icon: CircleAlert,
    classes: 'from-rose-600 to-red-500',
    ring: 'ring-red-100',
  },
  available: {
    label: 'Disponible',
    detail: 'El laboratorio esta libre en este momento.',
    icon: CircleCheck,
    classes: 'from-emerald-600 to-teal-500',
    ring: 'ring-emerald-100',
  },
  closed: {
    label: 'Fuera de horario',
    detail: 'El laboratorio esta cerrado (fuera de 7:00-17:00).',
    icon: Moon,
    classes: 'from-slate-600 to-slate-500',
    ring: 'ring-slate-100',
  },
}

export default function StatusHero({ status, signLabel, now }) {
  const meta = STATUS_META[status] ?? STATUS_META.closed
  const Icon = meta.icon

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${meta.classes} p-6 text-white shadow-lg ring-4 ${meta.ring} sm:p-8`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white/80">
            {signLabel}
          </p>
          <p className="mt-1 text-3xl font-extrabold sm:text-4xl">{meta.label}</p>
          <p className="mt-2 text-white/90">{meta.detail}</p>
        </div>
        <Icon className="h-14 w-14 shrink-0 text-white/90 sm:h-16 sm:w-16" strokeWidth={1.5} />
      </div>
      <p className="mt-5 text-xs font-medium text-white/70">
        {now.toLocaleDateString('es-EC', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        })}{' '}
        ·{' '}
        {now.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  )
}
