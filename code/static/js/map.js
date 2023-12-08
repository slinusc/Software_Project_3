import { map, currentTileLayer, initializeMap, placeCurrentUserMarkerOnMap, getCurrentMarker,
    updateAmenitiesMap, changeColorOfMarker} from './mapInitialization.js';
import { navigateToCoordinates, deleteRoute, navigateToAddress } from './routing.js';


// JavaScript Map ---------------------------------------------

// Initialisieren der Karte
initializeMap();


// Initialisierung Menu Button
const toggleButton = document.getElementById("toggleMenu");
const checkboxMenu = document.getElementById("checkboxMenu");


// Benutzer lokalisieren beim Laden des Skripts
if (!getCurrentMarker()) {
    placeCurrentUserMarkerOnMap();
}


// Event-Listener für den "Benutzer lokalisieren"-Button
document.getElementById('locate-btn').addEventListener('click', function() {
    placeCurrentUserMarkerOnMap(localStorage.getItem('mapDarkMode'));
});


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


// Routing (Event-Listener für das "amenityClicked"-Event)
window.addEventListener('amenityClicked', function(e) {
    const startMarker = getCurrentMarker();
    const start_latlon = [startMarker.getLatLng().lat, startMarker.getLatLng().lng];
    const end_latlon = [e.detail.lat, e.detail.lon];
    console.log("Amenity clicked, navigate from:", start_latlon, "to:", end_latlon);
    navigateToCoordinates(map, start_latlon, end_latlon);
});


// Event Listener für das Suchfeld (Routing Adresse)
// Debounce Funktion
function debounce(func, wait) {
    let timeout;

    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

const searchInput = document.getElementById('searchInput');
const debouncedNavigate = debounce(function() {
    const endLocation = searchInput.value;
    const startMarker = getCurrentMarker();
    const start_latlon = [startMarker.getLatLng().lat, startMarker.getLatLng().lng];
    if (endLocation) {
        navigateToAddress(map, start_latlon, endLocation);
    }
}, 800); // 500 Millisekunden Verzögerung
searchInput.addEventListener('input', debouncedNavigate);



// Event-Listener für den "Route löschen"-Button
document.getElementById('delete-btn').addEventListener('click', function() {
    deleteRoute(map);
});


// Event-listener für Wechsel zwischen hellen und dunklen Kartenmodus
document.querySelector('.toggle-switch').addEventListener('click', function() {
    map.removeLayer(currentTileLayer);

    // Ändern Sie die ID des TileLayers je nach aktuellem Modus
    if (currentTileLayer.options.id === 'mapbox/streets-v11') {
        currentTileLayer.options.id = 'mapbox/dark-v10'

    } else {
        currentTileLayer.options.id = 'mapbox/streets-v11'
    }

    changeColorOfMarker(localStorage.getItem('mapDarkMode'))

    // Fügt den TileLayer wieder zur Karte hinzu
    currentTileLayer.addTo(map);
});
