'use strict';

/**
 * Portfolio Website - Main JavaScript
 * Clean, organized, and efficient with dynamic portfolio loading
 */

class PortfolioApp {
  constructor() {
    this.portfolioItems = [];
    this.init();
  }

  init() {
    this.loadComponents();
    this.setupEventListeners();
  }

  /**
   * Load static components (sidebar, navbar)
   */
  loadComponents() {
    $('#sidebar-container').load('./includes/sidebar.html');
    $('#navbar-container').load('./includes/navbar.html', () => {
      // Set Portfolio as default active page
      this.navigateTo('portfolio');
    });
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
    
    const sectionMap = {
      'about': {
        container: '#about-section',
        url: './pages/about.html',
        selector: 'article.about'
      },
      'resume': {
        container: '#resume-section',
        url: './pages/resume.html'
      },
      'portfolio': {
        container: '#portfolio-section',
        url: './pages/portfolio.html',
        callback: () => this.loadPortfolioItems()
      },
      'contact': {
        container: '#contact-section',
        url: './pages/contact.html'
      },
      'more': {
        container: '#more-section',
        url: './pages/more.html'
      }
    };

    const page = sectionMap[pageName] || sectionMap['portfolio'];
    const selector = page.selector || '';
    
    $(page.container).load(`${page.url} ${selector}`, () => {
      $(page.container).show();
      if (page.callback) page.callback();
    });
  }

  /**
   * Load portfolio items from JSON and render them
   */
  async loadPortfolioItems() {
    try {
      const response = await fetch('./assets/data/portfolio-items.json');
      this.portfolioItems = await response.json();
      this.generateFilterButtons(); // Generate filters first
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
    // Get all unique categories from visible items
    const visibleItems = this.portfolioItems.filter(item => item.visible !== false);
    const categories = new Set();
    
    visibleItems.forEach(item => {
      if (item.category) {
        categories.add(item.category);
      }
    });
    
    // Convert to array and sort
    const sortedCategories = Array.from(categories).sort();
    
    // Check if we have highlighted projects
    const hasHighlighted = visibleItems.some(item => item.highlighted);
    
    // Generate desktop filter buttons
    const $filterList = $('.filter-list');
    if ($filterList.length) {
      $filterList.empty();
      
      // Always add "All" button
      $filterList.append(`
        <li class="filter-item">
          <button class="active" data-filter-btn>All</button>
        </li>
      `);
      
      // Add "Highlighted Projects" if any exist
      if (hasHighlighted) {
        $filterList.append(`
          <li class="filter-item">
            <button data-filter-btn>Highlighted Projects</button>
          </li>
        `);
      }
      
      // Add category buttons
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
      
      // Always add "All" option
      $selectList.append(`
        <li class="select-item">
          <button data-select-item>All</button>
        </li>
      `);
      
      // Add "Highlighted Projects" if any exist
      if (hasHighlighted) {
        $selectList.append(`
          <li class="select-item">
            <button data-select-item>Highlighted Projects</button>
          </li>
        `);
      }
      
      // Add category options
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

    // Filter only visible items
    const visibleItems = this.portfolioItems.filter(item => item.visible !== false);

    visibleItems.forEach(item => {
      const $item = this.createPortfolioItem(item);
      $projectList.append($item);
    });
  }

  /**
   * Create a single portfolio item element
   */
  createPortfolioItem(item) {
    const highlightedAttr = item.highlighted ? 'is-highlighted="yes"' : '';
    
    // Get the appropriate hover icon based on iconType
    const hoverIcon = this.getHoverIcon(item.iconType);
    
    // Create tags HTML
    let tagsHtml = '';
    if (item.tags && item.tags.length > 0) {
      item.tags.forEach((tag, index) => {
        const position = index === 0 ? 'corner-icon' : 
                        index === 1 ? 'corner-icon-new' : 
                        'corner-icon-new2';
        
        // Check if tag contains Unity or UE
        const isUnity = tag.toLowerCase().includes('unity');
        const isUE = tag.toLowerCase().includes('ue');
        
        if (isUnity) {
          tagsHtml += `<div class="${position}"><i class="fab fa-unity"></i></div>`;
        } else if (isUE) {
          tagsHtml += `<div class="${position}"><p style="color: white;">${tag}</p></div>`;
        } else {
          tagsHtml += `<div class="${position}"><p style="color: white;">${tag}</p></div>`;
        }
      });
    }

    return $(`
      <li data-value="${item.id}" class="project-item active" 
          data-filter-item 
          data-category="${item.category}" 
          ${highlightedAttr}>
        <a href="${item.link}" target="_blank">
          <figure class="project-img">
            <div class="project-item-icon-box">
              ${hoverIcon}
            </div>
            ${tagsHtml}
            <img src="${item.image}" alt="${item.title}" loading="lazy">
          </figure>
          <h3 class="project-title">${item.title}</h3>
          <p class="project-category">${this.capitalizeCategory(item.category)}</p>
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
    
    // Update button states
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
    
    // Close dropdown if open
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
    
    // Update filter buttons
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
$(function() {
  new PortfolioApp();
});
