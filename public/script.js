// Toggle hamburger menu
function toggleMenu() {
  const sliderMenu = document.querySelector('.slider-menu');
  sliderMenu.classList.toggle('active'); // Toggle the sliding menu visibility
}


// Close mobile menu on link click
document.querySelectorAll(".nav-list a").forEach(link => {
  link.addEventListener("click", () => {
    if (window.innerWidth < 992) toggleMenu();
  });
});

// More Information Tabs
const buttons = document.querySelectorAll(".mi-button");
const sections = document.querySelectorAll(".mi-section");
const dropdown = document.getElementById("mi-dropdown"); // <- new

function showSection(type) {
  sections.forEach(section => {
    section.style.display = section.id === type ? "block" : "none";
  });
  buttons.forEach(btn => {
    const target = btn.getAttribute("data-target");
    btn.classList.toggle("active", target === type);
  });

  // Sync the dropdown value when clicking a button (desktop)
  if (dropdown) {
    dropdown.value = type;
  }
}

// Handle button clicks (desktop)
buttons.forEach(button => {
  button.addEventListener("click", () => {
    const type = button.getAttribute("data-target");
    showSection(type);
  });
});

// Handle dropdown changes (mobile)
if (dropdown) {
  dropdown.addEventListener("change", () => {
    const type = dropdown.value;
    showSection(type);
  });
}


// Show the default section based on URL parameter or default to "family"
window.addEventListener("DOMContentLoaded", () => {
  const type = new URLSearchParams(window.location.search).get("type") || "family";
  showSection(type);

  // Navbar behavior on scroll
  const navbar = document.querySelector(".nav-bar-container");
  const mainContainer = document.querySelector(".main-container");
  if (navbar && mainContainer) {
    mainContainer.addEventListener("scroll", () => {
      navbar.classList.toggle("solid", mainContainer.scrollTop > 50);
    });
  }
});

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const target = button.getAttribute("data-target");
    showSection(target);
    history.pushState(null, "", `?type=${target}`);
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



// Map
const map = L.map("map").setView([46.467533991007826, 30.75029661639775], 13);
L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
  attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  subdomains: "abcd",
  maxZoom: 19,
}).addTo(map);
L.marker([46.467533991007826, 30.75029661639775])
  .addTo(map)
  .bindPopup("Грищенко та Партнери")
  .openPopup();

// Navigation button redirection
function goToInfo(type) {
  window.location.href = `info.html?type=${type}`;
}
