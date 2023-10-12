const map = L.map('map').setView([47.3769, 8.5417], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
}).addTo(map);

let currentMarker = null;

function locateUser() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const user_latlng = L.latLng(position.coords.latitude, position.coords.longitude);

            if (currentMarker) {
                map.removeLayer(currentMarker);
            }

            currentMarker = L.marker(user_latlng).addTo(map);
            map.setView(user_latlng, map.getZoom()); // behält den aktuellen Zoomlevel bei
        });
    } else {
        alert("Geolocation wird von diesem Browser nicht unterstützt");
    }
}

document.getElementById('locate-btn').addEventListener('click', locateUser);

if (!currentMarker) {
    locateUser();
}

let locationMarkers = [];

function updateMap() {
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
        // Entfernen Sie alle alten Marker von der Karte
        locationMarkers.forEach(marker => {
            map.removeLayer(marker);
        });
        locationMarkers = [];

        // Hinzufügen von neuen Markern zur Karte
        data.forEach(loc => {
            const marker = L.marker([loc.lat, loc.lon]).addTo(map);
            locationMarkers.push(marker);
        });
    })
    .catch(error => {
        console.error("Es gab einen Fehler beim Abrufen der Daten:", error);
    });
}

// Füge Event-Listener für jede Checkbox hinzu
document.querySelectorAll('input[name="amenity"]').forEach(checkbox => {
    checkbox.addEventListener('change', updateMap);
});
