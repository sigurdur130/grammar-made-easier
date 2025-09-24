
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface ExerciseInputHandle extends HTMLInputElement {
  focus: () => void;
}

interface ExerciseInputProps {
  answer: string;
  isCorrect: boolean | null;
  isTyping: boolean;
  baseForm: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  shake?: boolean;
}

export const ExerciseInput = forwardRef<ExerciseInputHandle, ExerciseInputProps>(({
  answer,
  isCorrect,
  isTyping,
  baseForm,
  onChange,
  onKeyPress,
  onClear,
  shake,
}, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useImperativeHandle(ref, () => inputRef.current as ExerciseInputHandle, []);

  // Calculate width based on baseForm length, with a minimum width
  // Add a small buffer (+2ch) for icons and padding
  const minWidth = baseForm ? `${Math.max(baseForm.length + 2, 16)}ch` : "16ch";

  const handleClear = () => {
    if (onClear) {
      onClear();
      // Focus the input after clearing
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  return (
    <div className="relative w-full sm:w-auto border-t-0 border-x-0 border-b-2 border-[#CBD5E0] hover:border-[#6B46C1] focus:border-[#6B46C1] dark:border-muted-foreground/40 dark:hover:border-primary dark:focus:border-primary mx-1" style={{ minWidth }}>
      {baseForm && (
        <span
          className={`absolute transition-all duration-200 pointer-events-none z-10 whitespace-nowrap ${
            isFocused || answer.length > 0
              ? "-top-3 left-3 text-xs text-muted-foreground bg-background px-1"
              : "top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-base text-muted-foreground/60"
          }`}
        >
          {baseForm}
        </span>
      )}
      <Input
        ref={inputRef}
        value={answer}
        onChange={onChange}
        onKeyPress={onKeyPress}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full text-center dark:bg-muted/50 dark:text-card-foreground border-none ${
          isCorrect === false
            ? "border-red-200 bg-red-50 dark:bg-red-950/30 dark:text-red-300 "
            : ""
        } text-base md:text-lg px-3 py-2 ${
          shake ? "animate-[shake_0.5s_ease-in-out]" : ""
        }`}
      />
      {isCorrect === true && (
        <Check className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500 dark:text-green-400" />
      )}
      {isCorrect === false && (
        <X 
          className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500 dark:text-red-400 cursor-pointer active:scale-90 transition-transform" 
          onClick={handleClear}
          aria-label="Clear answer"
        />
      )}
    </div>
  );
});

ExerciseInput.displayName = "ExerciseInput";
