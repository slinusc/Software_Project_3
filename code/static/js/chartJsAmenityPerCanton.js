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

            // Funktion zum Aktualisieren des Diagramms basierend auf der ausgewählten Amenität
            function updateChart(selectedAmenity) {
                loadFlaskServerData(selectedAmenity, function (data) {
                    // Daten aus dem Flask-Server direkt verwenden
                    var amenityCountPerCanton = {};

                    // Fülle amenityCountPerCanton mit den Daten aus data
                    data.forEach(function (entry) {
                        amenityCountPerCanton[entry._id] = entry.count;
                    });

                    // Sortiere die Daten nach der Anzahl der Amenities (absteigend)
                    var sortedData = Object.keys(amenityCountPerCanton)
                        .sort((a, b) => amenityCountPerCanton[b] - amenityCountPerCanton[a]);

                    // Diagramm aktualisieren
                    var ctx = document.getElementById('amenityChartCanvas').getContext('2d');
                    if (window.amenityChart) {
                        window.amenityChart.destroy(); // Zerstöre das vorhandene Diagramm, wenn es existiert
                    }
                    window.amenityChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: sortedData,
                            datasets: [{
                                label: 'Anzahl ' + selectedAmenity.replace('_', ' ').capitalize() + ' pro Kanton',
                                data: sortedData.map(canton => amenityCountPerCanton[canton]),
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                });
            }

                // Hinzufügen einer capitalize-Funktion zum Formatieren von Amenities für das Diagrammlabel
                String.prototype.capitalize = function () {
                    return this.charAt(0).toUpperCase() + this.slice(1);
                };

                // Initiieren des Diagramms mit der Standard-Amenität (Drinking Water)
                updateChart('drinking_water');

                // Dropdown-Änderungsereignis hinzufügen, um das Diagramm bei Auswahl zu aktualisieren
                document.getElementById('amenitySelect').addEventListener('change', function () {
                    var selectedAmenity = this.value;
                    updateChart(selectedAmenity);
                });