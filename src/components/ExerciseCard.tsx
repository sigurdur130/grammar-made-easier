import { useState, useEffect, KeyboardEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ExerciseContent } from "./exercise/ExerciseContent";
import { CharacterButtons } from "./exercise/CharacterButtons";
import { ActionButtons } from "./exercise/ActionButtons";

interface ExerciseCardProps {
  sentence: {
    id?: number;
    icelandic_left: string | null;
    icelandic_right: string | null;
    english_translation: string | null;
    correct_answer: string | null;
    base_form: string | null;
  };
  onCorrect?: () => void;
  subcategory: string;
}

export function ExerciseCard({ sentence, onCorrect, subcategory }: ExerciseCardProps) {
  const [answer, setAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasIncorrectAttempt, setHasIncorrectAttempt] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    setAnswer("");
    setIsCorrect(null);
    setHasIncorrectAttempt(false);
    setShowAnswer(false);
    setIsTyping(false);
    setShake(false);
  }, [sentence]);

  const handleCheck = () => {
    const correct = answer.toLowerCase().trim() === sentence.correct_answer?.toLowerCase().trim();
    setIsCorrect(correct);
    if (correct && onCorrect) {
      onCorrect();
    } else {
      setHasIncorrectAttempt(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCheck();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAnswer(value);
    setIsTyping(value.length > 0);
  };

  const insertCharacter = (char: string) => {
    setAnswer(prev => prev + char);
    setIsTyping(true);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto bg-[#F8FAFF] border-none shadow-lg">
      <CardContent className="pt-6">
        {/* Debug info */}
        <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
          <p>Debug Info:</p>
          <p>Current Sentence ID: {sentence.id}</p>
          <p>Correct Answer: {sentence.correct_answer}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-[#2D3748]">{subcategory}</h2>
        </div>

        <ExerciseContent
          sentence={sentence}
          answer={answer}
          isCorrect={isCorrect}
          isTyping={isTyping}
          shake={shake}
          onInputChange={handleInputChange}
          onKeyPress={handleKeyPress}
          showAnswer={showAnswer}
        />

        <CharacterButtons onCharacterClick={insertCharacter} />

        <ActionButtons
          onCheck={handleCheck}
          showAnswerButton={hasIncorrectAttempt}
          showAnswer={showAnswer}
          onToggleAnswer={() => setShowAnswer(!showAnswer)}
          correctAnswer={sentence.correct_answer}
        />
      </CardContent>
    </Card>
  );
}