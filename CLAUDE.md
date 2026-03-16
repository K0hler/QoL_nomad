# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

QoL Nomad — single-page React app for comparing countries by cost of living and quality of life. Users filter and search ~240 countries using sliders and text input.

## Commands

All commands run from `frontend/`:

```bash
cd frontend
npm run dev        # Start dev server (Vite, port 5173). Auto-runs build-data.js first.
npm run build      # TypeScript check + production build. Auto-runs build-data.js first.
npm run lint       # ESLint
npm run preview    # Serve production build locally
```

No test framework is configured yet.

## Architecture

### Data Pipeline

`CSV_BD/*.csv` → `frontend/scripts/build-data.js` → `frontend/src/assets/data/merged_db.json`

The build-data script merges two CSV sources (Cost of Living Index, Quality of Life) by normalizing country names and outputs a single JSON array. This runs automatically before `dev` and `build` via npm `pre` hooks.

### Frontend (React + TypeScript + Vite)

Single-component app in `frontend/src/App.tsx`:
- `CountryData` interface defines the merged data shape
- Three filter states: text search, max cost-of-living slider, min quality-of-life slider
- `useMemo` for filtered/sorted results (sorted by QoL descending)
- Data imported directly from generated JSON

Styling: CSS custom properties in `frontend/src/index.css` — dark theme, glassmorphism, HSL color system. No CSS framework.

### Key Paths

| Path | Purpose |
|------|---------|
| `frontend/src/App.tsx` | Main (and only) React component |
| `frontend/src/index.css` | Design tokens and global styles |
| `frontend/scripts/build-data.js` | CSV → JSON merge script |
| `CSV_BD/` | Raw CSV data sources |
| `frontend/src/assets/data/merged_db.json` | Generated data (do not edit manually) |
| `design-artifacts/` | Product briefs, UX scenarios, design system docs |

## Tech Stack

- React 19, TypeScript (strict), Vite 8, ESLint 9
- csv-parse for data pipeline
- No backend — static SPA

## Conventions

- Language in UI and commits: Russian
- TypeScript strict mode with `noUnusedLocals` and `noUnusedParameters`
- ESM modules throughout
