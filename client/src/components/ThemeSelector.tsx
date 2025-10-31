interface ThemeSelectorProps {
  themes: { [key: string]: { naam: string; beschrijving: string } };
  selectedTheme: string;
  onSelectTheme: (themeKey: string) => void;
}

export default function ThemeSelector({ themes, selectedTheme, onSelectTheme }: ThemeSelectorProps) {
  const themeKeys = Object.keys(themes);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Kies een thema</label>
      <div className="flex flex-wrap gap-2">
        {themeKeys.map((key) => (
          <button
            key={key}
            onClick={() => onSelectTheme(key)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all
              ${selectedTheme === key
                ? 'bg-foreground text-background shadow-md'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }
            `}
          >
            {themes[key].naam}
          </button>
        ))}
      </div>
    </div>
  );
}
