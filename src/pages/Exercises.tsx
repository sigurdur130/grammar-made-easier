import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ExerciseCard } from "@/components/ExerciseCard";
import { supabase } from "@/integrations/supabase/client";

const Exercises = () => {
  const { category, subcategory } = useParams();

  const { data: sentences, isLoading } = useQuery({
    queryKey: ["sentences", category, subcategory],
    queryFn: async () => {
      console.log("Fetching sentences for:", category, subcategory);
      const { data, error } = await supabase
        .from("sentences")
        .select("*")
        .eq("word_category", category)
        .eq("subcategory", subcategory)
        .limit(6)
        .order("RANDOM()");

      if (error) {
        console.error("Error fetching sentences:", error);
        throw error;
      }
      console.log("Fetched sentences:", data);
      return data;
    },
  });

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6">
            {subcategory} - {category}
          </h1>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-32 bg-muted animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sentences?.map((sentence) => (
                <ExerciseCard key={sentence.id} sentence={sentence} />
              ))}
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Exercises;