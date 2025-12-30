# 👾 Kenan Ege - Portfolio Website  

<div align="center">

[![Live Site](https://img.shields.io/badge/Live-kenanege.com-8f6be8?style=for-the-badge&logo=google-chrome&logoColor=white)](https://kenanege.com)
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-181717?style=for-the-badge&logo=github&logoColor=white)](https://kenanaegean.github.io)
[![Version](https://img.shields.io/badge/Version-3.2.2-bc13fe?style=for-the-badge)](https://github.com/KenanAegean/KenanAegean.github.io)

**Modern, data-driven portfolio showcasing game development projects and professional experience**

[Live Demo](https://kenanege.com)

</div>

---

## 🌟 Overview

A responsive Single Page Application (SPA) built with **vanilla JavaScript** (no frameworks), featuring dynamic content loading from JSON files, an animated interactive background, and smooth theme color transitions between sections.

**Live Sites:**
- **Primary**: [kenanege.com](https://kenanege.com)
- **GitHub Pages**: [kenanaegean.github.io](https://kenanaegean.github.io)

**Key Highlights:**
- 🎮 Game Developer Portfolio (Unity, Unreal Engine 5, C++ projects)
- 📱 Fully Responsive (mobile-first design)
- 🎨 Dynamic Theme Colors (changes per section with smooth transitions)
- ✨ Interactive Animated Background (dot grid + 3D wireframe shapes)
- 🔄 JSON-driven dynamic content
- 🚀 Automated CI/CD deployment

---

## ✨ Features

### Core Functionality
- **Single Page Application** - Dynamic content loading without page refreshes
- **Advanced Portfolio Filtering** - Real-time filtering by category (Game Dev, Web App, Windows App, Mobile App, Other)
- **Highlighted Projects** - Curated showcase section with featured work
- **Responsive Design** - Mobile-first approach with multiple breakpoints
- **Dynamic Theme System** - Each section has its own color theme with smooth RGB transitions
- **Project Detail Pages** - Dedicated pages for in-depth project showcases

### Visual Effects
- **Animated Dot Grid Background** - Interactive particle system that responds to mouse movement
- **3D Wireframe Shapes** - Floating game-themed objects (controller, code tags, cube, terminal, potion)
- **Smooth Color Transitions** - Theme colors lerp between values when switching sections
- **Typewriter Effect** - Animated title rotation in the sidebar
- **Hover Animations** - Cards, buttons, and interactive elements with smooth transitions

### Social Integration
Links to: GitHub, LinkedIn, Instagram, YouTube, Spotify, SoundCloud, Steam, Itch.io

### Sections
| Section | Theme Color | Description |
|---------|-------------|-------------|
| **Overview** | `#00f3ff` (Cyan) | Personal intro with animated greeting |
| **Arcade** | `#ff0055` (Red) | Featured playable game demos |
| **Inventory** | `#bc13fe` (Purple) | Filterable project portfolio |
| **Career Log** | `#ffd700` (Gold) | Work experience timeline |
| **Stats** | `#0051ff` (Blue) | Education history |
| **More** | `#ff6600` (Orange) | Spotify, Steam, GitHub stats, Instagram |

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| **CSS Framework** | Tailwind CSS (CDN) |
| **Icons** | Lucide Icons, Ion Icons 7.1.0, Font Awesome 6.4.0 |
| **Fonts** | Archivo Black, Chakra Petch, Space Mono |
| **Deployment** | GitHub Pages, GitHub Actions (CI/CD), Custom Domain |

---

## 📁 Project Structure

```
├── .github/workflows/
│   ├── generate-snake.yml      # Daily GitHub contribution snake animation
│   └── sync_to_private.yml     # Sync public repo to private for FTP deployment
├── assets/
│   ├── css/
│   │   └── styles.css          # Custom styles & CSS variables
│   ├── data/                   # JSON data files (see below)
│   ├── images/                 # All images, GIFs, logos
│   ├── js/
│   │   └── main.js             # Main application logic (~900 lines)
│   └── pdf/                    # CV files (localized versions)
├── projects/
│   └── project-detail.html     # Dynamic project detail page template
├── index.html                  # Main entry point
└── README.md
```

---

## 📊 Data Management

### JSON-Driven Architecture

All content is managed through JSON files in `assets/data/`, providing:
- ✅ Easy content updates without touching code
- ✅ Version control for content changes
- ✅ Centralized, maintainable data structure
- ✅ Scalable system for adding new items

### Data Files

| File | Purpose |
|------|---------|
| `site-config.json` | **Master config**: versions, personal info, external integrations, CV paths, hero buttons |
| `portfolio-items.json` | All portfolio projects with categories, tags, and metadata |
| `games-showcase.json` | Featured games displayed in the Arcade section |
| `experience.json` | Work history with positions and responsibilities |
| `education.json` | Academic background |
| `navigation.json` | Navbar items, icons, and section mapping |
| `social-links.json` | Social media platform links and icons |
| `footer.json` | Footer text and configuration |
| `instagram.json` | Instagram integration data |
| `project-details.json` | In-depth project information for detail pages |

### Version-Based Cache-Busting

**Problem:** Browsers cache JSON files, showing outdated content after updates.

**Solution:** Centralized version management in `site-config.json`:

```json
{
  "versions": {
    "css": "3.1.7",
    "js": "3.1.7",
    "data": "3.1.7"
  }
}
```

**How it works:**
1. `main.js` fetches `site-config.json` first (with timestamp to bypass cache)
2. Extracts the `data` version number
3. All subsequent JSON fetches include `?v=3.1.7` query parameter
4. CSS and JS files in HTML also include version: `styles.css?v=3.1.7`

**Update Workflow:**
```bash
# 1. Update any JSON file
# 2. Increment version in site-config.json
"data": "3.1.8"

# 3. Update HTML file references if CSS/JS changed
<link rel="stylesheet" href="./assets/css/styles.css?v=3.1.8">
<script src="./assets/js/main.js?v=3.1.8"></script>

# 4. Commit and push
git add .
git commit -m "Update portfolio (v3.1.8)"
git push
```

### Adding a New Portfolio Project

```json
// Add to assets/data/portfolio-items.json
{
  "id": 35,
  "title": "My New Game",
  "category": "game development",
  "description": "Short description of the project.",
  "highlighted": true,
  "image": "./assets/images/Portfolio/gifs/newgame.gif",
  "link": "https://github.com/username/project",
  "tags": ["Unity", "Solo Project", "Play On Browser!"],
  "iconType": "unity",
  "opennewtab": true,
  "visible": true
}
```

**Categories:** `game development`, `web application`, `windows application`, `mobile application`, `other projects`

**Icon Types:** `unity`, `unreal`, `cpp`, `csharp`, `python`, `django`, `web`, `android`, `design`, `music`

---

## 🎨 Theme System

Each section has a unique color theme defined in the code:

```javascript
const defaultThemes = {
    about: { hex: '#00f3ff' },      // Cyan
    games: { hex: '#ff0055' },      // Red
    portfolio: { hex: '#bc13fe' },  // Purple (default)
    experience: { hex: '#ffd700' }, // Gold
    education: { hex: '#0051ff' },  // Blue
    more: { hex: '#ff6600' }        // Orange
};
```

**Color Transition System:**
- Colors transition smoothly using RGB lerp (linear interpolation)
- Transition speed is controlled by a multiplier (0.05 for smooth animation)
- CSS variable `--theme-color` is updated in real-time
- All themed elements automatically update (buttons, borders, glows, icons)

---

## ✨ Background Animation

The animated background consists of two layers:

### 1. Interactive Dot Grid
- Procedurally generated grid of dots
- Responds to mouse movement with ripple effects
- Dots grow/shrink based on cursor proximity
- Noise-based opacity and size variation
- Radial fade from center

### 2. 3D Wireframe Shapes
Five floating shapes that rotate and drift:
- 🎮 **Controller** - Game pad silhouette
- 📝 **Code Tags** - `</>` brackets
- 📦 **Cube** - Simple 3D cube
- 💻 **Terminal** - Monitor shape
- 🧪 **Potion** - Flask silhouette

**Performance Optimizations:**
- 30 FPS cap to reduce CPU usage
- Animation pauses when tab is not visible
- Squared distance calculations before sqrt (for mouse interactions)

---

## 🔄 CI/CD Pipeline

### Workflow 1: GitHub Contribution Snake

**File:** `.github/workflows/generate-snake.yml`

Generates an animated SVG of your GitHub contribution graph as a snake game.

- **Schedule:** Daily at midnight UTC
- **Output:** `assets/images/snake/github-contribution-grid-snake.svg`
- **Trigger:** Also manual via `workflow_dispatch`

### Workflow 2: Public → Private Sync

**File:** `.github/workflows/sync_to_private.yml`

Syncs the public repository to a private repository for secure FTP deployment.

**Process:**
1. Triggered on push to configured branch
2. Validates branch against secrets
3. Uses `rsync` to copy files (excludes `.git`, `.github`, protected files)
4. Commits and pushes to private repository

### Workflow 3: FTP Deployment (Private Repo)

Located in the private repository, deploys to web server via FTPS.

**Complete Flow:**
```
Developer Push → Public Repo → [Sync Workflow] → Private Repo → [FTP Deploy] → kenanege.com ✅
```

**Why Two Repositories?**
- ✅ Keeps FTP credentials secure (not in public repo)
- ✅ Enables protected files that shouldn't be public
- ✅ Clean separation of concerns

---

## 🖥️ Local Development

### Quick Start

```bash
# Clone the repository
git clone https://github.com/KenanAegean/KenanAegean.github.io.git
cd KenanAegean.github.io

# Open with Live Server (VS Code) or any local server
# The site requires a server due to fetch() calls for JSON files
```

### VS Code Settings

The project includes `.vscode/settings.json` for Live Server:
```json
{
    "liveServer.settings.port": 5501
}
```

### Making Changes

1. **Content Updates:** Edit JSON files in `assets/data/`
2. **Styling:** Modify `assets/css/styles.css` or Tailwind classes in HTML
3. **Functionality:** Edit `assets/js/main.js`
4. **Always update versions** in `site-config.json` after changes

---

## 📱 Responsive Breakpoints

| Breakpoint | Target |
|------------|--------|
| Default | Mobile (< 768px) |
| `md:` | Tablets (≥ 768px) |
| `lg:` | Desktop (≥ 1024px) |

Key responsive behaviors:
- Sidebar: Hidden on mobile, toggleable via hamburger menu
- Game cards: Full width on mobile, 2-column grid on desktop
- Portfolio grid: 1 → 2 → 3 columns as screen grows

---

## 🔧 Key Functions Reference

| Function | Purpose |
|----------|---------|
| `loadData()` | Fetches all JSON files with cache-busting |
| `initBackground()` | Sets up canvas animation (dots + 3D shapes) |
| `updateTheme(section)` | Triggers color transition to new section |
| `processColorTransition()` | Animates RGB values using requestAnimationFrame |
| `renderPortfolio(filter)` | Renders filtered project cards |
| `renderNavigation()` | Builds nav from navigation.json |
| `loadSvgWidget()` | Safely loads GitHub stats with fallback |

---

## 📄 License

This project is personal portfolio code. Feel free to use it as inspiration, but please create your own unique design and content.

---

<div align="center">

Made with 💜 by **Kenan EGE**

[![Portfolio](https://img.shields.io/badge/Portfolio-kenanege.com-bc13fe?style=flat-square)](https://kenanege.com)
[![GitHub](https://img.shields.io/badge/GitHub-KenanAegean-181717?style=flat-square&logo=github)](https://github.com/KenanAegean)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-kenanege-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/kenanege/)

</div>
