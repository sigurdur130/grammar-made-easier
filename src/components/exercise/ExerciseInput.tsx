
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface ExerciseInputHandle {
  focus: () => void;
}

interface ExerciseInputProps {
  answer: string;
  isCorrect: boolean | null;
  isTyping: boolean;
  baseForm: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  shake?: boolean;
}

export const ExerciseInput = forwardRef<ExerciseInputHandle, ExerciseInputProps>(({
  answer,
  isCorrect,
  isTyping,
  baseForm,
  onChange,
  onKeyPress,
  shake,
}, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    }
  }));

  // Calculate width based on baseForm length, with a minimum width
  // Add a small buffer (+2ch) for icons and padding
  const minWidth = baseForm ? `${Math.max(baseForm.length + 2, 16)}ch` : "16ch";

  return (
    <div className="relative w-full sm:w-auto" style={{ minWidth }}>
      <Input
        ref={inputRef}
        value={answer}
        onChange={onChange}
        onKeyPress={onKeyPress}
        className={`w-full text-center border-t-0 border-x-0 rounded-none focus:ring-0 focus:outline-none ${
          isCorrect === true
            ? "border-green-500 bg-green-50 dark:bg-green-950/30 dark:text-green-300"
            : isCorrect === false
            ? "border-red-200 bg-red-50 dark:bg-red-950/30 dark:text-red-300"
            : "border-b-2 border-[#CBD5E0] hover:border-[#6B46C1] focus:border-[#6B46C1] dark:border-muted-foreground/40 dark:hover:border-primary dark:focus:border-primary dark:bg-muted/50 dark:text-card-foreground"
        } placeholder:text-muted-foreground/60 text-base md:text-lg p-2 ${
          shake ? "animate-[shake_0.5s_ease-in-out]" : ""
        }`}
        placeholder={!isTyping ? baseForm || "" : ""}
      />
      {isCorrect === true && (
        <Check className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500 dark:text-green-400" />
      )}
      {isCorrect === false && (
        <X className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500 dark:text-red-400" />
      )}
    </div>
  );
});

ExerciseInput.displayName = "ExerciseInput";
