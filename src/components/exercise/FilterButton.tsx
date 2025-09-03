import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilterButtonProps {
  onClick: () => void;
}

export function FilterButton({ onClick }: FilterButtonProps) {
  return (
    <Button 
      onClick={onClick}
      variant="outline" 
      className="mb-4 flex items-center gap-2"
    >
      <Filter className="h-4 w-4" />
      Filters
    </Button>
  );
}