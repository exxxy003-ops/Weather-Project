import { Navigation } from 'lucide-react'

// Heights as fractions (0–1) for the bar graph
const BARS = [0.3, 0.5, 0.4, 0.7, 0.6, 0.5, 0.8, 0.6, 0.7, 0.9, 0.7, 0.8, 0.6, 0.55, 0.7, 0.65, 0.4, 0.5, 0.75, 1]

export default function WindCard({ wind_spd = 0, wind_dir = 0 }) {
  const kmh = (wind_spd * 3.6).toFixed(1)

  return (
    <div className="n-card p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/40 text-xs font-light tracking-widest uppercase">
          <Navigation
            size={11}
            strokeWidth={1.5}
            style={{ transform: `rotate(${wind_dir}deg)`, transition: 'transform 1s ease-out' }}
          />
          Wind status
        </div>
        <div className="text-white font-mono text-sm">
          {kmh}
          <span className="text-white/30 text-xs font-light ml-1">km/h</span>
        </div>
      </div>

      {/* SVG sine wave */}
      <svg viewBox="0 0 200 32" className="w-full h-6" fill="none">
        <path
          d="M0,16 C18,4 36,28 54,16 C72,4 90,28 108,16 C126,4 144,28 162,16 C176,6 188,12 200,16"
          stroke="white"
          strokeOpacity="0.2"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M0,16 C18,4 36,28 54,16 C72,4 90,28 108,16"
          stroke="white"
          strokeOpacity="0.6"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Glow dot at wave front */}
        <circle cx="108" cy="16" r="2.5" fill="white" fillOpacity="0.8" className="animate-glow-pulse" />
      </svg>

      {/* Animated bar graph */}
      <div className="flex items-end gap-[2px] h-8">
        {BARS.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-[1px]"
            style={{
              height: `${h * 100}%`,
              background: i === BARS.length - 1
                ? 'rgba(255,255,255,0.85)'
                : `rgba(255,255,255,${0.08 + h * 0.14})`,
              animation: `barGrow 0.6s ease-out ${i * 0.02}s both`,
              transformOrigin: 'bottom',
            }}
          />
        ))}
      </div>
    </div>
  )
}
