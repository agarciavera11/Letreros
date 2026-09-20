import { useEffect } from 'react'
import { fetchCounts, putCounts } from '../lib/api'
import { deriveDayCounts } from '../lib/deriveCounts'

// Mientras esta pagina este abierta, mantiene <targetId> "parecido pero no
// igual" a <sourceId>: lee los conteos reales de la fuente y escribe en
// Firebase una version derivada (misma formula siempre) para el destino.
// Pensado para un letrero cuyo hardware todavia no reporta datos reales.
export function useSyncDerivedCounts(sourceId, targetId, intervalMs) {
  useEffect(() => {
    let cancelled = false

    async function syncOnce() {
      try {
        const sourceCounts = await fetchCounts(sourceId)
        if (cancelled || !sourceCounts) return
        await Promise.all(
          Object.entries(sourceCounts).map(([date, values]) =>
            putCounts(targetId, date, deriveDayCounts(date, values)),
          ),
        )
      } catch {
        // Silencioso: el proximo ciclo reintenta solo.
      }
    }

    syncOnce()
    const id = setInterval(syncOnce, intervalMs)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [sourceId, targetId, intervalMs])
}
