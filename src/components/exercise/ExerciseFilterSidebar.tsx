import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filters } from "./Filters";

interface CasesFilters {
  caseFilters: string[];
  numberFilters: string[];
  definitenessFilters: string[];
  exemplarFilters: number[];
}

interface Exemplar {
  id: number;
  exemplar: string;
  gender: string | null;
  default: boolean | null;
  weak_strong: string | null;
}

interface ExerciseFilterSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  exemplars: Exemplar[];
  caseFilters: string[];
  numberFilters: string[];
  definitenessFilters: string[];
  exemplarFilters: number[];
  onFiltersChange: (filters: CasesFilters) => void;
  onApply: () => void;
  onReset: () => void;
}

export function ExerciseFilterSidebar({
  isOpen,
  onOpenChange,
  exemplars,
  caseFilters,
  numberFilters,
  definitenessFilters,
  exemplarFilters,
  onFiltersChange,
  onApply,
  onReset,
}: ExerciseFilterSidebarProps) {

  const genderOrder = ["Masculine", "Feminine", "Neuter"];
  const sortedExemplars = [...exemplars].sort(
    (a, b) => genderOrder.indexOf(a.gender || "") - genderOrder.indexOf(b.gender || "")
  );

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-lg flex flex-col p-6">
        <SheetHeader className="sr-only">
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Refine exercises by selecting filters below.</SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto py-6">
            <Filters
              caseFilters={caseFilters}
              numberFilters={numberFilters}
              definitenessFilters={definitenessFilters}
              exemplarFilters={exemplarFilters}
              exemplars={sortedExemplars}
              onFiltersChange={onFiltersChange}
            />
          </div>
          
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onReset}
              className="flex-1"
            >
              Reset all filters
            </Button>
            <Button
              onClick={onApply}
              className="flex-1"
            >
              Apply
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}