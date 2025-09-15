import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Filter } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/AppSidebar";
import { ExerciseCard } from "@/components/ExerciseCard";
import { Progress } from "@/components/ui/progress";
import { EndScreen } from "@/components/exercise/EndScreen";
import { FurtherReading } from "@/components/exercise/FurtherReading";
import { ExerciseFilterSidebar } from "@/components/exercise/ExerciseFilterSidebar";
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
  case: string | null;
  number: string | null;
  definiteness: string | null;
}

interface SubcategoryInfo {
  further_reading: string | null;
}

interface CasesFilters {
  caseFilters: string[];
  numberFilters: string[];
  definitenessFilters: string[];
  exemplarFilters: number[];
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
  const [currentAppliedFilters, setCurrentAppliedFilters] = useState<CasesFilters>({
    caseFilters: ["Accusative"],
    numberFilters: ["Singular"],
    definitenessFilters: ["Indefinite"],
    exemplarFilters: []
  });
  const [pendingFilterChanges, setPendingFilterChanges] = useState<CasesFilters>({
    caseFilters: ["Accusative"],
    numberFilters: ["Singular"],
    definitenessFilters: ["Indefinite"],
    exemplarFilters: []
  });
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

  // Helper function to check if filters are different
  const areFiltersDifferent = (filters1: CasesFilters, filters2: CasesFilters) => {
    return JSON.stringify(filters1) !== JSON.stringify(filters2);
  };

  // Fetch exemplars data
  const { data: exemplars } = useQuery({
    queryKey: ["exemplars"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exemplars")
        .select("id, exemplar, gender, default")
        .order("gender");
      if (error) throw error;
      return data;
    },
  });

  // Reset all state when category or subcategory changes
  useEffect(() => {
    setCurrentIndex(0);
    setAnsweredCount(0);
    setFirstTryCorrect(0);
    setMasteredIds([]);
    setRetrySentences([]);
    setHasIncorrectAttempt(false);
    
    // Reset filters based on subcategory
    if (subcategory === "Cases") {
      const defaultExemplars = exemplars?.filter(e => e.default).map(e => e.id) || [];
      const defaultFilters = {
        caseFilters: ["Accusative"],
        numberFilters: ["Singular"],
        definitenessFilters: ["Indefinite"],
        exemplarFilters: defaultExemplars
      };
      setCurrentAppliedFilters(defaultFilters);
      setPendingFilterChanges(defaultFilters);
    } else {
      const defaultFilters = {
        caseFilters: ["Accusative"],
        numberFilters: ["Singular"],
        definitenessFilters: ["Indefinite"],
        exemplarFilters: []
      };
      setCurrentAppliedFilters(defaultFilters);
      setPendingFilterChanges(defaultFilters);
    }
  }, [category, subcategory, exemplars]);

  // Initialize exemplar filters when exemplars data is loaded and subcategory is Cases
  useEffect(() => {
    if (exemplars && subcategory === "Cases") {
      const defaultExemplars = exemplars.filter(e => e.default).map(e => e.id);
      setCurrentAppliedFilters(prev => ({ ...prev, exemplarFilters: defaultExemplars }));
      setPendingFilterChanges(prev => ({ ...prev, exemplarFilters: defaultExemplars }));
    }
  }, [exemplars, subcategory]);

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
    queryKey: ["sentences", category, subcategory, currentAppliedFilters],
    queryFn: async () => {
      console.log("Fetching sentences with:", {
        category,
        subcategory,
        masteredIds,
        retryIds: retrySentences.map(s => s.id),
        retrySentencesCount: retrySentences.length
      });
      const neededRandomSentences = 6 - retrySentences.length;
      let newSentences: Sentence[] = [];
      if (neededRandomSentences > 0) {
        const {
          data,
          error
        } = await supabase.rpc('get_random_rows', subcategory === "Cases" ? {
          num_rows: neededRandomSentences,
          subcategory_filter: subcategory,
          word_category_filter: category,
          mastered_ids: masteredIds,
          retry_ids: retrySentences.map(s => s.id),
          cases_filter: currentAppliedFilters.caseFilters,
          numbers_filter: currentAppliedFilters.numberFilters,
          definiteness_filter: currentAppliedFilters.definitenessFilters,
          exemplar_filter: currentAppliedFilters.exemplarFilters
        } : {
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

  // Initialize pending filters when sidebar opens
  useEffect(() => {
    if (isFilterSidebarOpen) {
      setPendingFilterChanges(currentAppliedFilters);
    }
  }, [isFilterSidebarOpen, currentAppliedFilters]);

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
    setMasteredIds([]);
    await refetch();
  };
  
  const handleFiltersChange = (filters: CasesFilters) => {
    setPendingFilterChanges(filters);
  };

  const handleApplyFilters = () => {
    setCurrentAppliedFilters(pendingFilterChanges);
    setIsFilterSidebarOpen(false);
    // Reset exercise state when filters are applied
    setCurrentIndex(0);
    setAnsweredCount(0);
    setFirstTryCorrect(0);
    setMasteredIds([]);
    setRetrySentences([]);
    setHasIncorrectAttempt(false);
  };

  const handleResetFilters = () => {
    const defaultExemplars = exemplars?.filter(e => e.default).map(e => e.id) || [];
    setPendingFilterChanges({
      caseFilters: ["Accusative"],
      numberFilters: ["Singular"],
      definitenessFilters: ["Indefinite"],
      exemplarFilters: defaultExemplars
    });
  };
  
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
              {subcategory === "Cases" && (
                <div className="flex justify-start mb-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFilterSidebarOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </div>
              )}
            </div>
            {isLoading ? <div className="h-[400px] bg-muted animate-pulse rounded-lg" /> : sentences && sentences.length > 0 ? isComplete ? <EndScreen onRestart={handleRestart} firstTryCorrect={firstTryCorrect} totalExercises={sentences.length} isOutOfSentences={isOutOfSentences} /> : <>
                  <ExerciseCard sentence={sentences[currentIndex]} onCorrect={handleCorrectAnswer} onIncorrect={handleIncorrectAnswer} subcategory={subcategory || ''} />
                  {!isComplete && subcategoryInfo && <FurtherReading content={subcategoryInfo.further_reading} />}
                </> : null}
            
            {subcategory === "Cases" && (
              <ExerciseFilterSidebar
                isOpen={isFilterSidebarOpen}
                onOpenChange={setIsFilterSidebarOpen}
                exemplars={exemplars || []}
                caseFilters={pendingFilterChanges.caseFilters}
                numberFilters={pendingFilterChanges.numberFilters}
                definitenessFilters={pendingFilterChanges.definitenessFilters}
                exemplarFilters={pendingFilterChanges.exemplarFilters}
                onFiltersChange={handleFiltersChange}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
              />
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>;
};

export default Exercises;
