import { useMemo, useState } from 'react'

// Paleta categorica validada (dataviz skill): slot 1 azul, slot 3 aqua.
// Ambas pasan separacion CVD/vision normal para 2 series en claro y oscuro.
const COLOR_PEOPLE = '#2a78d6'
const COLOR_BLIND = '#1baf7a'

const WIDTH = 700
const HEIGHT = 260
const MARGIN = { top: 16, right: 12, bottom: 28, left: 34 }
const PLOT_W = WIDTH - MARGIN.left - MARGIN.right
const PLOT_H = HEIGHT - MARGIN.top - MARGIN.bottom
const BASELINE = MARGIN.top + PLOT_H

function niceMax(value) {
  if (value <= 0) return 4
  const exp = Math.floor(Math.log10(value))
  const base = 10 ** exp
  const fraction = value / base
  const niceFraction = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10
  return niceFraction * base
}

// Rectangulo con esquinas superiores redondeadas (4px) y base cuadrada,
// apoyado en la baseline (ver marks-and-anatomy.md).
function barPath(x, width, yTop, yBase, radius = 4) {
  const h = yBase - yTop
  if (h <= 0) return ''
  const r = Math.min(radius, width / 2, h)
  return `M ${x} ${yBase}
    L ${x} ${yTop + r}
    Q ${x} ${yTop} ${x + r} ${yTop}
    L ${x + width - r} ${yTop}
    Q ${x + width} ${yTop} ${x + width} ${yTop + r}
    L ${x + width} ${yBase}
    Z`
}

export default function TrendChart({ counts }) {
  const [hovered, setHovered] = useState(null)

  const chartDays = useMemo(() => {
    if (!counts) return []
    return Object.entries(counts)
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .slice(-14)
  }, [counts])

  const maxVal = useMemo(() => {
    const max = chartDays.reduce(
      (m, [, v]) => Math.max(m, v?.people ?? 0, v?.blind ?? 0),
      0,
    )
    return niceMax(max)
  }, [chartDays])

  const groupW = chartDays.length > 0 ? PLOT_W / chartDays.length : PLOT_W
  const barW = Math.max(4, Math.min(20, (groupW - 6) / 2))
  const barGap = 2
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(maxVal * f))
  const labelEvery = Math.max(1, Math.ceil(chartDays.length / 6))

  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-bold text-slate-800">
          Tendencia{' '}
          {chartDays.length > 1
            ? `(últimos ${chartDays.length} días)`
            : chartDays.length === 1
              ? '(último día)'
              : ''}
        </h3>
        {chartDays.length > 0 && (
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: COLOR_PEOPLE }} />
              Personas
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: COLOR_BLIND }} />
              No videntes
            </span>
          </div>
        )}
      </div>

      {chartDays.length === 0 ? (
        <p className="text-sm text-slate-400">
          Aun no hay suficientes lecturas para graficar una tendencia.
        </p>
      ) : (
        <div className="relative">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="w-full"
            role="img"
            aria-label="Tendencia de personas y personas no videntes por dia"
          >
            {yTicks.map((t) => {
              const y = BASELINE - (maxVal > 0 ? (t / maxVal) * PLOT_H : 0)
              return (
                <g key={t}>
                  <line x1={MARGIN.left} y1={y} x2={WIDTH - MARGIN.right} y2={y} stroke="#e1e0d9" strokeWidth="1" />
                  <text x={MARGIN.left - 6} y={y + 3} textAnchor="end" fontSize="9" fill="#898781">
                    {t}
                  </text>
                </g>
              )
            })}
            <line
              x1={MARGIN.left}
              y1={BASELINE}
              x2={WIDTH - MARGIN.right}
              y2={BASELINE}
              stroke="#c3c2b7"
              strokeWidth="1"
            />

            {chartDays.map(([date, v], i) => {
              const groupX = MARGIN.left + i * groupW
              const offset = (groupW - (barW * 2 + barGap)) / 2
              const xPeople = groupX + offset
              const xBlind = xPeople + barW + barGap
              const peopleH = maxVal > 0 ? ((v?.people ?? 0) / maxVal) * PLOT_H : 0
              const blindH = maxVal > 0 ? ((v?.blind ?? 0) / maxVal) * PLOT_H : 0
              const isHovered = hovered === i
              const showLabel = i === 0 || i === chartDays.length - 1 || i % labelEvery === 0

              return (
                <g key={date}>
                  <path
                    d={barPath(xPeople, barW, BASELINE - peopleH, BASELINE)}
                    fill={COLOR_PEOPLE}
                    opacity={isHovered ? 1 : 0.9}
                  />
                  <path
                    d={barPath(xBlind, barW, BASELINE - blindH, BASELINE)}
                    fill={COLOR_BLIND}
                    opacity={isHovered ? 1 : 0.9}
                  />
                  <rect
                    x={groupX}
                    y={MARGIN.top}
                    width={groupW}
                    height={PLOT_H}
                    fill="transparent"
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
                    onFocus={() => setHovered(i)}
                    onBlur={() => setHovered((h) => (h === i ? null : h))}
                    tabIndex={0}
                  />
                  {showLabel && (
                    <text x={groupX + groupW / 2} y={HEIGHT - 8} textAnchor="middle" fontSize="9" fill="#898781">
                      {date.slice(5)}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>

          {hovered !== null && chartDays[hovered] && (
            <div
              className="pointer-events-none absolute -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg"
              style={{
                left: `${((MARGIN.left + hovered * groupW + groupW / 2) / WIDTH) * 100}%`,
                top: `${(MARGIN.top / HEIGHT) * 100}%`,
              }}
            >
              <p className="mb-1.5 font-semibold text-slate-700">{chartDays[hovered][0]}</p>
              <p className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLOR_PEOPLE }} />
                <span className="font-semibold text-slate-800">{chartDays[hovered][1]?.people ?? 0}</span>
                <span className="text-slate-500">personas</span>
              </p>
              <p className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLOR_BLIND }} />
                <span className="font-semibold text-slate-800">{chartDays[hovered][1]?.blind ?? 0}</span>
                <span className="text-slate-500">no videntes</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
