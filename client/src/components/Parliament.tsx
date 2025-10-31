import { useMemo } from 'react';

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
      const color = party.standpunten[selectedTheme]?.kleur || '#999999';
      
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

  return (
    <div className="w-full space-y-4">
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

      {/* Legenda */}
      {legend.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold mb-3">Legenda</h4>
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
          <p className="text-xs text-muted-foreground mt-3">
            Kleuren gebaseerd op standpunt over: <strong>{partiesData?.themas[selectedTheme]?.naam}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
