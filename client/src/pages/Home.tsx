import { useState, useEffect } from 'react';
import Parliament from '@/components/Parliament';
import PartySelector from '@/components/PartySelector';
import ThemeSelector from '@/components/ThemeSelector';
import QuoteDisplay from '@/components/QuoteDisplay';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

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
          <h2 className="text-2xl font-semibold mb-2 font-serif">
            Laden...
          </h2>
          <p className="text-muted-foreground">De standpuntverdeler wordt geladen</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header - NIET MEER FIXED */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
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
          
          {/* Methodologie link */}
          <div className="text-center mt-3">
            <Dialog>
              <DialogTrigger className="text-sm text-primary hover:underline">
                Waarop is dit gebaseerd?
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-serif text-2xl">Methodologie</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm">
                  <section>
                    <h3 className="font-semibold mb-2">Databronnen</h3>
                    <p className="text-muted-foreground">
                      De Standpuntverdeler is gebaseerd op de verkiezingsprogramma's van alle politieke partijen 
                      voor de Tweede Kamerverkiezingen 2025, aangevuld met de doorrekening "Keuzes in Kaart 2027-2030" 
                      van het Centraal Planbureau (CPB).
                    </p>
                  </section>

                  <section>
                    <h3 className="font-semibold mb-2">Kleurenschema</h3>
                    <p className="text-muted-foreground mb-2">
                      Elke partij krijgt per thema een kleur op basis van twee politieke assen:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                      <li><strong>Links-Rechts as:</strong> Van zeer links (groen) via links (rood) en centrum (paars) naar rechts (blauw)</li>
                      <li><strong>Progressief-Conservatief as:</strong> Progressieve standpunten krijgen lichtere kleuren, conservatieve standpunten donkerdere kleuren</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="font-semibold mb-2">Standpuntbepaling</h3>
                    <p className="text-muted-foreground">
                      De politieke positie per partij per thema is bepaald door analyse van de verkiezingsprogramma's 
                      en CPB-doorrekening. Elke partij krijgt een score van -10 tot +10 op beide assen, waarbij:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2 mt-2">
                      <li>-10 = zeer links / zeer progressief</li>
                      <li>0 = centrum / gematigd</li>
                      <li>+10 = zeer rechts / zeer conservatief</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="font-semibold mb-2">Coalitieberekening</h3>
                    <p className="text-muted-foreground">
                      De politieke kleur van de coalitie wordt berekend als het gewogen gemiddelde van de geselecteerde 
                      partijen, waarbij het aantal zetels als gewicht dient. Een partij met meer zetels heeft dus meer 
                      invloed op de totale politieke kleur.
                    </p>
                  </section>

                  <section>
                    <h3 className="font-semibold mb-2">Quotes en standpunten</h3>
                    <p className="text-muted-foreground">
                      De weergegeven quotes zijn directe citaten of samenvattingen uit de verkiezingsprogramma's van 
                      de partijen, geselecteerd om hun kernstandpunt op het betreffende thema weer te geven.
                    </p>
                  </section>

                  <section>
                    <h3 className="font-semibold mb-2">Disclaimer</h3>
                    <p className="text-muted-foreground">
                      Deze tool is bedoeld als educatief hulpmiddel om politieke standpunten inzichtelijk te maken. 
                      De politieke positionering is gebaseerd op interpretatie van verkiezingsprogramma's en kan 
                      subjectieve elementen bevatten. Voor volledige informatie verwijzen we naar de originele 
                      verkiezingsprogramma's van de partijen.
                    </p>
                  </section>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 space-y-8">
        {/* Thema selector - PILL KNOPPEN */}
        <div className="flex justify-center">
          <ThemeSelector
            themes={partiesData.themas}
            selectedTheme={selectedTheme}
            onSelectTheme={handleSelectTheme}
          />
        </div>

        {/* Compact layout: Visualisatie + Partijen */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Linker kolom: Partij selector */}
              <div className="lg:col-span-3">
                <PartySelector
                  partiesData={partiesData}
                  selectedParties={selectedParties}
                  onToggleParty={handleToggleParty}
                />
              </div>

              {/* Rechter kolom: Parliament visualisatie */}
              <div className="lg:col-span-9">
                <h2 className="text-2xl font-bold text-center mb-4 font-serif">
                  Tweede Kamer (150 zetels)
                </h2>
                <Parliament
                  selectedParties={selectedParties}
                  partiesData={partiesData}
                  selectedTheme={selectedTheme}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Standpunten per partij */}
        <QuoteDisplay
          selectedParties={selectedParties}
          partiesData={partiesData}
          selectedTheme={selectedTheme}
        />
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-16">
        <div className="container text-center text-sm text-muted-foreground space-y-2">
          <p>Gebaseerd op de verkiezingsprogramma's van de partijen en de doorrekening van het CPB</p>
          <p>Verkiezingsuitslag Tweede Kamer 2025</p>
        </div>
      </footer>
    </div>
  );
}
