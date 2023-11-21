function loadFlaskServerData(amenityType, callback) {
                fetch('/amenities_per_canton', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ amenity_type: amenityType }),
                })
                    .then(response => response.json())
                    .then(data => callback(data))
                    .catch(error => console.error('Error fetching Flask Server data:', error));
}

// Hinzufügen einer capitalize-Funktion zum Formatieren von Amenities für das Diagrammlabel
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

let chart; // Declare chart variable outside the function to keep a reference to the chart instance

function renderMapWithData(amenityData) {
    fetch('https://swiss-maps.interactivethings.io/api/v0?shapes=cantons&format=topojson')
    .then((r) => r.json())
    .then((switzerland) => {
        const cantons = ChartGeo.topojson.feature(switzerland, switzerland.objects.cantons).features;

        // Convert the data into a format suitable for the map
        const dataForMap = cantons.map(canton => {
            const cantonId = canton.properties.name;
            const value = amenityData[cantonId] || 0; // Use 0 if no data is available
            return { feature: canton, value: value };
        });

        const ctx = document.getElementById("mapTopoJSON").getContext("2d");

        // If a chart already exists, destroy it
        if (chart) {
            chart.destroy();
        }

        // Create a new chart
        chart = new Chart(ctx, {
            type: 'choropleth',
            data: {
                labels: cantons.map((d) => d.properties.name),
                datasets: [{
                    label: 'Cantons of Switzerland',
                    outline: cantons,
                    data: dataForMap
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
                        quantize: 5,
                        legend: {
                            position: 'bottom-right',
                            align: 'bottom'
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

        // Fülle amenityCountPerCanton mit den Daten aus data
        data.forEach(function (entry) {
            amenityCountPerCanton[entry._id] = entry.count;
        });

        // Aktualisiere die Karte mit den neuen Daten
        renderMapWithData(amenityCountPerCanton);
    });
}

// Initiieren der Karte mit der Standard-Amenität (Drinking Water)
updateMap('drinking_water');

// Dropdown-Änderungsereignis hinzufügen, um die Karte bei Auswahl zu aktualisieren
document.getElementById('amenitySelect').addEventListener('change', function () {
    var selectedAmenity = this.value;
    updateMap(selectedAmenity);
});
