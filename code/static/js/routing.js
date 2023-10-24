let routingControl;

export function navigateToCoordinates(map, startCoordinates, endCoordinates) {
    console.log("navigateToCoordinates wurde aufgerufen");

    // Stellt sicher, dass die alte Routing-Kontrolle entfernt wird, bevor eine neue hinzugefügt wird
    if (routingControl) {
        map.removeControl(routingControl);
    }

    const [lat, lng] = endCoordinates;
    const [startLat, startLng] = startCoordinates;

    routingControl = L.Routing.control({
        waypoints: [
            L.latLng(startLat, startLng), // Startpunkt
            L.latLng(lat, lng) // Ziel
        ],

        createMarker: function(i, waypoint, n) {
        return null;  // Entfernt Marker für die Routenpunkte

        },
        routeWhileDragging: false,
        addWaypoints: false, // Verhindert das Hinzufügen von Zwischenstopps
        show: true, // Zeigt die Instructions an
        router: new L.Routing.OSRMv1({
            serviceUrl: 'https://router.project-osrm.org/route/v1',
            profile: 'bike',
        }),

    }).addTo(map);
}
