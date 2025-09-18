import { ChevronDown } from "lucide-react";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Database } from "@/integrations/supabase/types";

type CategoryItemProps = {
  categoryName: string;
  subcategories: Array<Database["public"]["Tables"]["subcategories"]["Row"]>;
  isOpen: boolean;
  onToggle: () => void;
  onSubcategoryClick: (category: string, subcategory: string) => void;
};

export function CategoryItem({
  categoryName,
  subcategories,
  isOpen,
  onToggle,
  onSubcategoryClick,
}: CategoryItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={onToggle}
        className={isOpen ? "bg-accent" : ""}
      >
        <span>{categoryName}</span>
        <ChevronDown
          className={`ml-auto h-4 w-4 transition-transform duration-300 ease-in-out ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </SidebarMenuButton>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <SidebarMenuSub>
          {subcategories
            ?.filter((sub) => sub.word_category === categoryName)
            .map((sub) => (
              <SidebarMenuSubButton
                key={sub.subcategory}
                onClick={() =>
                  onSubcategoryClick(
                    categoryName || "",
                    sub.subcategory || ""
                  )
                }
                className="cursor-pointer"
              >
                {sub.subcategory}
              </SidebarMenuSubButton>
            ))}
        </SidebarMenuSub>
      </div>
    </SidebarMenuItem>
  );
}