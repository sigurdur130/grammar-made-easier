import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EndScreenProps {
  onRestart: () => void;
}

export function EndScreen({ onRestart }: EndScreenProps) {
  return (
    <Card className="w-full max-w-3xl mx-auto bg-[#F8FAFF] border-none shadow-lg">
      <CardContent className="pt-6 text-center">
        <h2 className="text-2xl font-semibold text-[#2D3748] mb-4">Great job!</h2>
        <p className="text-[#718096] mb-6">You've completed all exercises in this set.</p>
        <Button 
          onClick={onRestart}
          className="bg-[#6B46C1] hover:bg-[#553C9A]"
        >
          Continue Practice
        </Button>
      </CardContent>
    </Card>
  );
}