import { Radio } from 'lucide-react'

export default function Header() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-blue-800 via-blue-600 to-sky-500 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-25 [background:radial-gradient(circle_at_15%_20%,white,transparent_35%),radial-gradient(circle_at_85%_-10%,white,transparent_30%)]" />
      <div className="relative mx-auto max-w-6xl px-6 py-10 sm:py-12">
        <div className="flex items-center gap-2 text-blue-100">
          <Radio className="h-4 w-4 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-widest">
            Monitoreo en vivo
          </span>
        </div>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Laboratorio FabLab
        </h1>
        <p className="mt-3 max-w-xl text-blue-100">
          Estado, horario y estadísticas de los letreros inteligentes del
          laboratorio, actualizados en tiempo real.
        </p>
      </div>
    </header>
  )
}
