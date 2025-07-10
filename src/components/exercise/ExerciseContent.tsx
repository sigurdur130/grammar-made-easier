
import { forwardRef } from "react";
import { ExerciseInput, ExerciseInputHandle } from "./ExerciseInput";

type FeedbackState = 'none' | 'correct' | 'incorrect';

interface ExerciseContentProps {
  sentence: {
    icelandic_left: string | null;
    icelandic_right: string | null;
    english_translation: string | null;
    base_form: string | null;
  };
  answer: string;
  feedbackState: FeedbackState;
  isTyping: boolean;
  shake: boolean;
  showAnswer: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

export const ExerciseContent = forwardRef<ExerciseInputHandle, ExerciseContentProps>(({
  sentence,
  answer,
  feedbackState,
  isTyping,
  shake,
  showAnswer,
  onInputChange,
  onKeyPress,
  onClear
}, ref) => {
  return (
    <div className="mb-6 md:mb-8">
      <p className="text-muted-foreground italic mb-4 md:mb-6 text-sm md:text-base px-2">
        {sentence.english_translation}
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-base md:text-lg mb-4">
        <span className="text-card-foreground">{sentence.icelandic_left}</span>
        <ExerciseInput
          ref={ref}
          answer={answer}
          feedbackState={feedbackState}
          isTyping={isTyping}
          baseForm={sentence.base_form}
          onChange={onInputChange}
          onKeyPress={onKeyPress}
          onClear={onClear}
          shake={shake}
        />
        <span className="text-card-foreground">{sentence.icelandic_right}</span>
      </div>
    </div>
  );
});

ExerciseContent.displayName = "ExerciseContent";
