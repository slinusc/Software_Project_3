var ctx = document.getElementById('meinBubbleChart').getContext('2d');
        var meinBubbleChart = new Chart(ctx, {
            type: 'bubble',
            data: {
                datasets: [{
                    label: 'data', // no label
                    data: [{
                        x:  8.6339,
                        y: 47.6965,
                        r: 20
                    }, {
                        x: 40,
                        y: 10,
                        r: 10
                    }],
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
                    x: { // longitude
                        type: 'linear',
                        position: 'bottom',
                        min: 5.95590, // minimaler Längengrad der Schweiz
                        max: 10.49219, // maximaler Längengrad der Schweiz
                        grid: {
                        drawBorder: false,
                        drawTicks: true,
                        drawOnChartArea: false
            },
            ticks: {
                display: false
            }

                    },
                    y: { // latitude
                        type: 'linear',
                        min: 45.81796, // minimaler Breitengrad der Schweiz
                        max: 47.80845, // maximaler Breitengrad der Schweiz
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

    // Weitere Optionen und Konfigurationen
}

        });