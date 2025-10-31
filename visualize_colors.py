#!/usr/bin/env python3
"""
Script om het kleurenschema per partij per thema te visualiseren
"""

import json
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.colors import to_rgb
import numpy as np

# Laad de partijstandpunten
with open('partij_standpunten.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Thema's
themas = list(data['themas'].keys())
thema_namen = [data['themas'][t]['naam'] for t in themas]

# Partijen (gesorteerd op zetels)
partijen_data = data['partijen']
partijen_sorted = sorted(partijen_data.items(), key=lambda x: x[1]['zetels'], reverse=True)

# Maak een visualisatie
fig, axes = plt.subplots(len(themas), 1, figsize=(14, 3 * len(themas)))
fig.suptitle('Politieke Kleuren per Thema - De Standpuntverdeler', fontsize=16, fontweight='bold')

for idx, thema in enumerate(themas):
    ax = axes[idx] if len(themas) > 1 else axes
    
    # Verzamel kleuren en partijnamen voor dit thema
    colors = []
    labels = []
    zetels = []
    
    for partij_key, partij_info in partijen_sorted:
        if partij_info['zetels'] > 0:  # Alleen partijen met zetels
            kleur = partij_info['standpunten'][thema]['kleur']
            colors.append(kleur)
            labels.append(f"{partij_info['naam']} ({partij_info['zetels']})")
            zetels.append(partij_info['zetels'])
    
    # Maak een horizontale bar chart
    y_pos = np.arange(len(labels))
    ax.barh(y_pos, zetels, color=colors, edgecolor='black', linewidth=0.5)
    
    ax.set_yticks(y_pos)
    ax.set_yticklabels(labels, fontsize=9)
    ax.set_xlabel('Aantal zetels', fontsize=10)
    ax.set_title(f'Thema: {thema_namen[idx]}', fontsize=12, fontweight='bold')
    ax.grid(axis='x', alpha=0.3)
    ax.set_xlim(0, max(zetels) + 2)

plt.tight_layout()
plt.savefig('kleurenschema_per_thema.png', dpi=300, bbox_inches='tight')
print("Visualisatie opgeslagen als: kleurenschema_per_thema.png")

# Maak ook een overzicht van alle kleuren per partij
fig2, ax2 = plt.subplots(figsize=(16, 10))

# Maak een grid van kleuren
n_partijen = len([p for p in partijen_sorted if p[1]['zetels'] > 0])
n_themas = len(themas)

# Maak een matrix van kleuren
color_matrix = []
partij_labels = []

for partij_key, partij_info in partijen_sorted:
    if partij_info['zetels'] > 0:
        partij_labels.append(f"{partij_info['naam']} ({partij_info['zetels']} zetels)")
        row_colors = []
        for thema in themas:
            kleur = partij_info['standpunten'][thema]['kleur']
            row_colors.append(to_rgb(kleur))
        color_matrix.append(row_colors)

# Plot de matrix
color_matrix = np.array(color_matrix)
ax2.imshow(color_matrix, aspect='auto')

# Zet labels
ax2.set_xticks(np.arange(n_themas))
ax2.set_yticks(np.arange(n_partijen))
ax2.set_xticklabels(thema_namen, rotation=45, ha='right', fontsize=10)
ax2.set_yticklabels(partij_labels, fontsize=10)

# Voeg grid toe
ax2.set_xticks(np.arange(n_themas) - 0.5, minor=True)
ax2.set_yticks(np.arange(n_partijen) - 0.5, minor=True)
ax2.grid(which='minor', color='white', linestyle='-', linewidth=2)

ax2.set_title('Kleurenschema per Partij per Thema', fontsize=14, fontweight='bold', pad=20)

plt.tight_layout()
plt.savefig('kleurenschema_matrix.png', dpi=300, bbox_inches='tight')
print("Matrix visualisatie opgeslagen als: kleurenschema_matrix.png")

print("\nKleurenschema succesvol gevisualiseerd!")
