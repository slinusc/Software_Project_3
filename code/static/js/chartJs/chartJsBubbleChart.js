fetch('https://swiss-maps.interactivethings.io/api/v0?shapes=cantons&format=topojson').then((r) => r.json()).then((switzerland) => {
  // Sie müssen den genauen Pfad zu den Topojson-Objekten der Schweiz anpassen
  const cantons = ChartGeo.topojson.feature(switzerland, switzerland.objects.cantons).features;

  const chart = new Chart(document.getElementById("meinBubbleChart").getContext("2d"), {
    type: 'choropleth',
    data: {
      labels: cantons.map((d) => d.properties.name), // Namen der Kantone
      datasets: [{
        label: 'Cantons',
        outline: cantons, // Kann entfernt werden, wenn kein Umriss benötigt wird
        data: cantons.map((d) => ({feature: d, value: Math.random() * 10})),
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
          projection: 'somerc' // Oder eine andere geeignete Projektion für die Schweiz
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
