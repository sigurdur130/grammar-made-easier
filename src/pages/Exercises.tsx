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
  const [showEndScreen, setShowEndScreen] = useState(false);

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

      if (completedIds.length > 0) {
        query = query.not('id', 'in', `(${completedIds.join(',')})`);
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
    if (!sentences) return;
    
    const currentSentence = sentences[currentIndex];
    if (!currentSentence) return;

    const newAnsweredCount = answeredCount + 1;
    setAnsweredCount(newAnsweredCount);
    setCompletedIds(prev => [...prev, currentSentence.id]);

    if (newAnsweredCount === sentences.length) {
      console.log("All exercises completed, showing end screen");
      setShowEndScreen(true);
    } else {
      setTimeout(handleNext, 500);
    }
  };

  const handleContinue = () => {
    console.log("Continuing with new exercises");
    setCurrentIndex(0);
    setAnsweredCount(0);
    setShowEndScreen(false);
    refetch();
  };

  const progress = sentences ? ((answeredCount) / sentences.length) * 100 : 0;

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 p-6">
            <div className="max-w-3xl mx-auto">
              <Progress value={0} className="mb-6" />
              <div className="h-[400px] bg-muted animate-pulse rounded-lg" />
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (!sentences || sentences.length === 0) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 p-6">
            <div className="max-w-3xl mx-auto">
              <div className="text-center p-8">
                No exercises available for this category.
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <Progress value={progress} className="mb-6" />
            {showEndScreen ? (
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
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Exercises;