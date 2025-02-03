import { Button } from "@/components/ui/button";

interface CharacterButtonsProps {
  onCharacterClick: (char: string) => void;
}

export function CharacterButtons({ onCharacterClick }: CharacterButtonsProps) {
  const icelandicChars = ['á', 'é', 'í', 'ó', 'ú', 'ý', 'þ', 'ð', 'æ', 'ö'];

  return (
    <div className="grid grid-cols-5 sm:flex sm:flex-wrap gap-2 mb-4 md:mb-6 justify-center">
      {icelandicChars.map((char) => (
        <Button
          key={char}
          variant="outline"
          size="sm"
          onClick={() => onCharacterClick(char)}
          className="min-w-8 h-8 md:min-w-6 md:h-6 p-0 text-sm md:text-xs touch-manipulation"
        >
          {char}
        </Button>
      ))}
    </div>
  );
}