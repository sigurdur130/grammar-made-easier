import { useQuery } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { CategoryCard } from "@/components/CategoryCard";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { data: subcategories } = useQuery({
    queryKey: ["featuredSubcategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subcategories")
        .select("subcategory, word_category")
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6">Featured Categories</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subcategories?.map((sub) => (
              <CategoryCard 
                key={sub.subcategory} 
                title={sub.subcategory || ''} 
                category={sub.word_category || ''}
              />
            ))}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;