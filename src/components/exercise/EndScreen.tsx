import { Trophy, ArrowRight, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface EndScreenProps {
  answeredCount: number;
  onContinue: () => void;
}

export function EndScreen({ answeredCount, onContinue }: EndScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8 bg-white rounded-lg shadow-lg max-w-3xl mx-auto">
      <Trophy className="w-16 h-16 text-yellow-400" />
      <h2 className="text-2xl font-bold text-center">
        Great job! You've completed {answeredCount} exercises!
      </h2>
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Button
          onClick={onContinue}
          className="flex-1 gap-2"
        >
          Keep practicing
          <ArrowRight className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          className="flex-1 gap-2"
          asChild
        >
          <Link to="/">
            Practice something else
            <Home className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}