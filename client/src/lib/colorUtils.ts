/**
 * Bereken een kleur op basis van politieke positie op twee assen:
 * - Links-Rechts as: -10 (zeer links) tot +10 (zeer rechts)
 * - Progressief-Conservatief as: -10 (zeer progressief) tot +10 (zeer conservatief)
 * 
 * Kleurenschema:
 * - Links-Progressief: Helder Rood/Roze
 * - Links-Conservatief: Donker Rood/Bruin
 * - Centrum-Progressief: Helder Paars
 * - Centrum-Conservatief: Donker Paars/Grijs
 * - Rechts-Progressief: Helder Blauw/Cyaan
 * - Rechts-Conservatief: Donker Blauw/Navy
 */

export function calculatePoliticalColor(
  linksRechts: number, // -10 (links) tot +10 (rechts)
  progressiefConservatief: number // -10 (progressief) tot +10 (conservatief)
): string {
  // Normaliseer waarden naar 0-1 range
  const lr = (linksRechts + 10) / 20; // 0 = links, 1 = rechts
  const pc = (progressiefConservatief + 10) / 20; // 0 = progressief, 1 = conservatief
  
  // Bereken helderheid op basis van progressief-conservatief
  // Progressief = lichter/verzadigder, Conservatief = donkerder
  const lightness = 65 - (pc * 30); // 65% (progressief) tot 35% (conservatief)
  const saturation = 85 - (pc * 30); // 85% (progressief) tot 55% (conservatief)
  
  // Bereken hue op basis van links-rechts
  // Rood (0°) → Paars (300°) → Blauw (240°)
  let hue: number;
  if (lr < 0.5) {
    // Links naar centrum: rood (0°) naar paars (300°)
    hue = 0 + (lr * 2 * 300);
  } else {
    // Centrum naar rechts: paars (300°) naar blauw (240°)
    hue = 300 - ((lr - 0.5) * 2 * 60);
  }
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Bereken de gemiddelde politieke positie van een coalitie
 */
export function calculateCoalitionPosition(
  parties: Array<{ linksRechts: number; progressiefConservatief: number; zetels: number }>
): { linksRechts: number; progressiefConservatief: number } {
  const totalSeats = parties.reduce((sum, p) => sum + p.zetels, 0);
  
  if (totalSeats === 0) {
    return { linksRechts: 0, progressiefConservatief: 0 };
  }
  
  const weightedLR = parties.reduce((sum, p) => sum + (p.linksRechts * p.zetels), 0);
  const weightedPC = parties.reduce((sum, p) => sum + (p.progressiefConservatief * p.zetels), 0);
  
  return {
    linksRechts: weightedLR / totalSeats,
    progressiefConservatief: weightedPC / totalSeats
  };
}

/**
 * Geef een tekstuele beschrijving van de politieke positie
 */
export function describePoliticalPosition(
  linksRechts: number,
  progressiefConservatief: number
): string {
  let lrLabel = '';
  if (linksRechts < -5) lrLabel = 'zeer links';
  else if (linksRechts < -2) lrLabel = 'links';
  else if (linksRechts < 2) lrLabel = 'centrum';
  else if (linksRechts < 5) lrLabel = 'rechts';
  else lrLabel = 'zeer rechts';
  
  let pcLabel = '';
  if (progressiefConservatief < -5) pcLabel = 'zeer progressief';
  else if (progressiefConservatief < -2) pcLabel = 'progressief';
  else if (progressiefConservatief < 2) pcLabel = 'gematigd';
  else if (progressiefConservatief < 5) pcLabel = 'conservatief';
  else pcLabel = 'zeer conservatief';
  
  return `${lrLabel} en ${pcLabel}`;
}

/**
 * Geef een kleur voor de legenda-indicator
 */
export function getLegendColor(position: 'links' | 'centrum' | 'rechts', shade: 'licht' | 'donker'): string {
  const isLight = shade === 'licht';
  const lightness = isLight ? 65 : 35;
  const saturation = isLight ? 85 : 55;
  
  let hue: number;
  switch (position) {
    case 'links':
      hue = 0; // Rood
      break;
    case 'centrum':
      hue = 300; // Paars
      break;
    case 'rechts':
      hue = 240; // Blauw
      break;
  }
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
