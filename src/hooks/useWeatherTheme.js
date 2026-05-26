const THEMES = {
  'clear-day': {
    id: 'clear-day',
    bgGradient: 'linear-gradient(145deg, #1a0e00 0%, #2d1500 50%, #1a0a00 100%)',
    cardBg: '#1a1000',
    cardBorder: 'rgba(251,146,60,0.15)',
    glyphColor: 'rgba(251,146,60,0.65)',
    accent: '#fb923c',
    dotGrid: 'rgba(251,146,60,0.06)',
  },
  'clear-night': {
    id: 'clear-night',
    bgGradient: 'linear-gradient(145deg, #050510 0%, #0a0a1f 50%, #06061a 100%)',
    cardBg: '#080818',
    cardBorder: 'rgba(129,140,248,0.14)',
    glyphColor: 'rgba(129,140,248,0.6)',
    accent: '#818cf8',
    dotGrid: 'rgba(129,140,248,0.05)',
  },
  'cloudy-day': {
    id: 'cloudy-day',
    bgGradient: 'linear-gradient(145deg, #0f1623 0%, #1a2535 50%, #121e2e 100%)',
    cardBg: '#111e2e',
    cardBorder: 'rgba(96,165,250,0.15)',
    glyphColor: 'rgba(96,165,250,0.6)',
    accent: '#60a5fa',
    dotGrid: 'rgba(96,165,250,0.06)',
  },
  'cloudy-night': {
    id: 'cloudy-night',
    bgGradient: 'linear-gradient(145deg, #0a0f1a 0%, #111827 50%, #0c1220 100%)',
    cardBg: '#0e1520',
    cardBorder: 'rgba(75,107,154,0.15)',
    glyphColor: 'rgba(75,107,154,0.6)',
    accent: '#4b6b9a',
    dotGrid: 'rgba(75,107,154,0.05)',
  },
  rain: {
    id: 'rain',
    bgGradient: 'linear-gradient(145deg, #040e1c 0%, #0a1e38 50%, #061428 100%)',
    cardBg: '#071525',
    cardBorder: 'rgba(56,189,248,0.15)',
    glyphColor: 'rgba(56,189,248,0.6)',
    accent: '#38bdf8',
    dotGrid: 'rgba(56,189,248,0.06)',
  },
  drizzle: {
    id: 'drizzle',
    bgGradient: 'linear-gradient(145deg, #071521 0%, #0d2030 50%, #091a28 100%)',
    cardBg: '#081620',
    cardBorder: 'rgba(103,232,249,0.14)',
    glyphColor: 'rgba(103,232,249,0.55)',
    accent: '#67e8f9',
    dotGrid: 'rgba(103,232,249,0.05)',
  },
  storm: {
    id: 'storm',
    bgGradient: 'linear-gradient(145deg, #08021a 0%, #12082a 50%, #0a051f 100%)',
    cardBg: '#0d0520',
    cardBorder: 'rgba(167,139,250,0.18)',
    glyphColor: 'rgba(167,139,250,0.7)',
    accent: '#a78bfa',
    dotGrid: 'rgba(167,139,250,0.05)',
  },
  fog: {
    id: 'fog',
    bgGradient: 'linear-gradient(145deg, #0e0e12 0%, #181820 50%, #111115 100%)',
    cardBg: '#131318',
    cardBorder: 'rgba(148,163,184,0.14)',
    glyphColor: 'rgba(148,163,184,0.55)',
    accent: '#94a3b8',
    dotGrid: 'rgba(148,163,184,0.05)',
  },
  snow: {
    id: 'snow',
    bgGradient: 'linear-gradient(145deg, #040d1a 0%, #091a2e 50%, #061525 100%)',
    cardBg: '#071220',
    cardBorder: 'rgba(186,230,253,0.15)',
    glyphColor: 'rgba(186,230,253,0.6)',
    accent: '#bae6fd',
    dotGrid: 'rgba(186,230,253,0.05)',
  },
}

const DEFAULT = THEMES['cloudy-night']

export function useWeatherTheme(currentWeather) {
  if (!currentWeather) return DEFAULT

  const code = currentWeather.weather?.code ?? 800
  const isDay = (currentWeather.pod ?? 'd') === 'd'
  const p = Math.floor(code / 100)

  if (p === 2) return THEMES.storm
  if (p === 3) return THEMES.drizzle
  if (p === 5) return THEMES.rain
  if (p === 6) return THEMES.snow
  if (p === 7) return THEMES.fog
  if (code === 800) return isDay ? THEMES['clear-day'] : THEMES['clear-night']
  if (p === 8) return isDay ? THEMES['cloudy-day'] : THEMES['cloudy-night']

  return isDay ? THEMES['cloudy-day'] : THEMES['cloudy-night']
}
