// const carouselContainer = document.querySelector('.carousel-container');
// const prevButton = document.querySelector('.carousel-prev');
// const nextButton = document.querySelector('.carousel-next');

// let currentIndex = 0;

// function updateCarousel() {
//   const itemWidth = document.querySelector('.carousel-item').clientWidth;
//   carouselContainer.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
// }

// prevButton.addEventListener('click', () => {
//   currentIndex = (currentIndex > 0) ? currentIndex - 1 : 0;
//   updateCarousel();
// });

// nextButton.addEventListener('click', () => {
//   const totalItems = document.querySelectorAll('.carousel-item').length;
//   currentIndex = (currentIndex < totalItems - 1) ? currentIndex + 1 : totalItems - 1;
//   updateCarousel();
// });


/* Content for FAQ section */
const questions = document.querySelectorAll('.question');

questions.forEach(function(question) {
  question.addEventListener('click', function(){
    question.classList.toggle('open');
    console.log("this works")
  })
})

// // Hamburger menu toggle
// const hamburger = document.querySelector('.hamburger-menu');
// const navList = document.querySelector('.nav-list');
// const sliderMenu = document.querySelector('.slider-menu');

// function toggleMenu() {
//   navList.classList.toggle('active');
//   hamburger.classList.toggle('active');
//   console.log("this works")

//   // const isOpen = sliderMenu.style.right === '0px';
//   // sliderMenu.style.right = isOpen ? '-250px' : '0';
// }


// const teamWrapper = document.querySelector(".team-wrapper");
// const prevBtn = document.querySelector(".prev");
// const nextBtn = document.querySelector(".next");

// // Adjust scroll size dynamically based on card width
// const scrollAmount = 320;

// prevBtn.addEventListener("click", () => {
//   teamWrapper.scrollBy({ left: -scrollAmount, behavior: "smooth" });
// });

// nextBtn.addEventListener("click", () => {
//   teamWrapper.scrollBy({ left: scrollAmount, behavior: "smooth" });
// });

// // Auto-scroll every 3 seconds (optional)
// let autoScroll = setInterval(() => {
//   teamWrapper.scrollBy({ left: scrollAmount, behavior: "smooth" });
// }, 3000);

// // Pause auto-scroll on hover
// teamWrapper.addEventListener("mouseenter", () => clearInterval(autoScroll));
// teamWrapper.addEventListener("mouseleave", () => {
//   autoScroll = setInterval(() => {
//     teamWrapper.scrollBy({ left: scrollAmount, behavior: "smooth" });
//   }, 3000);
// });

// // Disable arrows when at the start or end
// const checkOverflow = () => {
//   prevBtn.disabled = teamWrapper.scrollLeft <= 0;
//   nextBtn.disabled =
//     teamWrapper.scrollLeft + teamWrapper.clientWidth >= teamWrapper.scrollWidth;
// };

// teamWrapper.addEventListener("scroll", checkOverflow);
// window.addEventListener("resize", checkOverflow);
// checkOverflow();





  // Set the width of the team-wrapper to accommodate all the cards
  // const backButton = document.querySelector('.back-arrow');
  // const nextButton = document.querySelector('.next-arrow');
  // const teamWrapper = document.querySelector('.team-wrapper');
  // const teamCards = document.querySelectorAll('.team-member-card');
  // const totalCards = teamCards.length;
  // let currentIndex = 0;

  // // Set the width of the team-wrapper to accommodate all the cards
  // const cardWidth = teamCards[0].offsetWidth + 20; // 20px for margin (optional)
  // teamWrapper.style.width = `${cardWidth * totalCards}px`;

  // function updateCarousel() {
  //   // Prevent moving past the first or last card
  //   if (currentIndex >= totalCards) {
  //     currentIndex = totalCards - 1; // Stop at the last card
  //   } else if (currentIndex < 0) {
  //     currentIndex = 0; // Stop at the first card
  //   }
  //   // Calculate the new position based on currentIndex
  //   teamWrapper.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
  // }

  // backButton.addEventListener('click', () => {
  //   // Go to the previous card
  //   if (currentIndex > 0) {
  //     currentIndex--;
  //   }
  //   updateCarousel();
  // });

  // nextButton.addEventListener('click', () => {
  //   // Go to the next card but stop at the last one
  //   if (currentIndex < totalCards - 1) {
  //     currentIndex++;
  //   }
  //   updateCarousel();
  // });

  document.addEventListener("DOMContentLoaded", function () {
    const teamWrapper = document.querySelector(".team-wrapper");
    const dotsContainer = document.querySelector(".dots-navigation");
    const teamMembers = document.querySelectorAll(".team-member-card");
    const totalItems = teamMembers.length;
    const visibleItems = 3; // Adjust based on how many are visible at once
    const totalPages = Math.ceil(totalItems / visibleItems);
  
    // Create dots
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => scrollToPage(i));
      dotsContainer.appendChild(dot);
    }
  
    function scrollToPage(page) {
      const scrollAmount = teamWrapper.scrollWidth / totalPages;
      teamWrapper.scrollTo({ left: scrollAmount * page, behavior: "smooth" });
  
      // Update active dot
      document.querySelectorAll(".dot").forEach((d, index) => {
        d.classList.toggle("active", index === page);
      });
    }
  
    // Sync dots with scrolling
    teamWrapper.addEventListener("scroll", () => {
      const scrollLeft = teamWrapper.scrollLeft;
      const currentPage = Math.round(scrollLeft / (teamWrapper.scrollWidth / totalPages));
      
      document.querySelectorAll(".dot").forEach((d, index) => {
        d.classList.toggle("active", index === currentPage);
      });
    });
  });