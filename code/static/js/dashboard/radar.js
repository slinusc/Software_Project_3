import {getUserLocation} from '../getUserlocation.js';

let meinRadarChart = null; // Globale Variable für das Chart-Objekt

const translations = {
    "bicycle_parking": "Fahrradparkplatz",
    "bicycle_rental": "Fahrradverleih",
    "bicycle_repair_station": "Reparaturstation",
    "compressed_air": "Luftpumpe",
    "drinking_water": "Trinkwasser",
    "shelter": "Unterstand"
};

// Funktion zum Abrufen von Annehmlichkeiten in einem bestimmten Radius
function fetchAmenities(radius) {
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
                let labels = Object.keys(data);
                let dataPoints = Object.values(data);

                // Übersetzen der Labels
                let translatedLabels = labels.map(label => translations[label] || label);

                updateChart(translatedLabels, dataPoints);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
}

// Funktion zur Aktualisierung des Charts
function updateChart(labels, data) {
    // Wenn das Diagramm bereits existiert, zerstören Sie es
    if (meinRadarChart) {
        meinRadarChart.destroy();
    }

    let logData = data.map(value => Math.log(value + 1)); // +1, um zu verhindern, dass 0 logarithmiert wird
    var ctx = document.getElementById('meinRadarChart').getContext('2d');

    meinRadarChart = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: labels,
            datasets: [{
                label: 'Data',
                data: logData,// Logarithmierte Daten für die Darstellung
                originalData: data, // Speichern der ursprünglichen Daten im Dataset
                backgroundColor: [
                    'rgba(153, 194, 255, 0.5)',  // Hellste Abstufung: #99c2ff
                    'rgba(77, 142, 255, 0.5)',   // Heller: #4d8eff
                    'rgba(0, 123, 255, 0.5)',    // Standard-Blau: #007bff
                    'rgba(0, 81, 204, 0.5)',     // Dunkler: #0051cc
                    'rgba(0, 59, 153, 0.5)',     // Dunkler: #003b99
                    'rgba(0, 40, 102, 0.5)'      // Dunkelste Abstufung: #002866
                ],
                borderColor: [
                    'rgba(153, 194, 255, 1)',    // Hellste Abstufung: #99c2ff
                    'rgba(77, 142, 255, 1)',     // Heller: #4d8eff
                    'rgba(0, 123, 255, 1)',      // Standard-Blau: #007bff
                    'rgba(0, 81, 204, 1)',       // Dunkler: #0051cc
                    'rgba(0, 59, 153, 1)',       // Dunkler: #003b99
                    'rgba(0, 40, 102, 1)'        // Dunkelste Abstufung: #002866
                ],
                borderWidth: 1,
            }]
        },
        options: {
            maintainAspectRatio: true,
            responsive: true,
            scales: {
                r: {
                    ticks: {
                        display: false,
                    },
                    display: true,
                }
            },
            plugins: {
                tooltip: {
                    displayColors: false,
                    callbacks: {
                        label: function (context) {
                            let name = context.dataset.originalData[context.dataIndex];
                            return name;
                        }
                    }
                },
                legend: {
                    display: false,
                    position: 'right'
                }
            }
        }
    });
}


// Event-Listener für die Auswahl des Radius
document.getElementById('radiusSelect').addEventListener('change', function () {
    let selectedRadius = parseInt(this.value);
    fetchAmenities(selectedRadius);
});

fetchAmenities(1000);