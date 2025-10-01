import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { LoadingSkeleton } from "./sidebar/LoadingSkeleton";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Sidebar, SidebarContent, useSidebar, SidebarTrigger } from "@/components/ui/sidebar";
import { MobileNavbar } from "./MobileNavbar";
import { FeedbackInSidebar } from "./sidebar/FeedbackInSidebar";
import { ThemeToggle } from "./sidebar/ThemeToggle";
import { LearnWithTeacher } from "./sidebar/LearnWithTeacher";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

type Subcategory = {
  subcategory: string;
  word_category: string;
  status: string;
  difficulty: string;
  further_reading: string | null;
};

export function AppSidebar( { currentSentence }: {currentSentence?: number }){
  const navigate = useNavigate();
  const { setOpenMobile, isMobile } = useSidebar();
  const [openCategories, setOpenCategories] = useState<string[]>([]); // controlled accordion

  const { data: subcategories, isLoading } = useQuery({
    queryKey: ["subcategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subcategories")
        .select(
          "subcategory, word_category, status, difficulty, further_reading"
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

  const preferredSubcategoryOrder = [
    "Gender",
    "Gender recognition",
    "Definite article",
    "Plural",
    "Cases",
  ];

  Object.keys(categoriesMap).forEach((category) => {
    categoriesMap[category].sort((a, b) => {
      const indexA = preferredSubcategoryOrder.indexOf(a.subcategory);
      const indexB = preferredSubcategoryOrder.indexOf(b.subcategory);

      // If both are in the preferred list, compare by index
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      // If only A is in the list, it comes first
      if (indexA !== -1) return -1;
      // If only B is in the list, it comes first
      if (indexB !== -1) return 1;
      // If neither are in the list, keep their original order
      return 0;
    });
  });

  const preferredWordCategoryOrder = [
    "Nouns",
    "Verbs",
    "Adjectives",
    "Prepositions",
    "Numbers",
  ];

  const categoryNames = preferredWordCategoryOrder.filter(
    (c) => categoriesMap[c]
  );

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
        <div className="flex-1">
          <div className="flex flex-row justify-between items-center mb-4 pl-2">
            <Link to="/" className="flex items-center gap-2">
              <h2 className="font-bold">Grammar made easi(er)</h2>
              <img src="/logo.png" alt="Logo" className="h-6 w-6" />
            </Link> 
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full absolute right-4 md:hidden"
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
                  <ul className="pl-2 ml-2 border-l">
                    {categoriesMap[category].map((sub) => (
                      <li key={sub.subcategory} className="">
                        <button
                          className="text-left w-full p-1 pl-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg"
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
        <div className="mt-4 flex flex-col">
          <ThemeToggle/>
          <LearnWithTeacher />
          <FeedbackInSidebar currentSentence={currentSentence} />
        </div>
      </div>
      </SidebarContent>
   </Sidebar>
);
}
