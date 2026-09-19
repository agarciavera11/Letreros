export const DAY_NAMES = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
]

export const DAY_NAMES_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

// Misma ventana 7:00-17:00 que usa el firmware (firebase_sync.cpp).
export const HOURS = Array.from({ length: 10 }, (_, i) => i + 7)

export function scheduleValue(schedule, dow, hour) {
  const day = schedule?.[dow]
  if (!day) return 0
  return day[hour] ? 1 : 0
}

// Replica la logica de isLabOccupiedNow() del firmware: fuera de
// 7-17 se considera cerrado (no se consulta el horario).
export function labStatus(schedule, now = new Date()) {
  const hour = now.getHours()
  if (hour < 7 || hour >= 17) return 'closed'
  const dow = now.getDay()
  return scheduleValue(schedule, dow, hour) ? 'occupied' : 'available'
}

export function todayDateKey(now = new Date()) {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
