import {getUserLocation} from "../getUserlocation";

// Definieren Sie die Koordinaten und den Radius

let userLocation =getUserLocation()
let lat = userLocation.latitude;
let lon = userLocation.longitude;

let radius = 1000; // Beispiel für Radius

// Erstellen Sie den Request
fetch('/number_amenities_in_radius', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        lat: lat,
        lon: lon,
        radius: radius
    })
})
.then(response => response.json())
.then(data => console.log(data))
.catch((error) => {
    console.error('Error:', error);
});