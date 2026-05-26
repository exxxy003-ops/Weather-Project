import { useEffect, useState } from 'react'
import axios from 'axios'

const DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function weatherEmoji(code) {
  if (code >= 200 && code < 300) return '⛈'
  if (code >= 300 && code < 400) return '🌦'
  if (code >= 500 && code < 600) return '🌧'
  if (code >= 600 && code < 700) return '🌨'
  if (code >= 700 && code < 800) return '🌫'
  if (code === 800) return '☀️'
  if (code <= 803) return '🌤'
  return '☁️'
}

export default function ForecastStrip({ city, onMaxTemp }) {
  const [days, setDays] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setDays([])
    const key = import.meta.env.VITE_WEATHERBIT_KEY
    axios
      .get(`https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&country=IN&days=7&key=${key}`)
      .then(res => {
        const data = res.data.data
        setDays(data)
        if (onMaxTemp) onMaxTemp(Math.max(...data.map(d => d.max_temp)))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [city, onMaxTemp])

  return (
    <div className="n-card p-5">
      {loading ? (
        <p className="text-white/20 text-xs font-mono tracking-widest">LOADING FORECAST…</p>
      ) : (
        <>
          {/* Day labels + temps */}
          <div className="grid grid-cols-7 text-center mb-3">
            {days.map((day, i) => {
              const d = new Date(day.datetime)
              return (
                <div
                  key={i}
                  className="flex flex-col items-center gap-1"
                  style={{ animation: `fadeSlideUp 0.45s ease-out ${i * 55}ms both` }}
                >
                  <span className="text-white/25 text-[10px] font-light tracking-widest uppercase">
                    {DAY[d.getDay()]}
                  </span>
                  <span className="text-white font-mono text-base font-light">
                    {Math.round(day.max_temp)}°
                  </span>
                </div>
              )
            })}
          </div>

          {/* Connected icon strip */}
          <div className="relative">
            {/* SVG connector line */}
            <svg
              viewBox="0 0 700 2"
              className="absolute top-5 left-0 right-0 w-full"
              style={{ height: '2px' }}
              preserveAspectRatio="none"
            >
              <line x1="0" y1="1" x2="700" y2="1" stroke="white" strokeOpacity="0.08" strokeWidth="1" />
            </svg>

            <div className="grid grid-cols-7 relative z-10">
              {days.map((day, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center"
                  style={{ animation: `fadeSlideUp 0.45s ease-out ${i * 55 + 80}ms both` }}
                >
                  <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/[0.08] flex items-center justify-center text-lg hover:border-white/20 transition-colors duration-300">
                    {weatherEmoji(day.weather.code)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
