// Initialisierung der Karte
const START_COORDINATES = [47.3769, 8.5417];
const START_ZOOM_LEVEL = 13;

export const map = L.map('map').setView(START_COORDINATES, START_ZOOM_LEVEL);

// Hinzufügen des Mapbox TileLayers
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    maxZoom: 19,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11', // für dunklen Kartenstil: mapbox/dark-v10
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoic3R1aGxsaW4iLCJhIjoiY2xvOXY3OTl5MGQwbTJrcGViYmI2MHRtZCJ9.MaOQcyZ99PH5hey-6isRpw' // Mapbox Access Token
}).addTo(map);
