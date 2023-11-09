import { map, currentTileLayer , initializeMap, locateUser, getCurrentMarker, updateAmenitiesMap } from './mapInitialization.js';
import { navigateToCoordinates } from './routing.js';

// JavaScript Map ---------------------------------------------

// Initialisieren der Karte
initializeMap();


// Benutzer lokalisieren beim Laden des Skripts
if (!getCurrentMarker()) {
    locateUser();
}

// Event-Listener für den "Benutzer lokalisieren"-Button
document.getElementById('locate-btn').addEventListener('click', locateUser);


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


// JavaScript Menu ---------------------------------------------

const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle = body.querySelector(".toggle"),
    searchBtn = body.querySelector(".search-box"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text");

    if (toggle) {
        toggle.addEventListener("click", () => {
            sidebar.classList.toggle("close");
        });
    }

    searchBtn.addEventListener("click", () =>{
        sidebar.classList.remove("close");
    });


    modeSwitch.addEventListener("click", () =>{
        body.classList.toggle("dark");

        if(body.classList.contains("dark")){
            modeText.innerText = "Light Mode"
        }else{
            modeText.innerText = "Dark Mode"
        }
    });




// Switch between map styles

document.querySelector('.toggle-switch').addEventListener('click', function() {
    map.removeLayer(currentTileLayer);

    // Ändern Sie die ID des TileLayers je nach aktuellem Modus
    if (currentTileLayer.options.id === 'mapbox/streets-v11') {
        currentTileLayer.options.id = 'mapbox/dark-v10';
    } else {
        currentTileLayer.options.id = 'mapbox/streets-v11';
    }

    // Fügen Sie den TileLayer wieder zur Karte hinzu
    currentTileLayer.addTo(map);
});


// Menu Button

const toggleButton = document.getElementById("toggleMenu");
const checkboxMenu = document.getElementById("checkboxMenu");

toggleButton.addEventListener("click", () => {
  if (checkboxMenu.classList.contains("hidden")) {
    checkboxMenu.classList.remove("hidden");
    toggleButton.innerHTML = '<i class=\'bx bx-menu icon\'></i>'; // Setze das Bild im Button
  } else {
    checkboxMenu.classList.add("hidden");
    toggleButton.innerHTML = '<i class=\'bx bx-menu icon\'></i>'; // Setze das Bild im Button
  }
});
