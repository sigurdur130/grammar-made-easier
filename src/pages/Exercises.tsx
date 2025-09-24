import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExerciseCard } from "@/components/ExerciseCard";
import { Progress } from "@/components/ui/progress";
import { EndScreen } from "@/components/exercise/EndScreen";
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
  const { category, subcategory } = useParams();

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
    exemplarFilters: [],
  });
  const [pendingFilterChanges, setPendingFilterChanges] = useState(currentAppliedFilters);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

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

  // Reset state on category/subcategory change
  useEffect(() => {
    setCurrentIndex(0);
    setAnsweredCount(0);
    setFirstTryCorrect(0);
    setMasteredIds([]);
    setRetrySentences([]);
    setHasIncorrectAttempt(false);

    if (subcategory === "Cases") {
      const defaultExemplars = exemplars?.filter((e) => e.default).map((e) => e.id) || [];
      const defaultFilters = {
        caseFilters: ["Accusative"],
        numberFilters: ["Singular"],
        definitenessFilters: ["Indefinite"],
        exemplarFilters: defaultExemplars,
      };
      setCurrentAppliedFilters(defaultFilters);
      setPendingFilterChanges(defaultFilters);
    } else {
      const defaultFilters = {
        caseFilters: ["Accusative"],
        numberFilters: ["Singular"],
        definitenessFilters: ["Indefinite"],
        exemplarFilters: [],
      };
      setCurrentAppliedFilters(defaultFilters);
      setPendingFilterChanges(defaultFilters);
    }
  }, [category, subcategory, exemplars]);

  const { data: subcategoryInfo } = useQuery({
    queryKey: ["subcategoryInfo", subcategory, category],
    queryFn: async () => {
      const { data } = await supabase
        .from("subcategories")
        .select("further_reading")
        .eq("subcategory", subcategory)
        .eq("word_category", category)
        .maybeSingle();
      return (data || { further_reading: null }) as SubcategoryInfo;
    },
  });

  const { data: sentences, isLoading, refetch } = useQuery({
    queryKey: ["sentences", subcategory, currentAppliedFilters],
    queryFn: async () => {
      const neededRandomSentences = 6 - retrySentences.length;
      let newSentences: Sentence[] = [];

      if (neededRandomSentences > 0) {
        const { data, error } = await supabase.rpc(
          "get_random_rows",
          subcategory === "Cases"
            ? {
                num_rows: neededRandomSentences,
                subcategory_filter: subcategory,
                word_category_filter: category,
                mastered_ids: masteredIds,
                retry_ids: retrySentences.map((s) => s.id),
                cases_filter: currentAppliedFilters.caseFilters,
                numbers_filter: currentAppliedFilters.numberFilters,
                definiteness_filter: currentAppliedFilters.definitenessFilters,
                exemplar_filter: currentAppliedFilters.exemplarFilters,
              }
            : {
                num_rows: neededRandomSentences,
                subcategory_filter: subcategory,
                word_category_filter: category,
                mastered_ids: masteredIds,
                retry_ids: retrySentences.map((s) => s.id),
              }
        );

        if (error) {
          console.error("Error fetching sentences:", error);
          throw error;
        }

        newSentences = data || [];
      }

      const combinedSentences = [...retrySentences, ...newSentences];

      return combinedSentences;
    },
    refetchOnWindowFocus: false,
  });

  // Initialize pending filters when sidebar opens
  useEffect(() => {
    if (isFilterSidebarOpen) {
      setPendingFilterChanges(currentAppliedFilters);
    }
  }, [isFilterSidebarOpen, currentAppliedFilters]);

  // --- Handlers ---
  const handleCorrectAnswer = () => {
    const currentSentence = sentences?.[currentIndex];
    if (!currentSentence) return;

    if (!hasIncorrectAttempt) {
      setFirstTryCorrect((prev) => prev + 1);
      setMasteredIds((prev) => [...prev, currentSentence.id]);
      if (retrySentences.some((s) => s.id === currentSentence.id)) {
        setRetrySentences((prev) =>
          prev.filter((s) => s.id !== currentSentence.id)
        );
      }
    }

    setAnsweredCount((prev) => prev + 1);

    if (sentences && currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setHasIncorrectAttempt(false);
    }
  };

  const handleIncorrectAnswer = () => {
    const currentSentence = sentences?.[currentIndex];
    if (!currentSentence) return;

    if (!hasIncorrectAttempt && !retrySentences.some((s) => s.id === currentSentence.id)) {
      setRetrySentences((prev) => [...prev, currentSentence]);
    }

    setHasIncorrectAttempt(true);
  };

  const handleRestart = async () => {
    setCurrentIndex(0);
    setAnsweredCount(0);
    setFirstTryCorrect(0);
    setHasIncorrectAttempt(false);
    setMasteredIds([]);
    setRetrySentences([]);
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
    const defaultExemplars =
      exemplars?.filter((e) => e.default).map((e) => e.id) || [];

    setPendingFilterChanges({
      caseFilters: ["Accusative"],
      numberFilters: ["Singular"],
      definitenessFilters: ["Indefinite"],
      exemplarFilters: defaultExemplars,
    });
  };

  // --- Derived state ---
  const progress = sentences ? (answeredCount / sentences.length) * 100 : 0;
  const isComplete = sentences && answeredCount === sentences.length;
  const isOutOfSentences = sentences && sentences.length < 6;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="top-12 md:top-0 bg-background/95 backdrop-blur-sm z-10 pb-2 -mt-2 pt-2">
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
          <ExerciseCard
            sentence={sentences[currentIndex]}
            onCorrect={handleCorrectAnswer}
            onIncorrect={handleIncorrectAnswer}
            subcategory={subcategory || ""}
          />
        )
      ) : null}

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
  );
};

export default Exercises;