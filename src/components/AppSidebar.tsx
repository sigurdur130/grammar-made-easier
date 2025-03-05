
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Menu } from "lucide-react";
import { LoadingSkeleton } from "./sidebar/LoadingSkeleton";
import { CategoryList } from "./sidebar/CategoryList";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const navigate = useNavigate();
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const { data: subcategories, isLoading: subcategoriesLoading } = useQuery({
    queryKey: ["subcategories"],
    queryFn: async () => {
      console.log("Fetching subcategories...");
      const { data, error } = await supabase
        .from("subcategories")
        .select("subcategory, word_category, created_at, status, difficulty")
        .eq('status', 'online');
      if (error) {
        console.error("Error fetching subcategories:", error);
        throw error;
      }
      console.log("Fetched subcategories:", data);
      return data;
    },
  });

  // Get unique categories that have online subcategories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["wordCategories", subcategories],
    queryFn: async () => {
      if (!subcategories) return [];
      
      // Get unique word categories from subcategories
      const uniqueCategories = [...new Set(subcategories.map(sub => sub.word_category))];
      
      console.log("Fetching word categories...");
      const { data, error } = await supabase
        .from("word_categories")
        .select("word_category, created_at")
        .in('word_category', uniqueCategories);
      
      if (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }
      console.log("Fetched categories:", data);
      return data;
    },
    enabled: !!subcategories, // Only run this query when subcategories are loaded
  });

  const toggleCategory = (category: string) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  const handleSubcategoryClick = (category: string, subcategory: string) => {
    navigate(`/exercises/${category}/${subcategory}`);
  };

  // Mobile sidebar toggle
  const MobileSidebarToggle = () => (
    <div className="fixed bottom-4 right-4 z-50 md:hidden">
      <Button
        variant="default"
        size="icon"
        className="rounded-full shadow-lg"
        asChild
      >
        <SidebarTrigger>
          <Menu className="h-5 w-5" />
        </SidebarTrigger>
      </Button>
    </div>
  );

  if (categoriesLoading || subcategoriesLoading) {
    return (
      <>
        <LoadingSkeleton />
        <MobileSidebarToggle />
      </>
    );
  }

  return (
    <>
      <CategoryList
        categories={categories || []}
        subcategories={subcategories || []}
        openCategory={openCategory}
        onToggleCategory={toggleCategory}
        onSubcategoryClick={handleSubcategoryClick}
      />
      <MobileSidebarToggle />
    </>
  );
}
