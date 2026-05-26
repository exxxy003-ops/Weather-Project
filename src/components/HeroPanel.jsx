import { useEffect, useState } from 'react'

const DESCRIPTIONS = {
  2: 'Heavy rain and strong winds. Lightning expected. Sudden downpours may cause localised flooding.',
  3: 'Drizzle reducing visibility. Wet roads and reduced outdoor conditions.',
  5: 'Persistent rainfall across the region. Low-lying areas may be affected.',
  6: 'Cold temperatures with snowfall possible. Travel disruptions likely.',
  7: 'Dense fog. Visibility under 200m. Caution advised on highways.',
  8: 'Dry and clear. UV exposure elevated — stay hydrated.',
}

const CATEGORIES = {
  2: 'intense weather conditions',
  3: 'light precipitation',
  5: 'rainy conditions',
  6: 'winter conditions',
  7: 'low visibility',
  8: 'clear skies',
}

function prefix(code) { return Math.floor((code ?? 800) / 100) }

export default function HeroPanel({ currentWeather, city }) {
  const [displayTemp, setDisplayTemp] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!currentWeather) return
    setVisible(false)
    const target = Math.round(currentWeather.temp)
    let step = 0
    const steps = 28
    const timer = setInterval(() => {
      step++
      setDisplayTemp(step >= steps ? target : Math.round((target / steps) * step))
      if (step >= steps) clearInterval(timer)
    }, 28)
    // Trigger text fade-in slightly after mount
    setTimeout(() => setVisible(true), 80)
    return () => clearInterval(timer)
  }, [currentWeather])

  if (!currentWeather) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-px bg-white/20 animate-glow-pulse" />
          <p className="text-white/20 text-xs font-mono tracking-widest">LOADING CONDITIONS</p>
          <div className="w-8 h-px bg-white/20 animate-glow-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    )
  }

  const { temp, weather, uv } = currentWeather
  const code = weather?.code ?? 800
  const p = prefix(code)

  return (
    <div className={`flex-1 flex flex-col justify-between p-8 transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div>
        {/* Condition name */}
        <h1 className="text-5xl md:text-6xl font-light text-white leading-tight tracking-tight">
          {weather?.description ?? '—'}
        </h1>
        <p className="text-white/35 text-sm font-light mt-2 tracking-widest uppercase">
          {CATEGORIES[p] ?? 'partly cloudy'}
        </p>

        {/* Glyph divider */}
        <div className="flex items-center gap-3 mt-5">
          <div className="h-px flex-1 bg-white/[0.06]" />
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>

        <p className="text-white/25 text-xs font-light mt-4 max-w-xs leading-relaxed">
          {DESCRIPTIONS[p] ?? 'Atmospheric conditions are stable across the region.'}
        </p>
      </div>

      <div>
        {/* Animated temperature */}
        <div className="flex items-end gap-3 mt-6 select-none">
          <span className="text-[7rem] font-thin text-white leading-none font-mono">
            {displayTemp}
          </span>
          <span className="text-3xl text-white/30 font-thin mb-5">°</span>
          <span className="text-white/20 text-xl font-light mb-5">+/-</span>
        </div>

        {/* Location row */}
        <div className="flex items-center gap-3 mt-2">
          <span className="text-white/40 text-xs font-light tracking-widest uppercase">
            ◎ {city}
          </span>
          <span className="w-px h-3 bg-white/10" />
          <span className="text-white/25 text-xs font-mono">
            UV &nbsp;{uv ?? '—'}
          </span>
        </div>
      </div>
    </div>
  )
}
