import { useState, useEffect, KeyboardEvent, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { ExerciseContent } from "./exercise/ExerciseContent";
import { CharacterButtons } from "./exercise/CharacterButtons";
import { ActionButtons } from "./exercise/ActionButtons";
import type { ExerciseInputHandle } from "./exercise/ExerciseInput";

type FeedbackState = 'none' | 'correct' | 'incorrect';

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
  onCorrect?: (x: number, y: number) => void;
  onIncorrect?: () => void;
  subcategory: string;
}

export function ExerciseCard({ sentence, onCorrect, onIncorrect, subcategory }: ExerciseCardProps) {
  const [answer, setAnswer] = useState("");
  const [feedbackState, setFeedbackState] = useState<FeedbackState>('none');
  const [hasIncorrectAttempt, setHasIncorrectAttempt] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [shake, setShake] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<ExerciseInputHandle>(null);

  useEffect(() => {
    setAnswer("");
    setFeedbackState('none');
    setHasIncorrectAttempt(false);
    setShowAnswer(false);
    setIsTyping(false);
    setShake(false);
    setShowHint(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, [sentence]);

  const handleCheck = () => {
    const correct = answer.toLowerCase().trim() === sentence.correct_answer?.toLowerCase().trim();
    
    if (correct) {
      setFeedbackState('correct');
      
      // Calculate position for floating checkmark
      const inputElement = inputRef.current?.getBoundingClientRect();
      if (inputElement && onCorrect) {
        const x = inputElement.right - 40;
        const y = inputElement.top - 5;
        onCorrect(x, y);
      }
    } else {
      setFeedbackState('incorrect');
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
    setShowHint(true);
    setTimeout(() => setShowHint(false), 3000);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg dark:shadow-md dark:bg-muted bg-background">
      <CardContent className="p-4 md:pt-6 md:px-6">
        <div className="mb-4 md:mb-6 flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-semibold text-card-foreground">{subcategory}</h2>
          
          {subcategory === "Cases" && (
            <TooltipProvider>
              <Tooltip open={showHint}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleHintClick}
                    className="h-8 w-8"
                  >
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Case: {sentence.case || 'Unknown'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <ExerciseContent
          ref={inputRef}
          sentence={sentence}
          answer={answer}
          feedbackState={feedbackState}
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