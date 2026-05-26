# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Vite, http://localhost:5173)
npm run build    # Production build
npm run preview  # Preview production build
```

No test runner is configured. Use Playwright (`npx playwright`) for E2E if needed.

## Environment

Requires `.env` at project root:
```
VITE_WEATHERBIT_KEY=...   # https://www.weatherbit.io — current weather + 7-day forecast
VITE_GNEWS_KEY=...        # https://gnews.io — weather news headlines
```

## Architecture

Single-page React app with no router, no state library. All weather state lives in `App.jsx` and flows down as props.

**Data flow:**
1. `App.jsx` fetches `currentWeather` from Weatherbit `/v2.0/current` whenever `city` changes
2. `ForecastStrip` self-fetches the 7-day forecast and lifts `maxForecastTemp` up via `onMaxTemp` callback
3. `NewsSidebar` self-fetches GNews and lifts headline strings up via `onHeadlines` callback
4. `App.jsx` combines `maxForecastTemp` and `headlines` to compute `highRisk` (triggers the red risk strip)

**Weather code convention (Weatherbit / WMO-style):**
- `2xx` = thunderstorm, `3xx` = drizzle, `5xx` = rain, `6xx` = snow, `7xx` = fog, `800` = clear, `801–804` = clouds
- `HeroPanel` groups by `Math.floor(code / 100)` (called `prefix`) to pick descriptions/categories
- `ForecastStrip` maps codes to emojis in `weatherEmoji()`

**Time handling:**
- Weatherbit returns `sunrise`/`sunset` in UTC — `SunCard` converts to IST (+330 min) via `utcToIST()`
- `App.jsx` has a `useNow()` hook that ticks every 60 s for the navbar clock

## Styling

- Theme: "Nothing Phone" — near-black bg (`#0a0a0a`), dark cards (`#111111`)
- Card component: `.n-card` class (defined in `index.css`) — border, rounded-2xl, animated LED glyph on top edge
- `.dot-grid` wraps the full page for the radial-dot texture
- Tailwind v3; no custom theme extensions in `tailwind.config.js` — all color values are inline
- All enter animations use `animate-fade-up` (fadeSlideUp keyframe) with staggered `animationDelay`
