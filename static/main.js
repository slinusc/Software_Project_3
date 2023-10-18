import { map } from './mapInitialization.js';
import { locateUser, getCurrentMarker } from './userLocation.js';
import { updateMap } from './getAmenities.js';

// Event-Listener für den "Benutzer lokalisieren"-Button
document.getElementById('locate-btn').addEventListener('click', locateUser);

// Event-Listener für jede Checkbox zum Aktualisieren der Karte
document.querySelectorAll('input[name="amenity"]').forEach(checkbox => {
    checkbox.addEventListener('change', updateMap);
});

// Benutzer lokalisieren beim Laden des Skripts
if (!getCurrentMarker()) {
    locateUser();
}
