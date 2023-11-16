import { getUserLocation } from "./getUserlocation";

export function getNearestAmenities(amenityType, k) {
    // Erhalten Sie das Marker-Objekt
    const marker = getUserLocation();

    // Überprüfen Sie, ob ein Marker vorhanden ist
    if (!marker) {
        console.error('Kein Marker vorhanden');
        return;
    }

    // Erhalten Sie die LatLng des Markers
    const latLng = marker.getLatLng();

    // Erstellen Sie die URL mit den Abfrageparametern
    const url = new URL('/nearest_amenities');
    url.searchParams.append('lat', latLng.lat);
    url.searchParams.append('lon', latLng.lng);
    url.searchParams.append('amenity_type', amenityType);
    url.searchParams.append('k', k);

    // Machen Sie die Anfrage und geben Sie das versprochene Response-Objekt zurück
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Verarbeiten Sie die Daten hier
            console.log(data);
        })
        .catch(error => {
            // Behandeln Sie Fehler hier
            console.error('There was an error!', error);
        });
}
