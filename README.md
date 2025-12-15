# 👾 Kenan Ege - Portfolio Website  

<div align="center">

[![Live Site](https://img.shields.io/badge/Live-kenanege.com-8f6be8?style=for-the-badge&logo=google-chrome&logoColor=white)](https://kenanege.com)
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-181717?style=for-the-badge&logo=github&logoColor=white)](https://kenanaegean.github.io)

**Modern, data-driven portfolio showcasing game development projects and professional experience**

[Live Demo](https://kenanege.com)

</div>

---

## 🌟 Overview

A responsive Single Page Application (SPA) built with vanilla JavaScript and jQuery, featuring dynamic content loading from JSON files. The site showcases game development projects with an advanced filtering system, professional work experience, and social media integration.

**Live Sites:**
- **Primary**: [kenanege.com](https://kenanege.com)
- **GitHub Pages**: [kenanaegean.github.io](https://kenanaegean.github.io)

**Key Highlights:**
- 🎮 Game Developer Portfolio (Unity, Unreal Engine, C++ projects)
- 📱 Fully Responsive (mobile-first design)
- 🎨 Dark Theme with purple accents
- 🔄 JSON-driven dynamic content
- 🚀 Automated CI/CD deployment

---

## ✨ Features

### Core Functionality
- **Single Page Application** - Dynamic content loading without page refreshes
- **Advanced Portfolio Filtering** - Real-time filtering by category (Game Dev, Web App, Windows App, Mobile App, Other)
- **Highlighted Projects** - Curated showcase section with featured work
- **Responsive Design** - Mobile-first approach with breakpoints at 580px, 768px, 1024px, 1250px+
- **Dark Theme** - Professional dark mode with custom purple accent (`#8f6be8`)
- **Dynamic Resume** - Work experience timeline with downloadable CV (auto-localized for Turkey/International)

### Social Integration
Links to: GitHub, LinkedIn, Instagram, YouTube, Spotify, SoundCloud, Steam, Itch.io

### Additional Sections
- **About** - Personal intro with GitHub stats and featured games
- **Resume** - Experience timeline and education history
- **Portfolio** - Filterable project showcase
- **More** - Spotify embed, Instagram grid, Steam statistics

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+), jQuery 3.6.0 |
| **Icons & Fonts** | Ion Icons 7.4.0, Font Awesome 6.4.2, Devicon, Poppins, Pixelify Sans, VT323, Jersey 10/20 |
| **Deployment** | GitHub Pages, GitHub Actions (CI/CD), Custom Domain |

---

## 📊 Data Management

### JSON-Driven Architecture

All content is managed through JSON files in `assets/data/`, providing:
- ✅ Easy content updates without touching code
- ✅ Version control for content changes
- ✅ Centralized, maintainable data structure
- ✅ Scalable system for adding new items

### Key Data Files

```
assets/data/
├── site-config.json        # Personal info, external integrations (GitHub, Spotify, Steam)
├── portfolio-items.json    # All portfolio projects with categories and metadata
├── experience.json         # Work history with positions and responsibilities
├── education.json          # Academic background
├── social-links.json       # Social media platform links
├── navigation.json         # Navbar configuration
├── games-showcase.json     # Featured and in-development games
└── instagram.json          # Instagram integration data
```

### Cache-Busting System

**Problem:** Browsers cache JSON files, showing outdated content after updates.

**Solution:** Automatic version-based cache-busting in `main.js`:

```javascript
// In main.js (line 16)
this.dataVersion = '1.0.6';  // Increment when updating JSON files

// All JSON fetches become:
fetch('./assets/data/portfolio-items.json?v=1.0.6')
```

**Workflow:**
1. Update any JSON file
2. Increment `dataVersion` in `main.js`
3. Commit both files together
4. Users see changes instantly (no cache issues!)

### Content Update Example

**Adding a new portfolio project:**

```json
// 1. Add to assets/data/portfolio-items.json
{
  "id": 35,
  "title": "My New Game",
  "category": "game development",
  "highlighted": true,
  "image": "./assets/images/Portfolio/gifs/newgame.gif",
  "link": "https://github.com/username/project",
  "tags": ["Unity", "Solo Project"],
  "iconType": "unity",
  "visible": true
}

// 2. Update main.js
this.dataVersion = '1.0.7';  // Was 1.0.6

// 3. Commit and push
git add assets/data/portfolio-items.json assets/js/main.js
git commit -m "Add new project: My New Game (v1.0.7)"
git push
```

**Categories:** `game development`, `web application`, `windows application`, `mobile application`, `other projects`

**Icon Types:** `unity`, `unreal`, `cpp`, `csharp`, `python`, `django`, `web`, `android`, `design`, `music`

---

## 🔄 CI/CD Pipeline

### Two-Stage Automated Deployment

#### Stage 1: Public → Private Repository Sync

**Workflow:** `.github/workflows/sync_to_private.yml`

**Process:**
1. Triggered on push to configured branch
2. Validates branch against secrets
3. Syncs files using `rsync` (excludes: `.git`, `.github`, protected files)
4. Commits changes to private repository
5. Pushes to private repo branch


#### Stage 2: Private → FTP Deployment

**Location:** Private repository (not in public repo)

**Process:**
1. Triggered on push to main branch in private repo
2. Uses `SamKirkland/FTP-Deploy-Action`
3. Deploys via FTPS to web server
4. Target: `/public_html/` directory

**Why Two Stages?**
- ✅ Keeps public repo clean (no FTP credentials)
- ✅ Enables custom deployment logic
- ✅ Maintains security while automating deployment

### Deployment Flow

```
Developer Push → GitHub Public Repo → [Sync Workflow] → 
Private Repo → [FTP Deploy] → Live at kenanege.com ✅
```

---

## 👨‍💻 Development

### Application Architecture

**Main Class (`assets/js/main.js`):**
```javascript
class PortfolioApp {
  constructor() {
    this.dataVersion = '1.0.6';  // Cache-busting version
    // Load all data from JSON files
  }
  
  async loadAllData() { /* Fetch JSON with cache-busting */ }
  renderSidebar() { /* Dynamic sidebar from JSON */ }
  renderNavbar() { /* Dynamic navbar from JSON */ }
  navigateTo(page) { /* SPA navigation */ }
  applyFilter(filter) { /* Real-time portfolio filtering */ }
}
```

**CSS Architecture (`assets/css/style.css`):**
1. CSS Variables (colors, typography, shadows, transitions)
2. Reset & Base Styles
3. Reusable Components (cards, icons, scrollbars)
4. Layout Components (sidebar, navbar, main content)
5. Page Sections (about, resume, portfolio, contact, more)
6. Media Queries (responsive breakpoints)

### Performance Optimizations

- **Lazy Loading** - Images load only when visible
- **Code Splitting** - Modular HTML components loaded on demand
- **Caching Strategy** - Versioned CSS, JS, and JSON files
- **Minimal Dependencies** - jQuery only, no heavy frameworks
- **Asset Optimization** - Compressed images and GIFs

---

<div align="center">

Made by Kenan EGE 👾

</div>
