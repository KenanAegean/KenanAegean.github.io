/**
 * Project Detail Page - Modern Enhanced Version with Lightbox
 * 
 * Supports beautiful, modern project showcase pages with:
 * - Simplified header section
 * - Tech stack badges
 * - Feature lists
 * - Screenshot galleries with fullscreen lightbox
 * - Project links/CTAs
 * - Animations
 */

'use strict';

class ProjectDetailPage {
  constructor() {
    this.dataVersion = '1.0.9';
    this.projectId = null;
    this.projectData = null;
    this.siteConfig = null;
    this.socialLinks = [];
    this.lightboxImages = [];
    this.currentImageIndex = 0;
    this.init();
  }

  async init() {
    // Load site data for sidebar
    await this.loadSiteData();
    
    // Render sidebar dynamically
    this.renderSidebar();
    
    // Get project ID from URL
    this.projectId = this.getProjectIdFromUrl();
    
    if (!this.projectId) {
      this.showError('No project ID specified');
      return;
    }

    // Load project data
    await this.loadProjectData();
    
    if (this.projectData) {
      this.renderProject();
      this.initLightbox();
    } else {
      this.showError('Project not found');
    }
  }

  getCacheBustedUrl(url) {
    return `${url}?v=${this.dataVersion}`;
  }

  /**
   * Load site configuration and social links
   */
  async loadSiteData() {
    try {
      const [siteConfig, socialLinks] = await Promise.all([
        fetch(this.getCacheBustedUrl('../assets/data/site-config.json')).then(r => r.json()),
        fetch(this.getCacheBustedUrl('../assets/data/social-links.json')).then(r => r.json())
      ]);

      this.siteConfig = siteConfig;
      this.socialLinks = socialLinks.filter(link => link.visible !== false);
    } catch (error) {
      console.error('Error loading site data:', error);
    }
  }

  /**
   * Render sidebar with correct paths
   */
  renderSidebar() {
    if (!this.siteConfig) return;

    const config = this.siteConfig.personal;
    const external = this.siteConfig.external;
    
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
              <a href="../index.html">
                <img src="../${config.avatar}" alt="${config.name}" class="avatar-base" width="80" style="border-radius: 30px;">
              </a>
            </figure>
          </div>
          
          <div class="info-content">
            <a href="../index.html"><h1 class="name" title="${config.name}">${config.name} 👾</h1></a>
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
                <a class="contact-link">${config.nickname || external.steamUsername}</a>
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
    this.setupSidebarToggle();
  }

  setupSidebarToggle() {
    $(document).on('click', '[data-sidebar-toggle]', () => {
      $('[data-sidebar]').toggleClass('active');
    });
  }

  getProjectIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
  }

  async loadProjectData() {
    try {
      const response = await fetch(this.getCacheBustedUrl('../assets/data/project-details.json'));
      const allProjects = await response.json();
      this.projectData = allProjects[this.projectId];
    } catch (error) {
      console.error('Error loading project data:', error);
      this.projectData = null;
    }
  }

  /**
   * Render the complete modern project page
   */
  renderProject() {
    const project = this.projectData;

    // Set page title
    document.title = `${project.title} | Kenan EGE`;
    $('#page-title').text(`${project.title} | Kenan EGE`);

    // Set back link
    $('#back-link').attr('href', project.backLink);

    // Render simplified header section
    if (project.hero) {
      this.renderHeaderSection(project.hero);
    } else {
      // Fallback to simple title
      $('#project-main-title').text(project.title);
      $('#project-header').show();
    }

    // Render logo if exists
    if (project.logo) {
      $('#logo-section').show();
      $('#project-logo').attr('src', project.logo).attr('alt', project.logoAlt || project.title);
    }

    // Render project links if available
    if (project.links && project.links.length > 0) {
      this.renderProjectLinks(project.links);
    }

    // Render sections
    const $content = $('#project-content');
    $content.empty();

    project.sections.forEach((section, index) => {
      let sectionHtml = '';
      
      switch (section.type) {
        case 'text':
          sectionHtml = this.renderTextSection(section);
          break;
        case 'list':
          sectionHtml = this.renderListSection(section);
          break;
        case 'features':
          sectionHtml = this.renderFeaturesSection(section);
          break;
        case 'screenshots':
          sectionHtml = this.renderScreenshotsSection(section);
          break;
        case 'info-cards':
          sectionHtml = this.renderInfoCards(section);
          break;
      }
      
      if (sectionHtml) {
        const $section = $(sectionHtml);
        $section.css('animation-delay', `${0.1 * (index + 4)}s`);
        $content.append($section);
      }
    });
  }

  /**
   * Render simplified header section
   */
  renderHeaderSection(hero) {
    $('#project-header').show();
    
    $('#project-main-title').text(hero.title);
    
    if (hero.subtitle) {
      $('#project-subtitle').text(hero.subtitle);
    }

    // Render metadata in a cleaner way
    if (hero.metadata && hero.metadata.length > 0) {
      const metaHtml = hero.metadata.map(meta => `
        <div class="project-meta-item">
          <ion-icon name="${meta.icon}"></ion-icon>
          <span>${meta.value}</span>
        </div>
      `).join('');
      $('#project-meta').html(metaHtml);
    }

    // Render tech stack badges
    if (hero.techStack && hero.techStack.length > 0) {
      const techHtml = hero.techStack.map(tech => {
        let iconHtml = '';
        if (tech.icon) {
          if (tech.iconType === 'devicon') {
            iconHtml = `<i class="${tech.icon}"></i>`;
          } else if (tech.iconType === 'fontawesome') {
            iconHtml = `<i class="fa-brands ${tech.icon}"></i>`;
          } else {
            iconHtml = `<ion-icon name="${tech.icon}"></ion-icon>`;
          }
        }
        return `
          <div class="tech-badge">
            ${iconHtml}
            <span>${tech.name}</span>
          </div>
        `;
      }).join('');
      
      $('#tech-badges').html(techHtml);
      $('#tech-stack').show();
    }
  }

  /**
   * Render project links/CTAs
   */
  renderProjectLinks(links) {
    const linksHtml = links.map(link => {
      const btnClass = link.primary ? 'project-link-btn' : 'project-link-btn secondary';
      return `
        <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="${btnClass}">
          <ion-icon name="${link.icon}"></ion-icon>
          <span>${link.label}</span>
        </a>
      `;
    }).join('');
    
    $('#project-links').html(linksHtml).show();
  }

  /**
   * Render text section
   */
  renderTextSection(section) {
    let html = '<section class="project-section animate-in">';
    if (section.heading) {
      html += `<h2 class="project-section-title">${section.heading}</h2>`;
    }
    html += `<div class="project-text">${section.content}</div>`;
    html += '</section>';
    return html;
  }

  /**
   * Render list section
   */
  renderListSection(section) {
    let html = '<section class="project-section animate-in">';
    if (section.heading) {
      html += `<h2 class="project-section-title">${section.heading}</h2>`;
    }
    html += '<ul class="feature-list">';
    section.items.forEach(item => {
      html += `
        <li class="feature-item">
          <div class="feature-icon">
            <ion-icon name="checkmark-circle"></ion-icon>
          </div>
          <div class="feature-content">
            <p class="feature-text">${item}</p>
          </div>
        </li>
      `;
    });
    html += '</ul>';
    html += '</section>';
    return html;
  }

  /**
   * Render features section
   */
  renderFeaturesSection(section) {
    let html = '<section class="project-section animate-in">';
    if (section.heading) {
      html += `<h2 class="project-section-title">${section.heading}</h2>`;
    }
    html += '<div class="feature-list">';
    section.features.forEach(feature => {
      html += `
        <div class="feature-item">
          <div class="feature-icon">
            <ion-icon name="${feature.icon || 'star'}"></ion-icon>
          </div>
          <div class="feature-content">
            <p class="feature-text"><strong>${feature.title}:</strong> ${feature.description}</p>
          </div>
        </div>
      `;
    });
    html += '</div>';
    html += '</section>';
    return html;
  }

  /**
   * Render screenshots section with lightbox support
   */
  renderScreenshotsSection(section) {
    let html = '<section class="screenshot-gallery animate-in">';
    
    if (section.heading) {
      html += `<h2 class="gallery-title">${section.heading}</h2>`;
    }

    const hasMany = section.images.length > 4 ? ' has-many' : '';
    html += `<div class="gallery-grid${hasMany}">`;
    
    section.images.forEach((img, index) => {
      html += `
        <div class="gallery-item" data-lightbox-index="${this.lightboxImages.length}">
          <img src="${img.src}" alt="${img.alt}" loading="lazy" class="gallery-image">
          <div class="gallery-overlay">
            <ion-icon name="expand-outline" class="gallery-expand-icon"></ion-icon>
          </div>
          ${img.caption ? `<div class="gallery-caption">${img.caption}</div>` : ''}
        </div>
      `;
      
      // Store image data for lightbox
      this.lightboxImages.push({
        src: img.src,
        alt: img.alt,
        caption: img.caption || ''
      });
    });
    
    html += '</div>';
    html += '</section>';
    return html;
  }

  /**
   * Render info cards section
   */
  renderInfoCards(section) {
    let html = '<section class="project-section animate-in">';
    if (section.heading) {
      html += `<h2 class="project-section-title">${section.heading}</h2>`;
    }
    html += '<div class="info-cards">';
    section.cards.forEach(card => {
      html += `
        <div class="info-card">
          <ion-icon name="${card.icon}" class="info-card-icon"></ion-icon>
          <div class="info-card-title">${card.title}</div>
          <div class="info-card-value">${card.value}</div>
        </div>
      `;
    });
    html += '</div>';
    html += '</section>';
    return html;
  }

  /**
   * Initialize lightbox functionality
   */
  initLightbox() {
    const self = this;
    
    // Click on gallery item to open lightbox
    $(document).on('click', '.gallery-item', function() {
      const index = parseInt($(this).data('lightbox-index'));
      self.openLightbox(index);
    });

    // Close lightbox
    $('.lightbox-close').on('click', () => this.closeLightbox());
    
    // Click outside image to close
    $('#lightbox').on('click', function(e) {
      if (e.target === this) {
        self.closeLightbox();
      }
    });

    // Navigation buttons
    $('.lightbox-prev').on('click', () => this.prevImage());
    $('.lightbox-next').on('click', () => this.nextImage());

    // Keyboard navigation
    $(document).on('keydown', (e) => {
      if ($('#lightbox').hasClass('active')) {
        if (e.key === 'Escape') this.closeLightbox();
        if (e.key === 'ArrowLeft') this.prevImage();
        if (e.key === 'ArrowRight') this.nextImage();
      }
    });
  }

  /**
   * Open lightbox at specific image
   */
  openLightbox(index) {
    this.currentImageIndex = index;
    this.updateLightboxImage();
    $('#lightbox').addClass('active');
    $('body').css('overflow', 'hidden');
  }

  /**
   * Close lightbox
   */
  closeLightbox() {
    $('#lightbox').removeClass('active');
    $('body').css('overflow', '');
  }

  /**
   * Show previous image
   */
  prevImage() {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.lightboxImages.length) % this.lightboxImages.length;
    this.updateLightboxImage();
  }

  /**
   * Show next image
   */
  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.lightboxImages.length;
    this.updateLightboxImage();
  }

  /**
   * Update lightbox image and caption
   */
  updateLightboxImage() {
    const img = this.lightboxImages[this.currentImageIndex];
    $('#lightbox-image').attr('src', img.src).attr('alt', img.alt);
    $('#lightbox-caption').text(img.caption);
    $('#lightbox-counter').text(`${this.currentImageIndex + 1} / ${this.lightboxImages.length}`);
  }

  /**
   * Show error message
   */
  showError(message) {
    $('#project-main-title').text('Error 👾');
    $('#project-header').show();
    $('#project-content').html(`
      <section class="project-section animate-in">
        <p class="project-text">${message}</p>
        <p class="project-text"><a href="../index.html" style="color:var(--orange-yellow-crayola);">← Return to Portfolio</a></p>
      </section>
    `);
  }
}

// Initialize when DOM is ready
$(function() {
  new ProjectDetailPage();
});
