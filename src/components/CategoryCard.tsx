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
      className="hover:bg-accent cursor-pointer transition-colors"
      onClick={handleClick}
    >
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
    </Card>
  );
}