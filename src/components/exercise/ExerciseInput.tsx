
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

  // Determine if label should be in "up" position (floating)
  const shouldFloat = isFocused || answer.length > 0;

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

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
    <div className="relative w-full sm:w-auto" style={{ minWidth }}>
      {/* Floating Label */}
      {baseForm && (
        <label className={`
          absolute left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-200 ease-out z-10
          ${shouldFloat 
            ? "top-0 -translate-y-[90%] -translate-x-[10%] text-xs scale-90 text-muted-foreground bg-background px-1" 
            : "top-1/2 -translate-y-1/2 text-base md:text-lg text-muted-foreground/60"
          }
          ${isFocused && shouldFloat ? "text-primary" : ""}
          ${isCorrect === true && shouldFloat ? "text-green-500 dark:text-green-400" : ""}
          ${isCorrect === false && shouldFloat ? "text-red-500 dark:text-red-400" : ""}
        `}>
          {baseForm}
        </label>
      )}
      
      <Input
        ref={inputRef}
        value={answer}
        onChange={onChange}
        onKeyPress={onKeyPress}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`w-full text-center border-t-0 border-x-0 rounded-none focus:ring-0 focus:outline-none ${
          isCorrect === true
            ? "border-green-500 bg-green-50 dark:bg-green-950/30 dark:text-green-300"
            : isCorrect === false
            ? "border-red-200 bg-red-50 dark:bg-red-950/30 dark:text-red-300"
            : "border-b-2 border-muted-foreground/20 hover:border-primary focus:border-primary dark:border-muted-foreground/40 dark:hover:border-primary dark:focus:border-primary dark:bg-muted/50 dark:text-card-foreground"
        } text-base md:text-lg p-2 ${
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
