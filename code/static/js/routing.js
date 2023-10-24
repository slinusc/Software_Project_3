let routingControl;

export function initializeRouting(map) {
    console.log("initializeRouting wurde aufgerufen");
    // Stellen Sie sicher, dass die alte Routing-Kontrolle entfernt wird, bevor eine neue hinzugefügt wird
    if (routingControl) {
        map.removeControl(routingControl);
    }

    const address = document.getElementById('address-input').value;
    console.log("Eingegebene Adresse:", address);

    const geocoder = L.Control.Geocoder.nominatim();
    geocoder.geocode(address, function(results) {
        if (results && results.length > 0) {
            const latlng = results[0].center;

            // Routing-Optionen
            const routingOptions = {
                profile: 'bike', // Verwenden Sie das Profil "bike" für Fahrradrouten
                useMotorway: false, // Vermeiden Sie Autobahnen
                useRoads: true, // Erlauben Sie die Verwendung von Straßen
                usePaths: true, // Erlauben Sie die Verwendung von Radwegen
                useTraffic: true, //  die Verwendung von Verkehrsdaten
                useBridges: true, // Erlauben Sie die Verwendung von Brücken
                useFerries: true, // Erlauben Sie die Verwendung von Fähren
            };

            routingControl = L.Routing.control({
                waypoints: [
                    L.latLng(map.getCenter()), // Startpunkt (momentane Zentrum der Karte)
                    L.latLng(latlng.lat, latlng.lng) // Ziel (konvertierte Adresse)
                ],
                routeWhileDragging: true,
                router: new L.Routing.OSRMv1({
                    serviceUrl: 'https://router.project-osrm.org/route/v1',
                }),
                ...routingOptions, // Routing-Optionen hinzufügen
            }).addTo(map);
        } else {
            alert("Adresse nicht gefunden!");
        }
    });
}


export function navigateToCoordinates(map, startCoordinates, endCoordinates) {
    console.log("navigateToCoordinates wurde aufgerufen");

    // Stellen Sie sicher, dass die alte Routing-Kontrolle entfernt wird, bevor eine neue hinzugefügt wird
    if (routingControl) {
        map.removeControl(routingControl);
    }

    const routingOptions = {
        profile: 'bike',
        useMotorway: false,
        useRoads: true,
        usePaths: true,
        useTraffic: true,
        useBridges: true,
        useFerries: true,
        // ... (anderen Optionen)
    };

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
        router: new L.Routing.OSRMv1({
            serviceUrl: 'https://router.project-osrm.org/route/v1',
        }),
        ...routingOptions,
    }).addTo(map);
}

