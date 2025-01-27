import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ExerciseCard } from "@/components/ExerciseCard";
import { Progress } from "@/components/ui/progress";
import { EndScreen } from "@/components/exercise/EndScreen";
import { supabase } from "@/integrations/supabase/client";

const Exercises = () => {
  const { category, subcategory } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [completedIds, setCompletedIds] = useState<number[]>([]);

  const { data: sentences, isLoading, refetch } = useQuery({
    queryKey: ["sentences", category, subcategory, completedIds],
    queryFn: async () => {
      console.log("Fetching sentences for:", category, subcategory);
      console.log("Excluding completed IDs:", completedIds);
      
      let query = supabase
        .from("sentences")
        .select("*")
        .eq("word_category", category)
        .eq("subcategory", subcategory)
        .limit(6)
        .order('id');

      // Only apply the not-in filter if there are completed IDs
      if (completedIds.length > 0) {
        query = query.not('id', 'in', completedIds);
      }

      const { data, error } = await query;

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

  const handleCorrectAnswer = () => {
    if (sentences) {
      setCompletedIds(prev => [...prev, sentences[currentIndex].id]);
      setAnsweredCount(answeredCount + 1);
      setTimeout(handleNext, 500);
    }
  };

  const handleContinue = () => {
    setCurrentIndex(0);
    refetch();
  };

  const progress = sentences ? ((answeredCount) / sentences.length) * 100 : 0;
  const isComplete = sentences && currentIndex === sentences.length - 1 && answeredCount === sentences.length;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <Progress value={progress} className="mb-6" />
            {isLoading ? (
              <div className="h-[400px] bg-muted animate-pulse rounded-lg" />
            ) : sentences && sentences.length > 0 ? (
              isComplete ? (
                <EndScreen 
                  answeredCount={answeredCount}
                  onContinue={handleContinue}
                />
              ) : (
                <ExerciseCard 
                  sentence={sentences[currentIndex]} 
                  onCorrect={handleCorrectAnswer}
                  subcategory={subcategory || ''}
                />
              )
            ) : null}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Exercises;