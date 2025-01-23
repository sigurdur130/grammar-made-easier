import { useState, useEffect, KeyboardEvent } from "react";
import { HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HintDisplay } from "./exercise/HintDisplay";
import { ExerciseInput } from "./exercise/ExerciseInput";

interface ExerciseCardProps {
  sentence: {
    id: number;
    icelandic_left: string | null;
    icelandic_right: string | null;
    english_translation: string | null;
    correct_answer: string | null;
    base_form: string | null;
    gender: string | null;
  };
  onCorrect?: () => void;
}

export function ExerciseCard({ sentence, onCorrect }: ExerciseCardProps) {
  const [answer, setAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    setAnswer("");
    setIsCorrect(null);
    setShowHint(false);
    setIsTyping(false);
    setShowAnswer(false);
  }, [sentence]);

  const handleCheck = () => {
    const correct = answer.toLowerCase().trim() === sentence.correct_answer?.toLowerCase().trim();
    setIsCorrect(correct);
    if (correct && onCorrect) {
      setTimeout(onCorrect, 1000);
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

  const hint = `${sentence.base_form} (${sentence.english_translation}) is a ${sentence.gender} noun in Icelandic`;

  return (
    <Card className="w-full max-w-3xl mx-auto bg-[#F8FAFF] border-none shadow-lg">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-semibold text-[#2D3748]">Gender Recognition</h2>
        </div>

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
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <span className="text-[#2D3748]">{sentence.icelandic_right}</span>
          </div>

          {showHint && (
            <HintDisplay
              hint={hint}
              showAnswer={showAnswer}
              correctAnswer={sentence.correct_answer}
              onToggleAnswer={() => setShowAnswer(!showAnswer)}
            />
          )}
        </div>

        <div className="flex justify-center gap-4">
          <Button
            onClick={handleCheck}
            className="bg-[#6B46C1] hover:bg-[#553C9A] text-white px-8"
          >
            Check
          </Button>
          <Button
            onClick={() => setShowHint(!showHint)}
            variant="outline"
            className="border-[#6B46C1] text-[#6B46C1] hover:bg-[#6B46C1] hover:text-white"
          >
            <HelpCircle className="h-4 w-4" />
            Hint
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}