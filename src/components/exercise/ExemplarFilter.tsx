import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

interface Exemplar {
  id: number;
  exemplar_name: string;
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
    <Accordion type="multiple" defaultValue={[]} className="space-y-2">
      {genderOrder.map((gender) => {
        const genderExemplars = exemplars.filter(e => e.gender === gender);
        if (!genderExemplars.length) return null;

        return (
          <AccordionItem 
            key={gender}
            value={gender}
            className="last:border-b-0">
            <AccordionTrigger>{gender}</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col space-y-1">
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
                    {ex.exemplar_name}
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
