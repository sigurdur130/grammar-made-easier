import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onCheck: () => void;
  onToggleHint: () => void;
}

export function ActionButtons({ onCheck, onToggleHint }: ActionButtonsProps) {
  return (
    <div className="flex justify-center gap-4">
      <Button
        onClick={onCheck}
        className="bg-[#6B46C1] hover:bg-[#553C9A] text-white px-8"
      >
        Check
      </Button>
      <Button
        onClick={onToggleHint}
        variant="outline"
        className="border-[#6B46C1] text-[#6B46C1] hover:bg-[#6B46C1] hover:text-white"
      >
        <HelpCircle className="h-4 w-4" />
        Hint
      </Button>
    </div>
  );
}