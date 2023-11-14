// JavaScript Menu ---------------------------------------------

const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle = body.querySelector(".toggle"),
    searchBtn = body.querySelector(".search-box"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text");

// Funktion zum Speichern des Dark-Mode-Status
function saveDarkModeState(enabled) {
  localStorage.setItem('darkMode', enabled);
}

export function saveMapDarkModeState(enabled) {
  localStorage.setItem('mapDarkMode', enabled);
}

// Funktion zum Laden und Anwenden des Dark-Mode-Status
function loadAndApplyDarkModeState() {
  const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
  body.classList.toggle('dark', darkModeEnabled);
  modeText.innerText = darkModeEnabled ? 'Light Mode' : 'Dark Mode';
}

// Funktion zum Speichern des Menüstatus
function saveMenuState(open) {
  localStorage.setItem('menuOpen', open);
}

// Funktion zum Laden und Anwenden des Menüstatus
function loadAndApplyMenuState() {
  const menuOpen = localStorage.getItem('menuOpen') === 'true';
  sidebar.classList.toggle('close', !menuOpen);
}

// Event-Listener für den Dark-Mode-Schalter
modeSwitch.addEventListener('click', () => {
  body.classList.toggle('dark');
  const darkModeEnabled = body.classList.contains('dark');
  modeText.innerText = darkModeEnabled ? 'Light Mode' : 'Dark Mode';
  saveDarkModeState(darkModeEnabled);
});

// Event-Listener für das Menü-Schaltfläche
toggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
  const menuOpen = !sidebar.classList.contains('close');
  saveMenuState(menuOpen);
});

loadAndApplyDarkModeState();
loadAndApplyMenuState();
