
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CasesFilterProps {
  onFiltersChange: (filters: {
    caseFilters: string[];
    numberFilters: string[];
    definitenessFilters: string[];
  }) => void;
}

const CASE_OPTIONS = ["Accusative", "Dative", "Genitive"];
const NUMBER_OPTIONS = ["Singular", "Plural"];
const DEFINITENESS_OPTIONS = ["Indefinite", "Definite"];

export function CasesFilter({ onFiltersChange }: CasesFilterProps) {
  const [caseFilters, setCaseFilters] = useState<string[]>(["Accusative"]);
  const [numberFilters, setNumberFilters] = useState<string[]>(["Singular"]);
  const [definitenessFilters, setDefinitenessFilters] = useState<string[]>(["Indefinite"]);

  useEffect(() => {
    onFiltersChange({
      caseFilters,
      numberFilters,
      definitenessFilters,
    });
  }, [caseFilters, numberFilters, definitenessFilters, onFiltersChange]);

  const handleCaseChange = (option: string, checked: boolean) => {
    if (checked) {
      setCaseFilters(prev => [...prev, option]);
    } else {
      setCaseFilters(prev => {
        const newFilters = prev.filter(f => f !== option);
        // Prevent deselecting all options
        return newFilters.length === 0 ? prev : newFilters;
      });
    }
  };

  const handleNumberChange = (option: string, checked: boolean) => {
    if (checked) {
      setNumberFilters(prev => [...prev, option]);
    } else {
      setNumberFilters(prev => {
        const newFilters = prev.filter(f => f !== option);
        // Prevent deselecting all options
        return newFilters.length === 0 ? prev : newFilters;
      });
    }
  };

  const handleDefinitenessChange = (option: string, checked: boolean) => {
    if (checked) {
      setDefinitenessFilters(prev => [...prev, option]);
    } else {
      setDefinitenessFilters(prev => {
        const newFilters = prev.filter(f => f !== option);
        // Prevent deselecting all options
        return newFilters.length === 0 ? prev : newFilters;
      });
    }
  };

  // Reset to defaults function
  const resetFilters = () => {
    setCaseFilters(["Accusative"]);
    setNumberFilters(["Singular"]);
    setDefinitenessFilters(["Indefinite"]);
  };

  // Expose reset function to parent
  useEffect(() => {
    (window as any).resetCasesFilters = resetFilters;
    return () => {
      delete (window as any).resetCasesFilters;
    };
  }, []);

  return (
    <Card className="w-full max-w-3xl mx-auto mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Filter Exercises</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Case Filter */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Case</h4>
            <div className="space-y-2">
              {CASE_OPTIONS.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`case-${option}`}
                    checked={caseFilters.includes(option)}
                    onCheckedChange={(checked) => 
                      handleCaseChange(option, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`case-${option}`} 
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Number Filter */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Number</h4>
            <div className="space-y-2">
              {NUMBER_OPTIONS.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`number-${option}`}
                    checked={numberFilters.includes(option)}
                    onCheckedChange={(checked) => 
                      handleNumberChange(option, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`number-${option}`} 
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Definiteness Filter */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Definiteness</h4>
            <div className="space-y-2">
              {DEFINITENESS_OPTIONS.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`definiteness-${option}`}
                    checked={definitenessFilters.includes(option)}
                    onCheckedChange={(checked) => 
                      handleDefinitenessChange(option, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`definiteness-${option}`} 
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
