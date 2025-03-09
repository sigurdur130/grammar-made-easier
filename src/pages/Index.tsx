
import { useQuery } from "@tanstack/react-query";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { CategoryCard } from "@/components/CategoryCard";
import { supabase } from "@/integrations/supabase/client";

interface GroupedSubcategories {
  [key: string]: {
    subcategory: string;
    word_category: string;
    status?: string;
    difficulty?: string;
  }[];
}

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

  // Group subcategories by word_category
  const groupedSubcategories: GroupedSubcategories = {};
  subcategories?.forEach((sub) => {
    if (!groupedSubcategories[sub.word_category]) {
      groupedSubcategories[sub.word_category] = [];
    }
    groupedSubcategories[sub.word_category].push(sub);
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
            <div className="space-y-6 md:space-y-8">
              {Object.entries(groupedSubcategories).map(([category, subs]) => (
                <div key={category} className="space-y-3 md:space-y-4">
                  <h2 className="text-xl md:text-2xl font-semibold text-left pl-2 sticky top-12 md:top-0 bg-background/95 backdrop-blur py-2 z-10">
                    {category}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 px-2">
                    {subs.map((sub) => (
                      <CategoryCard
                        key={sub.subcategory}
                        title={sub.subcategory || ''}
                        category={sub.word_category || ''}
                      />
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
