import { useMemo } from 'react';

interface Seat {
  x: number;
  y: number;
  party?: string;
  color?: string;
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
        
        result.push({ x, y });
        seatIndex++;
      }
    }
    
    return result.slice(0, totalSeats);
  }, []);

  // Wijs zetels toe aan partijen op basis van selectie
  const assignedSeats = useMemo(() => {
    if (!partiesData || !partiesData.partijen) return seats;
    
    const assigned = [...seats];
    let currentIndex = 0;
    
    // Sorteer partijen op aantal zetels (aflopend)
    const sortedParties = Object.entries(partiesData.partijen)
      .filter(([key]) => selectedParties[key])
      .sort((a: any, b: any) => b[1].zetels - a[1].zetels);
    
    for (const [partyKey, partyData] of sortedParties) {
      const party = partyData as any;
      const numSeats = party.zetels;
      const color = party.standpunten[selectedTheme]?.kleur || '#999999';
      
      for (let i = 0; i < numSeats && currentIndex < assigned.length; i++) {
        assigned[currentIndex] = {
          ...assigned[currentIndex],
          party: party.naam,
          color: color
        };
        currentIndex++;
      }
    }
    
    return assigned;
  }, [seats, selectedParties, partiesData, selectedTheme]);

  return (
    <div className="w-full flex justify-center">
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
  );
}
