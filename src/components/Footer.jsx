export default function Footer({ updatedAt, hasError }) {
  return (
    <footer className="mx-auto max-w-6xl px-6 py-10 text-center text-xs text-slate-400">
      <p>
        Datos en vivo desde Firebase Realtime Database ·{' '}
        {hasError ? (
          <span className="font-medium text-red-500">sin conexión, reintentando…</span>
        ) : updatedAt ? (
          <>última actualización {updatedAt.toLocaleTimeString('es-EC')}</>
        ) : (
          'cargando…'
        )}
      </p>
    </footer>
  )
}
