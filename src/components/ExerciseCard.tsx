import { useState, useEffect, KeyboardEvent } from "react";
import { Check, X, HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  const [answer, setAnswer] = useState(sentence.base_form || "");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    // Reset state when sentence changes
    setAnswer(sentence.base_form || "");
    setIsCorrect(null);
    setShowHint(false);
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

  const hint = `${sentence.base_form} (${sentence.english_translation}) is a ${sentence.gender} noun in Icelandic`;

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-semibold">Gender Recognition</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowHint(!showHint)}
            className="rounded-full"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
        </div>

        {showHint && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded">
            <p className="text-amber-800">{hint}</p>
          </div>
        )}

        <div className="mb-8">
          <p className="text-gray-600 italic mb-6">
            {sentence.english_translation}
          </p>
          <div className="flex items-center gap-2 text-lg">
            <span>{sentence.icelandic_left}</span>
            <div className="relative">
              <Input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                className={`w-32 text-center pr-8 ${
                  isCorrect === true
                    ? "border-green-500 bg-green-50 focus-visible:ring-green-200"
                    : isCorrect === false
                    ? "border-red-200 bg-red-50 focus-visible:ring-red-200"
                    : ""
                }`}
                placeholder={sentence.base_form || "Type answer..."}
              />
              {isCorrect === true && (
                <Check className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
              )}
              {isCorrect === false && (
                <X className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
              )}
            </div>
            <span>{sentence.icelandic_right}</span>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleCheck}
            className={
              isCorrect === true
                ? "bg-green-500 hover:bg-green-600"
                : isCorrect === false
                ? "bg-red-500 hover:bg-red-600"
                : ""
            }
          >
            Check Answer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}