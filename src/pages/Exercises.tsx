import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ExerciseCard } from "@/components/ExerciseCard";
import { Progress } from "@/components/ui/progress";
import { EndScreen } from "@/components/exercise/EndScreen";

import { FurtherReading } from "@/components/exercise/FurtherReading";
import { CasesFilter } from "@/components/exercise/CasesFilter";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Sentence {
  id: number;
  english_translation: string | null;
  icelandic_left: string | null;
  icelandic_right: string | null;
  correct_answer: string[] | null;
  subcategory: string | null;
  base_form: string | null;
  word_category: string | null;
  case: string | null;
  number: string | null;
  definiteness: string | null;
}

interface RawSentence {
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
}

const DEFAULT_CASES_FILTERS: CasesFilters = {
  caseFilters: ["Accusative"],
  numberFilters: ["Singular"],
  definitenessFilters: ["Indefinite"]
};

const Exercises = () => {
  const { category, subcategory } = useParams();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [masteredIds, setMasteredIds] = useState<number[]>([]);
  const [retrySentences, setRetrySentences] = useState<Sentence[]>([]);
  const retrySentencesRef = useRef<Sentence[]>([]);
  const [hasIncorrectAttempt, setHasIncorrectAttempt] = useState(false);
  const [currentAppliedFilters, setCurrentAppliedFilters] = useState<CasesFilters>(DEFAULT_CASES_FILTERS);
  const [pendingFilterChanges, setPendingFilterChanges] = useState<CasesFilters>(DEFAULT_CASES_FILTERS);

  const areFiltersDifferent = (filters1: CasesFilters, filters2: CasesFilters) => {
    return JSON.stringify(filters1) !== JSON.stringify(filters2);
  };

  useEffect(() => {
    setCurrentIndex(0);
    setAnsweredCount(0);
    setFirstTryCorrect(0);
    setMasteredIds([]);
    setRetrySentences([]);
    retrySentencesRef.current = [];
    setHasIncorrectAttempt(false);

    if (subcategory === "Cases") {
      setCurrentAppliedFilters(DEFAULT_CASES_FILTERS);
      setPendingFilterChanges(DEFAULT_CASES_FILTERS);
    }

    Promise.resolve().then(() => refetch());
  }, [category, subcategory]);

  const {
    data: subcategoryInfo
  } = useQuery({
    queryKey: ["subcategoryInfo", subcategory, category],
    queryFn: async () => {
      console.log("Fetching sentences with:", {
        category,
        subcategory,
        masteredIds,
        retryIds: retrySentences.map(s => s.id),
        retrySentencesCount: retrySentences.length
      });
      const { data, error } = await supabase
        .from("subcategories")
        .select("further_reading")
        .eq("subcategory", subcategory)
        .eq("word_category", category)
        .maybeSingle();

      if (error) return { further_reading: null } as SubcategoryInfo;
      return (data || { further_reading: null }) as SubcategoryInfo;
    }
  });

  const {
    data: sentences,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["sentences", currentAppliedFilters],
    queryFn: async () => {
      const retry = retrySentencesRef.current;
      const neededRandomSentences = 6 - retry.length;
      let newSentences: Sentence[] = [];

      console.log("Fetching sentences with:", {
        category,
        subcategory,
        masteredIds,
        retryIds: retrySentencesRef.current.map(s => s.id),
        retrySentencesCount: retrySentencesRef.current.length
      });

      if (neededRandomSentences > 0) {
        const { data, error } = await supabase.rpc('get_random_rows', subcategory === "Cases" ? {
          num_rows: neededRandomSentences,
          subcategory_filter: subcategory,
          word_category_filter: category,
          mastered_ids: masteredIds,
          retry_ids: retry.map(s => s.id),
          cases_filter: currentAppliedFilters.caseFilters,
          numbers_filter: currentAppliedFilters.numberFilters,
          definiteness_filter: currentAppliedFilters.definitenessFilters
        } : {
          num_rows: neededRandomSentences,
          subcategory_filter: subcategory,
          word_category_filter: category,
          mastered_ids: masteredIds,
          retry_ids: retry.map(s => s.id)
        });

        if (error) throw error;
        // Parse correct_answer from JSON string to array
        const rawSentences = data || [];
        newSentences = rawSentences.map((sentence: any) => ({
          ...sentence,
          correct_answer: sentence.correct_answer ? JSON.parse(sentence.correct_answer) : null
        }));
      }

      const combinedSentences = [...retry, ...newSentences];

      if (newSentences.length < neededRandomSentences && retry.length === 0) {
        try {
          const notificationBody: any = { category, subcategory };
          if (subcategory === "Cases") {
            notificationBody.caseFilters = currentAppliedFilters.caseFilters;
            notificationBody.numberFilters = currentAppliedFilters.numberFilters;
            notificationBody.definitenessFilters = currentAppliedFilters.definitenessFilters;
          }
          await supabase.functions.invoke('notify-category-completed', {
            body: notificationBody
          });
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


    if (!hasIncorrectAttempt) {
      setFirstTryCorrect(prev => prev + 1);
      setMasteredIds(prev => [...prev, currentSentence.id]);
      if (retrySentencesRef.current.some(s => s.id === currentSentence.id)) {
        const updated = retrySentencesRef.current.filter(s => s.id !== currentSentence.id);
        setRetrySentences(updated);
        retrySentencesRef.current = updated;
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

    if (!hasIncorrectAttempt && !retrySentencesRef.current.some(s => s.id === currentSentence.id)) {
      const updated = [...retrySentencesRef.current, currentSentence];
      setRetrySentences(updated);
      retrySentencesRef.current = updated;
    }

    setHasIncorrectAttempt(true);
  };

  const handleRestart = async () => {
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

  const hasPendingChanges = areFiltersDifferent(pendingFilterChanges, currentAppliedFilters);

  const applyFilters = () => {
    setCurrentAppliedFilters(pendingFilterChanges);
    setCurrentIndex(0);
    setAnsweredCount(0);
    setFirstTryCorrect(0);
    setMasteredIds([]);
    setRetrySentences([]);
    retrySentencesRef.current = [];
    setHasIncorrectAttempt(false);
    toast({ title: "Filters applied", description: "Fetching new sentences..." });
  };

  const progress = sentences ? answeredCount / sentences.length * 100 : 0;
  const isComplete = sentences && answeredCount === sentences.length;
  const isOutOfSentences = sentences && sentences.length < 6;

  return <SidebarProvider>
    <div className="flex min-h-screen w-full">
      <AppSidebar currentSentence={sentences?.[currentIndex]?.id} />
      <main className="flex-1 p-6 pt-[calc(theme(spacing.6)_+_theme(spacing.12))] md:pt-6">
        <div className="max-w-3xl mx-auto">
          <div className="top-12 md:top-0 bg-background/95 backdrop-blur-sm z-10 pb-2 -mt-2 pt-2 ">
            <Progress value={progress} className="mb-3" />
          </div>
          {isLoading ? (
            <div className="h-[400px] bg-muted animate-pulse rounded-lg" />
          ) : sentences && sentences.length > 0 ? (
            isComplete ? (
              <EndScreen
                onRestart={handleRestart}
                firstTryCorrect={firstTryCorrect}
                totalExercises={sentences.length}
                isOutOfSentences={isOutOfSentences}
              />
            ) : (
              <>
                <ExerciseCard
                  sentence={sentences[currentIndex]}
                  onCorrect={handleCorrectAnswer}
                  onIncorrect={handleIncorrectAnswer}
                  subcategory={subcategory || ''}
                />
                {subcategory === "Cases" && (
                  <CasesFilter
                    caseFilters={pendingFilterChanges.caseFilters}
                    numberFilters={pendingFilterChanges.numberFilters}
                    definitenessFilters={pendingFilterChanges.definitenessFilters}
                    onFiltersChange={handleFiltersChange}
                    hasPendingChanges={hasPendingChanges}
                    onApply={applyFilters}
                  />
                )}
                {!isComplete && subcategoryInfo && (
                  <FurtherReading content={subcategoryInfo.further_reading} />
                )}
              </>
            )
          ) : null}
        </div>
      </main>
      
    </div>
  </SidebarProvider>;
};

export default Exercises;
