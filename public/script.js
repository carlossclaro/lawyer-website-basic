document.addEventListener('DOMContentLoaded', () => {
  

    const slideUpElements = document.querySelectorAll('.slide-up');
   
    const checkSlide = () => {
      slideUpElements.forEach((element) => {
        // Get the position of the element relative to the viewport
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
  
        // Check if the element is in the viewport
        const isElementVisible = elementTop < window.innerHeight && elementBottom >= 0;
  
        if (isElementVisible) {
          element.classList.add('active');
        } else {
          element.classList.remove('active'); // Optional: Remove the class if you want the animation to reset  
        }
      });
    };
  
    // Run the check on page load
    checkSlide();
  
    // Run the check on scroll
    window.addEventListener('scroll', checkSlide);
    function throttle(func, limit) {
      let inThrottle;
      return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => (inThrottle = false), limit);
        }
      };
    }
    
    window.addEventListener('scroll', throttle(checkSlide, 100)); // Throttle to 100ms

  // Function to set up navigation for carousels
  function setupNavigation(wrapper, dotsContainer, totalItems, visibleItems) {
    if (!wrapper || !dotsContainer || totalItems === 0) return;

    const totalPages = Math.ceil(totalItems / visibleItems);

    // Create dots
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => {
        scrollToPage(wrapper, dotsContainer, totalPages, i);
      });
      dotsContainer.appendChild(dot);
    }

    // Sync active dots with scroll
    wrapper.addEventListener("scroll", () => {
      updateActiveDot(wrapper, dotsContainer, totalPages);
    });
  }

  // Function to scroll to a specific page
  function scrollToPage(wrapper, dotsContainer, totalPages, page) {
    const scrollAmount = wrapper.scrollWidth / totalPages;
    wrapper.scrollTo({ left: scrollAmount * page, behavior: "smooth" });

    // Immediately update active dot after clicking
    setTimeout(() => {
      updateActiveDot(wrapper, dotsContainer, totalPages);
    }, 100);
  }

  // Function to update the active dot
  function updateActiveDot(wrapper, dotsContainer, totalPages) {
    const scrollLeft = wrapper.scrollLeft;
    const currentPage = Math.round(scrollLeft / (wrapper.scrollWidth / totalPages));

    // Update only the dots for the current section
    const dots = dotsContainer.querySelectorAll(".dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentPage);
    });
  }

  // Team Navigation
  setupNavigation(
    document.querySelector(".team-wrapper"),
    document.querySelector(".team-dots"),
    document.querySelectorAll(".team-member-card").length,
    3
  );

  // Blog Navigation
  setupNavigation(
    document.querySelector(".blog-container"),
    document.querySelector(".blog-dots"),
    document.querySelectorAll(".blog-card").length,
    3
  );

  // FAQ Section: Toggle open/close for questions
  const questions = document.querySelectorAll('.question');
  questions.forEach((question) => {
    question.addEventListener('click', function () {
      question.classList.toggle('open');
    });
  });

  // Smooth scroll to sections on arrow key press
  document.addEventListener('keydown', (event) => {
    const sections = document.querySelectorAll('section');
    const currentSection = document.querySelector('section.active');
    let currentIndex = Array.from(sections).indexOf(currentSection);

    if (event.key === 'ArrowDown' && currentIndex < sections.length - 1) {
      sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
    } else if (event.key === 'ArrowUp' && currentIndex > 0) {
      sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
    }
  });

  // Highlight the active section on scroll
  document.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });
  });
});