let routingControl;

export function navigateToCoordinates(map, startCoordinates, endCoordinates) {
    console.log("navigateToCoordinates wurde aufgerufen");

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
