import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ThemeSelectorProps {
  themes: { [key: string]: { naam: string; beschrijving: string } };
  selectedTheme: string;
  onSelectTheme: (themeKey: string) => void;
}

export default function ThemeSelector({ themes, selectedTheme, onSelectTheme }: ThemeSelectorProps) {
  return (
    <div className="w-full max-w-xs">
      <label className="text-sm font-medium mb-2 block">Thema</label>
      <Select value={selectedTheme} onValueChange={onSelectTheme}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecteer een thema" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(themes).map(([key, theme]) => (
            <SelectItem key={key} value={key}>
              {theme.naam}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
