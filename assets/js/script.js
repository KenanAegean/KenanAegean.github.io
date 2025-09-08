'use strict';

$(function () {
  const version = Date.now();

  /** ---------------------------
   *  Helpers
   *  ---------------------------
   */
  const $sections = $('.content-section');

  function hideAllSections() {
    $sections.hide();
  }

  function isMarkedHighlighted($el) {
    // supports either is-highlighted="yes"/"true"/"" OR data-highlighted="true"
    const raw = ($el.attr('is-highlighted') ?? $el.data('highlighted'));
    if (raw === undefined) return false;
    const v = String(raw).toLowerCase();
    return v === '' || v === 'yes' || v === 'true' || v === '1';
  }

  function loadSection(page) {
    hideAllSections();

    switch (page) {
      case 'about':
        $('#about-placeholder').load(`about.html?v=${version}`, () => {
          $('#about-placeholder').show();
        });
        break;

      case 'resume':
        $('#resume-placeholder').load(`resume.html?v=${version}`, () => {
          $('#resume-placeholder').show();
          sortSkills(); // resume-only tidy, harmless
        });
        break;

      case 'portfolio':
        $('#portfolio-placeholder').load(`portfolio.html?v=${version}`, () => {
          $('#portfolio-placeholder').show();

          const $scope = $('#portfolio-placeholder');
          const hasHighlighted = $scope.find('[data-filter-item]').filter(function () {
            return isMarkedHighlighted($(this));
          }).length > 0;

          const initial = hasHighlighted ? 'Highlighted Projects' : 'All';
          setSelectLabel(initial);
          applyFilter(initial);

          // reflect in the top filter buttons if present
          const $btns = $scope.find('[data-filter-btn]');
          if ($btns.length) {
            $btns.removeClass('active');
            $btns.filter(function () {
              return $(this).text().trim().toLowerCase() === initial.toLowerCase();
            }).addClass('active');
          }
        });
        break;

      case 'contact':
        $('#contact-placeholder').load(`contact.html?v=${version}`, () => {
          $('#contact-placeholder').show();
        });
        break;

      case 'more':
        $('#more-placeholder').load(`more.html?v=${version}`, () => {
          $('#more-placeholder').show();
        });
        break;

      default:
        // fallback to portfolio
        loadSection('portfolio');
        break;
    }
  }

  function setSelectLabel(text) {
    const $lbl = $('[data-selecct-value]'); // matches your HTML attribute (double 'c')
    if ($lbl.length) $lbl.text(text);
  }

  function sortSkills() {
    const list = document.querySelector('.skills-list');
    if (!list) return;
    const items = Array.from(list.querySelectorAll('.skills-item'));
    items.sort((a, b) =>
      a.querySelector('h5').innerText.localeCompare(b.querySelector('h5').innerText)
    );
    list.innerHTML = '';
    items.forEach(li => list.appendChild(li));
  }

  function applyFilter(selected) {
    const val = (selected || 'all').toLowerCase();

    $('[data-filter-item]').each(function () {
      const $item = $(this);
      const cat = String($item.data('category') || '').toLowerCase();

      const show =
        val === 'all' ||
        (val === 'highlighted projects' && isMarkedHighlighted($item)) ||
        cat === val;

      $item.toggleClass('active', show);
    });
  }

  $(document).on('click', '[data-filter-btn]', function () {
    const chosen = $(this).text().trim();
    $('[data-filter-btn]').removeClass('active');
    $(this).addClass('active');

    setSelectLabel(chosen);
    applyFilter(chosen);

    // close the custom select if it was open
    $('.filter-select').removeClass('active');
  });

  /** ---------------------------
   *  Static parts load
   *  ---------------------------
   */
  $('#head-placeholder').load(`head.html?v=${version}`);
  $('#navbar-placeholder').load(`navbar.html?v=${version}`, () => {
    // Ensure Portfolio is active on first load
    $('.navbar-link').removeClass('active');
    $('.navbar-link').filter(function () {
      return $(this).text().trim().toLowerCase() === 'portfolio';
    }).addClass('active');

    loadSection('portfolio');
  });
  $('#sidebar-placeholder').load(`sidebar.html?v=${version}`);

  /** ---------------------------
   *  Delegated global handlers
   *  ---------------------------
   */

  // Navbar router (works for loaded navbar.html)
  $(document).on('click', '.navbar-link', function () {
    $('.navbar-link').removeClass('active');
    $(this).addClass('active');

    const page = $(this).text().trim().toLowerCase();
    loadSection(page);
  });

  // Sidebar “Show Details” toggle (works for loaded sidebar.html)
  $(document).on('click', '[data-sidebar-btn]', function () {
    $('[data-sidebar]').toggleClass('active');
  });

  // Portfolio filters (buttons row)
  $(document).on('click', '[data-filter-btn]', function () {
    const chosen = $(this).text().trim();
    $('[data-filter-btn]').removeClass('active');
    $(this).addClass('active');

    setSelectLabel(chosen);
    applyFilter(chosen);
  });

  // Custom select: open/close
  $(document).on('click', '[data-select]', function (e) {
    e.stopPropagation();
    $(this).toggleClass('active');
  });

  // Custom select: choose an item
  $(document).on('click', '[data-select-item]', function () {
    const chosen = $(this).text().trim();
    setSelectLabel(chosen);
    $('.filter-select').removeClass('active');

    // also reflect on the top filter buttons if they exist
    $('[data-filter-btn]').each(function () {
      const same = $(this).text().trim().toLowerCase() === chosen.toLowerCase();
      $(this).toggleClass('active', same);
    });

    applyFilter(chosen);
  });

  // Close custom select if clicking elsewhere
  $(document).on('click', function () {
    $('.filter-select').removeClass('active');
  });

  /** ---------------------------
   *  Removed: glitch/animation code
   *  ---------------------------
   */
});
