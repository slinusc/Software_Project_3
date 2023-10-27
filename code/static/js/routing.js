let routingControl;

export function navigateToCoordinates(map, startCoordinates, endCoordinates) {
    console.log("navigateToCoordinates wurde aufgerufen");

    // Stellt sicher, dass die alte Routing-Kontrolle entfernt wird, bevor eine neue hinzugefügt wird
    if (routingControl) {
        map.removeControl(routingControl);
    }

    const [lat, lng] = endCoordinates; // Zielkoordinaten
    const [startLat, startLng] = startCoordinates; // Startkoordinaten

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
        draggableWaypoints: false, // Verhindert das Verschieben der Zwischenstopps
        show: true, // Zeigt die Instructions an
        router: new L.Routing.OSRMv1({
            serviceUrl: 'https://router.project-osrm.org/route/v1',
            profile: 'bike', // Fahrradprofil
            exclude: 'motorway' // Autobahnen ausschliessen
        }),

    }).addTo(map);
}
