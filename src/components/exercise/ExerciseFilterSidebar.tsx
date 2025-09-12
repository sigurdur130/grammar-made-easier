import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { CasesFilter } from "./CasesFilter";

interface CasesFilters {
  caseFilters: string[];
  numberFilters: string[];
  definitenessFilters: string[];
}

interface ExerciseFilterSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  caseFilters: string[];
  numberFilters: string[];
  definitenessFilters: string[];
  onFiltersChange: (filters: CasesFilters) => void;
  onApply: () => void;
  onReset: () => void;
}

export function ExerciseFilterSidebar({
  isOpen,
  onOpenChange,
  caseFilters,
  numberFilters,
  definitenessFilters,
  onFiltersChange,
  onApply,
  onReset,
}: ExerciseFilterSidebarProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          <div className="flex-1 py-6">
            <Accordion type="single" collapsible defaultValue="grammar">
              <AccordionItem value="grammar">
                <AccordionTrigger>Grammar</AccordionTrigger>
                <AccordionContent>
                  <CasesFilter
                    caseFilters={caseFilters}
                    numberFilters={numberFilters}
                    definitenessFilters={definitenessFilters}
                    onFiltersChange={onFiltersChange}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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