import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
          
          return (
            <Card key={key} className="border-2" style={{ borderColor: standpunt.kleur }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>{party.naam}</span>
                  <span 
                    className="w-4 h-4 rounded-full border border-foreground/20"
                    style={{ backgroundColor: standpunt.kleur }}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {standpunt.positie}
                </p>
                <blockquote className="text-sm italic border-l-4 pl-3 py-1" style={{ borderColor: standpunt.kleur }}>
                  "{standpunt.quote}"
                </blockquote>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
