
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, Leaf, TreePine, Mountain } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CategoryCardProps {
  title: string;
  category: string;
  difficulty?: string | null;
}

export function CategoryCard({ title, category, difficulty }: CategoryCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/exercises/${category}/${title}`);
  };

  const getDifficultyIcon = () => {
    switch (difficulty?.toLowerCase()) {
      case "beginner":
        return <Sprout className="h-4 w-4 text-green-500" />;
      case "low intermediate":
        return <Leaf className="h-4 w-4 text-blue-500" />;
      case "high intermediate":
        return <TreePine className="h-4 w-4 text-orange-500" />;
      case "advanced":
        return <Mountain className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const difficultyIcon = getDifficultyIcon();

  return (
    <Card 
      className="hover:bg-accent cursor-pointer transition-colors active:bg-accent/90 touch-manipulation dark:hover:bg-accent dark:active:bg-accent/80"
      onClick={handleClick}
    >
      <CardHeader className="p-4 md:p-6">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base md:text-lg line-clamp-2 text-card-foreground">{title}</CardTitle>
          {difficultyIcon && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="ml-2 flex-shrink-0 mt-0.5">
                    {difficultyIcon}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{difficulty}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}
