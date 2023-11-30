import {getUserLocation} from "../getUserlocation.js";

let myChart;

function fetchNearestAmenities(lat, lon, amenityType, k) {
    return fetch('/nearest_amenities', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            lat: lat,
            lon: lon,
            amenity_type: amenityType,
            k: k
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Netzwerkantwort war nicht ok');
        }
        return response.json(); // Stellen Sie sicher, dass die Antwort als JSON geparst wird
    });
}

function createGeoBubbleChart(userLocation, data) {
    const canvas = document.getElementById('meinGeoBubbleChart');
    const ctx = canvas.getContext('2d');

    const size = Math.min(canvas.parentElement.offsetWidth, canvas.parentElement.offsetHeight);
    canvas.width = size;
    canvas.height = size;

    // Sortieren der Daten nach Distanz
    const sortedData = data.sort((a, b) => a.distance - b.distance);

    const bubbleChartData = {
        datasets: [{
            label: 'Nearest Amenities',
            data: sortedData.map((item, index) => ({
                x: (item.coordinates[0] - userLocation.lng) * 1000, // Skalierung der Longitude
                y: (item.coordinates[1] - userLocation.lat) * 1000, // Skalierung der Latitude
                r: 25 - index * 5, // Größe basierend auf dem Index in der sortierten Liste
                distance: item.distance, // Speichern der ursprünglichen Distanz
                address: item.address
            })),
            backgroundColor: 'rgba(0, 123, 255, 0.5)',
        }]
    };

    // Calculate maxRadius
    let maxRadius = Math.max(...bubbleChartData.datasets[0].data.map(d => Math.sqrt(d.x * d.x + d.y * d.y)));

    // Wenn ein Diagramm bereits existiert, zerstören Sie es
    if (myChart) {
        myChart.destroy();
    }

    // Erstellen Sie ein neues Diagramm und speichern Sie die Instanz in myChart
    myChart = new Chart(ctx, {
        type: 'bubble',
        data: bubbleChartData,
        options: {
            scales: {
                x: {
                    display: false, // x-Achse ausblenden
                    type: 'linear',
                    position: 'bottom',
                    min: -maxRadius * 1.2, // Skalieren Sie die x-Achse etwas, um die Blasen nicht zu überlappen
                    max: maxRadius * 1.2,
                    grid: {
                        display: false,
                    },
                    ticks: {
                        display: false,
                    }
                },
                y: {
                    display: false, // y-Achse ausblenden
                    type: 'linear',
                    min: -maxRadius * 1.2, // Skalieren Sie die y-Achse etwas, um die Blasen nicht zu überlappen
                    max: maxRadius * 1.2,
                    grid: {
                        display: false,
                    },
                    ticks: {
                        display: false,
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // Legende ausblenden
                },
                tooltip: {
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            let address = context.raw.address; // Adresse aus den Rohdaten extrahieren
                            let distance = context.raw.distance; // Distanz aus den Rohdaten extrahieren
                            return [`Adresse: ${address}`, `Distanz: ${distance.toFixed(2)} m`];
                        }
                    }
                }
            },
            elements: {
                point: {
                    radius: 0 // Punkte im Hintergrund ausblenden
                }
            }
        },
        plugins: [{
            beforeDatasetsDraw: chart => {
                let ctx = chart.ctx;
                ctx.save();
                let xAxis = chart.scales.x;
                let yAxis = chart.scales.y;
                let centerX = xAxis.getPixelForValue(0);
                let centerY = yAxis.getPixelForValue(0);
                let maxRadius = (Math.max(xAxis.width, yAxis.height) /2);

                ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)'; // Standardfarbe für Linien in Chart.js

                // Weitere Kreise zeichnen, falls gewünscht
                let totalCircles = 7;
                for (let i = 1; i <= totalCircles; i++) {
                    let currentRadius = (i / totalCircles) * maxRadius;
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, currentRadius, 0, 2 * Math.PI);
                    ctx.stroke();
                }
            }
        }]
    });
}

// Event-Listener für das 'change'-Event hinzufügen
document.getElementById('amenitySelect2').addEventListener('change', function() {
    // Den ausgewählten Wert als Amenity setzen
    let selectedAmenity = this.value;

    // Diagramm mit dem ausgewählten Amenity aktualisieren
    loadAndCreateChart(selectedAmenity);
});

function loadAndCreateChart(amenityType) {
    getUserLocation().then(userLocation => {
        fetchNearestAmenities(userLocation.lat, userLocation.lng, amenityType, 5)
            .then(data => {

                if (!Array.isArray(data)) {
                    throw new TypeError("Erwartete ein Array, erhielt aber: " + typeof data);
                }
                createGeoBubbleChart(userLocation, data);
            })
            .catch(error => {
                console.error('Fehler beim Laden der Daten:', error);
                // Zusätzliche Fehlerbehandlung hier
            });
    });
}

// Starten Sie das Diagramm mit dem standardmäßig ausgewählten Amenity
loadAndCreateChart(document.getElementById('amenitySelect2').value);