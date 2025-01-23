import { Eye } from "lucide-react";

interface HintDisplayProps {
  hint: string;
  showAnswer: boolean;
  correctAnswer: string | null;
  onToggleAnswer: () => void;
}

export function HintDisplay({ hint, showAnswer, correctAnswer, onToggleAnswer }: HintDisplayProps) {
  return (
    <div className="bg-[#FFF9E5] p-4 mb-6 rounded-lg">
      <div className="flex justify-between items-center">
        <p className="text-[#B45309]">{hint}</p>
        <button
          onClick={onToggleAnswer}
          className="flex items-center gap-2 text-[#B45309] hover:text-[#92400E]"
        >
          <Eye className="h-4 w-4" />
          <span>{showAnswer ? "Hide Answer" : "Show Answer"}</span>
        </button>
      </div>
      {showAnswer && (
        <p className="mt-2 text-[#B45309] font-medium">
          Answer: {correctAnswer}
        </p>
      )}
    </div>
  );
}