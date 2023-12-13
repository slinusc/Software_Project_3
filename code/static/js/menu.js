import {navigateToAddress} from "./routing.js";
import {getUserLocation} from "./getUserlocation.js";

const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle = body.querySelector(".toggle"),
    searchBtn = body.querySelector(".search-box"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeSwitchmap = body.querySelector(".toggle-map-switch"),
    modeText = body.querySelector(".mode-text");
    localStorage.setItem('mapDarkMode', false);


// Event-Listener für das Menu-Schaltflaeche
if (toggle) {
    toggle.addEventListener("click", () => {
        sidebar.classList.toggle("close");
    });
}

// Event-Listener für die Such-Schaltflaeche
if (searchBtn) {
    searchBtn.addEventListener("click", () => {
        sidebar.classList.remove("close");
    });
}

// Event-Listener für Dark Mode / Light Mode
modeSwitch.addEventListener("click", () => {
    body.classList.toggle("dark");

    if (body.classList.contains("dark")) {
        modeText.innerText = "Hell";
        localStorage.setItem('mapDarkMode', true); // Speichert Dark Mode im Web Storage
    } else {
        modeText.innerText = "Dunkel";
        localStorage.setItem('mapDarkMode', false);  // Speichert Light Mode im Web Storage
    }
});



// Event-Listener für den Seitenwechsel
document.querySelectorAll('.menu-links a').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        let targetSectionID = this.getAttribute('href').substring(1);
        document.querySelectorAll('.home .content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(targetSectionID).classList.add('active');
    });
});

