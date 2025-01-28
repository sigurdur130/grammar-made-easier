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

  const { data: sentences, isLoading, refetch } = useQuery({
    queryKey: ["sentences", category, subcategory],
    queryFn: async () => {
      console.log("Fetching sentences for:", category, subcategory);
      const { data, error } = await supabase
        .from("sentences")
        .select("*")
        .eq("word_category", category)
        .eq("subcategory", subcategory)
        .limit(6)
        .order('id', { ascending: true, foreignTable: null }) // This ensures proper ordering
        .then(result => {
          if (result.error) throw result.error;
          // Shuffle the results after fetching
          return {
            ...result,
            data: result.data ? result.data.sort(() => Math.random() - 0.5) : null
          };
        });

      if (error) {
        console.error("Error fetching sentences:", error);
        throw error;
      }
      console.log("Fetched sentences:", data);
      return data;
    },
  });

  const handleCorrectAnswer = () => {
    console.log("Handling correct answer. Current count:", answeredCount);
    setAnsweredCount(prev => prev + 1);
    if (sentences && currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleRestart = async () => {
    console.log("Restarting exercises...");
    setCurrentIndex(0);
    setAnsweredCount(0);
    await refetch();
  };

  const progress = sentences ? ((answeredCount) / sentences.length) * 100 : 0;
  const isComplete = sentences && answeredCount === sentences.length;

  console.log("Render state:", { 
    answeredCount, 
    totalSentences: sentences?.length,
    isComplete,
    progress 
  });

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
                <EndScreen onRestart={handleRestart} />
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