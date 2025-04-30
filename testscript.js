'use strict';

let translations = {}; // Store translations after loading

// Load translations from JSON file
fetch('translations.json')
  .then(response => response.json())
  .then(data => {
    translations = data;

    const savedLang = localStorage.getItem('language') || 'de';
    changeLanguage(savedLang);
  })
  .catch(error => console.error("Error loading translations:", error));

// Language Switcher
function changeLanguage(lang) {
  if (!translations[lang]) return;

  document.querySelectorAll("[data-lang]").forEach(el => {
    const key = el.getAttribute("data-lang");
    const translation = translations[lang][key];
    if (!translation) return;

    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
      el.placeholder = translation;
    } else {
      el.innerText = translation;
    }
  });

  // Update select element if needed
  const langSelector = document.getElementById("lang");
  if (langSelector && langSelector.value !== lang) {
    langSelector.value = lang;
  }

  // Update Load More button text
  if (loadMoreBtn) {
    updateLoadMoreText(lang);
  }

  // Update form status message if present
  const statusDiv = document.getElementById('form-status');
  if (statusDiv && statusDiv.textContent) {
    if (statusDiv.classList.contains('success')) {
      statusDiv.textContent = translations[lang]?.form_success || statusDiv.textContent;
    } else if (statusDiv.classList.contains('error')) {
      statusDiv.textContent = translations[lang]?.form_error || statusDiv.textContent;
    }
  }

  localStorage.setItem('language', lang);
}

// DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  const langSelector = document.getElementById("lang");
  if (langSelector) {
    langSelector.addEventListener("change", (event) => {
      changeLanguage(event.target.value);
    });
  }

  // Initially hide hidden projects
  hiddenProjects.forEach(project => {
    project.style.display = 'none';
  });
});

// Toggle Helper
const elemToggleFunc = function (elem) {
  elem.classList.toggle('active');
};

// Sticky Header + Go-Top
const header = document.querySelector('[data-header]');
const goTopBtn = document.querySelector('[data-go-top]');
window.addEventListener('scroll', function () {
  if (window.scrollY >= 10) {
    header.classList.add('active');
    goTopBtn.classList.add('active');
  } else {
    header.classList.remove('active');
    goTopBtn.classList.remove('active');
  }
});

// Mobile Menu
const navToggleBtn = document.querySelector('[data-nav-toggle-btn]');
const navbar = document.querySelector('[data-navbar]');
const navLinks = document.querySelectorAll('[data-navbar] a');

navToggleBtn.addEventListener('click', function () {
  elemToggleFunc(navToggleBtn);
  elemToggleFunc(navbar);
  elemToggleFunc(document.body);
});

navLinks.forEach(link => {
  link.addEventListener('click', function () {
    navToggleBtn.classList.remove('active');
    navbar.classList.remove('active');
    document.body.classList.remove('active');
  });
});

// Theme Toggle
const themeToggleBtn = document.querySelector('[data-theme-btn]');

themeToggleBtn.addEventListener('click', function () {
  elemToggleFunc(themeToggleBtn);

  if (themeToggleBtn.classList.contains('active')) {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    localStorage.setItem('theme', 'light-theme');
  } else {
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme');
    localStorage.setItem('theme', 'dark-theme');
  }
});

// Apply saved theme
if (localStorage.getItem('theme') === 'light-theme') {
  themeToggleBtn.classList.add('active');
  document.body.classList.remove('dark-theme');
  document.body.classList.add('light-theme');
} else {
  themeToggleBtn.classList.remove('active');
  document.body.classList.remove('light-theme');
  document.body.classList.add('dark-theme');
}

// Load More Projects
const loadMoreBtn = document.querySelector('.load-more');
const hiddenProjects = document.querySelectorAll('.hidden-project');

function updateLoadMoreText(lang) {
  if (!loadMoreBtn) return;
  const loadMoreKey = loadMoreBtn.getAttribute('data-lang');
  loadMoreBtn.textContent = translations[lang]?.[loadMoreKey] || loadMoreBtn.textContent;
}

if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', () => {
    const areHidden = hiddenProjects[0].style.display === 'none';

    if (areHidden) {
      hiddenProjects.forEach(project => {
        project.style.display = 'block';
      });
      loadMoreBtn.setAttribute('data-lang', 'show_less');
    } else {
      hiddenProjects.forEach(project => {
        project.style.display = 'none';
      });
      loadMoreBtn.setAttribute('data-lang', 'load_more');
    }

    const currentLang = localStorage.getItem('language') || 'de';
    updateLoadMoreText(currentLang);
  });
}

// Contact Form Submission
const form = document.querySelector('.contact-form');
const submitBtn = form?.querySelector('button[type="submit"]');
const statusDiv = document.getElementById('form-status');

form?.addEventListener('submit', async function (e) {
  e.preventDefault();

  const currentLang = localStorage.getItem('language') || 'de';
  const loadingText = translations[currentLang]?.form_loading || 'Sending...';
  const originalText = submitBtn.textContent;

  submitBtn.disabled = true;
  submitBtn.textContent = loadingText;

  const formData = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: form.method || 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      const successMessage = translations[currentLang]?.form_success || 'Message sent successfully!';
      statusDiv.textContent = successMessage;
      statusDiv.className = 'form-status success';
      form.reset();
    } else {
      const errorText = await response.text();
      console.error('Form submission error:', errorText);
      throw new Error('Submission failed');
    }
  } catch (error) {
    const errorMessage = translations[currentLang]?.form_error || 'An error occurred. Please try again.';
    statusDiv.textContent = errorMessage;
    statusDiv.className = 'form-status error';
  }

  submitBtn.disabled = false;
  submitBtn.textContent = translations[currentLang]?.send || originalText;
});
