import { map, currentTileLayer, initializeMap, locateUser, getCurrentMarker, updateAmenitiesMap } from './mapInitialization.js';
import { navigateToCoordinates } from './routing.js';
import { saveMapDarkModeState } from './menu.js';

// JavaScript Map ---------------------------------------------

// Initialisieren der Karte
initializeMap();


// Initialisierung Menu Button
const toggleButton = document.getElementById("toggleMenu");
const checkboxMenu = document.getElementById("checkboxMenu");


// Benutzer lokalisieren beim Laden des Skripts
if (!getCurrentMarker()) {
    locateUser();
}

// Event-Listener für den "Benutzer lokalisieren"-Button
document.getElementById('locate-btn').addEventListener('click', locateUser);


// Event-Listener für das Menu-Schaltflaeche
toggleButton.addEventListener("click", () => {
  if (checkboxMenu.classList.contains("hidden")) {
    checkboxMenu.classList.remove("hidden");
    toggleButton.innerHTML = '<i class=\'bx bx-menu icon\'></i>'; // Setze das Bild im Button
  } else {
    checkboxMenu.classList.add("hidden");
    toggleButton.innerHTML = '<i class=\'bx bx-menu icon\'></i>'; // Setze das Bild im Button
  }
});


// Event-Listener für jede Checkbox zum Aktualisieren der Karte
document.querySelectorAll('input[name="amenity"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        updateAmenitiesMap(map);
    });
});


// Event-listener switch between map styles
document.querySelector('.toggle-switch').addEventListener('click', function() {
    map.removeLayer(currentTileLayer);

    // Ändern Sie die ID des TileLayers je nach aktuellem Modus
    if (currentTileLayer.options.id === 'mapbox/streets-v11') {
        currentTileLayer.options.id = 'mapbox/dark-v10'
        saveMapDarkModeState(true);

    } else {
        currentTileLayer.options.id = 'mapbox/streets-v11'
        saveMapDarkModeState(false);
    }

    // Fügt den TileLayer wieder zur Karte hinzu
    currentTileLayer.addTo(map);
});


// Routing (Event-Listener für das "amenityClicked"-Event)
window.addEventListener('amenityClicked', function(e) {
    const startMarker = getCurrentMarker();
    const start_latlon = [startMarker.getLatLng().lat, startMarker.getLatLng().lng];
    const end_latlon = [e.detail.lat, e.detail.lon];
    console.log("Amenity clicked, navigate from:", start_latlon, "to:", end_latlon);
    navigateToCoordinates(map, start_latlon, end_latlon);
});


function loadAndApplyMapDarkModeState() {
  const mapDarkModeEnabled = localStorage.getItem('mapDarkMode') === 'true';
  if (mapDarkModeEnabled) {
    currentTileLayer.options.id = 'mapbox/dark-v10';
  } else {
    currentTileLayer.options.id = 'mapbox/streets-v11';
  }
  currentTileLayer.addTo(map);
}

// Rufen Sie die Funktion zum Laden und Anwenden des dunklen Kartenmodus auf
loadAndApplyMapDarkModeState();