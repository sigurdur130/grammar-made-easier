import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

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
        if (!genderExemplars.length) return null;

        return (
          <AccordionItem 
            key={gender}
            value={gender}
            className="last:border-b-0">
            <AccordionTrigger className="font-medium text-sm">{gender}</AccordionTrigger>
            <AccordionContent className="!pb-0">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 pb-4">
                {genderExemplars.map((ex) => (
                  <label key={ex.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedExemplars.includes(ex.id)}
                      onChange={() => {
                        if (selectedExemplars.includes(ex.id)) {
                          onExemplarChange(selectedExemplars.filter(id => id !== ex.id));
                        } else {
                          onExemplarChange([...selectedExemplars, ex.id]);
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
