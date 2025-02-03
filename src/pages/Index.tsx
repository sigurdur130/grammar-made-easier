import { useQuery } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar";
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
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-8 text-center">
            What do you want to practice today?
          </h1>
          <div className="space-y-8">
            {Object.entries(groupedSubcategories).map(([category, subs]) => (
              <div key={category} className="space-y-4">
                <h2 className="text-2xl font-semibold text-left pl-2">
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;