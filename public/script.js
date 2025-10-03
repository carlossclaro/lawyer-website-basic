// Awards Carousel Functions - Clean Version
let currentAwardIndex = 0;
const totalAwards = 7;

// Mobile Carousel Variables
let currentMobileAwardIndex = 0;
let isDragging = false;
let startX = 0;
let currentX = 0;
let initialTransform = 0;

function getAwardsPerView() {
  if (window.innerWidth >= 769) return 3; // Desktop: 3 awards
  if (window.innerWidth >= 481) return 2; // Tablet: 2 awards  
  return 1; // Mobile: 1 award
}

function getTotalSlides() {
  const awardsPerView = getAwardsPerView();
  const totalSlides = Math.ceil(totalAwards / awardsPerView);
  return Math.max(1, totalSlides); // Ensure at least 1 slide
}

// Initialize carousel on page load
function initializeCarousel() {
  const awardsContainer = document.querySelector('.awards-container');
  const dotsContainer = document.querySelector('.award-dots');
  const awardItems = document.querySelectorAll('.award-item');
  const mobileCarousel = document.querySelector('.awards-mobile-carousel');
  
  if (!awardsContainer || !dotsContainer || !awardItems.length) return;
  
  // Check if mobile
  if (window.innerWidth <= 480) {
    // Show mobile carousel, hide desktop carousel
    if (mobileCarousel) {
      mobileCarousel.style.display = 'block';
      initializeMobileCarousel();
    }
    awardsContainer.closest('.awards-carousel').style.display = 'none';
    dotsContainer.style.display = 'none';
    return;
  } else {
    // Show desktop carousel, hide mobile carousel
    if (mobileCarousel) mobileCarousel.style.display = 'none';
    awardsContainer.closest('.awards-carousel').style.display = 'flex';
    dotsContainer.style.display = 'flex';
  }
  
  // Reset to first slide
  currentAwardIndex = 0;
  
  // Clear existing dots
  dotsContainer.innerHTML = '';
  
  // Create dots for all awards (circular carousel)
  for (let i = 0; i < totalAwards; i++) {
    const dot = document.createElement('span');
    dot.className = 'dot';
    if (i === 0) dot.classList.add('active');
    dot.onclick = () => currentAward(i + 1);
    dotsContainer.appendChild(dot);
  }
  
  // Set initial positioning
  updateAwardPositions();
  
  // Debug info
  console.log(`Carousel initialized: ${getTotalSlides()} slides, ${getAwardsPerView()} awards per view, ${totalAwards} total awards`);
}

// Update award positions and styling - Circular carousel
function updateAwardPositions() {
  const awardItems = document.querySelectorAll('.award-item');
  
  // Remove all position classes
  awardItems.forEach(item => {
    item.classList.remove('active', 'prev', 'next');
  });
  
  // Show all awards but only highlight the current one
  // Note: awardItems[0] is duplicate of last award, awardItems[8] is duplicate of first award
  awardItems.forEach((item, index) => {
    if (index === currentAwardIndex + 1) { // +1 because first item is duplicate
      item.classList.add('active');
      console.log(`Award ${currentAwardIndex} is ACTIVE`);
    } else {
      // All other awards are visible but not prominent
      item.classList.add('prev');
    }
  });
  
  // Update carousel position for circular effect
  updateCircularCarouselPosition();
}

// Update circular carousel position
function updateCircularCarouselPosition() {
  const awardsContainer = document.querySelector('.awards-container');
  const awardsWrapper = document.querySelector('.awards-wrapper');
  
  if (!awardsContainer || !awardsWrapper) return;
  
  const itemWidth = window.innerWidth >= 769 ? 300 : window.innerWidth >= 481 ? 300 : 180;
  const gap = 24; // 1.5rem gap
  const totalItemWidth = itemWidth + gap;
  
  // Calculate the center position
  const wrapperWidth = awardsWrapper.offsetWidth;
  const centerOffset = (wrapperWidth - itemWidth) / 2;
  
  // Calculate how much to slide to center the current award
  // +1 because first item is duplicate, so we need to offset by one more position
  const slideOffset = (currentAwardIndex + 1) * totalItemWidth;
  
  awardsContainer.style.transform = `translateX(${centerOffset - slideOffset}px)`;
}


// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCarousel);

// Reinitialize on window resize
window.addEventListener('resize', () => {
  setTimeout(initializeCarousel, 100); // Small delay to ensure proper calculation
});

function changeAward(direction) {
  const dots = document.querySelectorAll('.dot');
  
  // Remove active class from current dot
  if (dots[currentAwardIndex]) {
    dots[currentAwardIndex].classList.remove('active');
  }
  
  // Calculate new index with circular navigation
  const newIndex = currentAwardIndex + direction;
  
  // Circular navigation - wrap around
  if (newIndex >= totalAwards) {
    currentAwardIndex = 0; // Go to first award
  } else if (newIndex < 0) {
    currentAwardIndex = totalAwards - 1; // Go to last award
  } else {
    currentAwardIndex = newIndex;
  }
  
  // Update award positions and styling
  updateAwardPositions();
  
  // Add active class to new dot
  if (dots[currentAwardIndex]) {
    dots[currentAwardIndex].classList.add('active');
  }
}

