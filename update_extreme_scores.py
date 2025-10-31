import json

# Lees het huidige bestand
with open('/home/ubuntu/standpuntverdeler/client/public/partij_standpunten.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Update scores voor extreem-rechtse partijen op specifieke thema's
# PVV: extreem-rechts op migratie, samenleving_inclusie
if 'PVV' in data['partijen']:
    data['partijen']['PVV']['standpunten']['migratie']['linksRechts'] = 10  # Extreem-rechts
    data['partijen']['PVV']['standpunten']['samenleving_inclusie']['linksRechts'] = 9  # Zeer rechts tot extreem

# FvD: extreem-rechts op migratie, samenleving_inclusie  
if 'FvD' in data['partijen']:
    data['partijen']['FvD']['standpunten']['migratie']['linksRechts'] = 10  # Extreem-rechts
    data['partijen']['FvD']['standpunten']['samenleving_inclusie']['linksRechts'] = 10  # Extreem-rechts

# JA21: zeer rechts tot extreem-rechts op migratie
if 'JA21' in data['partijen']:
    data['partijen']['JA21']['standpunten']['migratie']['linksRechts'] = 9  # Zeer rechts

# BIJ1: mogelijk extreem-links op bepaalde thema's (maar geen anti-democratisch)
# Laten we BIJ1 op -9 zetten voor sommige thema's (zeer links, net niet extreem)
if 'BIJ1' in data['partijen']:
    data['partijen']['BIJ1']['standpunten']['wonen']['linksRechts'] = -9
    data['partijen']['BIJ1']['standpunten']['migratie']['linksRechts'] = -9

# Schrijf terug
with open('/home/ubuntu/standpuntverdeler/client/public/partij_standpunten.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Extreme scores toegevoegd voor PVV, FvD, JA21, BIJ1")
