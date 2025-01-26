import { Button } from "@/components/ui/button";

interface CharacterButtonsProps {
  onCharacterClick: (char: string) => void;
}

export function CharacterButtons({ onCharacterClick }: CharacterButtonsProps) {
  const icelandicChars = ['á', 'é', 'í', 'ó', 'ú', 'ý', 'þ', 'ð', 'æ', 'ö'];

  return (
    <div className="flex flex-wrap gap-1.5 mb-6">
      {icelandicChars.map((char) => (
        <Button
          key={char}
          variant="outline"
          size="sm"
          onClick={() => onCharacterClick(char)}
          className="min-w-6 h-6 p-0 text-xs"
        >
          {char}
        </Button>
      ))}
    </div>
  );
}