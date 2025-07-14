'use strict';

function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const stored = localStorage.getItem('theme');
    if (stored === 'light') {
        body.classList.add('light-theme');
        if (toggleBtn) {
            toggleBtn.querySelector('ion-icon').setAttribute('name', 'sunny-outline');
        }
    }
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function () {
            body.classList.toggle('light-theme');
            const isLight = body.classList.contains('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            toggleBtn.querySelector('ion-icon').setAttribute('name', isLight ? 'sunny-outline' : 'moon-outline');
        });
    }
}

$(document).ready(function() {
    const version = new Date().getTime();
    
    // Load head and navbar sections
    $("#head-placeholder").load("head.html?v=" + version);
    $("#navbar-placeholder").load("navbar.html?v=" + version, initTheme);

    // Load sidebar and attach event listener after loading
    $("#sidebar-placeholder").load("sidebar.html", function() {
        console.log("sidebar loaded");
        // Attach toggle event to .info_more-btn after sidebar is loaded
        $("#sidebar-placeholder").on("click", ".info_more-btn", function() {
            $("this").toggleClass("active");
        });
    });

    // Load the about section initially
    $("#about-placeholder").load("about.html?v=" + version).show();

    // Attach click event for navbar links for page navigation
    $(document).on("click", ".navbar-link", function() {
        $(".navbar-link").removeClass("active");
        $(this).addClass("active");

        // Determine which section to load based on clicked link
        const page = $(this).text().trim().toLowerCase();

        // Hide all sections and load the selected one
        $(".content-section").hide();
        if (page === "about") {
            $("#about-placeholder").load("about.html?v=" + version).show();
        } else if (page === "resume") {
            $("#resume-placeholder").load("resume.html?v=" + version).show();
        } else if (page === "portfolio") {
            $("#portfolio-placeholder").load("portfolio.html?v=" + version).show();
        } else if (page === "contact") {
            $("#contact-placeholder").load("contact.html?v=" + version).show();
        } else if (page === "more") {
            $("#contact-placeholder").load("more.html?v=" + version).show();
        }
    });
});

// Additional functions
document.addEventListener("DOMContentLoaded", function () {
    // Sidebar variables and event listener
    const sidebar = document.querySelector("[data-sidebar]");
    const sidebarBtn = document.querySelector("[data-sidebar-btn]");
    
    if (sidebarBtn) {
        sidebarBtn.addEventListener("click", function () {
            if (sidebar) {
                sidebar.classList.toggle("active");
            }
        });
    }

    // Testimonials modal logic
    const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
    const modalContainer = document.querySelector("[data-modal-container]");
    const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
    const overlay = document.querySelector("[data-overlay]");

    if (modalContainer && overlay && modalCloseBtn) {
        const testimonialsModalFunc = function () {
            modalContainer.classList.toggle("active");
            overlay.classList.toggle("active");
        };

        testimonialsItem.forEach(item => {
            item.addEventListener("click", function () {
                const modalImg = document.querySelector("[data-modal-img]");
                const modalTitle = document.querySelector("[data-modal-title]");
                const modalText = document.querySelector("[data-modal-text]");

                if (modalImg && modalTitle && modalText) {
                    modalImg.src = item.querySelector("[data-testimonials-avatar]").src;
                    modalImg.alt = item.querySelector("[data-testimonials-avatar]").alt;
                    modalTitle.innerHTML = item.querySelector("[data-testimonials-title]").innerHTML;
                    modalText.innerHTML = item.querySelector("[data-testimonials-text]").innerHTML;
                }
                testimonialsModalFunc();
            });
        });

        modalCloseBtn.addEventListener("click", testimonialsModalFunc);
        overlay.addEventListener("click", testimonialsModalFunc);
    }

    // Skills sorting
    const skillsList = document.querySelector('.skills-list');
    if (skillsList) {
        const skillsItems = Array.from(skillsList.querySelectorAll('.skills-item'));
        skillsItems.sort((a, b) => a.querySelector('h5').innerText.localeCompare(b.querySelector('h5').innerText));
        skillsList.innerHTML = '';
        skillsItems.forEach(item => skillsList.appendChild(item));
    }

    // Project sorting logic
    const projectList = document.querySelector(".project-list");
    if (projectList) {
        const projectItems = Array.from(projectList.querySelectorAll(".project-item"));
        projectItems.sort((a, b) => {
            const categoryA = a.dataset.category.toLowerCase();
            const categoryB = b.dataset.category.toLowerCase();
            const valueA = parseInt(a.dataset.value, 10) || 0;
            const valueB = parseInt(b.dataset.value, 10) || 0;

            if (categoryA !== categoryB) return categoryA.localeCompare(categoryB);
            if (valueA !== valueB) return valueB - valueA;
            return a.querySelector(".project-title").textContent.localeCompare(b.querySelector(".project-title").textContent);
        });

        projectList.innerHTML = '';
        projectItems.forEach(item => projectList.appendChild(item));
    }
});

