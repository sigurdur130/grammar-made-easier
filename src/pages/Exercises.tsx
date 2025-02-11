
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

interface Sentence {
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
  const [retrySentences, setRetrySentences] = useState<Sentence[]>([]);
  const [hasIncorrectAttempt, setHasIncorrectAttempt] = useState(false);

  const { data: sentences, isLoading, refetch } = useQuery({
    queryKey: ["sentences", category, subcategory, masteredIds],
    queryFn: async () => {
      console.log("Fetching sentences with:", { 
        category, 
        subcategory, 
        masteredIds,
        retryIds: retrySentences.map(s => s.id),
        retrySentencesCount: retrySentences.length 
      });

      // Calculate how many new random sentences we need
      const neededRandomSentences = 6 - retrySentences.length;

      // Get new random sentences if needed
      let newSentences: Sentence[] = [];
      if (neededRandomSentences > 0) {
        const { data, error } = await supabase.rpc('get_random_rows', {
          num_rows: neededRandomSentences,
          subcategory_filter: subcategory,
          word_category_filter: category,
          mastered_ids: masteredIds,
          retry_ids: retrySentences.map(s => s.id)
        });

        if (error) {
          console.error("Error fetching sentences:", error);
          throw error;
        }
        newSentences = data || [];
      }

      // Combine retry sentences with new random sentences
      const combinedSentences = [...retrySentences, ...newSentences];
      console.log("Combined sentences:", combinedSentences);
      return combinedSentences;
    },
  });

  const handleCorrectAnswer = () => {
    const currentSentence = sentences?.[currentIndex];
    if (!currentSentence) return;

    console.log("Handling correct answer:", { 
      sentenceId: currentSentence.id, 
      hasIncorrectAttempt,
      currentIndex,
      totalSentences: sentences?.length
    });

    // If this was a first-try correct answer, add to mastered
    if (!hasIncorrectAttempt) {
      setMasteredIds(prev => [...prev, currentSentence.id]);
      
      // If this was a retry sentence that's now mastered, remove it from retry list
      if (retrySentences.some(s => s.id === currentSentence.id)) {
        setRetrySentences(prev => prev.filter(s => s.id !== currentSentence.id));
      }
    }

    setAnsweredCount(prev => prev + 1);
    if (sentences && currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setHasIncorrectAttempt(false); // Reset for next sentence
    }
  };

  const handleIncorrectAnswer = () => {
    const currentSentence = sentences?.[currentIndex];
    if (!currentSentence) return;

    // Only add to retry sentences if this is the first incorrect attempt
    // and it's not already in the retry list
    if (!hasIncorrectAttempt && !retrySentences.some(s => s.id === currentSentence.id)) {
      console.log("Adding sentence to retry list:", currentSentence.id);
      setRetrySentences(prev => [...prev, currentSentence]);
    }
    
    setHasIncorrectAttempt(true);
  };

  const handleRestart = async () => {
    console.log("Restarting exercises...");
    setCurrentIndex(0);
    setAnsweredCount(0);
    setHasIncorrectAttempt(false);
    await refetch();
  };

  // Debug logging for render state
  console.log("Render state:", { 
    answeredCount, 
    totalSentences: sentences?.length,
    currentIndex,
    masteredIds,
    retrySentences: retrySentences.map(s => s.id),
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
                  onIncorrect={handleIncorrectAnswer}
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
