
import { useState, useEffect, KeyboardEvent, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ExerciseContent } from "./exercise/ExerciseContent";
import { CharacterButtons } from "./exercise/CharacterButtons";
import { ActionButtons } from "./exercise/ActionButtons";
import { FloatingCheckmark } from "./exercise/FloatingCheckmark";
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
  onCheck?: () => void;
  onCheck?: (answer: string) => void;
  subcategory: string;
}

export function ExerciseCard({ sentence, onCheck, subcategory }: ExerciseCardProps) {
  const [answer, setAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasIncorrectAttempt, setHasIncorrectAttempt] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [shake, setShake] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [checkmarkPosition, setCheckmarkPosition] = useState({ x: 0, y: 0 });
  const inputRef = useRef<ExerciseInputHandle>(null);

  useEffect(() => {
    setAnswer("");
    setIsCorrect(null);
    setHasIncorrectAttempt(false);
    setShowAnswer(false);
    setIsTyping(false);
    setShake(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, [sentence]);

  const handleCheck = () => {
    if (onCheck) onCheck(answer);
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

  const handleClearInput = () => {
    setAnswer("");
    setIsTyping(false);
  };

  const insertCharacter = (char: string) => {
    setAnswer(prev => prev + char);
    setIsTyping(true);
    inputRef.current?.focus();
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg dark:shadow-md dark:bg-muted bg-background">
      <CardContent className="p-4 md:pt-6 md:px-6">
        {showCheckmark && (
          <FloatingCheckmark 
            className="fixed"
            style={{ 
              left: `${checkmarkPosition.x}px`,
              top: `${checkmarkPosition.y}px`
            }} 
          />
        )}
        
        <div className="mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-card-foreground">{subcategory}</h2>
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
          onClear={handleClearInput}
        />

        {/* Mobile layout: Check button above character buttons */}
        <div className="md:hidden mb-4">
          <ActionButtons
            onCheck={handleCheck}
            showAnswerButton={hasIncorrectAttempt}
            showAnswer={showAnswer}
            onToggleAnswer={() => setShowAnswer(!showAnswer)}
            correctAnswer={sentence.correct_answer}
          />
        </div>

        <CharacterButtons onCharacterClick={insertCharacter} />

        {/* Desktop layout: Check button below character buttons */}
        <div className="hidden md:block">
          <ActionButtons
            onCheck={handleCheck}
            showAnswerButton={hasIncorrectAttempt}
            showAnswer={showAnswer}
            onToggleAnswer={() => setShowAnswer(!showAnswer)}
            correctAnswer={sentence.correct_answer}
          />
        </div>
      </CardContent>
    </Card>
  );
}
