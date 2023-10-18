// Initialisierung der Karte
const START_COORDINATES = [47.3769, 8.5417];
const START_ZOOM_LEVEL = 13;

export const map = L.map('map').setView(START_COORDINATES, START_ZOOM_LEVEL);

// Hinzufügen des OSM-TileLayers
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
}).addTo(map);
