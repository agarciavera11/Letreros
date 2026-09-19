// Misma Realtime Database (NoAuth) que usan los 2 letreros ESP32
// (ver FabLabSign/config.h -> FIREBASE_DATABASE_URL).
export const DATABASE_URL = 'https://letrerosdb-default-rtdb.firebaseio.com'

async function getJson(path) {
  const res = await fetch(`${DATABASE_URL}/${path}.json`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Firebase respondio ${res.status}`)
  return res.json()
}

// /schedule/<dia 0-6>/<hora 7-16> -> 0 | 1, compartido por ambos letreros.
export function fetchSchedule() {
  return getJson('schedule')
}

// /counts/<signId>/<YYYY-MM-DD>/{people,blind} -> lecturas propias de cada letrero.
export function fetchCounts(signId) {
  return getJson(`counts/${encodeURIComponent(signId)}`)
}
