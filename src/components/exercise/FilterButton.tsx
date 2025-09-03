import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilterButtonProps {
  onClick: () => void;
  hasActiveFilters: boolean;
}

export function FilterButton({ onClick, hasActiveFilters }: FilterButtonProps) {
  return (
    <Button 
      onClick={onClick}
      variant={hasActiveFilters ? "secondary" : "outline"}
      className="mb-4 flex items-center gap-2"
    >
      <Filter className="h-4 w-4" />
      Filters
    </Button>
  );
}