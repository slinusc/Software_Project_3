
/**
 * Lokalisierung des Benutzers und Hinzufügen eines Markers auf der Karte.
 */

import { map } from './mapInitialization.js';

let currentMarker = null;

export function locateUser() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const user_latlng = L.latLng(position.coords.latitude, position.coords.longitude);

            if (currentMarker) {
                map.removeLayer(currentMarker);
            }

            currentMarker = L.marker(user_latlng).addTo(map);
            map.setView(user_latlng, map.getZoom()); // Behält den aktuellen Zoomlevel bei
        });
    } else {
        alert("Geolocation wird von diesem Browser nicht unterstützt");
    }
}

export function getCurrentMarker() {
    return currentMarker;
}

