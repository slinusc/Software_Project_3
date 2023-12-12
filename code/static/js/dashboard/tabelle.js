let search = document.querySelector('.input-group input'),
    table_rows = document.querySelectorAll('tbody tr'),
    table_headings = document.querySelectorAll('thead th');


// Funktion, die den Status basierend auf Fahrradwege pro km2 zurückgibt
function getStatus(fahrradwegeProKm2) {
    if (fahrradwegeProKm2 < 1) {
        return `<p class="status wenig">wenig</p>`;
    } else if (fahrradwegeProKm2 <= 2) {
        return `<p class="status mittel">mittel</p>`;
    } else {
        return `<p class="status viel">viel</p>`;
    }
}

// Funktion zum Abrufen von Daten und Aktualisieren der Tabelle
function updateTable() {
    fetch('/bike_ways', {method: 'POST'})
        .then(response => response.json())
        .then(data => {
            // Sicherstellen, dass die Tabelle existiert
            const tableBody = document.querySelector('.table__body tbody');
            if (tableBody) {
                // Leeren Sie den aktuellen Inhalt der Tabelle
                tableBody.innerHTML = '';

                // Iterieren über jedes Item und erstellen Sie die Tabellenzeilen
                data.forEach(item => {
                    const table_rows = document.createElement('tr');
                    table_rows.innerHTML = `
                        <td>${item.Gemeinde}</td>
                        <td>${item['Fahrradwege_pro_km2'].toFixed(2)} km</td>
                        <td>${getStatus(item['Fahrradwege_pro_km2'])}</td>
                        <td>${item['Flaeche_in_km2']} km²</td>
                        <td>${item['Fahrradwege_in_km']} km</td>
                        `;
                    // Füge die neue Zeile der Tabelle hinzu
                    tableBody.appendChild(table_rows);
                });

                // Aktualisieren Sie die Referenz auf die Tabellenzeilen
                table_rows = document.querySelectorAll('tbody tr');
                sortTable(1, true)
            }
        })
        .catch(error => console.error('Fehler beim Abrufen der Daten:', error));
}

// Ruft die Funktion updateTable auf, um die Tabelle zu initialisieren, wenn die Seite geladen wird
document.addEventListener('DOMContentLoaded', updateTable);

// 1. Searching for specific data of HTML table
search.addEventListener('input', searchTable);

function searchTable() {
    table_rows.forEach((row, i) => {
        let table_data = row.cells[0].textContent.toLowerCase(),
            search_data = search.value.toLowerCase();

        row.classList.toggle('hide', table_data.indexOf(search_data) < 0);
        row.style.setProperty('--delay', i / 2 + 's');
    });

    document.querySelectorAll('tbody tr:not(.hide)').forEach((visible_row, i) => {
        visible_row.style.backgroundColor = (i % 2 == 0) ? 'transparent' : '#0000000b';
    });
}


// 2. Sorting | Ordering data of HTML table
table_headings.forEach((head, i) => {
    let sort_asc = true;
    head.onclick = () => {
        table_headings.forEach(head => head.classList.remove('active'));
        head.classList.add('active');

        document.querySelectorAll('td').forEach(td => td.classList.remove('active'));
        table_rows.forEach(row => {
            row.querySelectorAll('td')[i].classList.add('active');
        })

        head.classList.toggle('asc', sort_asc);
        sort_asc = !head.classList.contains('asc');

        sortTable(i, sort_asc);
    }
})

function sortTable(column, sort_asc) {
    [...table_rows].sort((a, b) => {
        // Bestimmen Sie, ob die Spalte 3 oder 4 ist, und verwenden Sie in beiden Fällen den Wert von Spalte 3 für den Vergleich
        let columnIndex = (column === 1 || column === 2) ? 1 : column;

        let first_row = a.querySelectorAll('td')[columnIndex].textContent.toLowerCase(),
            second_row = b.querySelectorAll('td')[columnIndex].textContent.toLowerCase();

        // Konvertieren Sie die Werte in Zahlen für alle Spalten außer der ersten
        if (columnIndex !== 0) {
            first_row = parseFloat(first_row);
            second_row = parseFloat(second_row);
        }

        // Sortierlogik
        return sort_asc ? (first_row < second_row ? 1 : -1) : (first_row < second_row ? -1 : 1);
    })
    .map(sorted_row => document.querySelector('tbody').appendChild(sorted_row));
}

