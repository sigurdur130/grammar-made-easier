import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ExerciseCard } from "@/components/ExerciseCard";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

const Exercises = () => {
  const { category, subcategory } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);

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
        .order('id');

      if (error) {
        console.error("Error fetching sentences:", error);
        throw error;
      }
      console.log("Fetched sentences:", data);
      return data;
    },
  });

  const handleNext = () => {
    if (sentences && currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const progress = sentences ? ((currentIndex + 1) / sentences.length) * 100 : 0;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <Progress value={progress} className="mb-6" />
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">{subcategory}</h1>
              <div className="text-muted-foreground">
                Progress: {currentIndex + 1}/{sentences?.length || 6}
              </div>
            </div>
            
            {isLoading ? (
              <div className="h-[400px] bg-muted animate-pulse rounded-lg" />
            ) : sentences && sentences.length > 0 ? (
              <ExerciseCard 
                sentence={sentences[currentIndex]} 
                onCorrect={handleNext}
              />
            ) : null}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Exercises;