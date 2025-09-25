import { useState } from "react";
import { Book, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface FurtherReadingProps {
  content: string | null;
}

export function FurtherReading({ content }: FurtherReadingProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!content) return null;

  return (
    <div className="max-w-3xl mx-auto mt-6">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full"
      >
        <CollapsibleTrigger className="flex items-center justify-center w-full gap-2 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <Book className="h-4 w-4" />
          Further reading
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <Card>
            <CardContent className="p-4 prose dark:prose-invert prose-sm max-w-none prose-headings:mt-4 prose-headings:mb-2 prose-ul:m-0">
              <div 
                dangerouslySetInnerHTML={{ __html: content }} 
                className="html-content"
              />
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
