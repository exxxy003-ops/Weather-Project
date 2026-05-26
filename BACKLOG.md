# Product Backlog — forecast.now

Maintained by: @exxxy003  
Last updated: 2026-05-27

---

## Prioritized Feature Backlog

### 1. Severe Weather Alerts  `P0 · High Impact`

**Elevator pitch:** Integrate the Tomorrow.io Timelines API to surface hyper-local, real-time severe-weather alerts (cyclone watches, heat advisories, flood warnings) directly in the risk strip and as a dismissible modal overlay.

**User story:** *"As a field operations manager I need to know about red-flag weather events before they happen so I can pre-position resources and protect my team."*

**Acceptance criteria:**
- Alert data fetched from `GET /v4/timelines` (Tomorrow.io, hourly, 24 h window)
- Severity levels map to existing risk-strip colours: `advisory → amber`, `warning → orange`, `emergency → red`
- Alert modal is dismissible and does not re-appear within the same session for the same event
- `VITE_TOMORROW_KEY` env var is already wired and documented

**Effort:** M (3–5 days)  
**Dependencies:** Tomorrow.io free-tier account; `VITE_TOMORROW_KEY` already in `.env`

---

### 2. City Comparison View  `P1 · Medium Impact`

**Elevator pitch:** Allow users to pin up to three cities side-by-side in a responsive comparison grid, enabling quick at-a-glance temperature, humidity, and risk-level benchmarking across locations.

**User story:** *"As a supply-chain lead overseeing multiple depots I need to compare current conditions across cities so I can prioritise where to send resources first."*

**Acceptance criteria:**
- `+` button in `CitySelector` queues a city into a comparison slot (max 3)
- Comparison panel renders below the main `HeroPanel` with a condensed `HighlightsGrid` per city
- Each city slot is independently removable
- Shared `maxForecastTemp` drives a unified risk indicator at the top of the comparison panel

**Effort:** L (5–8 days)  
**Dependencies:** Weatherbit free tier allows concurrent city queries; no new API keys required

---

### 3. User Custom Themes  `P2 · Delight`

**Elevator pitch:** Let users override the default "Nothing Phone" dark palette with a small set of curated themes (e.g. *Midnight Blue*, *Forest Fog*, *Desert Dusk*) persisted to `localStorage` and applied via CSS custom properties that already drive all card surfaces.

**User story:** *"As a power user who keeps the dashboard open all day I want a theme that matches my workspace setup so the interface feels less visually fatiguing."*

**Acceptance criteria:**
- Theme picker accessible from the navbar (icon button, no full settings page)
- At least 3 pre-designed palettes (`--card-bg`, `--card-border`, `--glyph-color`, `--dot-color`)
- Selected theme persisted in `localStorage` and restored on reload
- `useWeatherTheme` hook continues to override the base palette during storm/clear conditions

**Effort:** S (1–2 days)  
**Dependencies:** `useWeatherTheme.js` and CSS variable plumbing already in place

---

## Icebox

| Idea | Notes |
|---|---|
| PWA / offline mode | Cache last-known weather for offline viewing |
| Export PDF briefing | One-click snapshot for operations reports |
| Unit toggle (°C / °F) | Low effort, high visibility |
| Historical trend chart | 30-day temperature chart via Weatherbit history endpoint |
