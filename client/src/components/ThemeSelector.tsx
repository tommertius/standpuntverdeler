import { Button } from '@/components/ui/button';

interface ThemeSelectorProps {
  themes: { [key: string]: { naam: string; beschrijving: string } };
  selectedTheme: string;
  onSelectTheme: (themeKey: string) => void;
}

export default function ThemeSelector({ themes, selectedTheme, onSelectTheme }: ThemeSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold font-serif">
        Selecteer een thema
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {Object.entries(themes).map(([key, theme]) => (
          <Button
            key={key}
            variant={selectedTheme === key ? "default" : "outline"}
            size="sm"
            onClick={() => onSelectTheme(key)}
            className="h-auto py-3 px-4 flex flex-col items-start text-left"
          >
            <span className="font-semibold text-sm">{theme.naam}</span>
            <span className="text-xs opacity-70 mt-1">{theme.beschrijving}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
