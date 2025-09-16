import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

interface Exemplar {
  id: number;
  exemplar: string;
  gender: string | null;
  default: boolean | null;
}

interface ExemplarFilterProps {
  exemplars: Exemplar[];
  selectedExemplars: number[];
  onExemplarChange: (selected: number[]) => void;
}

export function ExemplarFilter({ exemplars, selectedExemplars, onExemplarChange }: ExemplarFilterProps) {
  const genderOrder = ["Masculine", "Feminine", "Neuter"];

  return (
    <Accordion type="multiple" defaultValue={[]} className="space-y-2 pl-4">
      {genderOrder.map((gender) => {
        const genderExemplars = exemplars.filter(e => e.gender === gender);
        const sortedExemplars = genderExemplars.sort((a, b) => {
          if (a.default && !b.default) return -1;
          if (!a.default && b.default) return 1;
          return 0;
        });

        if (!genderExemplars.length) return null;

        return (
          <AccordionItem 
            key={gender}
            value={gender}
            className="last:border-b-0">
            <AccordionTrigger className="font-medium text-sm">{gender}</AccordionTrigger>
            <AccordionContent className="!pb-0">
              <div className="grid grid-cols-2 gap-2 pb-4">
                {sortedExemplars.map((ex) => (
                  <label key={ex.id} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      className="h-4 w-4"
                      checked={selectedExemplars.includes(ex.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          onExemplarChange([...selectedExemplars, ex.id]);
                        } else {
                          onExemplarChange(selectedExemplars.filter(id => id !== ex.id));
                        }
                      }}
                    />
                    {ex.exemplar}
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
