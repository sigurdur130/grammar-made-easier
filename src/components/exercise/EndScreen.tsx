
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { useEffect } from "react";

interface EndScreenProps {
  onRestart: () => void;
}

export function EndScreen({ onRestart }: EndScreenProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const duration = 1000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const confettiInterval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(confettiInterval);
        return;
      }

      confetti({
        particleCount: 3,
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        origin: { y: 0.6 },
        colors: ['#FFD700', '#6B46C1', '#48BB78', '#4299E1'],
      });
    }, 50);

    // Cleanup interval
    return () => clearInterval(confettiInterval);
  }, []);

  return (
    <Card className="w-full max-w-3xl mx-auto bg-[#F8FAFF] border-none shadow-lg">
      <CardContent className="p-4 md:p-6 text-center">
        <div className="flex justify-center mb-4 md:mb-6">
          <Trophy className="w-12 h-12 md:w-16 md:h-16 text-yellow-500" />
        </div>
        <div className="animate-fade-in">
          <h2 className="text-xl md:text-2xl font-semibold text-[#2D3748] mb-3 md:mb-4">Great job!</h2>
          <p className="text-sm md:text-base text-[#718096] mb-4 md:mb-6">You've completed all exercises in this set.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button 
              onClick={onRestart}
              className="bg-[#6B46C1] hover:bg-[#553C9A] w-full sm:w-auto"
            >
              Keep practicing
            </Button>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Practice something else
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
