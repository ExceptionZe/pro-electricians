let translations = {}; // Store translations after loading

// Load translations from JSON file
fetch('translations.json')
    .then(response => response.json())
    .then(data => {
        translations = data;
    })
    .catch(error => console.error("Error loading translations:", error));

function changeLanguage(lang) {
    if (!translations[lang]) return;

    document.querySelectorAll("[data-lang]").forEach(el => {
        el.innerText = translations[lang][el.getAttribute("data-lang")];
    });
}

// Wait until translations are loaded before changing the language
document.addEventListener("DOMContentLoaded", () => changeLanguage("en"));
