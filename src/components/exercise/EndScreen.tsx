import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Trophy } from "lucide-react";

interface EndScreenProps {
  onContinue: () => void;
  answeredCount: number;
}

export function EndScreen({ onContinue, answeredCount }: EndScreenProps) {
  return (
    <Card className="w-full max-w-3xl mx-auto bg-[#F8FAFF] border-none shadow-lg">
      <CardContent className="pt-6 text-center">
        <div className="flex justify-center mb-4">
          <Trophy className="h-16 w-16 text-yellow-500" />
        </div>
        <h2 className="text-2xl font-semibold text-[#2D3748] mb-2">Great job!</h2>
        <p className="text-[#718096] mb-6">
          You've completed {answeredCount} exercises successfully.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button 
            onClick={onContinue}
            className="bg-[#6B46C1] hover:bg-[#553C9A]"
          >
            Keep practicing
          </Button>
          <Button
            variant="outline"
            className="border-[#6B46C1] text-[#6B46C1] hover:bg-[#6B46C1] hover:text-white"
            asChild
          >
            <Link to="/">Practice something else</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}