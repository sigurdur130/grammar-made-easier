import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { CategoryItem } from "./CategoryItem";
import { Database } from "@/integrations/supabase/types";

type CategoryListProps = {
  categories: Array<Database["public"]["Tables"]["word_categories"]["Row"]>;
  subcategories: Array<Database["public"]["Tables"]["subcategories"]["Row"]>;
  openCategory: string | null;
  onToggleCategory: (category: string) => void;
  onSubcategoryClick: (category: string, subcategory: string) => void;
};

export function CategoryList({
  categories,
  subcategories,
  openCategory,
  onToggleCategory,
  onSubcategoryClick,
}: CategoryListProps) {
  if (!categories?.length) {
    return (
      <Sidebar>
        <SidebarContent>
          <div className="p-4 text-sm text-muted-foreground">
            No categories available
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((category) => (
                <CategoryItem
                  key={category.word_category}
                  category={category}
                  subcategories={subcategories}
                  isOpen={openCategory === category.word_category}
                  onToggle={() => onToggleCategory(category.word_category || "")}
                  onSubcategoryClick={onSubcategoryClick}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}