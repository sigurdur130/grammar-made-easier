import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface CategoryCardProps {
  title: string;
  category: string;
}

export function CategoryCard({ title, category }: CategoryCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log("Navigating to exercises for:", category, title);
    navigate(`/exercises/${category}/${title}`);
  };

  return (
    <Card 
      className="hover:bg-accent cursor-pointer transition-colors active:bg-accent/90 touch-manipulation"
      onClick={handleClick}
    >
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-base md:text-lg line-clamp-2">{title}</CardTitle>
      </CardHeader>
    </Card>
  );
}