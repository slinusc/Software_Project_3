import {getUserLocation} from "../getUserlocation.js";

// Funktion zum Abrufen der Daten vom Server
function fetchNearestAmenities(lat, lon, amenityType, k) {
    return fetch('/nearest_amenities', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            lat: lat,
            lon: lon,
            amenity_type: amenityType,
            k: k
        }),
    })
    .then(response => response.json());
}

// Funktion zum Erstellen des Bubble-Charts
function createBubbleChart(data) {
    const ctx = document.getElementById('meinBubble').getContext('2d');

    data = [{"amenity": "bicycle_parking", "coordinates": [8.5125734, 47.3899326], "address": "Duttweilerstrasse, 8010", "distance": 203.9}, {"amenity": "bicycle_parking", "coordinates": [8.5110966, 47.3915322], "address": "F\u00f6rrlibuckstrasse, 8010", "distance": 285.1}, {"amenity": "bicycle_parking", "coordinates": [8.5129302, 47.3898001], "address": "Passerelle Gleisbogen, 8010", "distance": 239.5}, {"amenity": "bicycle_parking", "coordinates": [8.5137976, 47.3891266], "address": "Pfingstweidstrasse, 8010", "distance": 332.6}, {"amenity": "bicycle_parking", "coordinates": [8.5146265, 47.3905673], "address": "F\u00f6rrlibuckstrasse, 8005", "distance": 437.3}];

    new Chart(ctx, {
        type: 'bubble',
        data: {
            datasets: [{
                label: 'Nearest Amenities',
                data: data.map(item => ({
                    x: item.coordinates[0], // Längengrad
                    y: item.coordinates[1], // Breitengrad
                    r: item.distance // Entfernung als Radius
                })),
                backgroundColor: 'rgba(0, 123, 255, 0.5)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(0, 123, 255, 1)',
                hoverBorderColor: 'rgba(0, 123, 255, 1)',
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Longitude'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Latitude'
                    }
                }
            }
        }
    });
}

// Verwenden Sie die Funktionen
getUserLocation().then(user_latlng => {
    console.log(user_latlng.lat);
    fetchNearestAmenities(user_latlng.lat, user_latlng.lng, 'bicycle_parking', 5)
        .then(data => {
            console.log(data);
            createBubbleChart(data);
        })
        .catch(error => console.error('Error:', error)); // Füge diesen Block hinzu
});
