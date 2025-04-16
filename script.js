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

// Function to change language
function changeLanguage(lang) {
    if (!translations[lang]) return;

    // Apply translations to elements
    document.querySelectorAll("[data-lang]").forEach(el => {
        const key = el.getAttribute("data-lang");
        const translation = translations[lang][key];
        if (translation) {
            el.innerText = translation;
        }
    });

    // Update dropdown to reflect current language
    const langSelector = document.getElementById("lang");
    if (langSelector && langSelector.value !== lang) {
        langSelector.value = lang;
    }

    // Store language in localStorage
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

const navToggleBtn = document.querySelector('[data-nav-toggle-btn]');
const navbar = document.querySelector('[data-navbar]');

navToggleBtn.addEventListener('click', function() { 
    elemToggleFunc(navToggleBtn);
    elemToggleFunc(navbar);
    elemToggleFunc(document.body);
})

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