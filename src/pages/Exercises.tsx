
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

interface RetryItem {
  id: number;
  english_translation: string | null;
  icelandic_left: string | null;
  icelandic_right: string | null;
  correct_answer: string | null;
  subcategory: string | null;
  base_form: string | null;
  word_category: string | null;
}

const Exercises = () => {
  const { category, subcategory } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [masteredIds, setMasteredIds] = useState<number[]>([]);
  const [retryItems, setRetryItems] = useState<RetryItem[]>([]);
  const [currentRetryIndex, setCurrentRetryIndex] = useState(0);

  const { data: sentences, isLoading, refetch } = useQuery({
    queryKey: ["sentences", category, subcategory, masteredIds, retryItems],
    queryFn: async () => {
      console.log("Fetching sentences with:", { 
        category, 
        subcategory, 
        masteredIds,
        retryIds: retryItems.map(item => item.id)
      });

      const numRandomNeeded = 6 - Math.min(retryItems.length, 6);
      
      if (numRandomNeeded <= 0) {
        // If we have enough retry items, just return the first 6
        return retryItems.slice(0, 6);
      }

      // Fetch new random sentences, excluding mastered and retry ones
      const { data: randomSentences, error } = await supabase
        .rpc('get_random_rows', { 
          num_rows: numRandomNeeded,
          subcategory_filter: subcategory,
          word_category_filter: category,
          mastered_ids: masteredIds,
          retry_ids: retryItems.map(item => item.id)
        });

      if (error) {
        console.error("Error fetching sentences:", error);
        throw error;
      }

      // Combine retry items with new random sentences
      const combinedSentences = [
        ...retryItems.slice(0, 6),
        ...(randomSentences || [])
      ].slice(0, 6);

      console.log("Combined sentences:", combinedSentences);
      return combinedSentences;
    },
  });

  const handleCorrectAnswer = () => {
    if (!sentences) return;
    
    const currentSentence = sentences[currentIndex];
    if (!currentSentence) return;

    console.log("Handling correct answer for sentence:", currentSentence.id);
    
    // If this was a first-try correct answer, add to mastered
    if (!retryItems.some(item => item.id === currentSentence.id)) {
      setMasteredIds(prev => [...prev, currentSentence.id]);
    }
    
    setAnsweredCount(prev => prev + 1);
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleIncorrectAnswer = (sentence: RetryItem) => {
    console.log("Handling incorrect answer for sentence:", sentence.id);
    // Only add to retry items if it's not already there
    if (!retryItems.some(item => item.id === sentence.id)) {
      setRetryItems(prev => [...prev, sentence]);
    }
  };

  const handleRestart = async () => {
    console.log("Restarting exercises...");
    setCurrentIndex(0);
    setAnsweredCount(0);
    setCurrentRetryIndex(0);
    await refetch();
  };

  // Debug logging for render state
  console.log("Render state:", { 
    answeredCount, 
    totalSentences: sentences?.length,
    currentIndex,
    masteredIds,
    retryItems,
    currentSentence: sentences?.[currentIndex],
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
                <EndScreen onRestart={handleRestart} />
              ) : (
                <ExerciseCard 
                  sentence={sentences[currentIndex]} 
                  onCorrect={handleCorrectAnswer}
                  onIncorrect={() => handleIncorrectAnswer(sentences[currentIndex])}
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
