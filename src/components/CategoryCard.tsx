import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface CategoryCardProps {
  title: string;
}

export function CategoryCard({ title }: CategoryCardProps) {
  return (
    <Card className="hover:bg-accent cursor-pointer transition-colors">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
    </Card>
  );
}