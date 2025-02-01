import { ExerciseInput } from "./ExerciseInput";

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

export function ExerciseContent({
  sentence,
  answer,
  isCorrect,
  isTyping,
  shake,
  showAnswer,
  onInputChange,
  onKeyPress
}: ExerciseContentProps) {
  return (
    <div className="mb-8">
      <p className="text-[#718096] italic mb-6">
        {sentence.english_translation}
      </p>
      <div className="flex items-center gap-2 text-lg mb-4">
        <span className="text-[#2D3748]">{sentence.icelandic_left}</span>
        <ExerciseInput
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
}