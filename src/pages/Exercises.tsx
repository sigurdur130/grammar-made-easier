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
import { FurtherReading } from "@/components/exercise/FurtherReading";
import { useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { parseFiltersFromURL, serializeFiltersToURL, getDefaultFilters } from "@/utils/filterUrlHelpers";

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

interface Exemplar {
  id: number;
  exemplar_name: string;
  gender: string | null;
  default: boolean | null;
  weak_strong: string | null;
}

const Exercises = ({ setCurrentSentence }: { setCurrentSentence: (id: number | undefined) => void }) => {

  const { category, subcategory } = useParams();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [masteredIds, setMasteredIds] = useState<number[]>([]);
  const [retrySentences, setRetrySentences] = useState<Sentence[]>([]);
  const [hasIncorrectAttempt, setHasIncorrectAttempt] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  // For Cases subcategory, initialize filters from URL or use defaults
  const initialFilters = subcategory === "Cases"
    ? parseFiltersFromURL(searchParams)
    : getDefaultFilters();
  const [currentAppliedFilters, setCurrentAppliedFilters] = useState<CasesFilters>(initialFilters);
  const [pendingFilterChanges, setPendingFilterChanges] = useState(currentAppliedFilters);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const clearIntentRef = useRef(true);

  // Sync URL params with state for Cases subcategory
  useEffect(() => {
    if (subcategory === "Cases") {
      // If URL has no filter params, initialize them with current filters
      if (!searchParams.has('case')) {
        const params = serializeFiltersToURL(currentAppliedFilters);
        setSearchParams(params, { replace: true });
      } else {
        // If URL has params (from back/forward nav or direct link), sync to state
        const filtersFromURL = parseFiltersFromURL(searchParams);
        setCurrentAppliedFilters(filtersFromURL);
      }
    }
  }, [searchParams, subcategory]);

  // Fetch exemplars for filter sidebar
  const { data: exemplars } = useQuery({
    queryKey: ["exemplars"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exemplars")
        .select("id, exemplar_name, gender, default, weak_strong")
        .order("gender");

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      return data;
    },
  });

  // Fetch further reading content for the subcategory. 
  const { data: subcategoryInfo } = useQuery({
    queryKey: ["subcategoryInfo", subcategory],
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

  // This is Sir Findsalot. He fetches sentences, combining retrySentences and new random sentences as needed
  const { data: sentences, isLoading, refetch } = useQuery({
    queryKey: ["sentences", subcategory, currentAppliedFilters],
    queryFn: async () => {
          
      // Declare local variables. State is asynchronous, so if the query calls state, information can be stale.
      let currentRetrySentences = retrySentences;
      let currentMasteredIds = masteredIds

      // Always reset exercise state when fetching new sentences
      setCurrentIndex(0);
      setAnsweredCount(0);
      setFirstTryCorrect(0);
      setHasIncorrectAttempt(false);

      // Reset additional state if you're not clicking 'keep practicing' 
      if (clearIntentRef.current) {
        setMasteredIds([]);
        currentMasteredIds = [];
        setRetrySentences([]);
        currentRetrySentences = []; // Reset local copy too
      } else {
        clearIntentRef.current = true;
      }

      const neededRandomSentences = 6 - currentRetrySentences.length;
      
      let newSentences: Sentence[] = [];

      // Only fetch new sentences if we need more to reach 6 total

      if (neededRandomSentences > 0) {

        // Fetch new random sentences from the database. Add filters if subcategory is Cases.
        const { data, error } = await supabase.rpc(
          "get_random_rows",
          subcategory === "Cases"
            ? {
                num_rows: neededRandomSentences,
                subcategory_filter: subcategory,
                word_category_filter: category,
                mastered_ids: currentMasteredIds,
                retry_ids: currentRetrySentences.map((s) => s.id),
                cases_filter: currentAppliedFilters.caseFilters,
                numbers_filter: currentAppliedFilters.numberFilters,
                definiteness_filter: currentAppliedFilters.definitenessFilters,
                exemplar_filter: currentAppliedFilters.exemplarFilters,
              }
            : {
                num_rows: neededRandomSentences,
                subcategory_filter: subcategory,
                word_category_filter: category,
                mastered_ids: currentMasteredIds,
                retry_ids: currentRetrySentences.map((s) => s.id),
              }
        );

        if (error) {
          console.error("Error fetching sentences:", error);
          throw error;
        }

        newSentences = data || [];
      }

      const combinedSentences = [...currentRetrySentences, ...newSentences];

      return combinedSentences;
    },
    refetchOnWindowFocus: false,
  });

  // This is Joan of Arc. She sets pending filters when sidebar opens. Triggers on currentAppliedFilters change too, to keep in sync.
  useEffect(() => {
    if (isFilterSidebarOpen) {
      setPendingFilterChanges(currentAppliedFilters);
    }
  }, [isFilterSidebarOpen, currentAppliedFilters]);

  // --- Handlers ---
  const handleCorrectAnswer = () => {
    const sentenceToCheck = sentences?.[currentIndex];
    if (!sentenceToCheck) return;

    // If the answer was correct on the first try, increment firstTryCorrect and add to masteredIds. Remove from retrySentences if it was there.
    if (!hasIncorrectAttempt) {
      setFirstTryCorrect((prev) => prev + 1);
      setMasteredIds((prev) => [...prev, sentenceToCheck.id]);
      if (retrySentences.some((s) => s.id === sentenceToCheck.id)) {
        setRetrySentences((prev) =>
          prev.filter((s) => s.id !== sentenceToCheck.id)
        );
      }
    }

    setAnsweredCount((prev) => prev + 1);

    // Move to next sentence if available
    if (sentences && currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setHasIncorrectAttempt(false);
    }
  };

  const handleIncorrectAnswer = () => {
    const sentenceToCheck = sentences?.[currentIndex];
    if (!sentenceToCheck) return;

    // If this is the first incorrect attempt for this sentence, add it to retrySentences
    if (!hasIncorrectAttempt && !retrySentences.some((s) => s.id === sentenceToCheck.id)) {
      setRetrySentences((prev) => [...prev, sentenceToCheck]);
    }

    setHasIncorrectAttempt(true);
  };

  // This is Kilroy. He updates pending filters when user makes changes in the sidebar.
  const handleFiltersChange = (filters: CasesFilters) => {
    setPendingFilterChanges(filters);
  };

  const handleApplyFilters = () => {
    const params = serializeFiltersToURL(pendingFilterChanges);
    setSearchParams(params);
    setIsFilterSidebarOpen(false);
  };

  // This is Frodo. He resets filters to default values.
  const handleResetFilters = () => {
    const defaultExemplars =
      exemplars?.filter((e) => e.default).map((e) => e.id) || [];

    const resetFilters = {
      caseFilters: ["Accusative"],
      numberFilters: ["Singular"],
      definitenessFilters: ["Indefinite"],
      exemplarFilters: defaultExemplars,
    };
    
    setPendingFilterChanges(resetFilters);
    const params = serializeFiltersToURL(resetFilters);
    setSearchParams(params);
  };

  // --- Derived state ---
  const progress = sentences ? (answeredCount / sentences.length) * 100 : 0;
  const isComplete = sentences && answeredCount === sentences.length;
  const isOutOfSentences = sentences && sentences.length < 6;
  const currentSentence = sentences?.[currentIndex].id;

  const [hasSentNotification, setHasSentNotification] = useState(false);

  useEffect(() => {
    if (isOutOfSentences && !hasSentNotification) {
      setHasSentNotification(true);

      fetch("https://mfqpuxijcbdhtqizpcdu.functions.supabase.co/notify-category-completed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          subcategory,
          filters: {
            caseFilters: currentAppliedFilters.caseFilters.join(", "),
            numberFilters: currentAppliedFilters.numberFilters.join(", "),
            definitenessFilters: currentAppliedFilters.definitenessFilters.join(", "),
            exemplarFilters: currentAppliedFilters.exemplarFilters.join(", "),
          }
        })
      }).catch(console.error);
    }
  }, [isOutOfSentences, hasSentNotification]);


  useEffect(() => {
    setCurrentSentence(currentSentence);
  }, [currentSentence, setCurrentSentence]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="top-12 md:top-0 bg-background/95 backdrop-blur-sm z-10 pb-2 -mt-2 pt-2">
        <Progress value={progress} className="mb-3 dark:bg-muted/50" />
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
          <>
            <EndScreen
              onStartFresh={() => {
                refetch();
              }}
              onKeepPracticing={() => {
                clearIntentRef.current = false;
                refetch();
              }}
              firstTryCorrect={firstTryCorrect}
              totalExercises={sentences.length}
              isOutOfSentences={isOutOfSentences}
            />
            <FurtherReading content={subcategoryInfo?.further_reading ?? null}/>
          </>
        ) : (
          <>
            <ExerciseCard
              sentence={sentences[currentIndex]}
              onCorrect={handleCorrectAnswer}
              onIncorrect={handleIncorrectAnswer}
              subcategory={subcategory || ""}
            />
            <FurtherReading content={subcategoryInfo?.further_reading ?? null}/>
          </>
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
