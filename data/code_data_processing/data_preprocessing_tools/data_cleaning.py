import json
import datetime as dt

def replace_chars(key):
    # Ersetzen von Umlauten und 'ß'
    replacements = {
        'ä': 'ae',
        'ö': 'oe',
        'ü': 'ue',
        'Ä': 'Ae',
        'Ö': 'Oe',
        'Ü': 'Ue',
        'ß': 'ss',
        'km²': 'km2',
        "Einwohnerdichte (Einwohner pro km²)": "Einwohner_pro_km2"
    }
    for german_char, replacement in replacements.items():
        key = key.replace(german_char, replacement)
    return key


def clean_key(key):
    key = replace_chars(key)
    key = key.replace(' ', '_').replace('.', '')
    return key


def rename_keys(data):
    renamed_data = []
    for item in data:
        new_item = {}
        for key, value in item.items():
            # Bereinigen des Schlüssels
            new_key = clean_key(key)
            new_item[new_key] = value
        renamed_data.append(new_item)
    return renamed_data


# Beispiel-Daten
data = [
    {
        "_id": "656f991754e6a2bcfcfdfc8a",
        "Gemeinde": "Aarau",
        "Kanton": "Aargau",
        "BFS-Nr.": 4001,
        "Einwohner": 21807,
        "Fläche in km²": 12.36,
        "Einwohnerdichte (Einwohner pro km²)": 1764.3,
        "Fahrradwege in km": 22.013198046243335
    },
    # Weitere Datenobjekte können hier hinzugefügt werden
]


def find_keys_with_dot(data, prefix=''):
    if isinstance(data, dict):
        for key, value in data.items():
            full_key = prefix + key
            if '.' in key:
                print(f"Found key with dot: {full_key}")
            find_keys_with_dot(value, full_key + '.')
    elif isinstance(data, list):
        for item in data:
            find_keys_with_dot(item, prefix)


def replace_dots_in_keys(document):
    if isinstance(document, dict):
        new_document = {}
        for key, value in document.items():
            new_key = key.replace('.', '_')
            new_document[new_key] = replace_dots_in_keys(value) if isinstance(value, (dict, list)) else value
        return new_document
    elif isinstance(document, list):
        return [replace_dots_in_keys(item) for item in document]
    else:
        return document


if __name__ == '__main__':

    with open('../../raw_data/2023-12-12_cleaned_amenity_file.json', 'r') as file:
        data = json.load(file)

    find_keys_with_dot(data)