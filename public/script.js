// FAQ Toggle Function
function toggleFAQ(button) {
  const faqItem = button.closest('.faq-item');
  const answer = faqItem.querySelector('.faq-answer');
  const isActive = button.classList.contains('active');
  
  // Close all other FAQ items
  document.querySelectorAll('.faq-item').forEach(item => {
    if (item !== faqItem) {
      item.querySelector('.faq-question').classList.remove('active');
      item.querySelector('.faq-answer').classList.remove('active');
    }
  });
  
  // Toggle current FAQ item
  button.classList.toggle('active');
  answer.classList.toggle('active');
}

// Enhanced Navigation Functions
function toggleMenu() {
  const sliderMenu = document.querySelector('.slider-menu');
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  
  sliderMenu.classList.toggle('active');
  hamburgerMenu.classList.toggle('active');
}

// Enhanced mobile navigation with smooth animations
function toggleMobileMenu() {
  const mobileNav = document.querySelector('.mobile-nav');
  const hamburgerMenus = document.querySelectorAll('.hamburger-menu');
  const isActive = mobileNav.classList.contains('active');
  
  mobileNav.classList.toggle('active');
  
  // Toggle all hamburger menus with enhanced animation
  hamburgerMenus.forEach(menu => {
    menu.classList.toggle('active');
    // Update ARIA expanded state
    menu.setAttribute('aria-expanded', !isActive);
  });
  
  // Update ARIA attributes for accessibility
  mobileNav.setAttribute('aria-hidden', isActive);
  
  // Handle inert attribute for better accessibility
  if (!isActive) {
    // Menu is opening - remove inert to make elements interactive
    mobileNav.removeAttribute('inert');
  } else {
    // Menu is closing - add inert to make elements non-interactive
    mobileNav.setAttribute('inert', '');
  }
  
  // Prevent body scroll when mobile nav is open
  document.body.style.overflow = !isActive ? 'hidden' : '';
  
  // Close all dropdowns when mobile menu is closed
  if (isActive) {
    setTimeout(() => {
      closeAllMobileDropdowns();
    }, 300); // Wait for animation to complete
  }
  
  // Add smooth transition effect
  if (!isActive) {
    mobileNav.style.animation = 'slideInFromTop 0.3s ease-out';
  } else {
    mobileNav.style.animation = 'slideOutToTop 0.3s ease-in';
  }
}

// Close mobile menu without slide-out animation (for dropdown items)
function closeMobileMenu() {
  const mobileNav = document.querySelector('.mobile-nav');
  const hamburgerMenus = document.querySelectorAll('.hamburger-menu');
  
  if (mobileNav.classList.contains('active')) {
    mobileNav.classList.remove('active');
    
    // Toggle all hamburger menus
    hamburgerMenus.forEach(menu => {
      menu.classList.remove('active');
      menu.setAttribute('aria-expanded', 'false');
    });
    
    // Update ARIA attributes for accessibility
    mobileNav.setAttribute('aria-hidden', 'true');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Don't apply slide-out animation
    mobileNav.style.animation = '';
  }
}

// Enhanced smooth scrolling with offset for fixed navbar
function smoothScrollTo(targetId) {
  // Check if targetId is valid and not empty
  if (!targetId || targetId === '#' || targetId === '') {
    return;
  }
  
  const targetElement = document.querySelector(targetId);
  if (targetElement) {
    const navHeight = document.querySelector('.nav-bar-container').offsetHeight;
    const targetPosition = targetElement.offsetTop - navHeight - 20;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

// Enhanced active navigation state management
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-list a, .mobile-nav-menu a');
  const navHeight = document.querySelector('.nav-bar-container').offsetHeight;
  
  let currentSection = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - navHeight - 100;
    const sectionHeight = section.offsetHeight;
    
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });
  
  // Update active states
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

// Enhanced navbar scroll effect
function handleNavbarScroll() {
  const navbar = document.querySelector('.nav-bar-container');
  const scrollY = window.scrollY;
  
  if (scrollY > 100) {
    navbar.classList.add('solid');
  } else {
    navbar.classList.remove('solid');
  }
}

// Navigation button redirection
function goToInfo(type) {
  // Check if we're on the info.html page
  if (window.location.pathname.includes('info.html')) {
    // We're on info.html, so just switch sections
    // Hide all sections
    document.querySelectorAll('.mi-section').forEach(section => {
      section.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.mi-button').forEach(button => {
      button.classList.remove('active');
    });
    
    // Show the target section
    const targetSection = document.getElementById(type);
    if (targetSection) {
      targetSection.classList.add('active');
    }
    
    // Add active class to the clicked button
    const targetButton = document.querySelector(`[data-target="${type}"]`);
    if (targetButton) {
      targetButton.classList.add('active');
    }
    
    // Update dropdown if it exists
    const dropdown = document.getElementById('mi-dropdown');
    if (dropdown) {
      dropdown.value = type;
    }
  } else {
    // We're on another page, navigate to info.html with the type parameter
    window.location.href = `info.html?type=${type}`;
  }
}

