let toggleState = false;
let chart, colorScale;
let cachedSwitzerlandData = null;
let mapToggleSwitch = document.querySelector(".map-toggle-switch");


// Eventlistener für absolute oder relative Werte in Karten-Diagramm


function loadFlaskServerData(amenityType, callback) {
    // Daten vom Flask Server abrufen
    fetch('/amenities_per_canton', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({amenity_type: amenityType}),
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


const cantonNameMapping = {
    'Zürich': 'Zürich',
    'Bern / Berne': 'Bern',
    'Luzern': 'Luzern',
    'Uri': 'Uri',
    'Schwyz': 'Schwyz',
    'Obwalden': 'Obwalden',
    'Nidwalden': 'Nidwalden',
    'Glarus': 'Glarus',
    'Zug': 'Zug',
    'Fribourg / Freiburg': 'Freiburg',
    'Solothurn': 'Solothurn',
    'Basel-Stadt': 'Basel-Stadt',
    'Basel-Landschaft': 'Basel-Landschaft',
    'Schaffhausen': 'Schaffhausen',
    'Appenzell Ausserrhoden': 'Appenzell Ausserrhoden',
    'Appenzell Innerrhoden': 'Appenzell Innerrhoden',
    'St. Gallen': 'St. Gallen',
    'Graubünden / Grigioni / Grischun': 'Graubünden',
    'Aargau': 'Aargau',
    'Thurgau': 'Thurgau',
    'Ticino': 'Tessin',
    'Vaud': 'Waadt',
    'Valais / Wallis': 'Wallis',
    'Neuchâtel': 'Neuenburg',
    'Genève': 'Genf',
    'Jura': 'Jura'
};

function renderMapWithData(amenityData) {
    getSwitzerlandData((switzerland) => {
        const cantons = ChartGeo.topojson.feature(switzerland, switzerland.objects.cantons).features;

        // Konvertieren der Rohdaten in das richtige Format für die Karte
        const dataForMap = cantons.map(canton => {
            const cantonId = cantonNameMapping[canton.properties.name]; // Mapping der Namen
            const value = amenityData[cantonId] || 0;
            return {feature: canton, value: value};
        });

        const maxValue = d3.max(Object.values(amenityData));

        colorScale = d3.scaleLinear()
            .domain([0, maxValue]) // Anpassen des domain-Bereichs an den neuen Datenbereich
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
                    backgroundColor: function (context) {
                        const data = context.dataset.data[context.dataIndex];
                        const value = data ? data.value : 1;
                        return colorScale(value);
                    }
                }]
            },
            options: {
                plugins: {
                    tooltip: {
                        displayColors: false,
                        position: 'nearest',
                    },
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
                        quantize: 10, //  Quantisierungsstufen
                        legend: {
                            position: 'bottom-right',
                            align: 'top'
                        },

                    },
                }
            }
        });
    });
}


// Einwohnerzahlen der Kantone
const einwohnerzahlen = {
    'Zürich': 1564662,
    'Bern': 1047422,
    'Luzern': 420326,
    'Uri': 37047,
    'Schwyz': 163689,
    'Obwalden': 38435,
    'Nidwalden': 43894,
    'Glarus': 41190,
    'Zug': 129787,
    'Freiburg': 329860,
    'Solothurn': 280245,
    'Basel-Stadt': 196036,
    'Basel-Landschaft': 292817,
    'Schaffhausen': 83995,
    'Appenzell Ausserrhoden': 55585,
    'Appenzell Innerrhoden': 16360,
    'St. Gallen': 519245,
    'Graubünden': 201376,
    'Aargau': 703086,
    'Thurgau': 285964,
    'Tessin': 352181,
    'Waadt': 822968,
    'Wallis': 353209,
    'Neuenburg': 176166,
    'Genf': 509448,
    'Jura': 73798
};


// Event Listener für den Toggle-Schalter
mapToggleSwitch.addEventListener("click", () => {
    toggleState = !toggleState; // Umschalten des Zustands
    const switchBtn = mapToggleSwitch.querySelector(".switch");
    switchBtn.classList.toggle("on", toggleState); // Toggle-Klasse für visuelle Darstellung
    updateMap(document.getElementById('amenitySelect').value); // Aktualisieren der Karte
});



// Funktion zum Updaten der Map
function updateMap(selectedAmenity) {
    loadFlaskServerData(selectedAmenity, function (data) {
        var amenityCountPerCanton = {};

        // Füllen von amenityCountPerCanton mit den Daten von Flask
        data.forEach(function (entry) {
            let count = entry.count;
            let einwohnerzahl = einwohnerzahlen[entry._id];
            if (einwohnerzahl) {
                // Berechnen der relativen Anzahl pro 1000 Einwohner, falls der Toggle aktiviert ist
                amenityCountPerCanton[entry._id] = toggleState ? (count * 1000 / einwohnerzahl) : count;
            } else {
                console.error('Keine Einwohnerzahl gefunden für:', entry._id);
            }
        });

        // Aktualisieren der Karte mit den neuen Daten
        renderMapWithData(amenityCountPerCanton);
    });
}


// Event Listener für Dropdown-Änderungen
document.getElementById('amenitySelect').addEventListener('change', function () {
    var selectedAmenity = this.value;
    updateMap(selectedAmenity);
});


// Initiieren der Karte mit der Standard-Annehmlichkeit (Trinkwasser)
updateMap('bicycle_parking');