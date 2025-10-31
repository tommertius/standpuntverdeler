import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PartySelectorProps {
  partiesData: any;
  selectedParties: { [key: string]: boolean };
  onToggleParty: (partyKey: string) => void;
}

export default function PartySelector({ partiesData, selectedParties, onToggleParty }: PartySelectorProps) {
  if (!partiesData || !partiesData.partijen) {
    return <div>Laden...</div>;
  }

  // Sorteer partijen op aantal zetels
  const sortedParties = Object.entries(partiesData.partijen)
    .sort((a: any, b: any) => b[1].zetels - a[1].zetels);

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold font-serif">
        Selecteer partijen
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {sortedParties.map(([key, party]: [string, any]) => {
          if (party.zetels === 0) return null;
          
          const isSelected = selectedParties[key];
          
          return (
            <Button
              key={key}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onToggleParty(key)}
              className="flex items-center justify-between gap-2 h-auto py-2 px-3"
            >
              <span className="font-medium text-sm">{party.naam}</span>
              <Badge variant="secondary" className="text-xs">
                {party.zetels}
              </Badge>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
