
import { useQuery } from "@tanstack/react-query";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { CategoryCard } from "@/components/CategoryCard";
import { supabase } from "@/integrations/supabase/client";
import { Sprout, Leaf, TreePine, Mountain } from "lucide-react";

interface GroupedByDifficulty {
  [difficulty: string]: {
    [wordCategory: string]: {
      subcategory: string;
      word_category: string;
      status?: string;
      difficulty?: string;
    }[];
  };
}

// Helper function to get the order and icon for difficulty levels
const getDifficultyInfo = (difficulty: string | undefined) => {
  switch (difficulty?.toLowerCase()) {
    case "beginner":
      return { order: 1, icon: <Sprout className="h-5 w-5 text-green-500 mr-2" /> };
    case "low intermediate":
      return { order: 2, icon: <Leaf className="h-5 w-5 text-blue-500 mr-2" /> };
    case "high intermediate":
      return { order: 3, icon: <TreePine className="h-5 w-5 text-orange-500 mr-2" /> };
    case "advanced":
      return { order: 4, icon: <Mountain className="h-5 w-5 text-purple-500 mr-2" /> };
    default:
      return { order: 5, icon: null };
  }
};

const Index = () => {
  const { data: subcategories } = useQuery({
    queryKey: ["featuredSubcategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subcategories")
        .select("subcategory, word_category, status, difficulty")
        .eq('status', 'online');
      if (error) throw error;
      return data;
    },
  });

  // First group by difficulty, then by word_category
  const groupedByDifficulty: GroupedByDifficulty = {};
  
  subcategories?.forEach((sub) => {
    const difficulty = sub.difficulty || "Unknown";
    
    if (!groupedByDifficulty[difficulty]) {
      groupedByDifficulty[difficulty] = {};
    }
    
    if (!groupedByDifficulty[difficulty][sub.word_category]) {
      groupedByDifficulty[difficulty][sub.word_category] = [];
    }
    
    groupedByDifficulty[difficulty][sub.word_category].push(sub);
  });

  // Sort difficulty levels
  const sortedDifficulties = Object.keys(groupedByDifficulty).sort((a, b) => {
    return getDifficultyInfo(a).order - getDifficultyInfo(b).order;
  });

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="px-4 py-6 md:p-6 pt-[calc(theme(spacing.6)_+_theme(spacing.14))] md:pt-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center px-2">
              What do you want to practice today?
            </h1>
            <div className="space-y-8 md:space-y-12">
              {sortedDifficulties.map((difficulty) => (
                <div key={difficulty} className="space-y-6">
                  <div className="flex items-center bg-background/95 backdrop-blur py-2 sticky top-12 md:top-0 z-10">
                    {getDifficultyInfo(difficulty).icon}
                    <h2 className="text-xl md:text-2xl font-bold text-left">
                      {difficulty}
                    </h2>
                  </div>
                  
                  <div className="space-y-8">
                    {Object.entries(groupedByDifficulty[difficulty]).map(([wordCategory, subs]) => (
                      <div key={`${difficulty}-${wordCategory}`} className="space-y-3 md:space-y-4">
                        <h3 className="text-lg md:text-xl font-semibold text-left pl-2 sticky top-24 md:top-12 bg-background/95 backdrop-blur py-2 z-5">
                          {wordCategory}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 px-2">
                          {subs.map((sub) => (
                            <CategoryCard
                              key={sub.subcategory}
                              title={sub.subcategory || ''}
                              category={sub.word_category || ''}
                              difficulty={sub.difficulty}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