// Handle smooth navigation without URL hash changes
function handleSmoothNavigation(e, href) {
  // Check if it's a hash link to a section on the same page
  if (href.includes('#') && href.includes('index.html')) {
    e.preventDefault();
    
    // Extract the section ID from the href
    const sectionId = href.split('#')[1];
    
    // Navigate to index.html first if we're not already there
    if (!window.location.pathname.includes('index.html') && window.location.pathname !== '/') {
      window.location.href = href;
      return;
    }
    
    // If we're already on index.html, scroll to the section smoothly
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
}

// Close mobile menu on link click
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll(".nav-list a").forEach(link => {
    link.addEventListener("click", (e) => {
      handleSmoothNavigation(e, link.getAttribute('href'));
      if (window.innerWidth < 992) toggleMenu();
    });
  });

  // Close mobile navigation on link click
  document.querySelectorAll(".mobile-nav-menu a").forEach(link => {
    link.addEventListener("click", (e) => {
      handleSmoothNavigation(e, link.getAttribute('href'));
      toggleMobileMenu();
    });
  });

  // Handle footer navigation links
  document.querySelectorAll(".footer a[href*='index.html#']").forEach(link => {
    link.addEventListener("click", (e) => {
      handleSmoothNavigation(e, link.getAttribute('href'));
    });
  });

  // Initialize info page functionality
  const dropdown = document.getElementById('mi-dropdown');
  if (dropdown) {
    dropdown.addEventListener('change', function() {
      goToInfo(this.value);
    });
  }

  // Add click event listeners to mi-buttons
  document.querySelectorAll('.mi-button').forEach(button => {
    button.addEventListener('click', function() {
      const target = this.getAttribute('data-target');
      goToInfo(target);
    });
  });

  // Navbar behavior on scroll
  const navbar = document.querySelector(".nav-bar-container");
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.classList.toggle("solid", window.scrollY > 50);
    });
  }
});

// Show the default section based on URL parameter or default to "criminal"
// Only run this on the info.html page
window.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes('info.html')) {
    const type = new URLSearchParams(window.location.search).get("type") || "criminal";
    goToInfo(type);
  }
});

// Modal functionality
function openConsultationModal() {
  const modal = document.getElementById('consultationModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Focus on first input
  setTimeout(() => {
    document.getElementById('modalName').focus();
  }, 300);
}

function closeConsultationModal() {
  const modal = document.getElementById('consultationModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
  
  // Reset form
  document.getElementById('consultationForm').reset();
}

function closeSuccessModal() {
  const modal = document.getElementById('successModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function showSuccessModal() {
  closeConsultationModal();
  const modal = document.getElementById('successModal');
  modal.classList.add('active');
}

function showPrivacyPolicy() {
  // Open privacy policy in a new window/tab
  window.open('privacy-policy.html', '_blank');
}

// Handle consultation form submission
document.addEventListener('DOMContentLoaded', function() {
  const consultationForm = document.getElementById('consultationForm');
  if (consultationForm) {
    consultationForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const submitBtn = this.querySelector('.modal-submit-btn, .new-modal-submit');
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoading = submitBtn.querySelector('.btn-loading');
      
      // Get form data
      const formData = new FormData(this);
      
      // Show loading state
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      btnText.style.display = 'none';
      btnLoading.style.display = 'flex';
      
      // Send form data
      const isLocalhost = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
      const formUrl = isLocalhost ? 'https://gp.od.ua/send_message.php' : 'send_message.php';
      
      fetch(formUrl, {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          showSuccessModal();
        } else {
          alert('Помилка: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Помилка при надсиланні форми. Спробуйте ще раз.');
      })
      .finally(() => {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
      });
    });
  }
  
  // Close modals when clicking outside
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
      if (e.target === this) {
        this.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
  
  // Close modals with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(modal => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  });
});

// Slider navigation with dots
function setupNavigation(wrapper, dotsContainer, totalItems, visibleItems) {
  if (!wrapper || !dotsContainer || totalItems === 0) return;
  const totalPages = Math.ceil(totalItems / visibleItems);

  for (let i = 0; i < totalPages; i++) {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      const scrollAmount = wrapper.scrollWidth / totalPages;
      wrapper.scrollTo({ left: scrollAmount * i, behavior: "smooth" });
      updateActiveDot(dotsContainer, i);
    });
    dotsContainer.appendChild(dot);
  }

  wrapper.addEventListener("scroll", () => {
    const page = Math.round(wrapper.scrollLeft / (wrapper.scrollWidth / totalPages));
    updateActiveDot(dotsContainer, page);
  });
}

