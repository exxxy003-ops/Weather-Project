# forecast.now — Weather Dashboard

A production-grade weather intelligence dashboard built for field operations teams. Real-time conditions, 7-day forecasts, live news headlines, and automated risk assessment — all in a single focused interface.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3-38BDF8?style=flat&logo=tailwindcss)

---

## Product Strategy

### Problem

Operations managers, field supervisors, and logistics coordinators in India make time-sensitive decisions that are acutely sensitive to weather — routing, staffing, event planning, supply chain dispatch. Generic weather apps serve consumers; they do not surface the right signals for professional decision-making.

### Target User Persona

**Riya, 34 — Regional Operations Lead, FMCG company**

- Manages field teams across 3–5 Indian cities simultaneously
- Checks weather before briefing drivers and depot staff each morning
- Needs to know *whether a risk exists*, not just raw temperature numbers
- Works on a 13" laptop; keeps the dashboard open in a pinned tab all day
- Gets frustrated by apps that bury critical alerts in menus or require clicking through multiple pages

### Value Proposition

`forecast.now` turns raw weather data into an operations-ready briefing:

| Signal | What it means for Riya |
|---|---|
| Risk strip (red / grey) | One-glance GO / NO-GO assessment |
| 7-day forecast strip | Plan weekly dispatch schedule |
| News intelligence feed | Surface cyclone / flood alerts before they trend |
| PM Risk Assessment | Cross-references temperature extremes + alert headlines |

### North Star Metric

**Daily Active Operations Users** — measured as sessions where a user views the risk strip and interacts with at least one city change per day.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| UI Framework | React 19 | Component model, state management |
| Build Tool | Vite 8 | Dev server, HMR, optimised production build |
| Styling | Tailwind CSS v3 + CSS custom properties | Utility-first layout; CSS variables drive theming |
| HTTP Client | Axios | Promise-based API calls with interceptors |
| Icons | Lucide React | Lightweight icon set |
| Weather Data | Weatherbit API | Current conditions + 7-day daily forecast |
| News Feed | GNews API | Live weather-keyed headline search |
| Severe Alerts | Tomorrow.io *(roadmap)* | Hyper-local alert timeline — key in `.env`, integration pending |
| E2E Testing | Playwright | Browser automation for critical paths |

> **Note on animations:** All enter and transition animations use native CSS keyframes (`fadeSlideUp`, `slideInRight`) defined in `index.css` and applied via Tailwind's `animate-*` utilities. No animation library dependency is required.

---

## Getting Started

### Prerequisites

- Node.js 18+
- API keys from [Weatherbit](https://www.weatherbit.io) and [GNews](https://gnews.io)

### Setup

```bash
git clone https://github.com/exxxy003-ops/Weather-Project.git
cd Weather-Project

npm install

# Configure environment
cp .env.example .env
# Edit .env and fill in your API keys

npm run dev    # http://localhost:5173
```

### Available Commands

```bash
npm run dev      # Start dev server (Vite, http://localhost:5173)
npm run build    # Production build → dist/
npm run preview  # Preview the production build locally
```

---

## Deployment

### Vercel (recommended)

1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add `VITE_WEATHERBIT_KEY` and `VITE_GNEWS_KEY` under **Settings → Environment Variables**
4. Deploy — Vercel detects Vite automatically, no config needed

### GitHub Pages

Add the following to `vite.config.js` before building:

```js
base: '/Weather-Project/',   // must match your GitHub repo name
```

Then deploy with:

```bash
npm run build
npx gh-pages -d dist
```

> API keys are injected at **build time** via `import.meta.env`. They are never exposed in source code, only in the compiled JS bundle served to the browser. For server-side key protection, proxy calls through a Vercel Edge Function or Cloudflare Worker.

---

## Environment Variables

Copy `.env.example` to `.env` — this file is git-ignored and must never be committed.

| Variable | Source | Required |
|---|---|---|
| `VITE_WEATHERBIT_KEY` | [weatherbit.io](https://www.weatherbit.io) | Yes |
| `VITE_GNEWS_KEY` | [gnews.io](https://gnews.io) | Yes |
| `VITE_TOMORROW_KEY` | [tomorrow.io](https://www.tomorrow.io) | Roadmap |

---

## Architecture

Single-page React app with no router and no external state library. All weather state lives in `App.jsx` and flows down as props.

```
App.jsx
├── CitySelector          — city input + search
├── HeroPanel             — primary weather display
├── HighlightsGrid        — wind, humidity, UV, sun times
├── ForecastStrip         — 7-day forecast, lifts maxForecastTemp ↑
└── NewsSidebar           — GNews headlines, lifts headline strings ↑
```

`App.jsx` combines `maxForecastTemp > 40` and headline keywords to compute `highRisk`, which drives the red risk strip.

---

## Feature Backlog

See [BACKLOG.md](./BACKLOG.md) for the full prioritised roadmap, including:

- **Severe Weather Alerts** — Tomorrow.io integration `P0`
- **City Comparison View** — side-by-side multi-city grid `P1`
- **User Custom Themes** — `localStorage`-persisted palette switcher `P2`

---

## License

MIT
