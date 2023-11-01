import { map } from './mapInitialization.js';
import { locateUser, getCurrentMarker } from './userLocation.js';
import { updateMap } from './getAmenities.js';
import { navigateToCoordinates } from './routing.js';


// Event-Listener für den "Benutzer lokalisieren"-Button
document.getElementById('locate-btn').addEventListener('click', locateUser);


// Event-Listener für jede Checkbox zum Aktualisieren der Karte
document.querySelectorAll('input[name="amenity"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        updateMap(map);
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


// Benutzer lokalisieren beim Laden des Skripts
if (!getCurrentMarker()) {
    locateUser();
}
