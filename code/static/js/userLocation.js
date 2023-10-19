
/**
 * Lokalisierung des Benutzers und Hinzufügen eines Markers auf der Karte.
 */

import { map } from './mapInitialization.js';

let currentMarker = null;

var bikeIcon = L.icon({
    iconUrl: '../static/images/person-biking-solid.svg', // Pfad zu Ihrem Fahrrad-Icon
    iconSize: [38, 38],
    iconAnchor: [19, 38], // Position des Ankers des Icons
    popupAnchor: [0, -38] // Position des Popups

});


export function locateUser() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const user_latlng = L.latLng(position.coords.latitude, position.coords.longitude);

            if (currentMarker) {
                map.removeLayer(currentMarker);
            }

            currentMarker = L.marker(user_latlng, {icon: bikeIcon}).addTo(map);
            map.setView(user_latlng, 15, { animate: true }); // Zoom auf den Marker
        });
    } else {
        alert("Geolocation wird von diesem Browser nicht unterstützt");
    }
}

export function getCurrentMarker() {
    return currentMarker;
}

