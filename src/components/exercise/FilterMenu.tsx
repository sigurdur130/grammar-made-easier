import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CasesFilters {
  caseFilters: string[];
  numberFilters: string[];
  definitenessFilters: string[];
  exemplarFilters: number[];
}

interface FilterMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseFilters: string[];
  numberFilters: string[];
  definitenessFilters: string[];
  exemplarFilters: number[];
  availableExemplars: { id: number; exemplar: string }[];
  onFiltersChange: (filters: CasesFilters) => void;
  hasPendingChanges: boolean;
  onApply: () => void;
  onReset: () => void;
}

const CASE_OPTIONS = ["Accusative", "Dative", "Genitive"];
const NUMBER_OPTIONS = ["Singular", "Plural"];
const DEFINITENESS_OPTIONS = ["Indefinite", "Definite"];

export function FilterMenu({
  open,
  onOpenChange,
  caseFilters,
  numberFilters,
  definitenessFilters,
  exemplarFilters,
  availableExemplars,
  onFiltersChange,
  hasPendingChanges,
  onApply,
  onReset
}: FilterMenuProps) {
  const handleCaseChange = (values: string[]) => {
    if (values.length === 0) return;
    onFiltersChange({
      caseFilters: values,
      numberFilters,
      definitenessFilters,
      exemplarFilters
    });
  };

  const handleNumberChange = (values: string[]) => {
    if (values.length === 0) return;
    onFiltersChange({
      caseFilters,
      numberFilters: values,
      definitenessFilters,
      exemplarFilters
    });
  };

  const handleDefinitenessChange = (values: string[]) => {
    if (values.length === 0) return;
    onFiltersChange({
      caseFilters,
      numberFilters,
      definitenessFilters: values,
      exemplarFilters
    });
  };

  const handleExemplarChange = (values: string[]) => {
    if (values.length === 0) return;
    const numericValues = values.map(Number);
    onFiltersChange({
      caseFilters,
      numberFilters,
      definitenessFilters,
      exemplarFilters: numericValues
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[500px] sm:max-w-[500px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="flex-1 py-6">
          <Accordion type="multiple" defaultValue={[]} className="space-y-4 px-1">
            <AccordionItem value="grammar">
              <AccordionTrigger className="text-base font-medium">
                Grammar
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6">
                  {/* Case Filter */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Case</h4>
                    <ToggleGroup 
                      type="multiple" 
                      value={caseFilters} 
                      onValueChange={handleCaseChange} 
                      className="grid grid-cols-2 gap-2"
                    >
                      {CASE_OPTIONS.map(option => (
                        <ToggleGroupItem 
                          key={option} 
                          value={option} 
                          className="justify-center rounded-md px-3 py-2 text-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                        >
                          {option}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </div>

                  {/* Number Filter */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Number</h4>
                    <ToggleGroup 
                      type="multiple" 
                      value={numberFilters} 
                      onValueChange={handleNumberChange} 
                      className="grid grid-cols-2 gap-2"
                    >
                      {NUMBER_OPTIONS.map(option => (
                        <ToggleGroupItem 
                          key={option} 
                          value={option} 
                          className="justify-center rounded-md px-3 py-2 text-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                        >
                          {option}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </div>

                  {/* Definiteness Filter */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Definiteness</h4>
                    <ToggleGroup 
                      type="multiple" 
                      value={definitenessFilters} 
                      onValueChange={handleDefinitenessChange} 
                      className="grid grid-cols-2 gap-2"
                    >
                      {DEFINITENESS_OPTIONS.map(option => (
                        <ToggleGroupItem 
                          key={option} 
                          value={option} 
                          className="justify-center rounded-md px-3 py-2 text-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                        >
                          {option}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="exemplars">
              <AccordionTrigger className="text-base font-medium">
                Exemplars
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <ToggleGroup 
                    type="multiple" 
                    value={exemplarFilters.map(String)} 
                    onValueChange={handleExemplarChange} 
                    className="grid grid-cols-2 gap-2"
                  >
                    {availableExemplars.map(exemplar => (
                      <ToggleGroupItem 
                        key={exemplar.id} 
                        value={String(exemplar.id)} 
                        className="justify-center rounded-md px-3 py-2 text-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                      >
                        {exemplar.exemplar}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>

        <SheetFooter className="flex-row justify-between gap-4 border-t pt-4 mt-4">
          <Button 
            variant="outline" 
            onClick={onReset}
            className="flex-1"
          >
            Reset all filters
          </Button>
          <Button 
            onClick={onApply}
            disabled={!hasPendingChanges}
            className="flex-1"
          >
            Apply
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}