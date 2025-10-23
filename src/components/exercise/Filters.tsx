import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "@/hooks/use-toast";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Info } from "lucide-react";

interface Exemplar {
  id: number;
  exemplar_name: string;
  gender: string | null;
  default: boolean | null;
  weak_strong: string | null;
  about: string | null;
  pills: string[] | null;
  bin_link: string | null;
}

interface FiltersProps {
  caseFilters: string[];
  numberFilters: string[];
  definitenessFilters: string[];
  exemplarFilters: number[];
  exemplars: Exemplar[];
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

export function Filters({
  caseFilters,
  numberFilters,
  definitenessFilters,
  exemplarFilters,
  exemplars,
  onFiltersChange,
}: FiltersProps) {

  // --- Cases / Number / Definiteness handlers ---
  const handleCaseChange = (values: string[]) => {
    if (values.length === 0) {
      toast({
        title: "If you deselect EVERYTHING, there won't be anything for you to practice!",
        duration: 2000,
      });
        return;
    }
    onFiltersChange({ caseFilters: values, numberFilters, definitenessFilters, exemplarFilters });
  };

  const handleNumberChange = (values: string[]) => {
    if (values.length === 0) {
      toast({
        title: "If you deselect EVERYTHING, there won't be anything for you to practice!",
        duration: 2000,
      });
      return;
    }
    onFiltersChange({ caseFilters, numberFilters: values, definitenessFilters, exemplarFilters });
  };

  const handleDefinitenessChange = (values: string[]) => {
    if (values.length === 0) {
      toast({
        title: "If you deselect EVERYTHING, there won't be anything for you to practice!",
        duration: 2000,
      });
      return;
    }
    onFiltersChange({ caseFilters, numberFilters, definitenessFilters: values, exemplarFilters });
  };

  // --- Exemplar handler ---
  const handleExemplarChange = (selected: number[]) => {
      if (selected.length === 0) {
        toast({
          title: "If you deselect EVERYTHING, there won't be anything for you to practice!",
          duration: 2000,
        });
        return;
      }
    onFiltersChange({ caseFilters, numberFilters, definitenessFilters, exemplarFilters: selected });
  };

  // --- Exemplar rendering ---
  const genderOrder = ["Masculine", "Feminine", "Neuter"];
  const renderExemplarAccordion = () => (
    <Accordion type="multiple" className="">
      {genderOrder.map((gender) => {
        const genderExemplars = exemplars.filter(e => e.gender === gender);
        const sortedExemplars = genderExemplars.sort((a, b) => {
          if (a.default && !b.default) return -1;
          if (!a.default && b.default) return 1;
          return 0;
        });
        
        if (!genderExemplars.length) return null;

        const strongExemplars = genderExemplars
          .filter(e => e.weak_strong === 'Strong')
          .sort((a, b) => (a.default && !b.default ? -1 : !a.default && b.default ? 1 : 0));
        const weakExemplars = genderExemplars
          .filter(e => e.weak_strong === 'Weak')
          .sort((a, b) => (a.default && !b.default ? -1 : !a.default && b.default ? 1 : 0)
          );

        return (
        <AccordionItem key={gender} value={gender}>
          <AccordionTrigger className="font-medium text-sm">{gender}</AccordionTrigger>
          <AccordionContent className="p-3 pl-4">
            <div className="flex gap-4">
              
              {/* Strong Column */}
              <div className="flex-1 border p-2 rounded-lg">
                <div className="font-semibold mb-2">Strong</div>
                <div className="flex flex-col gap-2">
                  {strongExemplars.map((ex) => (
                    <label key={ex.id} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        className="h-4 w-4"
                        checked={exemplarFilters.includes(ex.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleExemplarChange([...exemplarFilters, ex.id]);
                          } else {
                            handleExemplarChange(exemplarFilters.filter(id => id !== ex.id));
                          }
                        }}
                      />

                      <span>{ex.exemplar_name}</span>

                      {/* Info Popover */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="text-muted-foreground hover:text-primary focus:outline-none"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="max-w-xs p-3 space-y-2.5 text-sm rounded-md shadow-md pointer-events-auto">
                          {ex.about && <p className="whitespace-pre-line">{ex.about}</p>}

                          {ex.pills && ex.pills.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {ex.pills.map((pill, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 text-xs bg-muted rounded-full"
                                >
                                  {pill}
                                </span>
                              ))}
                            </div>
                          )}

                          {ex.bin_link && (
                            <a
                              href={ex.bin_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-primary underline text-xs">
                              See {ex.exemplar_name} on BIN →
                            </a>
                          )}
                        </PopoverContent>
                      </Popover>
                    </label>

                  ))}
                </div>
              </div>

              {/* Weak Column */}
              <div className="flex-1 flex-1 border p-2 rounded-lg">
                <div className="font-semibold mb-2">Weak</div>
                <div className="flex flex-col gap-2">
                  {weakExemplars.map((ex) => (
                    <label key={ex.id} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        className="h-4 w-4"
                        checked={exemplarFilters.includes(ex.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleExemplarChange([...exemplarFilters, ex.id]);
                          } else {
                            handleExemplarChange(exemplarFilters.filter(id => id !== ex.id));
                          }
                        }}
                      />

                      <span>{ex.exemplar_name}</span>

                      {/* Info Popover */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="text-muted-foreground hover:text-primary focus:outline-none"
                            onClick={(e) => e.stopPropagation()} // prevents label click toggling checkbox
                          >
                            <Info className="w-4 h-4" />
                          </button>
                        </PopoverTrigger>

                        <PopoverContent className="max-w-xs p-3 space-y-2.5 text-sm rounded-md shadow-md">
                          {ex.about && <p className="whitespace-pre-line">{ex.about}</p>}

                          {ex.pills && ex.pills.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {ex.pills.map((pill, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 text-xs bg-muted rounded-full"
                                >
                                  {pill}
                                </span>
                              ))}
                            </div>
                          )}

                          {ex.bin_link && (
                            <a
                              href={ex.bin_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-primary underline text-xs"
                            >
                              See {ex.exemplar_name} on BIN →
                            </a>
                          )}
                        </PopoverContent>
                      </Popover>
                    </label>

                  ))}
                </div>
              </div>

            </div>
          </AccordionContent>
        </AccordionItem>
      );
    })}
  </Accordion>
);

  return (
  <div className="w-full max-w-3xl mx-auto mb-6 py-4 pl-4 space-y-6">
    <Accordion type="multiple">

      {/* Grammar Filter Accordion */}
      <AccordionItem value="grammar">
        <AccordionTrigger className="text-lg font-medium my-1">Grammar</AccordionTrigger>
        <AccordionContent className="">
          <div className="space-y-4 p-4 pt-2">
            {/* Case Options */}
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

            {/* Number Options */}
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

            {/* Definiteness Options */}
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
        </AccordionContent>
      </AccordionItem>

      {/* Exemplar Filter Accordion */}
      <AccordionItem value="exemplars">
        <AccordionTrigger className="text-lg font-medium">Exemplars</AccordionTrigger>
        <AccordionContent className="ml-2 pl-2 border-l">
          {renderExemplarAccordion()}
        </AccordionContent>
      </AccordionItem>

    </Accordion>
  </div>
);
}