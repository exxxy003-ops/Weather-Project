import { useState, useEffect, useCallback } from 'react'
import { AlertTriangle, Cloud } from 'lucide-react'
import axios from 'axios'
import CitySelector from './components/CitySelector'
import HeroPanel from './components/HeroPanel'
import ForecastStrip from './components/ForecastStrip'
import NewsSidebar from './components/NewsSidebar'
import HighlightsGrid from './components/HighlightsGrid'
import { useWeatherTheme } from './hooks/useWeatherTheme'

function useNow() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(t)
  }, [])
  return now
}

export default function App() {
  const [city, setCity] = useState('Surat')
  const [currentWeather, setCurrentWeather] = useState(null)
  const [maxForecastTemp, setMaxForecastTemp] = useState(null)
  const [headlines, setHeadlines] = useState([])
  const now = useNow()
  const theme = useWeatherTheme(currentWeather)

  // Apply CSS variables for themed card surfaces
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--card-bg', theme.cardBg)
    root.style.setProperty('--card-border', theme.cardBorder)
    root.style.setProperty('--glyph-color', theme.glyphColor)
    root.style.setProperty('--dot-color', theme.dotGrid)
  }, [theme])

  useEffect(() => {
    setCurrentWeather(null)
    const key = import.meta.env.VITE_WEATHERBIT_KEY
    axios
      .get(`https://api.weatherbit.io/v2.0/current?city=${city}&country=IN&key=${key}`)
      .then(res => setCurrentWeather(res.data.data[0]))
      .catch(() => {})
  }, [city])

  const handleMaxTemp = useCallback(t => setMaxForecastTemp(t), [])
  const handleHeadlines = useCallback(h => setHeadlines(h), [])

  const highRisk =
    (maxForecastTemp !== null && maxForecastTemp > 40) ||
    headlines.some(h => h.toLowerCase().includes('alert'))

  const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  return (
    <div
      className="min-h-screen text-white"
      style={{ background: theme.bgGradient, transition: 'background 1.2s ease' }}
    >
      {/* Dot-grid texture layer */}
      <div className="min-h-screen dot-grid flex flex-col">

        {/* Navbar */}
        <nav
          className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] animate-fade-up"
          style={{ animationDelay: '0ms' }}
        >
          <div className="flex items-center gap-2.5 text-white text-sm font-light tracking-widest uppercase">
            <Cloud size={16} strokeWidth={1.5} className="text-white/60" />
            forecast.now
          </div>
          <CitySelector city={city} onCityChange={setCity} />
          <div className="text-white/30 text-xs font-mono tracking-wider">
            {dateStr} &nbsp;|&nbsp; {timeStr}
          </div>
        </nav>

        {/* Risk strip */}
        <div
          className={`px-6 py-1.5 text-[11px] font-mono tracking-wider flex items-center gap-2 border-b transition-colors duration-700 animate-fade-up ${
            highRisk
              ? 'bg-red-500/10 border-red-500/20 text-red-400'
              : 'bg-white/[0.02] border-white/[0.04] text-white/25'
          }`}
          style={{ animationDelay: '60ms' }}
        >
          {highRisk
            ? <><AlertTriangle size={11} /> HIGH REGIONAL RISK DETECTED</>
            : <>● PM RISK ASSESSMENT &nbsp;·&nbsp; MONITORING — NO ALERTS</>
          }
        </div>

        {/* Main */}
        <main className="flex-1 flex flex-col gap-3 p-5 max-w-7xl mx-auto w-full">

          {/* Hero — full width */}
          <div
            className="n-card animate-fade-up"
            style={{ animationDelay: '100ms', minHeight: '280px' }}
          >
            <HeroPanel currentWeather={currentWeather} city={city} />
          </div>

          {/* Highlights grid */}
          <div className="animate-fade-up" style={{ animationDelay: '180ms' }}>
            <HighlightsGrid currentWeather={currentWeather} theme={theme} />
          </div>

          {/* Forecast */}
          <div className="animate-fade-up" style={{ animationDelay: '260ms' }}>
            <ForecastStrip city={city} onMaxTemp={handleMaxTemp} />
          </div>

          {/* News */}
          <div className="animate-fade-up" style={{ animationDelay: '340ms' }}>
            <NewsSidebar city={city} onHeadlines={handleHeadlines} />
          </div>

        </main>
      </div>
    </div>
  )
}
