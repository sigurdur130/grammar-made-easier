import { useState } from "react";
import { Check, X, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();

  const handleCheck = () => {
    const correct = answer.toLowerCase().trim() === sentence.correct_answer?.toLowerCase().trim();
    setIsCorrect(correct);
    if (correct && onCorrect) {
      setTimeout(onCorrect, 1000);
    }
    toast({
      title: correct ? "Correct!" : "Try again",
      description: correct
        ? "Well done!"
        : `Keep trying!`,
      variant: correct ? "default" : "destructive",
    });
  };

  const hint = `${sentence.base_form} (${sentence.english_translation}) is a ${sentence.gender} noun in Icelandic`;

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="pt-6">
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
            <Input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className={`w-32 text-center ${
                isCorrect === false
                  ? "border-red-200 bg-red-50 focus-visible:ring-red-200"
                  : ""
              }`}
              placeholder="Type answer..."
            />
            <span>{sentence.icelandic_right}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-6">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCheck}
            className={
              isCorrect === null
                ? ""
                : isCorrect
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
            }
          >
            {isCorrect === null ? (
              "Check Answer"
            ) : isCorrect ? (
              <Check className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowHint(!showHint)}
          >
            {showHint ? (
              <><EyeOff className="h-4 w-4 mr-2" /> Hide Answer</>
            ) : (
              <><Eye className="h-4 w-4 mr-2" /> Show Hint</>
            )}
          </Button>
        </div>
        {isCorrect === false && !showHint && (
          <Button
            variant="ghost"
            onClick={() => {
              setAnswer(sentence.correct_answer || "");
              setIsCorrect(null);
            }}
          >
            Show Answer
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}