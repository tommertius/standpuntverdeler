import { useMemo, useState } from 'react';
import { calculatePoliticalColor, calculateCoalitionPosition, describePoliticalPosition, getLegendColor } from '@/lib/colorUtils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

interface Seat {
  x: number;
  y: number;
  party?: string;
  color?: string;
  index: number;
}

interface ParliamentProps {
  selectedParties: { [key: string]: boolean };
  partiesData: any;
  selectedTheme: string;
}

export default function Parliament({ selectedParties, partiesData, selectedTheme }: ParliamentProps) {
  const [isLegendOpen, setIsLegendOpen] = useState(false);

  const seats = useMemo(() => {
    // Genereer 150 zetels in een halve boog
    const totalSeats = 150;
    const rows = 10; // Aantal rijen
    const result: Seat[] = [];
    
    let seatIndex = 0;
    
    for (let row = 0; row < rows; row++) {
      // Bereken het aantal zetels per rij (meer naar buiten toe)
      const seatsInRow = Math.ceil((row + 5) * 3.2);
      const radius = 100 + row * 25; // Straal neemt toe per rij
      
      for (let i = 0; i < seatsInRow && seatIndex < totalSeats; i++) {
        // Bereken de hoek (van 0 tot π voor een halve cirkel)
        const angle = (Math.PI / (seatsInRow - 1)) * i;
        
        // Bereken x en y coördinaten
        const x = 300 + radius * Math.cos(angle);
        const y = 350 - radius * Math.sin(angle);
        
        result.push({ x, y, index: seatIndex });
        seatIndex++;
      }
    }
    
    return result.slice(0, totalSeats);
  }, []);

  // Wijs zetels toe aan partijen op basis van selectie - VAN LINKS NAAR RECHTS
  const assignedSeats = useMemo(() => {
    if (!partiesData || !partiesData.partijen) return seats;
    
    const assigned = [...seats];
    
    // Sorteer partijen op aantal zetels (aflopend)
    const sortedParties = Object.entries(partiesData.partijen)
      .filter(([key]) => selectedParties[key])
      .sort((a: any, b: any) => b[1].zetels - a[1].zetels);
    
    // Sorteer zetels van links naar rechts (op basis van x-coördinaat)
    const sortedSeats = [...assigned].sort((a, b) => a.x - b.x);
    
    let currentIndex = 0;
    
    for (const [partyKey, partyData] of sortedParties) {
      const party = partyData as any;
      const numSeats = party.zetels;
      const themeStandpunt = party.standpunten[selectedTheme];
      
      if (!themeStandpunt) continue;
      
      // Bereken kleur op basis van politieke positie
      const color = calculatePoliticalColor(
        themeStandpunt.linksRechts || 0,
        themeStandpunt.progressiefConservatief || 0
      );
      
      for (let i = 0; i < numSeats && currentIndex < sortedSeats.length; i++) {
        const seatToAssign = sortedSeats[currentIndex];
        const originalIndex = assigned.findIndex(s => s.index === seatToAssign.index);
        
        assigned[originalIndex] = {
          ...assigned[originalIndex],
          party: party.naam,
          color: color
        };
        currentIndex++;
      }
    }
    
    return assigned;
  }, [seats, selectedParties, partiesData, selectedTheme]);

  // Bereken aantal gevulde zetels
  const filledSeats = assignedSeats.filter(seat => seat.party).length;

  // Verzamel unieke partijen en kleuren voor legenda
  const legend = useMemo(() => {
    const uniqueParties = new Map<string, { name: string; color: string; seats: number }>();
    
    assignedSeats.forEach(seat => {
      if (seat.party && seat.color) {
        if (!uniqueParties.has(seat.party)) {
          uniqueParties.set(seat.party, {
            name: seat.party,
            color: seat.color,
            seats: 1
          });
        } else {
          const existing = uniqueParties.get(seat.party)!;
          existing.seats += 1;
        }
      }
    });
    
    return Array.from(uniqueParties.values()).sort((a, b) => b.seats - a.seats);
  }, [assignedSeats]);

  // Bereken coalitie positie
  const coalitionPosition = useMemo(() => {
    if (!partiesData || !partiesData.partijen) return null;
    
    const selectedPartiesData = Object.entries(partiesData.partijen)
      .filter(([key]) => selectedParties[key])
      .map(([_, party]: [string, any]) => {
        const themeStandpunt = party.standpunten[selectedTheme];
        return {
          linksRechts: themeStandpunt?.linksRechts || 0,
          progressiefConservatief: themeStandpunt?.progressiefConservatief || 0,
          zetels: party.zetels
        };
      });
    
    if (selectedPartiesData.length === 0) return null;
    
    return calculateCoalitionPosition(selectedPartiesData);
  }, [selectedParties, partiesData, selectedTheme]);

  return (
    <div className="w-full space-y-6">
      {/* Zetelteller */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          <span className="font-bold text-lg text-foreground">{filledSeats}</span> van de{' '}
          <span className="font-bold text-lg text-foreground">150</span> zetels gevuld
        </p>
      </div>

      {/* Parliament visualisatie */}
      <div className="flex justify-center">
        <svg width="600" height="400" viewBox="0 0 600 400" className="max-w-full h-auto">
          {/* Achtergrond halve cirkel */}
          <path
            d="M 50 350 A 250 250 0 0 1 550 350"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          
          {/* Zetels */}
          {assignedSeats.map((seat, index) => (
            <circle
              key={index}
              cx={seat.x}
              cy={seat.y}
              r="5"
              fill={seat.color || 'hsl(var(--muted))'}
              stroke="hsl(var(--foreground))"
              strokeWidth="0.5"
              opacity={seat.party ? 1 : 0.3}
            />
          ))}
          
          {/* Podium lijn */}
          <line
            x1="50"
            y1="350"
            x2="550"
            y2="350"
            stroke="hsl(var(--foreground))"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* PROMINENTE Coalitie samenvatting */}
      {coalitionPosition && legend.length > 0 && (
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 border-2 border-primary/20">
          <p className="text-center text-xl md:text-2xl font-serif">
            <span className="text-muted-foreground">Deze coalitie is: </span>
            <span className="font-bold text-foreground">
              {describePoliticalPosition(coalitionPosition.linksRechts, coalitionPosition.progressiefConservatief)}
            </span>
            <span className="text-muted-foreground"> op het thema </span>
            <span className="font-semibold text-foreground">{partiesData?.themas[selectedTheme]?.naam.toLowerCase()}</span>
          </p>
        </div>
      )}

      {/* Legenda en uitleg */}
      {legend.length > 0 && (
        <div className="border-t pt-4 space-y-4">
          {/* Partijen legenda */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Geselecteerde partijen</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {legend.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border border-foreground/20 flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground ml-1">({item.seats})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Inklapbare kleurenschema uitleg */}
          <Collapsible open={isLegendOpen} onOpenChange={setIsLegendOpen}>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium hover:underline">
              <span>Wat betekenen deze kleuren?</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isLegendOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <p className="text-xs text-muted-foreground">
                  De kleuren tonen de politieke positie van elke partij op het thema <strong>{partiesData?.themas[selectedTheme]?.naam}</strong>
                </p>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="font-medium mb-2">Links ↔ Rechts</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getLegendColor('zeer_links', 'licht') }} />
                        <span>Zeer links (groen)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getLegendColor('links', 'licht') }} />
                        <span>Links (rood)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getLegendColor('centrum', 'licht') }} />
                        <span>Centrum (paars)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getLegendColor('rechts', 'licht') }} />
                        <span>Rechts (blauw)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-medium mb-2">Progressief ↔ Conservatief</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getLegendColor('centrum', 'licht') }} />
                        <span>Progressief (lichte kleuren)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getLegendColor('centrum', 'donker') }} />
                        <span>Conservatief (donkere kleuren)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}
    </div>
  );
}
