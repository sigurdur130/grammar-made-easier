
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { LoadingSkeleton } from "./sidebar/LoadingSkeleton";
import { CategoryList } from "./sidebar/CategoryList";
import { useSidebar } from "@/components/ui/sidebar";
import { MobileNavbar } from "./MobileNavbar";

export function AppSidebar() {
  const navigate = useNavigate();
  const { setOpenMobile, isMobile } = useSidebar();
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

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["wordCategories", subcategories],
    queryFn: async () => {
      if (!subcategories) return [];
      
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
    enabled: !!subcategories,
  });

  const toggleCategory = (category: string) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  const handleSubcategoryClick = (category: string, subcategory: string) => {
    navigate(`/exercises/${category}/${subcategory}`);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  if (categoriesLoading || subcategoriesLoading) {
    return (
      <>
        <LoadingSkeleton />
        <MobileNavbar />
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
      <MobileNavbar />
    </>
  );
}
