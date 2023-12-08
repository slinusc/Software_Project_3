let routingControl;

export function navigateToCoordinates(map, startCoordinates, endCoordinates) {

    // Stellt sicher, dass die alte Routing-Kontrolle entfernt wird, bevor eine neue hinzugefügt wird
    if (routingControl) {
        map.removeLayer(routingControl);
        routingControl = null;
    }

    const [startLat, startLng] = startCoordinates; // Startkoordinaten
    const [endLat, endLng] = endCoordinates; // Zielkoordinaten

    // URL für Mapbox Directions API
    const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/cycling/${startLng},${startLat};${endLng},${endLat}?geometries=geojson&access_token=pk.eyJ1Ijoic3R1aGxsaW4iLCJhIjoiY2xvOXY3OTl5MGQwbTJrcGViYmI2MHRtZCJ9.MaOQcyZ99PH5hey-6isRpw`;

    fetch(directionsUrl)
        .then(response => response.json())
        .then(data => {
            const route = data.routes[0].geometry.coordinates;
            const geojson = {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: route
                }
            };
            // Falls bereits eine Route vorhanden ist, entfernen
            if (routingControl) {
                map.removeLayer(routingControl);
            }
            // Route auf der Karte anzeigen
            routingControl = L.geoJSON(geojson).addTo(map);
        })
        .catch(error => {
            console.error('Fehler bei der Routing-Anfrage:', error);
        });
}

export function deleteRoute(map) {
    if (routingControl) {
        map.removeLayer(routingControl);
        routingControl = null;
    }
}

// Geokodierungsfunktion, um eine Adresse in Koordinaten umzuwandeln
function geocodeAddress(address) {
    const accessToken = 'pk.eyJ1Ijoic3R1aGxsaW4iLCJhIjoiY2xvOXY3OTl5MGQwbTJrcGViYmI2MHRtZCJ9.MaOQcyZ99PH5hey-6isRpw';
    const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${accessToken}`;

    return fetch(geocodingUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.features && data.features.length > 0) {
                // Gibt die Koordinaten des ersten Suchergebnisses zurück
                // lon, lat Reihenfolge beachten!
                return data.features[0].center.reverse();
            } else {
                throw new Error('Adresse konnte nicht geokodiert werden.');
            }
        });
}

// Erweiterte navigateToCoordinates Funktion, um auch Adressen zu akzeptieren
export function navigateToAddress(map, startCoordinates, endLocation) {
    // Überprüfen, ob endLocation eine Adresse oder bereits Koordinaten sind
    // Adresse geokodieren
    geocodeAddress(endLocation)
        .then(geocodedCoordinates => {
            // Geokodierte Koordinaten verwenden, um die Route zu berechnen
            navigateToCoordinates(map, startCoordinates, geocodedCoordinates);
            //add marker to map
            let customIcon = L.icon({
                iconUrl: '../static/images/location-dot-solid.svg',
                iconSize: [30, 30], // size of the icon
                iconAnchor: [19, 30], // point of the icon which will correspond to marker's location
                popupAnchor: [0, -30] // point from which the popup should open relative to the iconAnchor
            });

L.marker(geocodedCoordinates, {icon: customIcon}).addTo(map);
        })
        .catch(error => {
                console.error('Fehler bei der Geokodierung:', error);
            }
        );
}


