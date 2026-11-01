# Spain · day by day (Nov 21 – Dec 1, 2026)

An interactive day-map site for the family trip: Madrid, Barcelona, Tarragona and Toledo.
One map and one plan per day, plus a whole-trip overview.

## Files
- `index.html` – page shell (hero, sticky day switcher, map + day panel)
- `assets/styles.css` – design system (Fraunces + Inter, paper/saffron palette)
- `assets/data.js` – trip data (`PLACES`, `DAYS`, `STAYS`)
- `assets/app.js` – map, rendering, and interactions
- `verify-v2/` – Playwright screenshots from the last check
- `dev/v1/index-v1.html` – previous single-file version, kept for reference

## Open it locally
Double-click `index.html`, or open `file:///path/to/spain-trip-day-maps/index.html` in Chrome.
No build step and no local server needed. An internet connection is needed for the
map tiles (Esri), Leaflet (unpkg) and fonts (Google Fonts).

Tips: `←` / `→` change the day. `#nov-27` (etc.) in the URL opens a specific day; `#overview` opens the whole trip.

## GitHub Pages
Push this folder to a repo and enable Pages (Settings → Pages → deploy from branch, root).
GitHub Pages serves `index.html` automatically; all paths are relative, so it works from a project sub-path.

## Notes
- Map tiles: Esri World Light Gray Base + Reference only (no API key). Don't switch to OSM public tiles or Carto; both get blocked.
- No prices on the site, on purpose.
- Restaurants and shops are left off for now; dinner/lunch show the neighborhood only.
