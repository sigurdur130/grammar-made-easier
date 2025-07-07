
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface CasesFilterProps {
  caseFilters: string[];
  numberFilters: string[];
  definitenessFilters: string[];
  onFiltersChange: (filters: {
    caseFilters: string[];
    numberFilters: string[];
    definitenessFilters: string[];
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
    });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto mb-6 mt-6">
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* Case Filter */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Case</h4>
            <ToggleGroup 
              type="multiple" 
              value={caseFilters} 
              onValueChange={handleCaseChange}
              className="flex flex-col gap-2"
            >
              {CASE_OPTIONS.map((option) => (
                <ToggleGroupItem 
                  key={option} 
                  value={option}
                  className="justify-start rounded-full px-4 py-2 text-sm data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
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
              className="flex flex-col gap-2"
            >
              {NUMBER_OPTIONS.map((option) => (
                <ToggleGroupItem 
                  key={option} 
                  value={option}
                  className="justify-start rounded-full px-4 py-2 text-sm data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
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
              className="flex flex-col gap-2"
            >
              {DEFINITENESS_OPTIONS.map((option) => (
                <ToggleGroupItem 
                  key={option} 
                  value={option}
                  className="justify-start rounded-full px-4 py-2 text-sm data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  {option}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
