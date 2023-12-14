let routingControl;
let destinationMarker;
const routingInfo = document.getElementById('routing-info');
const deleteRouteButton = document.getElementById('delete-btn');

export function navigateToCoordinates(map, startCoordinates, endCoordinates) {
    // Stellt sicher, dass die alte Routing-Kontrolle entfernt wird, bevor eine neue hinzugefügt wird
    if (routingControl) {
        map.removeLayer(routingControl);
        routingControl = null;
    }
    if (destinationMarker) {
        map.removeLayer(destinationMarker);
        destinationMarker = null;
    }

    const [startLat, startLng] = startCoordinates; // Startkoordinaten
    const [endLat, endLng] = endCoordinates; // Zielkoordinaten

    // Adresse abrufen
    getAddressFromCoords([endLat, endLng])
        .then(address => {
            const accessToken = `pk.eyJ1Ijoic3R1aGxsaW4iLCJhIjoiY2xvOXY3OTl5MGQwbTJrcGViYmI2MHRtZCJ9.MaOQcyZ99PH5hey-6isRpw`;
            const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/cycling/${startLng},${startLat};${endLng},${endLat}?geometries=geojson&overview=full&access_token=${accessToken}`;

            fetch(directionsUrl)
                .then(response => response.json())
                .then(data => {
                    const route = data.routes[0].geometry.coordinates;
                    const distance = data.routes[0].distance; // Distanz in Metern
                    const duration = data.routes[0].duration; // Dauer in Sekunden
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
                    // Routing-Kontrolle erstellen
                    routingControl = L.geoJSON(geojson, {style: {color: '#007bff', opacity: 1}});
                    // Route auf der Karte anzeigen
                    routingControl.addTo(map);

                    const hours = Math.floor(duration / 3600);
                    const minutes = Math.floor((duration % 3600) / 60);
                    const co2 = Math.floor((distance / 1000) * 150); // ca. 150 g pro km

                    if (routingInfo) {
                        let durationString = '';
                        if (hours !== 0) {
                            durationString += `${hours} Std `;
                        }
                        if (minutes !== 0) {
                            durationString += `${minutes} Min `;
                        }

                        routingInfo.innerHTML = `
                            <strong>Adresse:</strong> ${address}<br>
                            <strong>Distanz:</strong> ${(distance / 1000).toFixed(2)} km<br>
                            <strong>Dauer:</strong> ${durationString}<br>
                            <strong>Eingespartes CO2:</strong> ${co2.toFixed(0)} g<br>`;
                        routingInfo.style.display = 'block';
                        deleteRouteButton.style.display = 'block';
                    }
                })
                .catch(error => {
                    console.error('Fehler bei der Routing-Anfrage:', error);
                });
        })
        .catch(error => {
            console.error('Fehler bei der Adressabfrage:', error);
        });
}


// Funktion zum Löschen der Route
export function deleteRoute(map) {
    // Entfernen der Route
    if (routingControl) {
        map.removeLayer(routingControl);
        routingControl = null;
    }

    // Entfernen des Markers
    if (destinationMarker) {
        map.removeLayer(destinationMarker);
        destinationMarker = null;
    }

    if (routingInfo) {
        routingInfo.innerHTML = '';
        routingInfo.style.display = 'none';
        deleteRouteButton.style.display = 'none';
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
    // Adresse geokodieren
    geocodeAddress(endLocation)
        .then(geocodedCoordinates => {
            // Geokodierte Koordinaten verwenden, um die Route zu berechnen
            navigateToCoordinates(map, startCoordinates, geocodedCoordinates);
            //add marker to map
            let customIcon = L.icon({
                iconUrl: '../static/images/location-dot-solid.svg',
                iconSize: [30, 30],
                iconAnchor: [19, 30],
                popupAnchor: [0, -30]
            });

            if (destinationMarker) {
                map.removeLayer(destinationMarker);
            }

            destinationMarker = L.marker(geocodedCoordinates, {icon: customIcon}).addTo(map);
        })
        .catch(error => {
                console.error('Fehler bei der Geokodierung:', error);
            }
        );
}


export function getAddressFromCoords(latlon) {
    const [lat, lon] = latlon;
    const accessToken = 'pk.eyJ1Ijoic3R1aGxsaW4iLCJhIjoiY2xvOXY3OTl5MGQwbTJrcGViYmI2MHRtZCJ9.MaOQcyZ99PH5hey-6isRpw';
    const reverseGeocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${accessToken}`;

    return fetch(reverseGeocodingUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.features && data.features.length > 0) {
                // Extrahieren Sie die Adresse und entfernen Sie den letzten Teil (Land)
                let fullAddress = data.features[0].place_name || 'Keine Adresse gefunden';
                let addressParts = fullAddress.split(',');
                addressParts.pop(); // Entfernt den letzten Teil der Adresse (normalerweise das Land)
                return addressParts.join(','); // Fügt die Teile ohne das Land wieder zusammen
            } else {
                throw new Error('Koordinaten konnten nicht in eine Adresse umgewandelt werden.');
            }
        });
}