function updateActiveDot(container, index) {
  container.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

// Arrow navigation
function setupArrowNavigation(wrapper, leftArrow, rightArrow, visibleItems) {
  if (!wrapper || !leftArrow || !rightArrow) return;
  const totalItems = wrapper.querySelectorAll(".team-member-card").length;
  const totalPages = Math.ceil(totalItems / visibleItems);
  let currentPage = 0;

  function scrollToPage(page) {
    const scrollAmount = wrapper.scrollWidth / totalPages;
    wrapper.scrollTo({ left: scrollAmount * page, behavior: "smooth" });
  }

  leftArrow.addEventListener("click", () => {
    if (currentPage > 0) scrollToPage(--currentPage);
  });
  rightArrow.addEventListener("click", () => {
    if (currentPage < totalPages - 1) scrollToPage(++currentPage);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupArrowNavigation(
    document.querySelector(".team-wrapper"),
    document.querySelector(".team-nav-arrows ion-icon[name='chevron-back-outline']"),
    document.querySelector(".team-nav-arrows ion-icon[name='chevron-forward-outline']"),
    4
  );

  setupNavigation(
    document.querySelector(".team-wrapper"),
    document.querySelector(".team-dots"),
    document.querySelectorAll(".team-member-card").length,
    4
  );

  setupNavigation(
    document.querySelector(".blog-container"),
    document.querySelector(".blog-dots"),
    document.querySelectorAll(".blog-card").length,
    3
  );
});

// FAQ toggle
document.querySelectorAll(".question").forEach(q => {
  q.addEventListener("click", () => q.classList.toggle("open"));
});


  // let currentLang = 'uk'; // Default

  // function changeLang(lang) {
  //   const select = document.querySelector('select.goog-te-combo');
  //   if (select) {
  //     select.value = lang;
  //     select.dispatchEvent(new Event('change'));
  //   }
  // }

  // document.getElementById('lang-toggle').addEventListener('click', () => {
  //   if (currentLang === 'uk') {
  //     currentLang = 'en';
  //     changeLang('en');
  //     document.getElementById('lang-toggle').innerHTML = `
  //       UA
  //       <img
  //         src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Flag_of_Ukraine.svg/1200px-Flag_of_Ukraine.svg.png"
  //         alt="Ukraine Flag"
  //         class="flag-icon"
  //       />
  //     `;
  //   } else {
  //     currentLang = 'uk';
  //     changeLang('uk');
  //     document.getElementById('lang-toggle').innerHTML = `
  //       EN
  //       <img
  //         src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg"
  //         alt="English Flag"
  //         class="flag-icon"
  //       />
  //     `;
  //   }
  // });



// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formMessage = document.getElementById('formMessage');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Show loading state
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      formMessage.style.display = 'none';
      
      // Get form data
      const formData = new FormData(contactForm);
      
      // Send form data
      const isLocalhost = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
      const formUrl = isLocalhost ? 'https://gp.od.ua/send_message.php' : 'send_message.php';
      
      fetch(formUrl, {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Hide loading state
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        
        // Show success modal or error message
        if (data.success) {
          contactForm.reset();
          showSuccessModal();
        } else {
          // Show error message
          formMessage.textContent = data.message;
          formMessage.className = 'form-message error';
          formMessage.style.display = 'block';
          
          // Scroll to message
          formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Hide message after 5 seconds
          setTimeout(() => {
            formMessage.style.display = 'none';
          }, 5000);
        }
      })
      .catch(error => {
        // Hide loading state
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        
        // Show error message
        let errorMessage = 'Помилка при надсиланні повідомлення. Спробуйте ще раз.';
        
        if (error.message.includes('403')) {
          errorMessage = 'Помилка доступу. Перевірте налаштування сервера.';
        } else if (error.message.includes('404')) {
          errorMessage = 'Файл обробки форми не знайдено.';
        } else if (error.message.includes('429')) {
          errorMessage = 'Занадто швидко. Зачекайте 10 секунд перед наступною спробою.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Помилка сервера. Спробуйте пізніше.';
        }
        
        formMessage.textContent = errorMessage;
        formMessage.className = 'form-message error';
        formMessage.style.display = 'block';
        
        console.error('Error:', error);
      });
    });
  }
});

