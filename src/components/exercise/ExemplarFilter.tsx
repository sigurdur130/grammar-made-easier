import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface Exemplar {
  id: number;
  exemplar_name: string;
  gender: string | null;
  default: boolean | null;
}

interface ExemplarFilterProps {
  exemplars: Exemplar[];
  selectedExemplars: number[];
  onExemplarChange: (exemplars: number[]) => void;
}

export function ExemplarFilter({ 
  exemplars, 
  selectedExemplars, 
  onExemplarChange 
}: ExemplarFilterProps) {
  // Group exemplars by gender
  const groupedExemplars = exemplars.reduce((acc, exemplar) => {
    const gender = exemplar.gender || "Unknown";
    if (!acc[gender]) {
      acc[gender] = [];
    }
    acc[gender].push(exemplar);
    return acc;
  }, {} as Record<string, Exemplar[]>);

  const handleExemplarChange = (values: string[]) => {
    // Convert string values back to numbers
    const numericValues = values.map(v => parseInt(v, 10));
    onExemplarChange(numericValues);
  };

  // Convert selected exemplars to strings for ToggleGroup
  const selectedExemplarStrings = selectedExemplars.map(id => id.toString());

  return (
    <div className="space-y-6">
      {Object.entries(groupedExemplars).map(([gender, genderExemplars]) => (
        <div key={gender} className="space-y-3">
          <h5 className="font-medium text-sm">{gender}</h5>
          <ToggleGroup 
            type="multiple" 
            value={selectedExemplarStrings} 
            onValueChange={handleExemplarChange}
            className="flex flex-col gap-2"
          >
            {genderExemplars.map((exemplar) => (
              <ToggleGroupItem 
                key={exemplar.id} 
                value={exemplar.id.toString()}
                className="justify-start rounded-full px-4 py-2 text-sm border border-input bg-muted/30 hover:bg-muted/50 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                {exemplar.exemplar_name}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      ))}
    </div>
  );
}