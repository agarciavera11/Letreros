// Genera, a partir de los conteos reales de un letrero "fuente", valores
// parecidos-pero-distintos para un letrero "destino" que todavia no tiene
// hardware reportando datos reales. La formula es determinista (misma
// fecha -> misma proporcion siempre) para que la serie en el tiempo se vea
// coherente en vez de saltar al azar cada vez que se recalcula.
export function deriveDayCounts(date, source) {
  const people1 = source?.people ?? 0
  const blind1 = source?.blind ?? 0

  const day = parseInt(date.slice(-2), 10) || 1
  const ratioPeople = 0.65 + (day % 25) / 100
  const ratioBlind = 0.55 + ((day * 7) % 30) / 100

  const people = Math.round(people1 * ratioPeople)
  let blind = Math.round(blind1 * ratioBlind)
  if (blind > people) blind = people

  return { people, blind }
}

// Aplica deriveDayCounts a cada fecha de un objeto /counts/<letrero> completo.
export function deriveCounts(sourceCounts) {
  const result = {}
  for (const [date, values] of Object.entries(sourceCounts ?? {})) {
    result[date] = deriveDayCounts(date, values)
  }
  return result
}
