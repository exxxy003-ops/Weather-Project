import { useEffect, useState } from 'react'

// Weatherbit returns sunrise/sunset in UTC — convert to IST (UTC+5:30)
function utcToIST(t) {
  if (!t) return '00:00'
  const [h, m] = t.split(':').map(Number)
  const total = h * 60 + m + 330        // +330 min = +5h30m
  const hh = Math.floor(total / 60) % 24
  const mm = total % 60
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

function timeToMin(t) {
  if (!t) return 0
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

// Returns [x, y] on the arc for a given angle (180° = left, 0° = right)
function arcPoint(angleDeg, cx, cy, r) {
  const rad = (angleDeg * Math.PI) / 180
  return [cx + r * Math.cos(rad), cy - r * Math.sin(rad)]
}

export default function SunCard({ sunrise: sunriseUTC = '00:30', sunset: sunsetUTC = '13:30' }) {
  const sunrise = utcToIST(sunriseUTC)
  const sunset  = utcToIST(sunsetUTC)
  const [animatedProgress, setAnimatedProgress] = useState(0)

  const riseMin = timeToMin(sunrise)
  const setMin  = timeToMin(sunset)
  const nowMin  = new Date().getHours() * 60 + new Date().getMinutes()
  const progress = Math.min(1, Math.max(0, (nowMin - riseMin) / (setMin - riseMin)))

  // Animate sun dot from 0 to real progress on mount
  useEffect(() => {
    let frame = 0
    const steps = 45
    const timer = setInterval(() => {
      frame++
      setAnimatedProgress(frame >= steps ? progress : (progress / steps) * frame)
      if (frame >= steps) clearInterval(timer)
    }, 20)
    return () => clearInterval(timer)
  }, [progress])

  const cx = 100, cy = 68, r = 52
  const [sx, sy] = arcPoint(180, cx, cy, r) // sunrise (left)
  const [ex, ey] = arcPoint(0,   cx, cy, r) // sunset (right)
  const sunAngle  = 180 - animatedProgress * 180
  const [sunX, sunY] = arcPoint(sunAngle, cx, cy, r)

  return (
    <div className="n-card p-4 flex flex-col gap-2 flex-1">
      {/* Labels */}
      <div className="flex justify-between text-white/30 text-[10px] font-mono tracking-widest uppercase">
        <span>Sunrise ↗</span>
        <span>↙ Sunset</span>
      </div>

      {/* Arc SVG */}
      <svg viewBox="0 0 200 80" className="w-full">
        {/* Dashed background arc */}
        <path
          d={`M ${sx} ${sy} A ${r} ${r} 0 0 1 ${ex} ${ey}`}
          fill="none"
          stroke="white"
          strokeOpacity="0.08"
          strokeWidth="1.5"
          strokeDasharray="3 5"
        />
        {/* Traveled arc */}
        {animatedProgress > 0.01 && (
          <path
            d={`M ${sx} ${sy} A ${r} ${r} 0 0 1 ${sunX} ${sunY}`}
            fill="none"
            stroke="white"
            strokeOpacity="0.35"
            strokeWidth="1.5"
          />
        )}
        {/* Horizon line */}
        <line x1={sx} y1={sy} x2={ex} y2={ey} stroke="white" strokeOpacity="0.06" strokeWidth="1" />

        {/* Endpoint dots */}
        <circle cx={sx} cy={sy} r="3" fill="#FCD34D" fillOpacity="0.7" />
        <circle cx={ex} cy={ey} r="3" fill="#93C5FD" fillOpacity="0.7" />

        {/* Sun dot with glow */}
        <circle cx={sunX} cy={sunY} r="5" fill="white" fillOpacity="0.9" className="animate-glow-pulse" />
        <circle cx={sunX} cy={sunY} r="9" fill="white" fillOpacity="0.06" />
      </svg>

      {/* Times */}
      <div className="flex justify-between text-white/50 text-xs font-mono">
        <span>{sunrise}</span>
        <span>{sunset}</span>
      </div>
    </div>
  )
}
