
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface ActionButtonsProps {
  onCheck: () => void;
  showAnswerButton: boolean;
  showAnswer: boolean;
  onToggleAnswer: () => void;
  correctAnswer: string | null;
}

export function ActionButtons({ 
  onCheck, 
  showAnswerButton, 
  showAnswer, 
  onToggleAnswer,
  correctAnswer 
}: ActionButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        onClick={onCheck}
        className="px-8 dark:bg-primary/80"
      >
        Check
      </Button>
      
      {showAnswerButton && !showAnswer && (
        <Button
          onClick={onToggleAnswer}
          variant="ghost"
          className="text-primary hover:bg-primary/10"
        >
          <Eye className="h-4 w-4 mr-2" />
          Show Answer
        </Button>
      )}
      
      {showAnswer && correctAnswer && (
        <span className="text-primary font-medium">
          {correctAnswer}
        </span>
      )}
    </div>
  );
}