$(document).ready(function() {
    // Load head and navbar sections
    $("#head-placeholder").load("head.html");
    $("#navbar-placeholder").load("navbar.html", initTheme);

    // Load sidebar and attach event listener after loading
    $("#sidebar-placeholder").load("sidebar.html", function() {
        $("#sidebar-placeholder").on("click", ".info_more-btn", function() {
            $(".sidebar").toggleClass("active");
        });
    });

    // Load the about section initially
    $("#about-placeholder").load("about.html").show();

    // Attach click event for navbar links to navigate between sections
    $(document).on("click", ".navbar-link", function() {
        $(".navbar-link").removeClass("active");
        $(this).addClass("active");

        // Hide all sections and determine which one to show
        $(".content-section").hide();
        const page = $(this).text().trim().toLowerCase();

        if (page === "about") {
            $("#about-placeholder").load("about.html").show();
        } else if (page === "resume") {
            $("#resume-placeholder").load("resume.html").show();
        } else if (page === "portfolio") {
            $("#portfolio-placeholder").load("portfolio.html", function() {
                // Reinitialize filter functionality after loading portfolio.html
                initPortfolioFilters();
            }).show();
        } else if (page === "contact") {
            $("#contact-placeholder").load("contact.html").show();
        } else if (page === "more") {
            $("#contact-placeholder").load("more.html").show();
        }
    });

    // Define the filter functionality
    function initPortfolioFilters() {
        // Category selection event
        $(document).on("click", "[data-filter-btn]", function() {
            const selectedValue = $(this).text().toLowerCase();
            $("[data-filter-btn]").removeClass("active");
            $(this).addClass("active");
            filterFunc(selectedValue);
        });

        // Dropdown category selection event
        $(document).on("click", "[data-select-item]", function() {
            const selectedValue = $(this).text().toLowerCase();
            $("[data-selecct-value]").text($(this).text());
            $(".filter-select").toggleClass("active");
            filterFunc(selectedValue);
        });

        // Dropdown category selection event
        $(document).on("click", "[data-select]", function() {
            const selectedValue = $(this).text().toLowerCase();
            $("[data-selecct-value]").text($(this).text());
            $(".filter-select").toggleClass("active");
            
        });

        // Filtering function
        function filterFunc(selectedValue) {
            $("[data-filter-item]").each(function() {
                const category = $(this).data("category").toLowerCase();
                if (selectedValue === "all" || category === selectedValue) {
                    $(this).addClass("active");
                } else {
                    $(this).removeClass("active");
                }
            });
        }
    }

    document.addEventListener('DOMContentLoaded', function(){
        const glitchInterval = 3000;   // Trigger every 3000ms (3 seconds)
        const glitchDuration = 300;    // Glitch animation lasts 300ms
        const avatarBox = document.querySelector('.avatar-box');
        const baseImg = document.querySelector('.avatar-base');
        const glitchImg = document.querySelector('.avatar-glitch');
        
        // Define your two image sources
        const originalSrc = "./assets/images/avatar.png";
        const alternateSrc = "./assets/images/avatar2.png";  // Ensure this image exists in your assets folder
        
        // Set initial base image source
        if (baseImg) {
            baseImg.src = originalSrc;
        }
        
        // This flag will help toggle between the two images
        let isOriginal = true;
        
        // Function to trigger the glitch effect and swap the image
        function triggerGlitch() {
          if (avatarBox && baseImg && glitchImg) {
            const targetSrc = isOriginal ? alternateSrc : originalSrc;
            // Set the glitch overlay's source to the target image
            glitchImg.src = targetSrc;
            
            // Add the class to trigger the glitch animation on the overlay
            avatarBox.classList.add('glitch-active');
            
            // After the animation duration, update the base image and remove the glitch class
            setTimeout(() => {
              baseImg.src = targetSrc;
              avatarBox.classList.remove('glitch-active');
              // Toggle state for the next trigger
              isOriginal = !isOriginal;
            }, glitchDuration);
          }
        }
        
        // Trigger the glitch effect at regular intervals
        setInterval(triggerGlitch, glitchInterval);
        
        // Also trigger the glitch effect when the user hovers over the avatar
        if (avatarBox) {
          avatarBox.addEventListener('mouseenter', triggerGlitch);
        }
      });
      
      
      
});
