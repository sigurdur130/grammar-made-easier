
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ExerciseCard } from "@/components/ExerciseCard";
import { Progress } from "@/components/ui/progress";
import { EndScreen } from "@/components/exercise/EndScreen";
import { FeedbackButton } from "@/components/FeedbackButton";
import { supabase } from "@/integrations/supabase/client";

const Exercises = () => {
  const { category, subcategory } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [isSubcategoryCompleted, setIsSubcategoryCompleted] = useState(false);

  const { data: sentences, isLoading, refetch } = useQuery({
    queryKey: ["sentences", category, subcategory, completedIds],
    queryFn: async () => {
      console.log("Fetching sentences with excluded IDs:", completedIds);
      const { data, error } = await supabase
        .rpc('get_random_rows', { 
          num_rows: 6,
          subcategory_filter: subcategory,
          word_category_filter: category,
          exclude_ids: completedIds
        });

      if (error) {
        console.error("Error fetching sentences:", error);
        throw error;
      }

      // If we get fewer than 6 sentences, it means we've completed all available ones
      if (data && data.length < 6) {
        console.log("Fewer than 6 sentences returned, setting subcategory as completed");
        setIsSubcategoryCompleted(true);
        setCompletedIds([]);
        return data; // Return the remaining sentences
      }

      return data;
    },
  });

  const handleCorrectAnswer = () => {
    console.log("Handling correct answer. Current count:", answeredCount);
    setAnsweredCount(prev => prev + 1);
    
    // Add the current sentence ID to completed IDs
    if (sentences && currentIndex < sentences.length) {
      const currentId = sentences[currentIndex].id;
      setCompletedIds(prev => [...prev, currentId]);
    }

    if (sentences && currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleRestart = async () => {
    if (isSubcategoryCompleted) {
      return; // Don't allow restart if subcategory is completed
    }
    console.log("Restarting exercises...");
    setCurrentIndex(0);
    setAnsweredCount(0);
    setCompletedIds([]); // Reset completed IDs when restarting
    await refetch();
  };

  // Debug logging for render state
  console.log("Render state:", { 
    answeredCount, 
    totalSentences: sentences?.length,
    currentIndex,
    currentSentence: sentences?.[currentIndex],
    sentenceId: sentences?.[currentIndex]?.id,
    completedIds,
    isSubcategoryCompleted,
    isLoading
  });

  const progress = sentences ? ((answeredCount) / sentences.length) * 100 : 0;
  const isComplete = sentences && answeredCount === sentences.length;

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
                  onRestart={handleRestart}
                  isSubcategoryCompleted={isSubcategoryCompleted}
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
        <FeedbackButton currentSentence={sentences?.[currentIndex]?.id} />
      </div>
    </SidebarProvider>
  );
};

export default Exercises;
