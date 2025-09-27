
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { useEffect, useRef } from "react";

interface EndScreenProps {
  onStartFresh: () => void;
  onKeepPracticing: () => void;
  firstTryCorrect: number;
  totalExercises: number;
  isOutOfSentences?: boolean;
}

const getScoreMessage = (firstTryCorrect: number, total: number): string => {
  switch (firstTryCorrect) {
    case 0:
      return "Ouch, 0/6 right on the first try. That's got to hurt. Maybe hit the books and try again?";
    case 1:
      return "1/6 right on the first try. Hey, Rome wasn't built in a day! Keep going!";
    case 2:
      return "2/6 right on the first try. You're getting there! Every journey starts with a single step.";
    case 3:
      return "You got 3/6 right on the first try. Keep at it: practice makes perfect!";
    case 4:
      return "4/6 right on the first try. Now we're cooking! You're really getting the hang of this!";
    case 5:
      return "5/6 right on the first try. So close to perfection! One more push and you've got this!";
    case 6:
      return "Wow, 6/6 right on the first try! A score as perfect as your face!";
    default:
      return "Practice makes perfect!";
  }
};

export function EndScreen({
  onStartFresh,
  onKeepPracticing,
  firstTryCorrect,
  totalExercises,
  isOutOfSentences
}: EndScreenProps) {
  const navigate = useNavigate();
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    buttonRef.current?.focus();
    const duration = 500;
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
        origin: {
          y: 0.5
        },
        colors: ['#FFD700', '#6B46C1', '#48BB78', '#4299E1']
      });
    }, 50);

    return () => clearInterval(confettiInterval);
  }, []);

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg dark:shadow-md dark:bg-muted bg-background">
      <CardContent className="p-4 md:p-6 text-center">
        <div className="flex justify-center mb-4 md:mb-6">
          <Trophy className="w-12 h-12 md:w-16 md:h-16 text-yellow-500" />
        </div>
        <div className="animate-fade-in">
          <h2 className="text-xl md:text-2xl font-semibold text-card-foreground mb-3 md:mb-4">
            {isOutOfSentences ? "You're on a roll! 🚀" : "Great job!"}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mb-4 my-[16px]">
            {isOutOfSentences ? "Wow! You've mastered all the available sentences in this category. Want to start fresh and practice them again?" : getScoreMessage(firstTryCorrect, totalExercises)}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            {isOutOfSentences ? (
              <Button 
                ref={buttonRef} 
                onClick={onStartFresh} 
                className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
              >
                Start fresh
              </Button>
            ) : (
              <Button 
                ref={buttonRef} 
                onClick={onKeepPracticing}
                className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
              >
                Keep practicing
              </Button>
            )}
            <Button 
              onClick={() => navigate('/')} 
              variant="outline" 
              className="w-full sm:w-auto dark:bg-muted/70 dark:border-muted-foreground/20 dark:hover:bg-accent"
            >
              Practice something else
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
