/**
 * Abrufen und Anzeigen von Standorten basierend auf den ausgewählten Annehmlichkeiten.
 */


const icon_size = [25, 25];

const icon_anchor = [19, 19];

const bicycleParking = L.icon({
    iconUrl: '../static/images/square-parking-solid.svg',
    iconSize: icon_size,
    iconAnchor: icon_anchor,
});

const bicycleRepair = L.icon({
    iconUrl: '../static/images/screwdriver-wrench-solid.svg',
    iconSize: icon_size,
    iconAnchor: icon_anchor,
});

const bicycleRental = L.icon({
    iconUrl: '../static/images/retweet-solid.svg',
    iconSize: icon_size,
    iconAnchor: icon_anchor,
});

const drinkingWater = L.icon({
    iconUrl: '../static/images/faucet-drip-solid.svg',
    iconSize: icon_size,
    iconAnchor: icon_anchor,
});

const shelter = L.icon({
    iconUrl: '../static/images/person-shelter-solid.svg',
    iconSize: icon_size,
    iconAnchor: icon_anchor,
});

const compressedAir = L.icon({
    iconUrl: '../static/images/pump-soap-solid.svg',
    iconSize: icon_size,
    iconAnchor: icon_anchor,
});

const amenityToIconMap = {
    'bicycle_parking': bicycleParking,
    'bicycle_rental': bicycleRental,
    'bicycle_repair_station': bicycleRepair,
    'compressed_air': compressedAir,
    'drinking_water': drinkingWater,
    'shelter': shelter
};

export function updateMap(map) {
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

        // Entfernt alle alten Marker und Cluster von der Karte
        if (window.markerClusterGroup) {
            window.markerClusterGroup.clearLayers();
        }

        // Erstellt eine neue MarkerClusterGroup
        const markers = L.markerClusterGroup({
            maxClusterRadius: 40,
            disableClusteringAtZoom: 18,
        });

        // Hinzufügen von neuen Markern zum Cluster basierend auf dem Amenity-Typ
        data.forEach(loc => {
            const amenityType = loc.amenity;
            const iconForAmenity = amenityToIconMap[amenityType] || bicycleParking;
            const marker = L.marker([loc.lat, loc.lon], {icon: iconForAmenity});

            // Event-Listener für das Klicken auf einen Marker
            marker.on('click', function() {
                const event = new CustomEvent('amenityClicked', {
                detail: {
                    lat: loc.lat,
                    lon: loc.lon
                }
                });
                window.dispatchEvent(event);
            });
            markers.addLayer(marker);
        });


        map.addLayer(markers);

        window.markerClusterGroup = markers;
    })
    .catch(error => {
        console.error("Es gab einen Fehler beim Abrufen der Daten:", error);
    });
}
