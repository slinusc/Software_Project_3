let search = document.querySelector('.input-group input'),
    table_rows = document.querySelectorAll('tbody tr'),
    table_headings = document.querySelectorAll('thead th');


// Funktion zum Anwenden der alternierenden Farben
function applyAlternatingRowColors() {
    // Auswählen der Zeilen
    let visibleRows = Array.from(document.querySelectorAll('tbody tr:not(.hide)'));
    visibleRows.forEach((row, index) => {
        // Setzen der Hintergrundfarbe für die gesamte Zeile basierend auf dem Index der Zeile
        let backgroundColor = index % 2 === 0 ? 'var(--body-color)' : 'var(--sidebar-color)';
        row.style.backgroundColor = backgroundColor;

        // Setzen der Hintergrundfarbe für die erste Zelle der Zeile
        let firstCell = row.cells[0];
        if (firstCell) {
            firstCell.style.backgroundColor = backgroundColor;
        }
        row.style.opacity = "1";
    });
}

// Funktion zum Abrufen und Anzeigen von Daten und Aktualisieren der Tabelle
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
                applyAlternatingRowColors();
            }
        })
        .catch(error => console.error('Fehler beim Abrufen der Daten:', error));
}


// Funktion zum Suchen nach Daten in der Tabelle
function searchTable() {
    table_rows.forEach((row, i) => {
        let table_data = row.cells[0].textContent.toLowerCase(),
            search_data = search.value.toLowerCase();

        // Zeile verstecken oder anzeigen basierend auf der Suche
        row.classList.toggle('hide', !table_data.includes(search_data));
    });

    // Aufrufen der Funktion für alternierende Farben
    applyAlternatingRowColors();
}


// Funktion zum Sortieren der Zeilen der Tabelle
function sortTable(column, sort_asc) {
    [...table_rows].sort((a, b) => {
        // Bestimmen Sie, ob es die Spalte 2 oder 3 ist, und verwenden Sie in beiden Fällen den Wert von Spalte 2 für den Vergleich
        let columnIndex = (column === 1 || column === 2) ? 1 : column;

        let first_row = a.querySelectorAll('td')[columnIndex].textContent.toLowerCase(),
            second_row = b.querySelectorAll('td')[columnIndex].textContent.toLowerCase();

        // Konvertierung deer Werte in Zahlen für alle Spalten ausser der ersten
        if (columnIndex !== 0) {
            first_row = parseFloat(first_row);
            second_row = parseFloat(second_row);
        }

        // Sortierlogik2
        return sort_asc ? (first_row < second_row ? 1 : -1) : (first_row < second_row ? -1 : 1);
    })
        .map(sorted_row => document.querySelector('tbody').appendChild(sorted_row));
    applyAlternatingRowColors();
}


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


// Ruft die Funktion updateTable auf, um die Tabelle zu initialisieren, wenn die Seite geladen wird
document.addEventListener('DOMContentLoaded', updateTable);


// Event Listener für die Suchleiste
search.addEventListener('input', searchTable);


// Sortieren der Tabelle
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


