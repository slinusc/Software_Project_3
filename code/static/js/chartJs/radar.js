import {getUserLocation} from '../getUserlocation.js';

let radius = 10000; // Beispiel für Radius

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
    // Logarithmierung der Datenpunkte für die Anzeige
    let logData = data.map(value => Math.log(value + 1)); // +1, um negative Werte zu vermeiden

    var ctx = document.getElementById('meinRadarChart').getContext('2d');
    var meinRadarChart = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: labels,
            datasets: [{
                label: 'data',
                data: logData, // Logarithmierte Daten für die Darstellung
                originalData: data, // Speichern der ursprünglichen Daten im Dataset
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1,
            }]
        },
        options: {
            maintainAspectRatio: true,
            responsive: true,
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, chartData) {
                        let label = chartData.labels[tooltipItem.index];
                        // Zugriff auf die ursprünglichen Daten aus dem Dataset
                        let originalValue = chartData.datasets[0].originalData[tooltipItem.index];
                        return label + ': ' + originalValue; // Anzeige des ursprünglichen Werts
                    }
                }
            },
        }
    });
}