// Enhanced Navigation Event Listeners and Initialization
document.addEventListener('DOMContentLoaded', function() {
  // Initialize navigation functionality
  initializeNavigation();
  
  // Add scroll event listeners for navbar effects
  window.addEventListener('scroll', function() {
    handleNavbarScroll();
    updateActiveNavLink();
  });
  
  // Add click event listeners for smooth scrolling
  const navLinks = document.querySelectorAll('.nav-list a, .mobile-nav-menu a');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href.startsWith('#') && href !== '#') {
        e.preventDefault();
        smoothScrollTo(href);
        
        // Close mobile menu if open, but not for dropdown items
        const mobileNav = document.querySelector('.mobile-nav');
        const isDropdownItem = this.closest('.mobile-dropdown-content');
        if (mobileNav.classList.contains('active') && !isDropdownItem) {
          closeMobileMenu();
        }
      }
    });
  });
  
  // Add specific event listeners for mobile dropdown items
  const mobileDropdownItems = document.querySelectorAll('.mobile-dropdown-content a');
  mobileDropdownItems.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href !== '#' && !href.startsWith('#')) {
        // For external links (like blog pages), close mobile menu after a short delay
        setTimeout(() => {
          closeMobileMenu();
        }, 100);
      } else if (href && href.startsWith('#') && href !== '#') {
        // For internal links, close mobile menu after navigation
        setTimeout(() => {
          closeMobileMenu();
        }, 500);
      }
    });
  });
  
  // Add keyboard navigation support
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const mobileNav = document.querySelector('.mobile-nav');
      if (mobileNav.classList.contains('active')) {
        toggleMobileMenu();
      }
    }
  });
});

// Initialize navigation functionality
function initializeNavigation() {
  // Set initial active state
  updateActiveNavLink();
  
  // Initialize mobile navigation
  initializeMobileNav();
  
  // Add smooth scrolling to all anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        smoothScrollTo(href);
      }
    });
  });
}

// Map
const map = L.map("map").setView([46.467533991007826, 30.75029661639775], 13);
L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
  attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  subdomains: "abcd",
  maxZoom: 19,
  minZoom: 10,
}).addTo(map);
L.marker([46.467533991007826, 30.75029661639775])
  .addTo(map)
  .bindPopup("Грищенко та Партнери")
  .openPopup();

// Mobile dropdown functionality
function toggleMobileDropdown(event, dropdownType) {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  
  // Prevent any scrolling
  event.returnValue = false;
  
  const dropdown = event.target.closest('.mobile-dropdown');
  const isActive = dropdown.classList.contains('active');
  
  // Close all other dropdowns
  document.querySelectorAll('.mobile-dropdown').forEach(dd => {
    if (dd !== dropdown) {
      dd.classList.remove('active');
      const otherTrigger = dd.querySelector('a');
      otherTrigger.setAttribute('aria-expanded', 'false');
    }
  });
  
  // Toggle current dropdown
  dropdown.classList.toggle('active');
  
  // Update ARIA attributes for accessibility
  const trigger = dropdown.querySelector('a');
  trigger.setAttribute('aria-expanded', !isActive);
  
  // Prevent any navigation and scrolling
  return false;
}

// Close mobile dropdowns when clicking outside
document.addEventListener('click', function(event) {
  if (!event.target.closest('.mobile-dropdown')) {
    document.querySelectorAll('.mobile-dropdown').forEach(dropdown => {
      dropdown.classList.remove('active');
      const trigger = dropdown.querySelector('a');
      trigger.setAttribute('aria-expanded', 'false');
    });
  }
});

// Close all dropdowns when mobile menu is closed
function closeAllMobileDropdowns() {
  document.querySelectorAll('.mobile-dropdown').forEach(dropdown => {
    dropdown.classList.remove('active');
    const trigger = dropdown.querySelector('a');
    trigger.setAttribute('aria-expanded', 'false');
  });
}

// Initialize mobile navigation state
function initializeMobileNav() {
  const mobileNav = document.querySelector('.mobile-nav');
  if (mobileNav) {
    // Set initial state - menu is closed, so it should be inert
    mobileNav.setAttribute('inert', '');
    mobileNav.setAttribute('aria-hidden', 'true');
  }
}

// Scroll to next section function
function scrollToNextSection() {
  const nextSection = document.getElementById('work-total-container');
  if (nextSection) {
    const navHeight = 80; // Height of the fixed navigation bar
    const elementPosition = nextSection.offsetTop;
    const offsetPosition = elementPosition - navHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}


