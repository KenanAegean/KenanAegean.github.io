# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Kenan Ege (game developer). Static SPA built with vanilla JavaScript — no build step, no package manager, no framework. All content is data-driven via JSON files.

**Live sites:** kenanege.com (via FTP) and kenanaegean.github.io (GitHub Pages)

## Running Locally

This site **requires a local HTTP server** — `fetch()` calls to JSON files won't work over `file://`.

```bash
# VS Code Live Server (recommended, configured on port 5501)
# Or any static file server, e.g.:
npx serve .
python -m http.server 5501
```

No build, test, or lint commands exist.

## Deployment Flow

Pushing to the `splitted` branch triggers a GitHub Actions workflow that:
1. Syncs the public repo to a private repo (via rsync, excluding secrets)
2. The private repo then FTP-deploys to kenanege.com

GitHub Pages deploys automatically from the same branch.

## Architecture

### Data-Driven Content
All content lives in `assets/data/*.json`. Content changes should be made there, not hardcoded in HTML/JS. Version numbers in `assets/data/site-config.json` are used as cache-busting query parameters — bump `versions.css`, `versions.js`, or `versions.data` when deploying changes to those asset types.

### Single Entry Point
`index.html` → `assets/js/main.js` (1,200+ lines, no modules). The JS fetches all JSON on load, then renders everything dynamically. There is no bundler or transpiler — use ES6+ syntax that browsers support natively.

### Section/Theme System
Each content section has a distinct neon theme color. When the user navigates, `updateTheme(sectionId)` triggers a smooth RGB lerp transition via `processColorTransition()` and `requestAnimationFrame`. The CSS variable `--theme-color` drives all themed elements (borders, glows, button colors).

```javascript
// Section → theme color mapping (in main.js)
const defaultThemes = {
    about:      { hex: '#00f3ff' },  // Overview
    games:      { hex: '#ff0055' },  // Arcade
    portfolio:  { hex: '#bc13fe' },  // Inventory
    experience: { hex: '#ffd700' },  // Career Log
    education:  { hex: '#0051ff' },  // Stats
    more:       { hex: '#ff6600' }   // More
};
```

### Animated Canvas Background
Two layered canvas animations run in `assets/js/main.js`:
- **Dot grid** — interactive particle system with mouse-proximity ripple effects
- **3D wireframe shapes** — five floating game-themed objects (controller, cube, terminal, etc.) capped at 30 FPS

### Project Detail Pages
`/projects/project-detail.html` is a shared template. It reads a `?id=` query param and loads matching data from `assets/data/project-details.json` at runtime.

### Key Data Files
| File | Controls |
|------|----------|
| `site-config.json` | Personal info, titles, asset versions, CV paths |
| `portfolio-items.json` | All portfolio cards and filter tags |
| `project-details.json` | Expanded project detail page content |
| `games-showcase.json` | Featured games in the Arcade section |
| `experience.json` / `education.json` | Timeline entries |
| `navigation.json` | Sidebar nav links |
| `social-links.json` | Social icon links |

### CSS Strategy
`assets/css/styles.css` contains custom properties and component styles. Tailwind CSS (v4, CDN) handles utility classes. The custom CSS takes precedence for themed/animated elements.
