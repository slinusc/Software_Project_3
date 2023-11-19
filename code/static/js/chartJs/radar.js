import {getUserLocation} from '../getUserlocation.js';

let radius = 2000; // Beispiel für Radius

// Abrufen der Benutzerposition
getUserLocation().then(user_latlng => {
    let lat = user_latlng.lat;
    let lon = user_latlng.lng;

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
    .then(data => {
        // Extrahieren Sie die Labels und Daten aus der Antwort
        let labels = Object.keys(data);
        let dataPoints = Object.values(data);

        // Aktualisieren Sie das Diagramm
        updateChart(labels, dataPoints);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

// Funktion zur Aktualisierung des Charts
function updateChart(labels, data) {
    var ctx = document.getElementById('meinRadarChart').getContext('2d');
    var meinRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels, // Setzen Sie die Labels aus den gefetchten Daten
            datasets: [{
                label: 'data', // no label
                data: data, // Setzen Sie die Daten aus den gefetchten Daten
                backgroundColor: 'rgba(0, 123, 255, 0.5)'
            }]
        },
        options: {
            maintainAspectRatio: true,
            responsive: true,
            elements: {
                point: {
                    clip: false // Setzen Sie dies auf false, um das Abschneiden zu verhindern
                }
            },
            scales: {
                rAxis: { // Ändern Sie 'r' zu 'rAxis'
                    type: 'linear',
                    position: 'bottom',
                    min: 0,
                    max: 5,
                    grid: {
                        drawBorder: false,
                        drawTicks: true,
                        drawOnChartArea: false
                    },
                    ticks: {
                        display: false
                    }
                }
            },
            // ...
        }
    });
}