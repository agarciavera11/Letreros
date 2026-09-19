import { useEffect, useRef, useState } from 'react'

// Vuelve a llamar `fetcher` cada `intervalMs` y expone el ultimo
// resultado. Pensado para GETs simples contra la REST API de
// Firebase RTDB (no necesita websockets/SDK para este panel).
export function usePolling(fetcher, intervalMs, deps = []) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [updatedAt, setUpdatedAt] = useState(null)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  useEffect(() => {
    let cancelled = false

    async function run() {
      try {
        const result = await fetcherRef.current()
        if (!cancelled) {
          setData(result)
          setError(null)
          setUpdatedAt(new Date())
        }
      } catch (err) {
        if (!cancelled) setError(err)
      }
    }

    run()
    const id = setInterval(run, intervalMs)
    return () => {
      cancelled = true
      clearInterval(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, error, updatedAt }
}
