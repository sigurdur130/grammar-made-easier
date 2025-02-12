
import { useState, useEffect, KeyboardEvent, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ExerciseContent } from "./exercise/ExerciseContent";
import { CharacterButtons } from "./exercise/CharacterButtons";
import { ActionButtons } from "./exercise/ActionButtons";
import type { ExerciseInputHandle } from "./exercise/ExerciseInput";

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
  onIncorrect?: () => void;
  subcategory: string;
}

export function ExerciseCard({ sentence, onCorrect, onIncorrect, subcategory }: ExerciseCardProps) {
  const [answer, setAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasIncorrectAttempt, setHasIncorrectAttempt] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<ExerciseInputHandle>(null);

  useEffect(() => {
    setAnswer("");
    setIsCorrect(null);
    setHasIncorrectAttempt(false);
    setShowAnswer(false);
    setIsTyping(false);
    setShake(false);
    // Focus input when sentence changes
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
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
      if (onIncorrect) {
        onIncorrect();
      }
      // Focus input after incorrect attempt
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
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
    // Focus input after inserting character
    inputRef.current?.focus();
  };

  return (
    <Card className="w-full max-w-3xl mx-auto bg-[#F8FAFF] border-none shadow-lg">
      <CardContent className="p-4 md:pt-6 md:px-6">
        <div className="mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-[#2D3748]">{subcategory}</h2>
        </div>

        <ExerciseContent
          ref={inputRef}
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
