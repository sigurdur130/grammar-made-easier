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
    <div className="flex flex-col items-center gap-4">
      <Button
        onClick={onCheck}
        className="bg-[#6B46C1] hover:bg-[#553C9A] text-white px-8"
      >
        Check
      </Button>
      
      {showAnswerButton && (
        <div className="text-center">
          <Button
            onClick={onToggleAnswer}
            variant="ghost"
            className="text-[#6B46C1] hover:bg-[#6B46C1]/10"
          >
            {showAnswer ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Hide Answer
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Show Answer
              </>
            )}
          </Button>
          {showAnswer && correctAnswer && (
            <p className="mt-2 text-[#6B46C1] font-medium">
              Answer: {correctAnswer}
            </p>
          )}
        </div>
      )}
    </div>
  );
}