'use strict';

let translations = {}; // Store translations after loading

// Load translations from JSON file
fetch('translations.json')
    .then(response => response.json())
    .then(data => {
        translations = data;

        // Use saved language if available, otherwise default to 'de'
        const savedLang = localStorage.getItem('language') || 'de';
        changeLanguage(savedLang);
    })
    .catch(error => console.error("Error loading translations:", error));

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
    
    const langSelector = document.getElementById("lang");
    if (langSelector && langSelector.value !== lang) {
        langSelector.value = lang;
    }
    
    localStorage.setItem('language', lang);
}

// When DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    const langSelector = document.getElementById("lang");
    if (langSelector) {
        langSelector.addEventListener("change", (event) => {
            changeLanguage(event.target.value);
        });
    }
});

//Toggle Function

const elemToggleFunc = function(elem) { elem.classList.toggle('active'); }

// Header Sticky & Go-Top

const header = document.querySelector('[data-header]');
const goTopBtn = document.querySelector('[data-go-top]');
window.addEventListener('scroll', function(){ if(window.scrollY >= 10) { header.classList.add('active'); goTopBtn.classList.add('active'); }
                                                                else { header.classList.remove('active'); goTopBtn.classList.remove('active'); } });

// Mobile Menu

// Mobile Menu
const navToggleBtn = document.querySelector('[data-nav-toggle-btn]');
const navbar = document.querySelector('[data-navbar]');
const navLinks = document.querySelectorAll('[data-navbar] a'); // all links inside the menu

navToggleBtn.addEventListener('click', function() { 
    elemToggleFunc(navToggleBtn);
    elemToggleFunc(navbar);
    elemToggleFunc(document.body);
});

// Close menu when a link is clicked
navLinks.forEach(link => {
  link.addEventListener('click', function() {
    navToggleBtn.classList.remove('active');
    navbar.classList.remove('active');
    document.body.classList.remove('active');
  });
});

// Dark & Light Theme Toggle

const themeToggleBtn = document.querySelector('[data-theme-btn]');

themeToggleBtn.addEventListener('click', function(){
    elemToggleFunc(themeToggleBtn);

    if(themeToggleBtn.classList.contains('active')){
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');

        localStorage.setItem('theme', 'light-theme');
    }else{
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');

        localStorage.setItem('theme', 'dark-theme');
    }
})

//Applying Theme kept in Local Storage 

if(localStorage.getItem('theme') === 'light-theme'){
    themeToggleBtn.classList.add('active');
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
}else{
    themeToggleBtn.classList.remove('active');
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
}

// Load More Projects, but also hide them again
const loadMoreBtn = document.querySelector('.load-more');
const hiddenProjects = document.querySelectorAll('.hidden-project');

// Function to update the button text
function updateLoadMoreText(lang) {
    const loadMoreText = loadMoreBtn.getAttribute('data-lang');
    loadMoreBtn.textContent = translations[lang][loadMoreText];
}

loadMoreBtn.addEventListener('click', () => {
    const areHidden = hiddenProjects[0].style.display === 'none'; // Check if the first hidden project is hidden

    // Show or hide the projects
    if (areHidden) {
        // Show all hidden projects
        hiddenProjects.forEach((project) => {
            project.style.display = 'block';
        });

        // Change button text to "Show Less"
        const currentLang = localStorage.getItem('language') || 'de';
        loadMoreBtn.setAttribute('data-lang', 'show_less');
        updateLoadMoreText(currentLang);
    } else {
        // Hide all projects again
        hiddenProjects.forEach((project) => {
            project.style.display = 'none';
        });

        // Change button text to "Load More Works"
        const currentLang = localStorage.getItem('language') || 'de';
        loadMoreBtn.setAttribute('data-lang', 'load_more');
        updateLoadMoreText(currentLang);
    }
});

// Handle Form Submission and Feedback

const form = document.querySelector('.contact-form');
const submitBtn = form.querySelector('button[type="submit"]');
const statusDiv = document.getElementById('form-status');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const currentLang = localStorage.getItem('language') || 'de';

  // Disable button & show loading message
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
      throw new Error('Submission failed');
    }
  } catch (error) {
    const errorMessage = translations[currentLang]?.form_error || 'An error occurred. Please try again.';
    statusDiv.textContent = errorMessage;
    statusDiv.className = 'form-status error';
  }

  // Restore button
  submitBtn.disabled = false;
  submitBtn.textContent = translations[currentLang]?.send || originalText;
});

// let scrollTimeout;
// window.addEventListener('scroll', function() {
//     if (scrollTimeout) clearTimeout(scrollTimeout);

//     scrollTimeout = setTimeout(() => {
//         if(window.scrollY >= 10) { 
//             header.classList.add('active'); 
//             goTopBtn.classList.add('active'); 
//         } else { 
//             header.classList.remove('active'); 
//             goTopBtn.classList.remove('active'); 
//         }
//     }, 100); // Add a 100ms delay
// });