const map = L.map('map').setView([47.3769, 8.5417], 13);

// Ändern Sie die L.tileLayer URL zu OSM Standard-Kacheln
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

// Rufen Sie die Funktion beim Laden der Seite auf, um den Standort sofort zu ermitteln.
if (!currentMarker) {
    locateUser();
}
