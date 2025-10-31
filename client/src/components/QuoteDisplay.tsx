import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculatePoliticalColor } from '@/lib/colorUtils';

interface QuoteDisplayProps {
  partiesData: any;
  selectedParties: { [key: string]: boolean };
  selectedTheme: string;
}

export default function QuoteDisplay({ partiesData, selectedParties, selectedTheme }: QuoteDisplayProps) {
  if (!partiesData || !partiesData.partijen) {
    return null;
  }

  const selectedPartiesData = Object.entries(partiesData.partijen)
    .filter(([key]) => selectedParties[key])
    .sort((a: any, b: any) => b[1].zetels - a[1].zetels);

  if (selectedPartiesData.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold font-serif">
        Standpunten per partij
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedPartiesData.map(([key, party]: [string, any]) => {
          const standpunt = party.standpunten[selectedTheme];
          
          // Bereken de kleur op basis van politieke positie (zelfde als in Parliament)
          const color = calculatePoliticalColor(
            standpunt.linksRechts || 0,
            standpunt.progressiefConservatief || 0
          );
          
          return (
            <Card key={key} className="border hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-3">
                  <span 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-semibold">{party.naam}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {standpunt.positie}
                </p>
                <blockquote className="text-base leading-relaxed border-l-2 border-muted pl-4 py-2">
                  <span className="text-foreground/90 italic">"{standpunt.quote}"</span>
                </blockquote>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
