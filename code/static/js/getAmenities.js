/**
 * Abrufen und Anzeigen von Standorten basierend auf den ausgewählten Annehmlichkeiten.
 */

import { map } from './mapInitialization.js';

export function updateMap() {
    const amenities = document.querySelectorAll('input[name="amenity"]:checked');
    let selectedAmenities = [];

    amenities.forEach(amenity => {
        selectedAmenities.push(amenity.value);
    });

    fetch('/locations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amenities: selectedAmenities })
    })
        .then(response => response.json())
        .then(data => {
            // Entfernen Sie alle alten Marker und Cluster von der Karte
            if (window.markerClusterGroup) {
                window.markerClusterGroup.clearLayers();
            }

            // Erstellen Sie eine neue MarkerClusterGroup
            const markers = L.markerClusterGroup({
                maxClusterRadius: 40,
                disableClusteringAtZoom: 18,
            });

            // Hinzufügen von neuen Markern zum Cluster
            data.forEach(loc => {
                const marker = L.marker([loc.lat, loc.lon]);
                markers.addLayer(marker);
            });

            // Fügen Sie die MarkerClusterGroup zur Karte hinzu
            map.addLayer(markers);

            // Speichern Sie die MarkerClusterGroup in einem globalen Fenstervariablen
            // (nützlich für späteres Löschen/Neuzeichnen)
            window.markerClusterGroup = markers;
        })
        .catch(error => {
            console.error("Es gab einen Fehler beim Abrufen der Daten:", error);
        });
}
