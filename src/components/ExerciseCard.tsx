import { useState, useEffect, KeyboardEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { HintDisplay } from "./exercise/HintDisplay";
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
  const [showHint, setShowHint] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    setAnswer("");
    setIsCorrect(null);
    setShowHint(false);
    setIsTyping(false);
    setShowAnswer(false);
    setShake(false);
  }, [sentence]);

  const handleCheck = () => {
    const correct = answer.toLowerCase().trim() === sentence.correct_answer?.toLowerCase().trim();
    setIsCorrect(correct);
    if (correct && onCorrect) {
      onCorrect();
    } else {
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

  const hint = `Need help? Try to think about the base form: ${sentence.base_form}`;

  return (
    <Card className="w-full max-w-3xl mx-auto bg-[#F8FAFF] border-none shadow-lg">
      <CardContent className="pt-6">
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
        />

        <CharacterButtons onCharacterClick={insertCharacter} />

        {showHint && (
          <HintDisplay
            hint={hint}
            showAnswer={showAnswer}
            correctAnswer={sentence.correct_answer}
            onToggleAnswer={() => setShowAnswer(!showAnswer)}
          />
        )}

        <ActionButtons
          onCheck={handleCheck}
          onToggleHint={() => setShowHint(!showHint)}
        />
      </CardContent>
    </Card>
  );
}