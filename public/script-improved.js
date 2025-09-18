// Improved Contact Form Handling with Spam Protection and Success Modal
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formMessage = document.getElementById('formMessage');
  const successModal = document.getElementById('successModal');
  
  // Spam protection variables
  let lastSubmissionTime = 0;
  const minSubmissionInterval = 30000; // 30 seconds between submissions
  let submissionCount = 0;
  const maxSubmissionsPerHour = 5;
  
  // Initialize spam protection from localStorage
  const storedData = localStorage.getItem('formSubmissionData');
  if (storedData) {
    const data = JSON.parse(storedData);
    lastSubmissionTime = data.lastSubmissionTime || 0;
    submissionCount = data.submissionCount || 0;
    
    // Reset count if more than 1 hour has passed
    if (Date.now() - lastSubmissionTime > 3600000) {
      submissionCount = 0;
    }
  }
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Check spam protection
      const currentTime = Date.now();
      
      // Check submission interval
      if (currentTime - lastSubmissionTime < minSubmissionInterval) {
        showError('Будь ласка, зачекайте 30 секунд перед наступним відправленням.');
        return;
      }
      
      // Check submission count
      if (submissionCount >= maxSubmissionsPerHour) {
        showError('Ви перевищили ліміт відправлень. Спробуйте пізніше.');
        return;
      }
      
      // Show loading state
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      formMessage.style.display = 'none';
      
      // Get form data
      const formData = new FormData(contactForm);
      
      // Add timestamp for additional spam protection
      formData.append('timestamp', currentTime.toString());
      
      // Send form data
      fetch('send_message.php', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        // Hide loading state
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        
        if (data.success) {
          // Update spam protection data
          lastSubmissionTime = currentTime;
          submissionCount++;
          localStorage.setItem('formSubmissionData', JSON.stringify({
            lastSubmissionTime: lastSubmissionTime,
            submissionCount: submissionCount
          }));
          
          // Show success modal
          showSuccessModal();
          
          // Clear form
          contactForm.reset();
        } else {
          showError(data.message);
        }
      })
      .catch(error => {
        // Hide loading state
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        
        // Show error message
        showError('Помилка при надсиланні повідомлення. Спробуйте ще раз.');
        console.error('Error:', error);
      });
    });
  }
  
  // Function to show error message
  function showError(message) {
    formMessage.textContent = message;
    formMessage.className = 'form-message error';
    formMessage.style.display = 'block';
    
    // Scroll to message
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Hide message after 5 seconds
    setTimeout(() => {
      formMessage.style.display = 'none';
    }, 5000);
  }
  
  // Function to show success modal
  function showSuccessModal() {
    successModal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Add escape key listener
    const escapeHandler = function(e) {
      if (e.key === 'Escape') {
        closeSuccessModal();
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);
    
    // Add click outside modal to close
    const outsideClickHandler = function(e) {
      if (e.target === successModal) {
        closeSuccessModal();
        successModal.removeEventListener('click', outsideClickHandler);
      }
    };
    successModal.addEventListener('click', outsideClickHandler);
  }
  
  // Function to close success modal
  window.closeSuccessModal = function() {
    successModal.style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
  };
  
  // Add form validation improvements
  const inputs = contactForm?.querySelectorAll('input, textarea');
  if (inputs) {
    inputs.forEach(input => {
      // Add real-time validation
      input.addEventListener('blur', function() {
        validateField(this);
      });
      
      // Add input formatting for phone
      if (input.type === 'tel') {
        input.addEventListener('input', function(e) {
          formatPhoneNumber(this);
        });
      }
    });
  }
  
  // Function to validate individual field
  function validateField(field) {
    const value = field.value.trim();
    
    switch(field.type) {
      case 'email':
        if (value && !isValidEmail(value)) {
          field.classList.add('error');
          showFieldError(field, 'Введіть коректний email адрес');
        } else {
          field.classList.remove('error');
          hideFieldError(field);
        }
        break;
        
      case 'tel':
        if (value && !isValidPhone(value)) {
          field.classList.add('error');
          showFieldError(field, 'Введіть коректний номер телефону');
        } else {
          field.classList.remove('error');
          hideFieldError(field);
        }
        break;
        
      default:
        if (field.required && !value) {
          field.classList.add('error');
          showFieldError(field, 'Це поле обов\'язкове');
        } else {
          field.classList.remove('error');
          hideFieldError(field);
        }
    }
  }
  
  // Function to format phone number
  function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.startsWith('380')) {
      value = '+' + value;
    } else if (value.startsWith('0')) {
      value = '+38' + value;
    } else if (value.length > 0 && !value.startsWith('+')) {
      value = '+380' + value;
    }
    
    input.value = value;
  }
  
  // Validation functions
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  function isValidPhone(phone) {
    const phoneRegex = /^\+380\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }
  
  // Function to show field error
  function showFieldError(field, message) {
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'field-error';
      field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
  
  // Function to hide field error
  function hideFieldError(field) {
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  }
});

// Existing functions (keep your current navigation and other functions)
function toggleMenu() {
  const sliderMenu = document.querySelector('.slider-menu');
  sliderMenu.classList.toggle('active');
}

function toggleMobileMenu() {
  const mobileNav = document.querySelector('.mobile-nav');
  mobileNav.classList.toggle('active');
  document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
}

// Navigation button redirection
function goToInfo(type) {
  document.querySelectorAll('.mi-section').forEach(section => {
    section.classList.remove('active');
  });
  
  document.querySelectorAll('.mi-button').forEach(button => {
    button.classList.remove('active');
  });
  
  const targetSection = document.getElementById(type);
  if (targetSection) {
    targetSection.classList.add('active');
  }
  
  const targetButton = document.querySelector(`[data-target="${type}"]`);
  if (targetButton) {
    targetButton.classList.add('active');
  }
  
  const dropdown = document.getElementById('mi-dropdown');
  if (dropdown) {
    dropdown.value = type;
  }
}
