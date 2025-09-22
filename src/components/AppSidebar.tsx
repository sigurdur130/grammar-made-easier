// AppSidebar.tsx
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { LoadingSkeleton } from "./sidebar/LoadingSkeleton";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Sidebar, SidebarContent, useSidebar } from "@/components/ui/sidebar";
import { MobileNavbar } from "./MobileNavbar";
import { FeedbackInSidebar } from "./sidebar/FeedbackInSidebar";
import { ThemeToggle } from "./sidebar/ThemeToggle";
import { LearnWithTeacher } from "./sidebar/LearnWithTeacher";
import { Link } from "react-router-dom";

// Subcategory type
type Subcategory = {
  subcategory: string;
  word_category: string;
  created_at: string;
  status: string;
  difficulty: string;
  further_reading: string | null;
};

export function AppSidebar() {
  const navigate = useNavigate();
  const { setOpenMobile, isMobile } = useSidebar();
  const [openCategories, setOpenCategories] = useState<string[]>([]); // controlled accordion

  const { data: subcategories, isLoading } = useQuery({
    queryKey: ["subcategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subcategories")
        .select(
          "subcategory, word_category, created_at, status, difficulty, further_reading"
        )
        .eq("status", "online");

      if (error) throw error;
      return data as Subcategory[];
    },
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <>
        <LoadingSkeleton />
        <MobileNavbar />
      </>
    );
  }

  // Group subcategories by word_category
  const categoriesMap: Record<string, Subcategory[]> = {};
  (subcategories || []).forEach((sub) => {
    if (typeof sub.subcategory !== "string") return; // skip invalid entries
    if (!categoriesMap[sub.word_category]) categoriesMap[sub.word_category] = [];
    categoriesMap[sub.word_category].push(sub);
  });

  const categoryNames = Object.keys(categoriesMap);

  const handleToggleCategory = (category: string) => {
    setOpenCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSubcategoryClick = (category: string, subcategory: string) => {
    navigate(`/exercises/${category}/${subcategory}`);
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar>
      <SidebarContent>
        <div className="flex flex-col h-screen p-4">
        {/* Top: Logo + Accordion, scrollable */}
        <div className="flex-1 overflow-y-auto">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <h2 className="font-bold">Grammar made easi(er)</h2>
            <img src="/logo.png" alt="Logo" className="h-6 w-6" />
          </Link>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full absolute right-4"
          asChild
        >
          <SidebarTrigger>
            <Menu className="h-5 w-5" />
          </SidebarTrigger>
        </Button>
      </div>


          <Accordion type="multiple" value={openCategories} onValueChange={(v) => setOpenCategories(v as string[])} >
            {categoryNames.map((category) => (
              <AccordionItem key={category} value={category}>
                <AccordionTrigger onClick={() => handleToggleCategory(category)}>
                  {category}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="pl-2">
                    {categoriesMap[category].map((sub) => (
                      <li key={sub.subcategory}>
                        <button
                          className="text-left w-full py-1 hover:text-blue-600"
                          onClick={() => handleSubcategoryClick(category, sub.subcategory)}
                        >
                          {sub.subcategory}
                        </button>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Bottom: sticks to bottom */}
        <div className="mt-4 flex flex-col gap-2">
          <ThemeToggle/>
          <LearnWithTeacher />
          <FeedbackInSidebar />
        </div>
      </div>
      </SidebarContent>
   </Sidebar>
);
}
