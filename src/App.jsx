import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useSyncDerivedCounts } from './hooks/useSyncDerivedCounts'
import { SIGNS } from './lib/signs'
import SignDashboard from './pages/SignDashboard'

const DERIVED_SYNC_MS = 15 * 1000

export default function App() {
  // Letrero 2 no tiene hardware reportando datos reales todavia: mientras
  // este panel este abierto (en cualquiera de las 2 paginas), se mantiene
  // "parecido pero no igual" a Letrero 1, escribiendo directo a su nodo
  // real en Firebase.
  useSyncDerivedCounts('LETRERO_1', 'LETRERO_2', DERIVED_SYNC_MS)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={SIGNS[0].path} replace />} />
        {SIGNS.map((sign) => (
          <Route key={sign.id} path={sign.path} element={<SignDashboard signId={sign.id} />} />
        ))}
        <Route path="*" element={<Navigate to={SIGNS[0].path} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
