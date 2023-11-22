import { getUserLocation } from './getUserlocation.js';

export let map;
export let currentTileLayer;
let currentMarker = null;
const START_COORDINATES = [47.497366, 8.7297876];
const START_ZOOM_LEVEL = 13;

const bikeIcon = L.icon({
    iconUrl: '../static/images/person-biking-solid.svg',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
});

// initialize map

export function initializeMap() {
    // Initialisierung der Karte
    map = L.map('map').setView(START_COORDINATES, START_ZOOM_LEVEL);

    // Definition des TileLayers
    currentTileLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        maxZoom: 19,
        attribution: 'Map raw_data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11', // für dunklen Kartenstil: mapbox/dark-v10
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1Ijoic3R1aGxsaW4iLCJhIjoiY2xvOXY3OTl5MGQwbTJrcGViYmI2MHRtZCJ9.MaOQcyZ99PH5hey-6isRpw' // Mapbox Access Token
    });

    // Hinzufügen des TileLayers zur Karte
    currentTileLayer.addTo(map);

    // Entfernen der Zoom-Steuerung (Zoom-Buttons)
    map.zoomControl.remove();

    placeCurrentUserMarkerOnMap();
}

// Lokalisieren des Benutzers auf der Karte

export function placeCurrentUserMarkerOnMap() {
    getUserLocation()
        .then(user_latlng => {
            if (currentMarker) {
                map.removeLayer(currentMarker);
            }
            currentMarker = L.marker(user_latlng, {icon: bikeIcon, draggable: false}).addTo(map);
            map.setView(user_latlng, 15, { animate: true }); // Zoom auf den Marker
        })
        .catch(error => {
            alert(error.message);
        });
}

// Rückgabe des aktuellen Markers des Benutzers
export function getCurrentMarker() {
    return currentMarker;
}

// Initialisierung der Icons für die Amenities

const icon_size = [30, 30];
const icon_anchor = [19, 19];
const amenityToIconMap = {
    'bicycle_parking': L.icon({iconUrl: '../static/images/Parking-bicycle.png', iconSize: icon_size, iconAnchor: icon_anchor}),
    'bicycle_rental': L.icon({iconUrl: '../static/images/Rental-bicycle.png', iconSize: icon_size, iconAnchor: icon_anchor}),
    'bicycle_repair_station': L.icon({iconUrl: '../static/images/Bicycle_repair_station.png', iconSize: icon_size, iconAnchor: icon_anchor}),
    'compressed_air': L.icon({iconUrl: '../static/images/compressed_air.png', iconSize: icon_size, iconAnchor: icon_anchor}),
    'drinking_water': L.icon({iconUrl: '../static/images/Drinking-water-16.svg', iconSize: icon_size, iconAnchor: icon_anchor}),
    'shelter': L.icon({iconUrl: '../static/images/person-shelter-solid.svg', iconSize: icon_size, iconAnchor: icon_anchor}),
};

// Aktualisieren der Karte basierend auf den ausgewählten Amenities

export function updateAmenitiesMap(map) {
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

