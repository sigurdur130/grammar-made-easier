import { Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ExerciseInputProps {
  answer: string;
  isCorrect: boolean | null;
  isTyping: boolean;
  baseForm: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  shake?: boolean;
}

export function ExerciseInput({
  answer,
  isCorrect,
  isTyping,
  baseForm,
  onChange,
  onKeyPress,
  shake,
}: ExerciseInputProps) {
  return (
    <div className="relative w-full sm:w-64">
      <Input
        value={answer}
        onChange={onChange}
        onKeyPress={onKeyPress}
        className={`w-full text-center border-t-0 border-x-0 rounded-none focus:ring-0 focus:outline-none bg-[#F8FAFF] ${
          isCorrect === true
            ? "border-green-500 bg-green-50"
            : isCorrect === false
            ? "border-red-200 bg-red-50"
            : "border-b-2 border-[#CBD5E0] hover:border-[#6B46C1] focus:border-[#6B46C1]"
        } placeholder:text-[#A0AEC0] text-base md:text-lg p-2 ${
          shake ? "animate-[shake_0.5s_ease-in-out]" : ""
        }`}
        placeholder={!isTyping ? baseForm || "" : ""}
      />
      {isCorrect === true && (
        <Check className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
      )}
      {isCorrect === false && (
        <X className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
      )}
    </div>
  );
}