function currentAward(index) {
  const dots = document.querySelectorAll('.dot');
  
  // Remove active class from current dot
  if (dots[currentAwardIndex]) {
    dots[currentAwardIndex].classList.remove('active');
  }
  
  // Set new index (index is 1-based, so subtract 1)
  currentAwardIndex = index - 1;
  
  // Ensure index is within bounds
  if (currentAwardIndex >= totalAwards) {
    currentAwardIndex = totalAwards - 1;
  } else if (currentAwardIndex < 0) {
    currentAwardIndex = 0;
  }
  
  // Update award positions and styling
  updateAwardPositions();
  
  // Add active class to new dot
  if (dots[currentAwardIndex]) {
    dots[currentAwardIndex].classList.add('active');
  }
}

// Auto-rotate awards every 5 seconds (only if carousel is properly initialized)
let autoRotateInterval;

function startAutoRotate() {
  if (autoRotateInterval) clearInterval(autoRotateInterval);
  autoRotateInterval = setInterval(() => {
    const awardsContainer = document.querySelector('.awards-container');
    if (awardsContainer) {
      changeAward(1);
    }
  }, 5000);
}

// Start auto-rotate after initialization
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(startAutoRotate, 1000);
});

// FAQ Toggle Function
function toggleFAQ(button) {
  const faqItem = button.closest('.faq-item');
  const answer = faqItem.querySelector('.faq-answer');
  const icon = button.querySelector('.faq-icon');
  const isActive = button.classList.contains('active');
  
  // Close all other FAQ items
  document.querySelectorAll('.faq-item').forEach(item => {
    if (item !== faqItem) {
      item.querySelector('.faq-question').classList.remove('active');
      item.querySelector('.faq-answer').classList.remove('active');
      item.querySelector('.faq-icon').textContent = '+';
    }
  });
  
  // Toggle current FAQ item
  button.classList.toggle('active');
  answer.classList.toggle('active');
  
  // Update icon
  if (button.classList.contains('active')) {
    icon.textContent = '-';
  } else {
    icon.textContent = '+';
  }
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

// Show the default section based on URL parameter or default to "urgent-legal-assistance"
// Only run this on the info.html page
window.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes('info.html')) {
    const type = new URLSearchParams(window.location.search).get("type") || "urgent-legal-assistance";
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
      
      // Combine phone code and number
      const phoneCode = document.getElementById('modalPhoneCode')?.value || '+380';
      const phoneNumber = document.getElementById('modalPhone')?.value || '';
      const fullPhone = phoneCode + phoneNumber;
      
      // Update form data with combined phone
      formData.set('phone', fullPhone);
      
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

// Enhanced Navigation Event Listeners and Initializationawa
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

// Scroll Animation Functions
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.scroll-animate, .scroll-animate-fade, .scroll-animate-slide-left, .scroll-animate-slide-right, .scroll-animate-scale');
  
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Mobile detection
  const isMobile = window.innerWidth <= 768;
  
  // Create intersection observer with mobile-optimized settings
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Reduced delay on mobile for better performance
        const delay = isMobile ? 50 : 100;
        
        setTimeout(() => {
          entry.target.classList.add('animate-in');
        }, delay);
      }
    });
  }, {
    threshold: isMobile ? 0.05 : 0.1, // Lower threshold on mobile for earlier triggering
    rootMargin: isMobile ? '0px 0px -20px 0px' : '0px 0px -50px 0px' // Less margin on mobile
  });

  // Observe all animated elements
  animatedElements.forEach(element => {
    observer.observe(element);
  });
  
  // Handle reduced motion preference
  if (prefersReducedMotion) {
    // Immediately show all elements without animation
    animatedElements.forEach(element => {
      element.classList.add('animate-in');
    });
  }
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initScrollAnimations();
});

// Mobile Carousel Functions
function initializeMobileCarousel() {
  const mobileCarouselContainer = document.querySelector('.mobile-carousel-container');
  const mobileDots = document.querySelectorAll('.mobile-dot');
  
  if (!mobileCarouselContainer) {
    console.log('Mobile carousel container not found');
    return;
  }
  
  console.log('Initializing mobile carousel with', mobileDots.length, 'dots');
  
  // Reset variables
  currentMobileAwardIndex = 0;
  isDragging = false;
  
  // Add touch event listeners
  mobileCarouselContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
  mobileCarouselContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
  mobileCarouselContainer.addEventListener('touchend', handleTouchEnd, { passive: false });
  
  // Add mouse event listeners for desktop testing
  mobileCarouselContainer.addEventListener('mousedown', handleMouseDown);
  mobileCarouselContainer.addEventListener('mousemove', handleMouseMove);
  mobileCarouselContainer.addEventListener('mouseup', handleMouseUp);
  mobileCarouselContainer.addEventListener('mouseleave', handleMouseUp);
  
  // Add click event listeners to dots
  mobileDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      console.log('Dot clicked:', index);
      goToMobileSlide(index);
    });
  });
  
  // Set initial position
  updateMobileCarouselPosition();
  console.log('Mobile carousel initialized');
}

