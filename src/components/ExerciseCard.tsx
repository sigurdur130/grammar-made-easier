import { useState, useEffect, KeyboardEvent, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ExerciseContent } from "./exercise/ExerciseContent";
import { CharacterButtons } from "./exercise/CharacterButtons";
import { ActionButtons } from "./exercise/ActionButtons";
import { FloatingCheckmark } from "./exercise/FloatingCheckmark";
import { HelpCircle } from "lucide-react";
import type { ExerciseInputHandle } from "./exercise/ExerciseInput";

interface ExerciseCardProps {
  sentence: {
    id?: number;
    icelandic_left: string | null;
    icelandic_right: string | null;
    english_translation: string | null;
    correct_answer: string | null;
    base_form: string | null;
    case?: string | null;
  };
  onCorrect?: () => void;
  onIncorrect?: () => void;
  subcategory: string;
  showHint?: boolean;
}

export function ExerciseCard({ sentence, onCorrect, onIncorrect, subcategory, showHint = false }: ExerciseCardProps) {
  const [answer, setAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasIncorrectAttempt, setHasIncorrectAttempt] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [shake, setShake] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [checkmarkPosition, setCheckmarkPosition] = useState({ x: 0, y: 0 });
  const [showHintTooltip, setShowHintTooltip] = useState(false);
  const inputRef = useRef<ExerciseInputHandle>(null);

  useEffect(() => {
    console.log("ExerciseCard debug:", {
      showHint,
      sentenceCase: sentence.case,
      shouldShowButton: showHint && sentence.case,
      subcategory
    });
    
    setAnswer("");
    setIsCorrect(null);
    setHasIncorrectAttempt(false);
    setShowAnswer(false);
    setIsTyping(false);
    setShake(false);
    setShowHintTooltip(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, [sentence, showHint]);

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

  const handleHintClick = () => {
    setShowHintTooltip(true);
    setTimeout(() => setShowHintTooltip(false), 3000);
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
        
        <div className="mb-4 md:mb-6 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-semibold text-card-foreground">{subcategory}</h2>
          {showHint && sentence.case && (
            <TooltipProvider>
              <Tooltip open={showHintTooltip}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleHintClick}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Case: {sentence.case}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
