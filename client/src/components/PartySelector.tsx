import { Checkbox } from '@/components/ui/checkbox';

interface PartySelectorProps {
  partiesData: any;
  selectedParties: { [key: string]: boolean };
  onToggleParty: (partyKey: string) => void;
}

export default function PartySelector({ partiesData, selectedParties, onToggleParty }: PartySelectorProps) {
  if (!partiesData || !partiesData.partijen) {
    return <div>Laden...</div>;
  }

  // Sorteer partijen op aantal zetels (groot naar klein)
  const sortedParties = Object.entries(partiesData.partijen)
    .filter(([_, party]: [string, any]) => party.zetels > 0)
    .sort((a: any, b: any) => b[1].zetels - a[1].zetels);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium block">Selecteer partijen</label>
      <div className="border rounded-md p-3 max-h-[400px] overflow-y-auto space-y-2">
        {sortedParties.map(([key, party]: [string, any]) => {
          const isSelected = selectedParties[key];
          
          return (
            <div
              key={key}
              className="flex items-center justify-between p-2 hover:bg-muted/50 rounded cursor-pointer transition-colors"
              onClick={() => onToggleParty(key)}
            >
              <div className="flex items-center gap-3 flex-1">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onToggleParty(key)}
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="font-medium text-sm">{party.naam}</span>
              </div>
              <span className="text-sm text-muted-foreground font-mono">
                {party.zetels} zetels
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
