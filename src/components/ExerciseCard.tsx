import { useState } from "react";
import { Check, X } from "lucide-react";
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
  };
}

export function ExerciseCard({ sentence }: ExerciseCardProps) {
  const [answer, setAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const { toast } = useToast();

  const handleCheck = () => {
    const correct = answer.toLowerCase().trim() === sentence.correct_answer?.toLowerCase().trim();
    setIsCorrect(correct);
    toast({
      title: correct ? "Correct!" : "Try again",
      description: correct
        ? "Well done!"
        : `The correct answer is: ${sentence.correct_answer}`,
      variant: correct ? "default" : "destructive",
    });
  };

  return (
    <Card className="flex flex-col">
      <CardContent className="flex-1 pt-6">
        <p className="text-sm text-muted-foreground mb-4">
          {sentence.english_translation}
        </p>
        <div className="flex items-center gap-2 mb-4">
          <span>{sentence.icelandic_left}</span>
          <Input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-32"
            placeholder="Type answer..."
          />
          <span>{sentence.icelandic_right}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
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
            "Check"
          ) : isCorrect ? (
            <Check className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </Button>
        {isCorrect === false && (
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