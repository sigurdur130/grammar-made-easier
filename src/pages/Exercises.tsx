import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ExerciseCard } from "@/components/ExerciseCard";
import { Progress } from "@/components/ui/progress";
import { EndScreen } from "@/components/exercise/EndScreen";
import { FeedbackButton } from "@/components/FeedbackButton";
import { FurtherReading } from "@/components/exercise/FurtherReading";
import { CasesFilter } from "@/components/exercise/CasesFilter";
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

interface SubcategoryInfo {
  further_reading: string | null;
}

interface CasesFilters {
  caseFilters: string[];
  numberFilters: string[];
  definitenessFilters: string[];
}

const Exercises = () => {
  const {
    category,
    subcategory
  } = useParams();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [masteredIds, setMasteredIds] = useState<number[]>([]);
  const [retrySentences, setRetrySentences] = useState<Sentence[]>([]);
  const [hasIncorrectAttempt, setHasIncorrectAttempt] = useState(false);
  const [casesFilters, setCasesFilters] = useState<CasesFilters>({
    caseFilters: ["Accusative"],
    numberFilters: ["Singular"],
    definitenessFilters: ["Indefinite"]
  });

  // Reset all state when category or subcategory changes
  useEffect(() => {
    setCurrentIndex(0);
    setAnsweredCount(0);
    setFirstTryCorrect(0);
    setMasteredIds([]);
    setRetrySentences([]);
    setHasIncorrectAttempt(false);
    // Reset filters to defaults for Cases subcategory
    if (subcategory === "Cases") {
      setCasesFilters({
        caseFilters: ["Accusative"],
        numberFilters: ["Singular"],
        definitenessFilters: ["Indefinite"]
      });
    }
  }, [category, subcategory]);

  const {
    data: subcategoryInfo
  } = useQuery({
    queryKey: ["subcategoryInfo", subcategory, category],
    queryFn: async () => {
      console.log("Fetching subcategory info for:", {
        subcategory,
        category
      });
      const {
        data,
        error
      } = await supabase.from("subcategories").select("further_reading").eq("subcategory", subcategory).eq("word_category", category).maybeSingle();
      if (error) {
        console.error("Error fetching subcategory info:", error);
        return {
          further_reading: null
        } as SubcategoryInfo;
      }
      return (data || {
        further_reading: null
      }) as SubcategoryInfo;
    }
  });

  const {
    data: sentences,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["sentences", category, subcategory, masteredIds, retrySentences.map(s => s.id), casesFilters],
    queryFn: async () => {
      console.log("Fetching sentences with:", {
        category,
        subcategory,
        masteredIds,
        retryIds: retrySentences.map(s => s.id),
        retrySentencesCount: retrySentences.length,
        casesFilters: subcategory === "Cases" ? casesFilters : null
      });
      const neededRandomSentences = 6 - retrySentences.length;
      let newSentences: Sentence[] = [];
      if (neededRandomSentences > 0) {
        // Use filtered function for Cases subcategory, regular function for others
        if (subcategory === "Cases") {
          const {
            data,
            error
          } = await supabase.rpc('get_filtered_random_rows', {
            num_rows: neededRandomSentences,
            subcategory_filter: subcategory,
            word_category_filter: category,
            mastered_ids: masteredIds,
            retry_ids: retrySentences.map(s => s.id),
            case_filters: casesFilters.caseFilters,
            number_filters: casesFilters.numberFilters,
            definiteness_filters: casesFilters.definitenessFilters
          });
          if (error) {
            console.error("Error fetching filtered sentences:", error);
            throw error;
          }
          newSentences = data || [];
        } else {
          const {
            data,
            error
          } = await supabase.rpc('get_random_rows', {
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
      }
      const combinedSentences = [...retrySentences, ...newSentences];
      console.log("Combined sentences:", combinedSentences);
      if (newSentences.length < neededRandomSentences && retrySentences.length === 0) {
        try {
          await supabase.functions.invoke('notify-category-completed', {
            body: {
              category,
              subcategory
            }
          });
          console.log("Notification sent for completed category");
        } catch (error) {
          console.error("Error sending completion notification:", error);
        }
      }
      return combinedSentences;
    }
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
    if (!hasIncorrectAttempt) {
      setFirstTryCorrect(prev => prev + 1);
      setMasteredIds(prev => [...prev, currentSentence.id]);
      if (retrySentences.some(s => s.id === currentSentence.id)) {
        setRetrySentences(prev => prev.filter(s => s.id !== currentSentence.id));
      }
    }
    setAnsweredCount(prev => prev + 1);
    if (sentences && currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setHasIncorrectAttempt(false);
    }
  };

  const handleIncorrectAnswer = () => {
    const currentSentence = sentences?.[currentIndex];
    if (!currentSentence) return;
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
    setFirstTryCorrect(0);
    setHasIncorrectAttempt(false);
    if (sentences && sentences.length < 6) {
      setMasteredIds([]);
    }
    // Reset filters to defaults for Cases subcategory
    if (subcategory === "Cases") {
      setCasesFilters({
        caseFilters: ["Accusative"],
        numberFilters: ["Singular"],
        definitenessFilters: ["Indefinite"]
      });
    }
    await refetch();
  };

  const handleFiltersChange = useCallback((filters: CasesFilters) => {
    setCasesFilters(filters);
  }, []);
  
  const progress = sentences ? answeredCount / sentences.length * 100 : 0;
  const isComplete = sentences && answeredCount === sentences.length;
  const isOutOfSentences = sentences && sentences.length < 6;
  
  return <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-6 pt-[calc(theme(spacing.6)_+_theme(spacing.12))] md:pt-6">
          <div className="max-w-3xl mx-auto">
            <div className="top-12 md:top-0 bg-background/95 backdrop-blur-sm z-10 pb-2 -mt-2 pt-2 ">
              <Progress value={progress} className="mb-3" />
            </div>
            {isLoading ? <div className="h-[400px] bg-muted animate-pulse rounded-lg" /> : sentences && sentences.length > 0 ? isComplete ? <EndScreen onRestart={handleRestart} firstTryCorrect={firstTryCorrect} totalExercises={sentences.length} isOutOfSentences={isOutOfSentences} /> : <>
                  <ExerciseCard sentence={sentences[currentIndex]} onCorrect={handleCorrectAnswer} onIncorrect={handleIncorrectAnswer} subcategory={subcategory || ''} />
                  {subcategory === "Cases" && (
                    <CasesFilter 
                      caseFilters={casesFilters.caseFilters}
                      numberFilters={casesFilters.numberFilters}
                      definitenessFilters={casesFilters.definitenessFilters}
                      onFiltersChange={handleFiltersChange}
                    />
                  )}
                  {!isComplete && subcategoryInfo && <FurtherReading content={subcategoryInfo.further_reading} />}
                </> : null}
          </div>
        </main>
        <FeedbackButton currentSentence={sentences?.[currentIndex]?.id} />
      </div>
    </SidebarProvider>;
};

export default Exercises;
