/**
 * Abrufen und Anzeigen von Standorten basierend auf den ausgewählten Annehmlichkeiten.
 */

import { map } from './mapInitialization.js';

var bicycleParking = L.icon({
    iconUrl: '../static/images/square-parking-solid.svg',
    iconSize: [38, 38],
    iconAnchor: [19, 19],
});

var bicycleRepair = L.icon({
    iconUrl: '../static/images/screwdriver-wrench-solid.svg',
    iconSize: [38, 38],
    iconAnchor: [19, 19],
});

var bicycleRental = L.icon({
    iconUrl: '../static/images/retweet-solid.svg',
    iconSize: [38, 38],
    iconAnchor: [19, 19],
});

var drinkingWater = L.icon({
    iconUrl: '../static/images/faucet-drip-solid.svg',
    iconSize: [38, 38],
    iconAnchor: [19, 19],
});

var shelter = L.icon({
    iconUrl: '../static/images/person-shelter-solid.svg',
    iconSize: [38, 38],
    iconAnchor: [19, 19],
});

var compressedAir = L.icon({
    iconUrl: '../static/images/pump-soap-solid.svg',
    iconSize: [38, 38],
    iconAnchor: [19, 19],
});

const amenityToIconMap = {
    'bicycle_parking': bicycleParking,
    'bicycle_rental': bicycleRental,
    'bicycle_repair_station': bicycleRepair,
    'compressed_air': compressedAir,
    'drinking_water': drinkingWater,
    'shelter': shelter
};

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

        // Hinzufügen von neuen Markern zum Cluster basierend auf dem Amenity-Typ
        data.forEach(loc => {
            const amenityType = loc.amenity;
            const iconForAmenity = amenityToIconMap[amenityType] || bicycleParking;
            const marker = L.marker([loc.lat, loc.lon], {icon: iconForAmenity});
            markers.addLayer(marker);
        });

        map.addLayer(markers);

        window.markerClusterGroup = markers;
    })
    .catch(error => {
        console.error("Es gab einen Fehler beim Abrufen der Daten:", error);
    });
}
