'use strict';

/**
 * Portfolio Website - Main JavaScript
 * Clean, organized, and efficient
 */

class PortfolioApp {
  constructor() {
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
        callback: () => this.initPortfolioFilters()
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
