import { useState, useEffect, KeyboardEvent } from "react";
import { Check, X, HelpCircle, Eye } from "lucide-react";
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
  const [answer, setAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    // Reset state when sentence changes
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowHint(!showHint)}
            className="rounded-full hover:bg-[#EDF2F7]"
          >
            <HelpCircle className="h-5 w-5 text-[#718096]" />
          </Button>
        </div>

        {showHint && (
          <div className="bg-[#FFF9E5] p-4 mb-6 rounded-lg">
            <div className="flex justify-between items-center">
              <p className="text-[#B45309]">{hint}</p>
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="flex items-center gap-2 text-[#B45309] hover:text-[#92400E]"
              >
                <Eye className="h-4 w-4" />
                <span>{showAnswer ? "Hide Answer" : "Show Answer"}</span>
              </button>
            </div>
            {showAnswer && (
              <p className="mt-2 text-[#B45309] font-medium">
                Answer: {sentence.correct_answer}
              </p>
            )}
          </div>
        )}

        <div className="mb-8">
          <p className="text-[#718096] italic mb-6">
            {sentence.english_translation}
          </p>
          <div className="flex items-center gap-2 text-lg">
            <span className="text-[#2D3748]">{sentence.icelandic_left}</span>
            <div className="relative">
              <Input
                value={answer}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className={`w-64 text-center border-t-0 border-x-0 rounded-none focus:ring-0 focus:outline-none bg-[#F8FAFF] ${
                  isCorrect === true
                    ? "border-green-500 bg-green-50"
                    : isCorrect === false
                    ? "border-red-200 bg-red-50"
                    : "border-b-2 border-[#CBD5E0] hover:border-[#6B46C1] focus:border-[#6B46C1]"
                } placeholder:text-[#A0AEC0]`}
                placeholder={!isTyping ? sentence.base_form || "" : ""}
              />
              {isCorrect === true && (
                <Check className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
              )}
              {isCorrect === false && (
                <X className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
              )}
            </div>
            <span className="text-[#2D3748]">{sentence.icelandic_right}</span>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleCheck}
            className="bg-[#6B46C1] hover:bg-[#553C9A] text-white px-8"
          >
            Check
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}