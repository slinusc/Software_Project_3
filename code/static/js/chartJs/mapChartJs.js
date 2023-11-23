function loadFlaskServerData(amenityType, callback) {
    // Daten vom Flask Server abrufen
    fetch('/amenities_per_canton', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amenity_type: amenityType }),
    })
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => console.error('Fehler beim Abrufen der Daten vom Flask Server:', error));
}

// Hinzufügen einer capitalize-Funktion zum Formatieren von Annehmlichkeiten für das Diagrammetikett
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

// TopoJSON-Daten zwischenspeichern, um die Karte schneller zu laden
let cachedSwitzerlandData = null;

function getSwitzerlandData(callback) {
    // Überprüfen, ob die Daten bereits zwischengespeichert sind
    if (cachedSwitzerlandData) {
        callback(cachedSwitzerlandData);
    } else {
        // Daten abrufen und zwischenspeichern
        fetch('https://swiss-maps.interactivethings.io/api/v0?shapes=cantons&format=topojson')
            .then((r) => r.json())
            .then((switzerland) => {
                cachedSwitzerlandData = switzerland;
                callback(switzerland);
            });
    }
}

// Deklarieren einer globalen Variablen für die Karte, um sie später zu zerstören
let chart;

//
function renderMapWithData(amenityData) {
    getSwitzerlandData((switzerland) => {
        const cantons = ChartGeo.topojson.feature(switzerland, switzerland.objects.cantons).features;

        // Konvertieren der Rohdaten in das richtige Format für die Karte
        const dataForMap = cantons.map(canton => {
            const cantonId = canton.properties.name;
            const value = amenityData[cantonId] || 0;
            return { feature: canton, value: value };
        });

        // Erstellen einer wurzelskalierten Farbskala für die Karte
        const colorScale = d3.scaleSqrt()
            .domain([1, d3.max(dataForMap, d => d.value)])
            .range([0, 1])
            .interpolate(() => d3.interpolateBlues);


        const ctx = document.getElementById("mapTopoJSON").getContext("2d");

        // Wenn bereits eine Karte existiert, zerstören Sie sie
        if (chart) {
            chart.destroy();
        }

        // Erstellen einer neuen Karte
        chart = new Chart(ctx, {
            type: 'choropleth',
            data: {
                labels: cantons.map((d) => d.properties.name),
                datasets: [{
                    label: 'Kantone der Schweiz',
                    outline: cantons,
                    data: dataForMap,
                    backgroundColor: function(context) {
                        const data = context.dataset.data[context.dataIndex];
                        const value = data ? data.value : 1; // Verwenden Sie 1 als minimalen Wert für die log-Skala
                        return colorScale(value);
                    }
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    },
                },
                scales: {
                    projection: {
                        axis: 'x',
                        projection: 'mercator'
                    },
                    color: {
                        axis: 'x',
                        quantize: 10, // Erhöhen Sie die Anzahl der Quantisierungsstufen
                        legend: {
                            position: 'bottom-right', // Ändern Sie die Position der Legende
                            align: 'top', // Ändern Sie die Ausrichtung der Legende
                            ticks: {
                                // Anpassen der angezeigten Werte auf der Skala
                                callback: function(value, index, values) {
                                    // Konvertieren Sie den Wert zurück zur ursprünglichen Skala
                                    return Math.round(Math.sqrt(value));
                                }
                            }
                        },
                    }
                },
            }
        });
    });
}

function updateMap(selectedAmenity) {
    loadFlaskServerData(selectedAmenity, function (data) {
        var amenityCountPerCanton = {};

        // Füllen von amenityCountPerCanton mit den Daten von Flask
        data.forEach(function (entry) {
            amenityCountPerCanton[entry._id] = entry.count;
        });

        // Aktualisieren der Karte mit den neuen Daten
        renderMapWithData(amenityCountPerCanton);
    });
}

// Initiieren der Karte mit der Standard-Annehmlichkeit (Trinkwasser)
updateMap('drinking_water');

// Hinzufügen eines Dropdown-Änderungsereignisses, um die Karte bei Auswahl zu aktualisieren
document.getElementById('amenitySelect').addEventListener('change', function () {
    var selectedAmenity = this.value;
    updateMap(selectedAmenity);
});