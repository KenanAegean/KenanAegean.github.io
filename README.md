# 👾 Kenan EGE - Portfolio Website

Personal portfolio website showcasing game development projects and professional experience.

**Live Site**: [kenanaegean.github.io](https://kenanaegean.github.io)

**Live Site**: [kenanege.com](https://kenanege.com)

## 🌟 Features Overview

- **Single Page Application** - Dynamic content loading without page refreshes
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Dark Theme** - Professional dark mode with purple accent colors
- **Project Filtering** - Interactive portfolio filtering system with categories
- **Automated Deployment** - GitHub Actions workflow for continuous deployment
- **Social Integration** - Links to GitHub, LinkedIn, Instagram, YouTube, Spotify, Steam, and Itch.io
- **Dynamic Components** - Modular sidebar and navbar loaded via jQuery

## 🛠️ Tech Stack

**Frontend**
- HTML5, CSS3, JavaScript (ES6+)
- jQuery 3.6.0
- Ion Icons 7.4.0
- Font Awesome 6.4.2

**Fonts**
- Poppins, Pixelify Sans, VT323, Jersey 10/20

**Deployment & CI/CD**
- GitHub Pages (hosting)
- GitHub Actions (automated sync workflow)

**Development**
- Live Server (VS Code extension)
- Vanilla JavaScript (no build tools required)

## 🔄 CI/CD Pipeline

### Public Repo → Private Repo Sync

The repository includes an automated sync workflow (`.github/workflows/sync_to_private.yml`) that:

**Triggers**: Push to any branch (filtered by configuration)

**Workflow Steps**:
1. **Extract Branch Name** - Identifies the current branch
2. **Branch Validation** - Checks if branch matches `PUBLIC_REPO_BRANCH` secret
3. **Checkout Public Repo** - Fetches full repository history
4. **Clone Private Repo** - Authenticates using `PRIVATE_REPO_PAT` token
5. **Sync Files** - Uses `rsync` to copy updates while excluding:
   - `.git` directory
   - `.github` workflows
   - Protected files defined in `PROTECTED_FILE` secret
6. **Commit & Push** - Automatically commits changes to private repository

### Private Repo → FTP Deployment

The private repository contains an additional workflow that automatically deploys to a web server via FTP:

**Triggers**: Push to main branch

**Features**:
- Uses `SamKirkland/FTP-Deploy-Action` for secure file transfer
- Supports FTPS (FTP over SSL/TLS)
- Excludes `.git`, `.github`, and `README.md` from deployment
- Deploys to `/public_html/` directory

This two-stage pipeline ensures the public repo remains clean while enabling automatic deployment from the private repository.

## 🎨 Feature Highlights

### Dynamic Content Loading

**Implementation**: Uses jQuery's `.load()` method to inject HTML partials

```javascript
$('#sidebar-container').load('./includes/sidebar.html');
$('#navbar-container').load('./includes/navbar.html', () => {
  this.navigateTo('portfolio'); // Set default page
});
```

**Benefits**:
- Reduces code duplication across pages
- Single source of truth for navigation and sidebar
- Easier maintenance and updates
- Improves development workflow

### Portfolio Filtering System

**Features**:
- Multi-category filtering (Game Development, Web Application, Windows Application, Other Projects)
- "Highlighted Projects" category for featured work
- Smooth animations on filter changes
- Responsive dropdown for mobile devices
- Desktop button list for larger screens

**How It Works**:

1. **Filter Detection**: Checks `is-highlighted` attribute on project items
2. **Dynamic Initialization**: Automatically shows "Highlighted Projects" if any exist, otherwise shows "All"
3. **Filter Application**: 
   ```javascript
   applyFilter(filterText) {
     const filter = filterText.toLowerCase();
     $('[data-filter-item]').each((_, item) => {
       const $item = $(item);
       const category = String($item.data('category') || '').toLowerCase();
       const shouldShow = 
         filter === 'all' ||
         (filter === 'highlighted projects' && this.isHighlighted($item)) ||
         category === filter;
       $item.toggleClass('active', shouldShow);
     });
   }
   ```
4. **Event Delegation**: Uses jQuery event delegation for dynamic elements
5. **Dropdown Sync**: Mobile dropdown stays synchronized with desktop buttons

**User Experience**:
- Instant filtering with no page reload
- Visual feedback with scale-up animation
- Category labels clearly visible on each project
- Corner badges show project type (Unity, UE5, C++, etc.)

---

Made with 💜 by Kenan EGE
