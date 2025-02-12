
import { forwardRef } from "react";
import { ExerciseInput, ExerciseInputHandle } from "./ExerciseInput";

interface ExerciseContentProps {
  sentence: {
    icelandic_left: string | null;
    icelandic_right: string | null;
    english_translation: string | null;
    base_form: string | null;
  };
  answer: string;
  isCorrect: boolean | null;
  isTyping: boolean;
  shake: boolean;
  showAnswer: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const ExerciseContent = forwardRef<ExerciseInputHandle, ExerciseContentProps>(({
  sentence,
  answer,
  isCorrect,
  isTyping,
  shake,
  showAnswer,
  onInputChange,
  onKeyPress
}, ref) => {
  return (
    <div className="mb-6 md:mb-8">
      <p className="text-[#718096] italic mb-4 md:mb-6 text-sm md:text-base px-2">
        {sentence.english_translation}
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-2 text-base md:text-lg mb-4">
        <span className="text-[#2D3748]">{sentence.icelandic_left}</span>
        <ExerciseInput
          ref={ref}
          answer={answer}
          isCorrect={isCorrect}
          isTyping={isTyping}
          baseForm={sentence.base_form}
          onChange={onInputChange}
          onKeyPress={onKeyPress}
          shake={shake}
        />
        <span className="text-[#2D3748]">{sentence.icelandic_right}</span>
      </div>
    </div>
  );
});

ExerciseContent.displayName = "ExerciseContent";
