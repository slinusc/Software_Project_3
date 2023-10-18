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
                useMotoway: false, // Vermeiden Sie Autobahnen
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
