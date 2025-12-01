'use strict';

/**
 * Portfolio Website - Main JavaScript
 * Clean, organized, and data-driven with dynamic content loading
 * * VERSION MANAGEMENT:
 * All versions are now managed in assets/data/site-config.json under "versions"
 * This eliminates hardcoded version numbers and provides a single source of truth
 */

class PortfolioApp {
  constructor() {
    this.portfolioItems = [];
    this.siteConfig = null;
    this.socialLinks = [];
    this.navigation = [];
    this.experience = [];
    this.education = [];
    this.gamesShowcase = null;
    this.instagram = null;
    this.footerConfig = null;

    this.init();
  }

  async init() {
    await this.loadAllData();
    this.renderSidebar();
    this.renderNavbar();
    this.renderFooter();
    this.setupEventListeners();
    this.checkVersions();
  }

  /**
   * Helper method to create cache-busted URL
   * Uses version from site-config.json after it's loaded
   */
  getCacheBustedUrl(url) {
    const version = this.siteConfig?.versions?.data || Date.now();
    return `${url}?v=${version}`;
  }

  /**
   * Load all JSON data files with cache-busting
   * Site config is loaded FIRST to get version numbers
   */
  async loadAllData() {
    try {
      // Load site-config FIRST (use timestamp for initial load)
      const configResponse = await fetch(`./assets/data/site-config.json?v=${Date.now()}`);
      this.siteConfig = await configResponse.json();

      // Now load everything else with proper cache-busting from config
      const [socialLinks, navigation, experience, education, gamesShowcase, instagram, footerConfig] = await Promise.all([
        fetch(this.getCacheBustedUrl('./assets/data/social-links.json')).then(r => r.json()),
        fetch(this.getCacheBustedUrl('./assets/data/navigation.json')).then(r => r.json()),
        fetch(this.getCacheBustedUrl('./assets/data/experience.json')).then(r => r.json()),
        fetch(this.getCacheBustedUrl('./assets/data/education.json')).then(r => r.json()),
        fetch(this.getCacheBustedUrl('./assets/data/games-showcase.json')).then(r => r.json()),
        fetch(this.getCacheBustedUrl('./assets/data/instagram.json')).then(r => r.json()),
        fetch(this.getCacheBustedUrl('./assets/data/footer.json')).then(r => r.json()).catch(() => null)
      ]);

      this.socialLinks = socialLinks.filter(link => link.visible !== false);
      this.navigation = navigation.filter(item => item.visible !== false).sort((a, b) => a.order - b.order);
      this.experience = experience;
      this.education = education;
      this.gamesShowcase = gamesShowcase;
      this.instagram = instagram;
      this.footerConfig = footerConfig;
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  /**
   * Check if HTML versions match config versions
   * Logs warnings if versions are mismatched
   */
  checkVersions() {
    if (!this.siteConfig?.versions) {
      console.warn('⚠️ No version configuration found in site-config.json');
      return;
    }

    const configVersions = this.siteConfig.versions;
    const htmlJsVersion = this.getHtmlVersion('main.js');
    const htmlCssVersion = this.getHtmlVersion('style.css');

    console.log('📦 Current versions from site-config.json:', configVersions);

    if (htmlJsVersion && htmlJsVersion !== configVersions.js) {
      console.warn(`⚠️ JS Version mismatch!
        HTML script version: ${htmlJsVersion}
        Config JS version: ${configVersions.js}
        → Update index.html to use v=${configVersions.js}`);
    }

    if (htmlCssVersion && htmlCssVersion !== configVersions.css) {
      console.warn(`⚠️ CSS Version mismatch!
        HTML stylesheet version: ${htmlCssVersion}
        Config CSS version: ${configVersions.css}
        → Update index.html to use v=${configVersions.css}`);
    }

    if (htmlJsVersion === configVersions.js && htmlCssVersion === configVersions.css) {
      console.log('✅ All versions are in sync!');
    }
  }

  /**
   * Extract version from current script/link tag
   */
  getHtmlVersion(filename) {
    let element;
    if (filename.endsWith('.js')) {
      element = document.querySelector(`script[src*="${filename}"]`);
    } else if (filename.endsWith('.css')) {
      element = document.querySelector(`link[href*="${filename}"]`);
    }

    if (!element) return null;

    const url = filename.endsWith('.js') ? element.src : element.href;
    const match = url.match(/v=([^&]+)/);
    return match ? match[1] : null;
  }

  /**
   * Render dynamic sidebar
   */
  renderSidebar() {
    const config = this.siteConfig.personal;
    const socialHtml = this.socialLinks.map(link => {
      const iconHtml = link.iconType === 'fontawesome'
        ? `<i class="fa-brands ${link.icon}"></i>`
        : `<ion-icon name="${link.icon}"></ion-icon>`;

      return `
        <li class="social-item">
          <a href="${link.url}" target="_blank" class="social-link">
            ${iconHtml}
          </a>
        </li>
      `;
    }).join('');

    const titlesHtml = config.titles.map(title => `${title}<br>`).join(' ');

    const sidebarHtml = `
      <aside class="sidebar" data-sidebar>
        <div class="sidebar-info">
          <div>
            <figure class="avatar-box">
              <a href="./index.html">
                <img src="${config.avatar}" alt="${config.name}" class="avatar-base" width="80" style="border-radius: 30px;">
              </a>
            </figure>
          </div>
          
          <div class="info-content">
            <a href="./index.html"><h1 class="name" title="${config.name}">${config.name} </h1></a>
            <p class="title">${titlesHtml}</p>
          </div>

          <div class="info-social">
            <ul class="social-list">
              ${socialHtml}
            </ul>
          </div>

          <button class="info-more-btn" data-sidebar-toggle>
            <span>Show Details</span>
            <ion-icon name="chevron-down"></ion-icon>
          </button>
        </div>

        <div class="sidebar-info-more">
          <div class="separator"></div>

          <ul class="contacts-list">
            <li class="contact-item">
              <div class="icon-box">
                <ion-icon name="logo-steam"></ion-icon>
              </div>
              <div class="contact-info">
                <p class="contact-title">Nickname</p>
                <a class="contact-link">${this.siteConfig.external.steamUsername}</a>
              </div>
            </li>
            
            <li class="contact-item">
              <div class="icon-box">
                <ion-icon name="calendar-outline"></ion-icon>
              </div>
              <div class="contact-info">
                <p class="contact-title">Birthday</p>
                <time datetime="${config.birthday}">${config.birthdayDisplay}</time>
              </div>
            </li>

            <li class="contact-item">
              <div class="icon-box">
                <ion-icon name="location-outline"></ion-icon>
              </div>
              <div class="contact-info">
                <p class="contact-title">Location</p>
                <address>${config.location}</address>
              </div>
            </li>
          </ul>
        </div>
      </aside>
    `;

    $('#sidebar-container').html(sidebarHtml);
  }

  /**
   * Render dynamic navbar
   */
  renderNavbar() {
    const navItems = this.navigation.map(item => {
      const activeClass = item.default ? 'active' : '';
      return `
        <li class="navbar-item">
          <button class="navbar-link ${activeClass}" data-nav-link>${item.label}</button>
        </li>
      `;
    }).join('');

    const navbarHtml = `
      <nav class="navbar">
        <ul class="navbar-list">
          ${navItems}
        </ul>
      </nav>
    `;

    $('#navbar-container').html(navbarHtml);

    // Navigate to default page
    const defaultPage = this.navigation.find(item => item.default);
    if (defaultPage) {
      this.navigateTo(defaultPage.page);
    }
  }

  /**
   * Render dynamic footer with full configuration support
   */
  renderFooter() {
    if (!this.footerConfig || !this.footerConfig.enabled) {
      return;
    }

    const currentYear = new Date().getFullYear();
    let footerHtml = '<footer class="footer"><div class="footer-content">';

    // Profile Section
    if (this.footerConfig.profile && this.footerConfig.profile.enabled) {
      const profile = this.footerConfig.profile;
      footerHtml += '<div class="footer-section">';

      if (profile.showTitle && profile.title) {
        footerHtml += `<h3 class="footer-title">${profile.title}</h3>`;
      }

      if (profile.showSubtitle && profile.subtitle) {
        footerHtml += `<p class="footer-text">${profile.subtitle}</p>`;
      }

      if (profile.showLocation && profile.location) {
        footerHtml += `<p class="footer-text">${profile.location}</p>`;
      }

      footerHtml += '</div>';
    }

    // Social Section
    if (this.footerConfig.social && this.footerConfig.social.enabled) {
      const social = this.footerConfig.social;
      const visibleLinks = social.links ? social.links.filter(link => link.visible !== false) : [];
      const maxIcons = social.maxIcons || 6;
      const linksToShow = visibleLinks.slice(0, maxIcons);

      if (linksToShow.length > 0) {
        const socialHtml = linksToShow.map(link => {
          const iconHtml = link.iconType === 'fontawesome'
            ? `<i class="fa-brands ${link.icon}"></i>`
            : `<ion-icon name="${link.icon}"></ion-icon>`;

          return `
            <a href="${link.url}" target="_blank" class="footer-social-link" title="${link.platform}">
              ${iconHtml}
            </a>
          `;
        }).join('');

        footerHtml += `
          <div class="footer-section">
            <h4 class="footer-subtitle">${social.title || 'Connect'}</h4>
            <div class="footer-social">
              ${socialHtml}
            </div>
          </div>
        `;
      }
    }

    footerHtml += '</div><div class="footer-bottom">';

    // Copyright Section
    if (this.footerConfig.copyright && this.footerConfig.copyright.enabled) {
      const copyright = this.footerConfig.copyright;
      const year = copyright.showYear ? currentYear : '';
      const name = copyright.name || '';
      const text = copyright.text || '';

      footerHtml += `
        <p class="footer-copyright">
          ${year ? `© ${year}` : ''} ${name}${name && text ? '.' : ''} ${text}
        </p>
      `;
    }

    // Credits Section
    if (this.footerConfig.credits && this.footerConfig.credits.enabled) {
      const creditsText = this.footerConfig.credits.text || '';
      footerHtml += `<p class="footer-credits">${creditsText}</p>`;
    }

    // Custom Links Section (optional)
    if (this.footerConfig.customLinks && this.footerConfig.customLinks.length > 0) {
      const visibleCustomLinks = this.footerConfig.customLinks.filter(link => link.visible !== false);
      if (visibleCustomLinks.length > 0) {
        const customLinksHtml = visibleCustomLinks.map(link =>
          `<a href="${link.url}" class="footer-custom-link">${link.text}</a>`
        ).join(' • ');
        footerHtml += `<p class="footer-custom-links">${customLinksHtml}</p>`;
      }
    }

    footerHtml += '</div></footer>';

    $('#footer-container').html(footerHtml);
  }

  /**
   * Setup all event listeners using event delegation
   */
  setupEventListeners() {
    // Navigation
    $(document).on('click', '.navbar-link', (e) => this.handleNavigation(e));

    // Sidebar toggle
    $(document).on('click', '[data-sidebar-toggle]', () => this.toggleSidebar());

    // Portfolio filters
    $(document).on('click', '[data-filter-btn]', (e) => this.handleFilterClick(e));
    $(document).on('click', '[data-select]', (e) => this.toggleFilterSelect(e));
    $(document).on('click', '[data-select-item]', (e) => this.handleSelectItem(e));

    // Close select dropdown when clicking outside
    $(document).on('click', (e) => {
      if (!$(e.target).closest('[data-select]').length) {
        $('.filter-select').removeClass('active');
      }
    });

    // Update: Click event for timeline items specifically targets header/logo
    $(document).on('click', '.timeline-item-clickable .timeline-header', (e) => this.handleTimelineCardClick(e));

    // Curriculum Vitae Button Logic (same as portfolio filter buttons)
    $(document).on('click', '#cv-download-link', (e) => {
      // Optional: Add any specific logic here if needed, like analytics tracking
      // For now, let the default link behavior happen or add a class for active state animation
      const $btn = $(e.currentTarget);
      $btn.addClass('active');
      setTimeout(() => $btn.removeClass('active'), 200); // Remove active class after animation
    });
  }

  handleTimelineCardClick(e) {
    // The event is now attached to .timeline-header, so we look up to the parent item to get the URL
    const $item = $(e.currentTarget).closest('.timeline-item-clickable');
    const url = $item.data('url');

    if (url) {
      window.open(url, '_blank');
    }
  }

  /**
   * Handle navigation between pages
   */
  handleNavigation(e) {
    const pageName = $(e.currentTarget).text().trim().toLowerCase();
    this.navigateTo(pageName);

    // Update active state
    $('.navbar-link').removeClass('active');
    $(e.currentTarget).addClass('active');
  }

  /**
   * Navigate to a specific page
   */
  navigateTo(pageName) {
    // Hide all sections
    $('.content-section').hide();

    const pageMap = {
      'about': () => this.loadAboutPage(),
      'resume': () => this.loadResumePage(),
      'portfolio': () => this.loadPortfolioPage(),
      'contact': () => this.loadContactPage(),
      'more': () => this.loadMorePage()
    };

    const loadPage = pageMap[pageName] || pageMap['portfolio'];
    loadPage();
  }

  /**
   * Load About page and populate with JSON data
   */
  async loadAboutPage() {
    $('#about-section').load('./pages/about.html article.about', () => {
      // Populate dynamic content from JSON
      this.populateAboutPage();
      $('#about-section').show();
    });
  }

  /**
   * Populate About page with data from JSON
   */
  populateAboutPage() {
    const config = this.siteConfig.personal.about;
    const highlightedGames = this.gamesShowcase.highlighted.filter(g => g.visible !== false);
    const inDevelopment = this.gamesShowcase.inDevelopment.filter(g => g.visible !== false);

    // Update about text if placeholders exist
    if ($('#about-greeting').length) {
      $('#about-greeting').text(config.greeting);
    }
    if ($('#about-description').length) {
      $('#about-description').html(config.description);
    }

    // Populate highlighted games
    const highlightedHtml = highlightedGames.map(game => `
      <li class="clients-item">
        <a href="${game.link}" target="_blank">
          <img src="${game.image}" alt="${game.title}">
        </a>
      </li>
    `).join('');
    $('#highlighted-games-list').html(highlightedHtml);

    // Update GitHub stats username
    const githubImg = `http://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=${this.siteConfig.external.githubUsername}&theme=material_palenight`;
    //const githubImg = `https://github-readme-stats.vercel.app/api?username=${this.siteConfig.external.githubUsername}&theme=tokyonight&hide_border=false&include_all_commits=false&count_private=false`;
    $('#github-stats-img').attr('src', githubImg);

    // Populate in-development games
    const inDevHtml = inDevelopment.map(game => `
      <li class="clients-item">
        <a href="${game.link}" target="_blank">
          <img src="${game.image}" alt="${game.title}">
        </a>
      </li>
    `).join('');
    $('#indev-games-list').html(inDevHtml);
  }

  /**
   * Load Resume page and populate with JSON data
   */
  async loadResumePage() {
    $('#resume-section').load('./pages/resume.html article.resume', () => {
      // Populate dynamic content from JSON
      this.populateResumePage();
      $('#resume-section').show();
      // Setup CV localization after page loads
      this.setupCVLocalization();
    });
  }

  /**
   * Populate Resume page with data from JSON
   */
  populateResumePage() {
    // --- START: EXPERIENCE SECTION ---
    const experienceHtml = this.experience.map(company => {
      // Loop through each position and wrap it in a div
      const positionsHtml = company.positions.map(position => {
        const responsibilitiesHtml = position.responsibilities.map(r =>
          `• ${r}<br>`
        ).join('');

        // This "position-item" div is key
        return `
          <div class="position-item">
            <div class="position-header">
              <h5 class="h5 timeline-item-title">${position.title}</h5>
              <span class="timeline-date">${position.startDate} — ${position.endDate}</span>
            </div>
            <p class="timeline-text">${responsibilitiesHtml}</p>
          </div>
        `;
      }).join('');

      // Logo HTML
      const logoHtml = (company.logo && company.url)
        ? `<a href="${company.url}" target="_blank" class="timeline-logo-link">
             <img src="${company.logo}" alt="${company.company} logo" class="timeline-logo">
           </a>`
        : '';

      // NEW: Add clickable class and data-url if URL exists
      const clickableClass = company.url ? 'timeline-item-clickable' : '';
      const dataUrl = company.url ? `data-url="${company.url}"` : '';

      // All positions are placed inside the single timeline-item card
      return `
        <li class="timeline-item ${clickableClass}" ${dataUrl}>
          <div class="timeline-header">
            ${logoHtml}
            <h4 class="h4">${company.company}</h4>
          </div>
          ${positionsHtml}
        </li>
      `;
    }).join('');
    $('#experience-timeline-list').html(experienceHtml);
    // --- END: EXPERIENCE SECTION ---

    // --- START: UPDATED EDUCATION SECTION ---
    const educationHtml = this.education.map(edu => {

      // NEW: Loop through each degree and create a "position-item" for it
      const degreesHtml = edu.degrees.map(degree => {
        const descriptionHtml = degree.description ? `<p class="timeline-text">${degree.description}</p>` : '';
        // We reuse the ".position-item" and ".position-header" classes from the CSS
        return `
          <div class="position-item">
            <div class="position-header">
              <h5 class="h5 timeline-item-title">${degree.title}</h5>
              <span class="timeline-date">${degree.startDate} — ${degree.endDate}</span>
            </div>
            ${descriptionHtml}
          </div>
        `;
      }).join('');

      // Logo HTML
      const logoHtml = (edu.logo && edu.url)
        ? `<a href="${edu.url}" target="_blank" class="timeline-logo-link">
             <img src="${edu.logo}" alt="${edu.institution} logo" class="timeline-logo">
           </a>`
        : '';

      // NEW: Add clickable class and data-url if URL exists
      const clickableClass = edu.url ? 'timeline-item-clickable' : '';
      const dataUrl = edu.url ? `data-url="${edu.url}"` : '';

      // All degrees are placed inside the single timeline-item card
      return `
        <li class="timeline-item ${clickableClass}" ${dataUrl}>
          <div class="timeline-header"> 
            ${logoHtml}
            <h4 class="h4">${edu.institution}</h4>
          </div>
          ${degreesHtml}
        </li>
      `;
    }).join('');
    $('#education-timeline-list').html(educationHtml);
    // --- END: UPDATED EDUCATION SECTION ---
  }

  /**
   * Setup CV download link based on user location
   */
  setupCVLocalization() {
    const link = document.getElementById('cv-download-link');
    if (!link) return;

    const userInTurkey = () => {
      const lang = (navigator.language || '').toLowerCase();
      const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '').toLowerCase();
      return lang.startsWith('tr') || tz.includes('istanbul');
    };

    if (userInTurkey()) {
      link.href = this.siteConfig.cv.turkey;
    } else {
      link.href = this.siteConfig.cv.default;
    }
  }

  /**
   * Load Portfolio page
   */
  async loadPortfolioPage() {
    $('#portfolio-section').load('./pages/portfolio.html article.portfolio', () => {
      $('#portfolio-section').show();
      this.loadPortfolioItems();
    });
  }

  /**
   * Load Contact page
   */
  async loadContactPage() {
    $('#contact-section').load('./pages/contact.html article.contact', () => {
      $('#contact-section').show();
    });
  }

  /**
   * Load More page and populate with JSON data
   */
  async loadMorePage() {
    $('#more-section').load('./pages/more.html article.More', () => {
      // Populate dynamic content from JSON
      this.populateMorePage();
      $('#more-section').show();
    });
  }

  /**
   * Populate More page with data from JSON
   */
  populateMorePage() {
    // Update Spotify embed
    const spotifyUrl = `https://open.spotify.com/embed/artist/${this.siteConfig.external.spotifyArtistId}?utm_source=generator&theme=0`;
    $('#spotify-embed').attr('src', spotifyUrl);

    // Update Instagram profile
    $('#insta-avatar').attr('src', this.instagram.profileImage);
    $('#insta-username').attr('href', this.instagram.profileUrl).text(`@${this.instagram.username}`);

    // Populate Instagram posts
    const instagramPostsHtml = this.instagram.posts.map(post => `
      <a class="insta-card__item" href="${post.link}" target="_blank" rel="noopener">
        <img src="${post.image}" alt="${post.alt}"/>
      </a>
    `).join('');
    $('#insta-grid').html(instagramPostsHtml);

    // Update Steam stats
    const steamUrl = `https://steam-stat.vercel.app/api?profileName=${this.siteConfig.external.steamUsername}`;
    $('#steam').attr('src', steamUrl);
  }

  /**
   * Load portfolio items from JSON and render them (with cache-busting)
   */
  async loadPortfolioItems() {
    try {
      const response = await fetch(this.getCacheBustedUrl('./assets/data/portfolio-items.json'));
      this.portfolioItems = await response.json();
      this.generateFilterButtons();
      this.renderPortfolioItems();
      this.initPortfolioFilters();
    } catch (error) {
      console.error('Error loading portfolio items:', error);
    }
  }

  /**
   * Dynamically generate filter buttons based on available categories
   */
  generateFilterButtons() {
    const visibleItems = this.portfolioItems.filter(item => item.visible !== false);
    const categories = new Set();

    visibleItems.forEach(item => {
      if (item.category) {
        categories.add(item.category);
      }
    });

    // Define custom order
    const categoryOrder = [
      'game development',
      'web application',
      'windows application',
      'mobile application',
      'other projects'
    ];

    // Filter the categories from the Set to match your defined order
    const sortedCategories = categoryOrder.filter(category => categories.has(category));
    const hasHighlighted = visibleItems.some(item => item.highlighted);

    // Generate desktop filter buttons
    const $filterList = $('.filter-list');
    if ($filterList.length) {
      $filterList.empty();

      $filterList.append(`
        <li class="filter-item">
          <button class="active" data-filter-btn>All</button>
        </li>
      `);

      if (hasHighlighted) {
        $filterList.append(`
          <li class="filter-item">
            <button data-filter-btn>Highlighted Projects</button>
          </li>
        `);
      }

      sortedCategories.forEach(category => {
        const displayName = this.capitalizeCategory(category);
        $filterList.append(`
          <li class="filter-item">
            <button data-filter-btn>${displayName}</button>
          </li>
        `);
      });
    }

    // Generate mobile dropdown items
    const $selectList = $('.select-list');
    if ($selectList.length) {
      $selectList.empty();

      $selectList.append(`
        <li class="select-item">
          <button data-select-item>All</button>
        </li>
      `);

      if (hasHighlighted) {
        $selectList.append(`
          <li class="select-item">
            <button data-select-item>Highlighted Projects</button>
          </li>
        `);
      }

      sortedCategories.forEach(category => {
        const displayName = this.capitalizeCategory(category);
        $selectList.append(`
          <li class="select-item">
            <button data-select-item>${displayName}</button>
          </li>
        `);
      });
    }
  }

  /**
   * Render portfolio items dynamically
   */
  renderPortfolioItems() {
    const $projectList = $('.project-list');
    if (!$projectList.length) return;

    $projectList.empty();
    const visibleItems = this.portfolioItems.filter(item => item.visible !== false);

    visibleItems.forEach(item => {
      const $item = this.createPortfolioItem(item);
      $projectList.append($item);
    });
  }

  /**
   * Create a single portfolio item element with opennewtab support
   */
  createPortfolioItem(item) {
    const highlightedAttr = item.highlighted ? 'is-highlighted="yes"' : '';
    const hoverIcon = this.getHoverIcon(item.iconType);

    // Determine target attribute based on opennewtab field (default to true)
    const targetAttr = (item.opennewtab !== false) ? 'target="_blank" rel="noopener noreferrer"' : '';

    // Generate tags HTML as a list of pills
    let tagsHtml = '';
    if (item.tags && item.tags.length > 0) {
      tagsHtml = '<div class="project-tags">';
      item.tags.forEach(tag => {
        tagsHtml += `<span class="project-tag">${tag}</span>`;
      });
      tagsHtml += '</div>';
    }

    return $(`
      <li data-value="${item.id}" class="project-item active" 
          data-filter-item 
          data-category="${item.category}" 
          ${highlightedAttr}>
        <a href="${item.link}" ${targetAttr}>
          <figure class="project-img">
            <div class="project-item-icon-box">
              ${hoverIcon}
            </div>
            ${tagsHtml}
            <img src="${item.image}" alt="${item.title}" loading="lazy">
          </figure>
          
          <div class="project-content">
            <h3 class="project-title">${item.title}</h3>
            <p class="project-category">${this.capitalizeCategory(item.category)}</p>
            ${item.description ? `<p class="project-description">${item.description}</p>` : ''}
          </div>

        </a>
      </li>
    `);
  }

  /**
   * Get the appropriate hover icon based on project type
   */
  getHoverIcon(iconType) {
    const iconMap = {
      'unity': '<i class="fa-brands fa-unity"></i>',
      'unreal': '<i class="devicon-unrealengine-original colored"></i>',
      'web': '<ion-icon name="logo-html5"></ion-icon>',
      'django': '<i class="devicon-django-plain colored"></i>',
      'python': '<i class="fa-brands fa-python"></i>',
      'cpp': '<i class="devicon-cplusplus-plain colored"></i>',
      'csharp': '<i class="devicon-csharp-plain colored"></i>',
      'android': '<i class="devicon-android-plain colored"></i>',
      'design': '<ion-icon name="color-palette-outline"></ion-icon>',
      'music': '<ion-icon name="musical-notes-outline"></ion-icon>',
      'default': '<ion-icon name="eye-outline"></ion-icon>'
    };

    return iconMap[iconType] || iconMap['default'];
  }

  /**
   * Capitalize category text
   */
  capitalizeCategory(category) {
    return category.split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  /**
   * Initialize portfolio filters
   */
  initPortfolioFilters() {
    const $items = $('[data-filter-item]');
    const hasHighlighted = $items.filter((_, el) => this.isHighlighted($(el))).length > 0;
    const initialFilter = hasHighlighted ? 'Highlighted Projects' : 'All';

    this.updateFilterLabel(initialFilter);
    this.applyFilter(initialFilter);

    $('[data-filter-btn]').removeClass('active')
      .filter((_, btn) => $(btn).text().trim() === initialFilter)
      .addClass('active');
  }

  /**
   * Check if an item is marked as highlighted
   */
  isHighlighted($element) {
    const value = $element.attr('is-highlighted') ?? $element.data('highlighted');
    if (value === undefined) return false;
    const str = String(value).toLowerCase();
    return str === '' || str === 'yes' || str === 'true' || str === '1';
  }

  /**
   * Handle filter button clicks
   */
  handleFilterClick(e) {
    const filterText = $(e.currentTarget).text().trim();

    $('[data-filter-btn]').removeClass('active');
    $(e.currentTarget).addClass('active');

    this.updateFilterLabel(filterText);
    this.applyFilter(filterText);

    $('.filter-select').removeClass('active');
  }

  /**
   * Toggle filter select dropdown
   */
  toggleFilterSelect(e) {
    e.stopPropagation();
    $(e.currentTarget).toggleClass('active');
  }

  /**
   * Handle select dropdown item clicks
   */
  handleSelectItem(e) {
    const selectedText = $(e.currentTarget).text().trim();

    this.updateFilterLabel(selectedText);
    this.applyFilter(selectedText);
    $('.filter-select').removeClass('active');

    $('[data-filter-btn]').each((_, btn) => {
      const $btn = $(btn);
      $btn.toggleClass('active',
        $btn.text().trim().toLowerCase() === selectedText.toLowerCase()
      );
    });
  }

  /**
   * Update filter dropdown label
   */
  updateFilterLabel(text) {
    $('[data-select-value]').text(text);
  }

  /**
   * Apply filter to portfolio items
   */
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

  /**
   * Toggle sidebar visibility
   */
  toggleSidebar() {
    $('[data-sidebar]').toggleClass('active');
  }
}

// Initialize app when DOM is ready
$(function () {
  new PortfolioApp();
});