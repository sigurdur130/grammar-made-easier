
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import { CategoryItem } from "./CategoryItem";
import { Database } from "@/integrations/supabase/types";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { LearnWithTeacher } from "./LearnWithTeacher";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const { setOpenMobile, isMobile } = useSidebar();

  if (!categories?.length) {
    return (
      <Sidebar>
        <SidebarContent>
          <div className="p-4 text-sm text-muted-foreground">
            No categories available
          </div>
        </SidebarContent>
        <ThemeToggle />
        <LearnWithTeacher />
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <SidebarContent>
        <div className="flex items-center justify-between px-4 py-3">
          <Link 
            to="/" 
            className="text-lg font-semibold text-sidebar-primary hover:text-sidebar-primary/80 transition-colors"
          >
            Grammar made easi(er)
          </Link>
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full" 
              onClick={() => setOpenMobile(false)}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close sidebar</span>
            </Button>
          )}
        </div>
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
      <ThemeToggle />
      <LearnWithTeacher />
    </Sidebar>
  );
}
