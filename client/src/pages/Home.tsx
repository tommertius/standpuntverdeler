import { useState, useEffect } from 'react';
import Parliament from '@/components/Parliament';
import PartySelector from '@/components/PartySelector';
import ThemeSelector from '@/components/ThemeSelector';
import QuoteDisplay from '@/components/QuoteDisplay';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  const [partiesData, setPartiesData] = useState<any>(null);
  const [selectedParties, setSelectedParties] = useState<{ [key: string]: boolean }>({});
  const [selectedTheme, setSelectedTheme] = useState<string>('wonen');

  useEffect(() => {
    // Laad partijstandpunten
    fetch('/partij_standpunten.json')
      .then(res => res.json())
      .then(data => {
        setPartiesData(data);
      })
      .catch(err => console.error('Fout bij laden data:', err));
  }, []);

  const handleToggleParty = (partyKey: string) => {
    setSelectedParties(prev => ({
      ...prev,
      [partyKey]: !prev[partyKey]
    }));
  };

  const handleSelectTheme = (themeKey: string) => {
    setSelectedTheme(themeKey);
  };

  if (!partiesData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
            Laden...
          </h2>
          <p className="text-muted-foreground">De standpuntverdeler wordt geladen</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-6">
          <h1 
            className="text-4xl md:text-5xl font-bold text-center mb-2 font-serif"
          >
            De Standpuntverdeler
          </h1>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            Maak je zetelverdeling voor de tweede kamer, en ontdek wat dit doet met de politieke 
            kleur van de kamer en welke standpunten je kunt verwachten.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 space-y-8">
        {/* Thema Selector */}
        <Card>
          <CardContent className="pt-6">
            <ThemeSelector
              themes={partiesData.themas}
              selectedTheme={selectedTheme}
              onSelectTheme={handleSelectTheme}
            />
          </CardContent>
        </Card>

        {/* Parliament Visualization */}
        <Card>
          <CardContent className="pt-6">
            <h2 
              className="text-2xl font-bold text-center mb-6 font-serif"
            >
              Tweede Kamer (150 zetels)
            </h2>
            <Parliament
              selectedParties={selectedParties}
              partiesData={partiesData}
              selectedTheme={selectedTheme}
            />
            <p className="text-center text-sm text-muted-foreground mt-4">
              Kleuren gebaseerd op thema: <strong>{partiesData.themas[selectedTheme].naam}</strong>
            </p>
          </CardContent>
        </Card>

        {/* Party Selector */}
        <Card>
          <CardContent className="pt-6">
            <PartySelector
              partiesData={partiesData}
              selectedParties={selectedParties}
              onToggleParty={handleToggleParty}
            />
          </CardContent>
        </Card>

        {/* Quotes Display */}
        {Object.values(selectedParties).some(v => v) && (
          <QuoteDisplay
            partiesData={partiesData}
            selectedParties={selectedParties}
            selectedTheme={selectedTheme}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8 bg-card/30">
        <div className="container text-center text-sm text-muted-foreground">
          <p>
            Gebaseerd op de verkiezingsprogramma's van de partijen en de doorrekening van het CPB
          </p>
          <p className="mt-2">
            Verkiezingsuitslag Tweede Kamer 2025
          </p>
        </div>
      </footer>
    </div>
  );
}
