
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
    case: string | null;
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
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [checkmarkPosition, setCheckmarkPosition] = useState({ x: 0, y: 0 });
  const [showCaseHint, setShowCaseHint] = useState(false);
  const inputRef = useRef<ExerciseInputHandle>(null);

  useEffect(() => {
    setAnswer("");
    setIsCorrect(null);
    setHasIncorrectAttempt(false);
    setShowAnswer(false);
    setIsTyping(false);
    setShake(false);
    setShowCaseHint(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, [sentence]);

  const handleCheck = () => {
    const correct = answer.toLowerCase().trim() === sentence.correct_answer?.toLowerCase().trim();
    setIsCorrect(correct);
    
    if (correct) {
      const inputElement = inputRef.current?.getBoundingClientRect();
      if (inputElement) {
        setCheckmarkPosition({
          x: inputElement.right - 40,
          y: inputElement.top - 5,
        });
      }
      setShowCheckmark(true);
      setTimeout(() => setShowCheckmark(false), 500);
      if (onCorrect) onCorrect();
    } else {
      setHasIncorrectAttempt(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      if (onIncorrect) onIncorrect();
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
        {/* Show case button - only visible for Cases subcategory */}
        {subcategory === "Cases" && (
          <div className="flex justify-end mb-2">
            <Button
              onClick={() => setShowCaseHint(!showCaseHint)}
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Show case
            </Button>
          </div>
        )}

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
          {/* Case hint display */}
          {showCaseHint && sentence.case && (
            <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-md">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Case:</strong> {sentence.case}
              </p>
            </div>
          )}
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
