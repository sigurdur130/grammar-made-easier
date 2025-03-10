
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingCheckmarkProps {
  className?: string;
  style?: React.CSSProperties;
}

export function FloatingCheckmark({ className, style }: FloatingCheckmarkProps) {
  return (
    <div 
      className={cn(
        "absolute z-50 animate-[floatUp_0.5s_ease-out_forwards] pointer-events-none",
        className
      )}
      style={style}
    >
      <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-1">
        <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
      </div>
    </div>
  );
}
