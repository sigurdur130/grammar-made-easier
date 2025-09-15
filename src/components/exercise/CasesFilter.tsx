import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {Accordion, AccordionItem, AccordionTrigger, AccordionContent,} from "@/components/ui/accordion";

interface CasesFilterProps {
  caseFilters: string[];
  numberFilters: string[];
  definitenessFilters: string[];
  onFiltersChange: (filters: {
    caseFilters: string[];
    numberFilters: string[];
    definitenessFilters: string[];
    exemplarFilters: number[];
  }) => void;
}

const CASE_OPTIONS = ["Accusative", "Dative", "Genitive"];
const NUMBER_OPTIONS = ["Singular", "Plural"];
const DEFINITENESS_OPTIONS = ["Indefinite", "Definite"];

export function CasesFilter({ 
  caseFilters, 
  numberFilters, 
  definitenessFilters, 
  onFiltersChange 
}: CasesFilterProps) {
  const handleCaseChange = (values: string[]) => {
    // Prevent deselecting all options
    if (values.length === 0) {
      return;
    }
    
    onFiltersChange({
      caseFilters: values,
      numberFilters,
      definitenessFilters,
      exemplarFilters: [], // Will be handled by parent component
    });
  };

  const handleNumberChange = (values: string[]) => {
    // Prevent deselecting all options
    if (values.length === 0) {
      return;
    }
    
    onFiltersChange({
      caseFilters,
      numberFilters: values,
      definitenessFilters,
      exemplarFilters: [], // Will be handled by parent component
    });
  };

  const handleDefinitenessChange = (values: string[]) => {
    // Prevent deselecting all options
    if (values.length === 0) {
      return;
    }
    
    onFiltersChange({
      caseFilters,
      numberFilters,
      definitenessFilters: values,
      exemplarFilters: [], // Will be handled by parent component
    });
  };

  return (
  <div className="w-full max-w-3xl mx-auto mb-6 py-4 pl-4 space-y-6">
    {/* Case Filter */}
    <div>
      <h3 className="font-medium text-sm mb-2">Case</h3>
      <ToggleGroup
        type="multiple"
        value={caseFilters}
        onValueChange={handleCaseChange}
        className="flex flex-wrap gap-2 justify-start"
      >
        {CASE_OPTIONS.map((option) => (
          <ToggleGroupItem
            key={option}
            value={option}
            className="px-6 py-2 rounded-md text-sm border border-input bg-muted/30 hover:bg-muted/50 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            {option}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>

    {/* Number Filter */}
    <div>
      <h3 className="font-medium text-sm mb-2">Number</h3>
      <ToggleGroup
        type="multiple"
        value={numberFilters}
        onValueChange={handleNumberChange}
        className="flex flex-wrap gap-2 justify-start"
      >
        {NUMBER_OPTIONS.map((option) => (
          <ToggleGroupItem
            key={option}
            value={option}
            className="px-6 py-2 rounded-md text-sm border border-input bg-muted/30 hover:bg-muted/50 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            {option}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>

    {/* Definiteness Filter */}
    <div>
      <h3 className="font-medium text-sm mb-2">Definiteness</h3>
      <ToggleGroup
        type="multiple"
        value={definitenessFilters}
        onValueChange={handleDefinitenessChange}
        className="flex flex-wrap gap-2 justify-start"
      >
        {DEFINITENESS_OPTIONS.map((option) => (
          <ToggleGroupItem
            key={option}
            value={option}
            className="px-6 py-2 rounded-md text-sm border border-input bg-muted/30 hover:bg-muted/50 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            {option}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  </div>
);
}