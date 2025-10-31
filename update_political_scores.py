import json

# Politieke scores per partij per thema
# Links-Rechts: -10 (zeer links) tot +10 (zeer rechts)
# Progressief-Conservatief: -10 (zeer progressief) tot +10 (zeer conservatief)

political_scores = {
    "PVV": {
        "wonen": {"linksRechts": 3, "progressiefConservatief": 7},  # Rechts-conservatief (Nederlanders eerst)
        "zorg": {"linksRechts": -4, "progressiefConservatief": 4},  # Links-conservatief (sociaal maar traditioneel)
        "migratie": {"linksRechts": 8, "progressiefConservatief": 9},  # Zeer rechts-conservatief
        "belastingen": {"linksRechts": -2, "progressiefConservatief": 2},  # Centrum-links (lastenverlichting burgers)
        "samenleving_inclusie": {"linksRechts": 7, "progressiefConservatief": 9},  # Zeer conservatief
        "financiering": {"linksRechts": 5, "progressiefConservatief": 6}  # Rechts-conservatief (bezuinigen)
    },
    "D66": {
        "wonen": {"linksRechts": -3, "progressiefConservatief": -6},  # Links-progressief (bouwen, verduurzamen)
        "zorg": {"linksRechts": 0, "progressiefConservatief": -4},  # Centrum-progressief (modernisering)
        "migratie": {"linksRechts": -2, "progressiefConservatief": -5},  # Centrum-links-progressief (humaan, Europees)
        "belastingen": {"linksRechts": -4, "progressiefConservatief": -3},  # Links-progressief (vermogen belasten)
        "samenleving_inclusie": {"linksRechts": -5, "progressiefConservatief": -8},  # Links-zeer progressief
        "financiering": {"linksRechts": -2, "progressiefConservatief": -4}  # Centrum-links-progressief
    },
    "VVD": {
        "wonen": {"linksRechts": 6, "progressiefConservatief": 0},  # Rechts-gematigd (marktwerking)
        "zorg": {"linksRechts": 5, "progressiefConservatief": 1},  # Rechts-gematigd (marktwerking, eigen verantwoordelijkheid)
        "migratie": {"linksRechts": 6, "progressiefConservatief": 5},  # Rechts-conservatief (streng maar pragmatisch)
        "belastingen": {"linksRechts": 7, "progressiefConservatief": 2},  # Rechts (lastenverlichting, minder overheid)
        "samenleving_inclusie": {"linksRechts": 3, "progressiefConservatief": 0},  # Centrum-rechts-gematigd
        "financiering": {"linksRechts": 6, "progressiefConservatief": 3}  # Rechts (bezuinigen)
    },
    "GroenLinks-PvdA": {
        "wonen": {"linksRechts": -7, "progressiefConservatief": -5},  # Zeer links-progressief
        "zorg": {"linksRechts": -8, "progressiefConservatief": -3},  # Zeer links-progressief
        "migratie": {"linksRechts": -6, "progressiefConservatief": -7},  # Links-zeer progressief (open, inclusief)
        "belastingen": {"linksRechts": -8, "progressiefConservatief": -4},  # Zeer links (vermogen en bedrijven belasten)
        "samenleving_inclusie": {"linksRechts": -7, "progressiefConservatief": -9},  # Links-zeer progressief
        "financiering": {"linksRechts": -7, "progressiefConservatief": -5}  # Links-progressief (investeren)
    },
    "CDA": {
        "wonen": {"linksRechts": 1, "progressiefConservatief": 4},  # Centrum-conservatief
        "zorg": {"linksRechts": 0, "progressiefConservatief": 3},  # Centrum-conservatief (solidariteit)
        "migratie": {"linksRechts": 4, "progressiefConservatief": 6},  # Rechts-conservatief (christelijk-sociaal)
        "belastingen": {"linksRechts": 2, "progressiefConservatief": 3},  # Centrum-rechts-conservatief
        "samenleving_inclusie": {"linksRechts": 2, "progressiefConservatief": 6},  # Centrum-conservatief (christelijke waarden)
        "financiering": {"linksRechts": 1, "progressiefConservatief": 4}  # Centrum-conservatief
    },
    "JA21": {
        "wonen": {"linksRechts": 5, "progressiefConservatief": 5},  # Rechts-conservatief
        "zorg": {"linksRechts": 4, "progressiefConservatief": 4},  # Rechts-conservatief
        "migratie": {"linksRechts": 7, "progressiefConservatief": 7},  # Zeer rechts-conservatief
        "belastingen": {"linksRechts": 6, "progressiefConservatief": 3},  # Rechts (liberaal)
        "samenleving_inclusie": {"linksRechts": 6, "progressiefConservatief": 7},  # Rechts-conservatief
        "financiering": {"linksRechts": 5, "progressiefConservatief": 5}  # Rechts-conservatief
    },
    "FVD": {
        "wonen": {"linksRechts": 4, "progressiefConservatief": 6},  # Rechts-conservatief
        "zorg": {"linksRechts": 3, "progressiefConservatief": 5},  # Centrum-rechts-conservatief
        "migratie": {"linksRechts": 9, "progressiefConservatief": 8},  # Zeer rechts-zeer conservatief
        "belastingen": {"linksRechts": 5, "progressiefConservatief": 4},  # Rechts-conservatief
        "samenleving_inclusie": {"linksRechts": 8, "progressiefConservatief": 9},  # Zeer rechts-zeer conservatief
        "financiering": {"linksRechts": 6, "progressiefConservatief": 6}  # Rechts-conservatief
    },
    "BBB": {
        "wonen": {"linksRechts": 2, "progressiefConservatief": 3},  # Centrum-rechts-gematigd
        "zorg": {"linksRechts": 0, "progressiefConservatief": 2},  # Centrum-gematigd
        "migratie": {"linksRechts": 4, "progressiefConservatief": 5},  # Rechts-conservatief
        "belastingen": {"linksRechts": 1, "progressiefConservatief": 2},  # Centrum-gematigd
        "samenleving_inclusie": {"linksRechts": 3, "progressiefConservatief": 5},  # Centrum-rechts-conservatief
        "financiering": {"linksRechts": 2, "progressiefConservatief": 3}  # Centrum-rechts-gematigd
    },
    "DENK": {
        "wonen": {"linksRechts": -5, "progressiefConservatief": -4},  # Links-progressief
        "zorg": {"linksRechts": -6, "progressiefConservatief": -2},  # Links-progressief
        "migratie": {"linksRechts": -7, "progressiefConservatief": -6},  # Links-progressief (inclusief)
        "belastingen": {"linksRechts": -5, "progressiefConservatief": -3},  # Links-progressief
        "samenleving_inclusie": {"linksRechts": -6, "progressiefConservatief": -7},  # Links-zeer progressief
        "financiering": {"linksRechts": -5, "progressiefConservatief": -4}  # Links-progressief
    },
    "SGP": {
        "wonen": {"linksRechts": 1, "progressiefConservatief": 8},  # Centrum-zeer conservatief
        "zorg": {"linksRechts": 0, "progressiefConservatief": 7},  # Centrum-zeer conservatief
        "migratie": {"linksRechts": 5, "progressiefConservatief": 8},  # Rechts-zeer conservatief
        "belastingen": {"linksRechts": 2, "progressiefConservatief": 6},  # Centrum-rechts-conservatief
        "samenleving_inclusie": {"linksRechts": 4, "progressiefConservatief": 10},  # Rechts-extreem conservatief (christelijk)
        "financiering": {"linksRechts": 1, "progressiefConservatief": 7}  # Centrum-zeer conservatief
    },
    "SP": {
        "wonen": {"linksRechts": -8, "progressiefConservatief": -2},  # Zeer links-progressief
        "zorg": {"linksRechts": -9, "progressiefConservatief": -1},  # Zeer links-progressief
        "migratie": {"linksRechts": -4, "progressiefConservatief": 2},  # Links-gematigd (sociaal maar voorzichtig)
        "belastingen": {"linksRechts": -9, "progressiefConservatief": -2},  # Zeer links (hoge belastingen voor rijken)
        "samenleving_inclusie": {"linksRechts": -6, "progressiefConservatief": -4},  # Links-progressief
        "financiering": {"linksRechts": -8, "progressiefConservatief": -3}  # Zeer links (investeren)
    },
    "PvdD": {
        "wonen": {"linksRechts": -5, "progressiefConservatief": -7},  # Links-zeer progressief (duurzaam)
        "zorg": {"linksRechts": -6, "progressiefConservatief": -5},  # Links-progressief
        "migratie": {"linksRechts": -5, "progressiefConservatief": -6},  # Links-progressief (humaan)
        "belastingen": {"linksRechts": -6, "progressiefConservatief": -5},  # Links-progressief
        "samenleving_inclusie": {"linksRechts": -6, "progressiefConservatief": -8},  # Links-zeer progressief
        "financiering": {"linksRechts": -5, "progressiefConservatief": -6}  # Links-progressief (duurzaam)
    },
    "ChristenUnie": {
        "wonen": {"linksRechts": -1, "progressiefConservatief": 5},  # Centrum-links-conservatief (sociaal)
        "zorg": {"linksRechts": -2, "progressiefConservatief": 4},  # Centrum-links-conservatief
        "migratie": {"linksRechts": 2, "progressiefConservatief": 6},  # Centrum-rechts-conservatief (christelijk)
        "belastingen": {"linksRechts": 0, "progressiefConservatief": 4},  # Centrum-conservatief
        "samenleving_inclusie": {"linksRechts": 1, "progressiefConservatief": 8},  # Centrum-zeer conservatief (christelijk)
        "financiering": {"linksRechts": 0, "progressiefConservatief": 5}  # Centrum-conservatief
    },
    "50PLUS": {
        "wonen": {"linksRechts": -3, "progressiefConservatief": 2},  # Links-gematigd (ouderen)
        "zorg": {"linksRechts": -4, "progressiefConservatief": 3},  # Links-gematigd (ouderenzorg)
        "migratie": {"linksRechts": 1, "progressiefConservatief": 4},  # Centrum-conservatief
        "belastingen": {"linksRechts": -2, "progressiefConservatief": 2},  # Centrum-links-gematigd
        "samenleving_inclusie": {"linksRechts": 0, "progressiefConservatief": 3},  # Centrum-gematigd
        "financiering": {"linksRechts": -1, "progressiefConservatief": 2}  # Centrum-gematigd
    },
    "Volt": {
        "wonen": {"linksRechts": -4, "progressiefConservatief": -7},  # Links-zeer progressief (Europees, duurzaam)
        "zorg": {"linksRechts": -3, "progressiefConservatief": -6},  # Links-progressief (innovatie)
        "migratie": {"linksRechts": -5, "progressiefConservatief": -8},  # Links-zeer progressief (Europees, open)
        "belastingen": {"linksRechts": -4, "progressiefConservatief": -5},  # Links-progressief
        "samenleving_inclusie": {"linksRechts": -5, "progressiefConservatief": -9},  # Links-zeer progressief
        "financiering": {"linksRechts": -4, "progressiefConservatief": -6}  # Links-progressief (Europees, investeren)
    }
}

# Lees het huidige JSON bestand
with open('/home/ubuntu/standpuntverdeler/client/public/partij_standpunten.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Voeg politieke scores toe aan elke partij
for party_key, party_data in data['partijen'].items():
    if party_key in political_scores:
        for theme_key, theme_data in party_data['standpunten'].items():
            if theme_key in political_scores[party_key]:
                theme_data['linksRechts'] = political_scores[party_key][theme_key]['linksRechts']
                theme_data['progressiefConservatief'] = political_scores[party_key][theme_key]['progressiefConservatief']

# Schrijf terug naar het bestand
with open('/home/ubuntu/standpuntverdeler/client/public/partij_standpunten.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Politieke scores toegevoegd aan partij_standpunten.json")