function handleTouchStart(e) {
  console.log('Touch start');
  isDragging = true;
  startX = e.touches[0].clientX;
  const mobileCarouselContainer = document.querySelector('.mobile-carousel-container');
  const transform = mobileCarouselContainer.style.transform;
  initialTransform = transform ? parseFloat(transform.match(/-?\d+\.?\d*/)[0]) : 0;
  console.log('Start X:', startX, 'Initial transform:', initialTransform);
}

function handleTouchMove(e) {
  if (!isDragging) return;
  
  e.preventDefault();
  currentX = e.touches[0].clientX;
  const diffX = currentX - startX;
  const mobileCarouselContainer = document.querySelector('.mobile-carousel-container');
  
  // Convert pixel difference to percentage
  const containerWidth = mobileCarouselContainer.parentElement.offsetWidth;
  const diffPercent = (diffX / containerWidth) * 100;
  
  // Apply the drag transform
  mobileCarouselContainer.style.transform = `translateX(${initialTransform + diffPercent}%)`;
}

function handleTouchEnd(e) {
  if (!isDragging) return;
  
  console.log('Touch end');
  isDragging = false;
  const diffX = currentX - startX;
  const mobileCarouselContainer = document.querySelector('.mobile-carousel-container');
  const containerWidth = mobileCarouselContainer.parentElement.offsetWidth;
  const threshold = containerWidth * 0.15; // 15% of container width
  
  console.log('Diff X:', diffX, 'Threshold:', threshold);
  
  if (Math.abs(diffX) > threshold) {
    if (diffX > 0) {
      // Swipe right - go to previous slide
      console.log('Swipe right - going to previous slide');
      goToMobileSlide(currentMobileAwardIndex - 1);
    } else {
      // Swipe left - go to next slide
      console.log('Swipe left - going to next slide');
      goToMobileSlide(currentMobileAwardIndex + 1);
    }
  } else {
    // Snap back to current position
    console.log('Snap back to current position');
    updateMobileCarouselPosition();
  }
}

function handleMouseDown(e) {
  isDragging = true;
  startX = e.clientX;
  const mobileCarouselContainer = document.querySelector('.mobile-carousel-container');
  const transform = mobileCarouselContainer.style.transform;
  initialTransform = transform ? parseFloat(transform.match(/-?\d+\.?\d*/)[0]) : 0;
  e.preventDefault();
}

function handleMouseMove(e) {
  if (!isDragging) return;
  
  e.preventDefault();
  currentX = e.clientX;
  const diffX = currentX - startX;
  const mobileCarouselContainer = document.querySelector('.mobile-carousel-container');
  
  // Convert pixel difference to percentage
  const containerWidth = mobileCarouselContainer.parentElement.offsetWidth;
  const diffPercent = (diffX / containerWidth) * 100;
  
  // Apply the drag transform
  mobileCarouselContainer.style.transform = `translateX(${initialTransform + diffPercent}%)`;
}

function handleMouseUp(e) {
  if (!isDragging) return;
  
  isDragging = false;
  const diffX = currentX - startX;
  const mobileCarouselContainer = document.querySelector('.mobile-carousel-container');
  const containerWidth = mobileCarouselContainer.parentElement.offsetWidth;
  const threshold = containerWidth * 0.15; // 15% of container width
  
  if (Math.abs(diffX) > threshold) {
    if (diffX > 0) {
      // Swipe right - go to previous slide
      goToMobileSlide(currentMobileAwardIndex - 1);
    } else {
      // Swipe left - go to next slide
      goToMobileSlide(currentMobileAwardIndex + 1);
    }
  } else {
    // Snap back to current position
    updateMobileCarouselPosition();
  }
}

function goToMobileSlide(index) {
  const totalSlides = document.querySelectorAll('.mobile-award-item').length;
  console.log('Going to slide:', index, 'Total slides:', totalSlides);
  
  // Handle circular navigation
  if (index < 0) {
    currentMobileAwardIndex = totalSlides - 1;
  } else if (index >= totalSlides) {
    currentMobileAwardIndex = 0;
  } else {
    currentMobileAwardIndex = index;
  }
  
  console.log('Current index set to:', currentMobileAwardIndex);
  updateMobileCarouselPosition();
  updateMobileDots();
}

function updateMobileCarouselPosition() {
  const mobileCarouselContainer = document.querySelector('.mobile-carousel-container');
  if (!mobileCarouselContainer) return;
  
  // Calculate the width of each slide including margins
  const slideWidth = 100; // Each slide is 100% width
  const translateX = -(currentMobileAwardIndex * slideWidth);
  
  console.log('Updating position - Index:', currentMobileAwardIndex, 'TranslateX:', translateX);
  mobileCarouselContainer.style.transform = `translateX(${translateX}%)`;
}

function updateMobileDots() {
  const mobileDots = document.querySelectorAll('.mobile-dot');
  mobileDots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentMobileAwardIndex);
  });
}


