// ─── Helpers ─────────────────────────────────────────────────────────────────

function utcToIST(t) {
  if (!t) return '00:00'
  const [h, m] = t.split(':').map(Number)
  const total = h * 60 + m + 330
  const hh = Math.floor(total / 60) % 24
  const mm = total % 60
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

function timeToMin(t) {
  if (!t) return 0
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function arcPoint(angleDeg, cx, cy, r) {
  const rad = (angleDeg * Math.PI) / 180
  return [cx + r * Math.cos(rad), cy - r * Math.sin(rad)]
}

function dirLabel(deg) {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW']
  return dirs[Math.round(deg / 22.5) % 16]
}

// ─── UV Index ────────────────────────────────────────────────────────────────

function uvLabel(uv) {
  if (uv <= 2) return { label: 'Low', color: '#4ade80' }
  if (uv <= 5) return { label: 'Moderate', color: '#facc15' }
  if (uv <= 7) return { label: 'High', color: '#fb923c' }
  if (uv <= 10) return { label: 'Very High', color: '#f87171' }
  return { label: 'Extreme', color: '#c084fc' }
}

function UVCard({ uv = 0, accent }) {
  const max = 12
  const pct = Math.min(uv / max, 1)
  const cx = 60, cy = 58, r = 44
  const startAngle = 180
  const endAngle = 0
  const sweepAngle = startAngle - endAngle
  const fillAngle = startAngle - pct * sweepAngle
  const [sx, sy] = arcPoint(startAngle, cx, cy, r)
  const [ex, ey] = arcPoint(endAngle, cx, cy, r)
  const [fx, fy] = arcPoint(fillAngle, cx, cy, r)
  const { label, color } = uvLabel(uv)

  return (
    <div className="n-card p-4 flex flex-col gap-1">
      <p className="text-white/35 text-[10px] font-light tracking-widest uppercase">UV Index</p>
      <div className="flex items-center gap-3">
        <svg viewBox="0 0 120 68" className="w-28 flex-shrink-0">
          <path d={`M ${sx} ${sy} A ${r} ${r} 0 0 1 ${ex} ${ey}`}
            fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="7" strokeLinecap="round" />
          {pct > 0.01 && (
            <path d={`M ${sx} ${sy} A ${r} ${r} 0 0 1 ${fx} ${fy}`}
              fill="none" stroke={color} strokeOpacity="0.85" strokeWidth="7" strokeLinecap="round" />
          )}
          <text x={cx} y={cy + 4} textAnchor="middle" fill="white" fontSize="22" fontWeight="300" fontFamily="monospace">
            {uv ?? '—'}
          </text>
          <text x={cx} y={cy + 16} textAnchor="middle" fill="white" fillOpacity="0.25" fontSize="7" fontFamily="sans-serif" letterSpacing="1">
            / {max}
          </text>
        </svg>
        <div>
          <p className="text-2xl font-thin text-white font-mono">{uv ?? '—'}</p>
          <p className="text-[11px] font-light mt-0.5" style={{ color }}>{label}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Wind Status ─────────────────────────────────────────────────────────────

function WindStatusCard({ wind_spd = 0, wind_dir = 0, accent }) {
  const kmh = (wind_spd * 3.6).toFixed(1)
  const bars = [0.3,0.5,0.4,0.7,0.6,0.5,0.8,0.6,0.7,0.9,0.7,0.8,0.6,0.55,0.7,0.65,0.4,0.5,0.75,1]

  return (
    <div className="n-card p-4 flex flex-col gap-2">
      <p className="text-white/35 text-[10px] font-light tracking-widest uppercase">Wind Status</p>
      <div className="flex items-end justify-between">
        <div>
          <span className="text-3xl font-thin text-white font-mono">{kmh}</span>
          <span className="text-white/30 text-xs font-light ml-1">km/h</span>
        </div>
        <div className="flex flex-col items-center">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center border"
            style={{ borderColor: `${accent}40`, background: `${accent}18` }}
          >
            <svg viewBox="0 0 16 16" className="w-4 h-4" style={{ transform: `rotate(${wind_dir}deg)`, transition: 'transform 1s ease-out' }}>
              <path d="M8 2 L10.5 10 L8 8.5 L5.5 10 Z" fill={accent} fillOpacity="0.85" />
            </svg>
          </div>
          <p className="text-[10px] font-mono mt-1" style={{ color: accent }}>{dirLabel(wind_dir)}</p>
        </div>
      </div>
      <div className="flex items-end gap-[2px] h-7 mt-1">
        {bars.map((h, i) => (
          <div key={i} className="flex-1 rounded-[1px]"
            style={{
              height: `${h * 100}%`,
              background: i === bars.length - 1
                ? accent
                : `rgba(255,255,255,${0.06 + h * 0.12})`,
              animation: `barGrow 0.6s ease-out ${i * 0.02}s both`,
              transformOrigin: 'bottom',
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Sunrise & Sunset ────────────────────────────────────────────────────────

function SunriseCard({ sunrise: sunriseUTC = '00:30', sunset: sunsetUTC = '13:30', accent }) {
  const sunrise = utcToIST(sunriseUTC)
  const sunset  = utcToIST(sunsetUTC)

  const riseMin = timeToMin(sunrise)
  const setMin  = timeToMin(sunset)
  const nowMin  = new Date().getHours() * 60 + new Date().getMinutes()
  const progress = Math.min(1, Math.max(0, (nowMin - riseMin) / (setMin - riseMin)))

  const cx = 80, cy = 54, r = 42
  const [sx, sy] = arcPoint(180, cx, cy, r)
  const [ex, ey] = arcPoint(0, cx, cy, r)
  const sunAngle = 180 - progress * 180
  const [sunX, sunY] = arcPoint(sunAngle, cx, cy, r)

  return (
    <div className="n-card p-4 flex flex-col gap-1">
      <p className="text-white/35 text-[10px] font-light tracking-widest uppercase">Sunrise & Sunset</p>
      <svg viewBox="0 0 160 65" className="w-full">
        <path d={`M ${sx} ${sy} A ${r} ${r} 0 0 1 ${ex} ${ey}`}
          fill="none" stroke="white" strokeOpacity="0.08" strokeWidth="1.5" strokeDasharray="3 5" />
        {progress > 0.01 && (
          <path d={`M ${sx} ${sy} A ${r} ${r} 0 0 1 ${sunX} ${sunY}`}
            fill="none" stroke={accent} strokeOpacity="0.5" strokeWidth="1.5" />
        )}
        <line x1={sx} y1={sy} x2={ex} y2={ey} stroke="white" strokeOpacity="0.06" strokeWidth="1" />
        <circle cx={sx} cy={sy} r="3" fill="#FCD34D" fillOpacity="0.8" />
        <circle cx={ex} cy={ey} r="3" fill="#93C5FD" fillOpacity="0.8" />
        <circle cx={sunX} cy={sunY} r="5" fill={accent} fillOpacity="0.9" className="animate-glow-pulse" />
        <circle cx={sunX} cy={sunY} r="9" fill={accent} fillOpacity="0.08" />
      </svg>
      <div className="flex justify-between text-white/45 text-xs font-mono mt-0.5">
        <div className="flex flex-col">
          <span className="text-[9px] text-white/25 uppercase tracking-widest">Sunrise</span>
          <span>{sunrise}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[9px] text-white/25 uppercase tracking-widest">Sunset</span>
          <span>{sunset}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Humidity ────────────────────────────────────────────────────────────────

function humidityLabel(rh) {
  if (rh < 30) return 'Dry'
  if (rh < 50) return 'Comfortable'
  if (rh < 70) return 'Normal'
  if (rh < 85) return 'High'
  return 'Very High'
}

function HumidityCard({ rh = 0, accent }) {
  const pct = Math.min(rh, 100)

  return (
    <div className="n-card p-4 flex flex-col gap-2">
      <p className="text-white/35 text-[10px] font-light tracking-widest uppercase">Humidity</p>
      <div className="flex items-center justify-between gap-3">
        <div>
          <span className="text-3xl font-thin text-white font-mono">{rh}</span>
          <span className="text-white/30 text-lg font-thin ml-0.5">%</span>
          <p className="text-[11px] font-light mt-1 text-white/40">{humidityLabel(rh)}</p>
        </div>
        {/* Vertical bar */}
        <div className="relative w-5 h-20 rounded-full bg-white/[0.06] overflow-hidden flex-shrink-0">
          <div
            className="absolute bottom-0 left-0 right-0 rounded-full transition-all duration-1000"
            style={{ height: `${pct}%`, background: `linear-gradient(to top, ${accent}, ${accent}88)` }}
          />
          <div
            className="absolute w-4 h-4 rounded-full left-0.5 shadow-lg transition-all duration-1000"
            style={{ bottom: `calc(${pct}% - 8px)`, background: accent }}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Visibility ──────────────────────────────────────────────────────────────

function visLabel(vis) {
  if (vis >= 10) return 'Clear'
  if (vis >= 5) return 'Good'
  if (vis >= 2) return 'Average'
  if (vis >= 1) return 'Poor'
  return 'Very Poor'
}

function VisibilityCard({ vis = 0, accent }) {
  const max = 10
  const pct = Math.min((vis / max) * 100, 100)

  return (
    <div className="n-card p-4 flex flex-col gap-2">
      <p className="text-white/35 text-[10px] font-light tracking-widest uppercase">Visibility</p>
      <div>
        <span className="text-3xl font-thin text-white font-mono">{vis?.toFixed(1) ?? '—'}</span>
        <span className="text-white/30 text-xs font-light ml-1.5">km</span>
      </div>
      {/* Horizontal fill bar */}
      <div className="w-full h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, background: `linear-gradient(to right, ${accent}88, ${accent})` }}
        />
      </div>
      <p className="text-[11px] font-light text-white/40">{visLabel(vis)}</p>
    </div>
  )
}

// ─── Air Quality ─────────────────────────────────────────────────────────────

function aqiLabel(aqi) {
  if (aqi <= 50)  return { label: 'Good', color: '#4ade80' }
  if (aqi <= 100) return { label: 'Moderate', color: '#facc15' }
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: '#fb923c' }
  if (aqi <= 200) return { label: 'Unhealthy', color: '#f87171' }
  if (aqi <= 300) return { label: 'Very Unhealthy', color: '#c084fc' }
  return { label: 'Hazardous', color: '#fb7185' }
}

function AirQualityCard({ aqi, accent }) {
  const { label, color } = aqiLabel(aqi ?? 0)

  return (
    <div className="n-card p-4 flex flex-col gap-2">
      <p className="text-white/35 text-[10px] font-light tracking-widest uppercase">Air Quality</p>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-3xl font-thin text-white font-mono">{aqi ?? '—'}</span>
          <p className="text-[11px] font-light mt-1" style={{ color }}>{label}</p>
        </div>
        <div
          className="w-8 h-8 rounded-full animate-glow-pulse flex-shrink-0"
          style={{ background: color, boxShadow: `0 0 16px ${color}60` }}
        />
      </div>
      {/* AQI scale dots */}
      <div className="flex gap-1.5 mt-1">
        {['#4ade80','#facc15','#fb923c','#f87171','#c084fc','#fb7185'].map((c, i) => (
          <div key={i} className="flex-1 h-1 rounded-full"
            style={{ background: c, opacity: aqiLabel(aqi ?? 0).color === c ? 1 : 0.2 }} />
        ))}
      </div>
    </div>
  )
}

// ─── Grid ────────────────────────────────────────────────────────────────────

export default function HighlightsGrid({ currentWeather, theme }) {
  if (!currentWeather) return null
  const { uv, rh, vis, aqi, wind_spd, wind_dir, sunrise, sunset } = currentWeather
  const accent = theme?.accent ?? '#60a5fa'

  return (
    <div>
      <p className="text-white/25 text-[10px] font-light tracking-widest uppercase mb-3 px-1">
        Today's Highlights
      </p>
      <div className="grid grid-cols-3 gap-3">
        <div className="animate-fade-up" style={{ animationDelay: '0ms' }}>
          <UVCard uv={uv} accent={accent} />
        </div>
        <div className="animate-fade-up" style={{ animationDelay: '55ms' }}>
          <WindStatusCard wind_spd={wind_spd} wind_dir={wind_dir} accent={accent} />
        </div>
        <div className="animate-fade-up" style={{ animationDelay: '110ms' }}>
          <SunriseCard sunrise={sunrise} sunset={sunset} accent={accent} />
        </div>
        <div className="animate-fade-up" style={{ animationDelay: '165ms' }}>
          <HumidityCard rh={rh} accent={accent} />
        </div>
        <div className="animate-fade-up" style={{ animationDelay: '220ms' }}>
          <VisibilityCard vis={vis} accent={accent} />
        </div>
        <div className="animate-fade-up" style={{ animationDelay: '275ms' }}>
          <AirQualityCard aqi={aqi} accent={accent} />
        </div>
      </div>
    </div>
  )
}
