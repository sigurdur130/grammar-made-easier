import { Sidebar, SidebarContent, useSidebar } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { LearnWithTeacher } from "./LearnWithTeacher";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeedbackInSidebar } from "./FeedbackInSidebar";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

type Subcategory = {
  subcategory: string;
  word_category: string;
  created_at: string;
  status: string;
  difficulty: string;
  further_reading: string | null;
};

type CategoryListProps = {
  categories: string[];
  subcategories: Subcategory[];
  openCategory: string | null; // optional if you want controlled accordion
  onToggleCategory: (category: string) => void;
  onSubcategoryClick: (category: string, subcategory: string) => void;
};

export function CategoryList({
  categories,
  subcategories,
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
    <Sidebar className="min-w-[250px]">
      <SidebarContent>
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 py-3">
          <Link
            to="/"
            className="text-lg font-semibold text-sidebar-primary hover:text-sidebar-primary/80 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <span>Grammar made easi(er)</span>
            <img src="/logo.png" alt="Logo" className="h-6 w-6" />
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

        {/* Accordion for categories */}
        <Accordion type="multiple" className="px-2">
          {categories.map((categoryName) => {
            const subsForCategory = subcategories.filter(
              (s) => s.word_category === categoryName
            );

            return (
              <AccordionItem key={categoryName} value={categoryName}>
                <AccordionTrigger>{categoryName}</AccordionTrigger>
                <AccordionContent className="flex flex-col gap-1 mt-1">
                  {subsForCategory.map((sub) => (
                    <button
                      key={sub.subcategory}
                      onClick={() => onSubcategoryClick(categoryName, sub.subcategory)}
                      className="text-left pl-4 py-1 rounded hover:bg-accent cursor-pointer"
                    >
                      {sub.subcategory}
                    </button>
                  ))}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </SidebarContent>
    </Sidebar>
  );
}
