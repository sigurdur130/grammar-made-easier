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
  const [seenSentenceIds, setSeenSentenceIds] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const { data: sentences, isLoading, refetch } = useQuery({
    queryKey: ["sentences", category, subcategory, seenSentenceIds],
    queryFn: async () => {
      console.log("Fetching sentences for:", category, subcategory);
      console.log("Excluding previously seen sentences:", seenSentenceIds);
      
      const { data, error } = await supabase
        .from("sentences")
        .select("*")
        .eq("word_category", category)
        .eq("subcategory", subcategory)
        .not('id', 'in', `(${seenSentenceIds.join(',')})`)
        .limit(6)
        .order('id');

      if (error) {
        console.error("Error fetching sentences:", error);
        throw error;
      }
      
      // Add new sentence IDs to seen list
      const newIds = data.map(sentence => sentence.id);
      setSeenSentenceIds(prev => [...prev, ...newIds]);
      
      console.log("Fetched sentences:", data);
      return data;
    },
  });

  const handleNext = () => {
    if (sentences && currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleCorrectAnswer = () => {
    setAnsweredCount(answeredCount + 1);
    setTimeout(handleNext, 500);
  };

  const handleContinue = async () => {
    setCurrentIndex(0);
    setIsCompleted(false);
    await refetch();
  };

  const progress = sentences ? ((answeredCount) / sentences.length) * 100 : 0;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <Progress value={progress} className="mb-6" />
            {isCompleted ? (
              <EndScreen 
                onContinue={handleContinue}
                answeredCount={answeredCount}
              />
            ) : isLoading ? (
              <div className="h-[400px] bg-muted animate-pulse rounded-lg" />
            ) : sentences && sentences.length > 0 ? (
              <ExerciseCard 
                sentence={sentences[currentIndex]} 
                onCorrect={handleCorrectAnswer}
                subcategory={subcategory || ''}
              />
            ) : null}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Exercises;