import { useQuery } from "@tanstack/react-query";
import { CategoryCard } from "@/components/CategoryCard";
import { supabase } from "@/integrations/supabase/client";
import { Sprout, Leaf, TreePine, Mountain } from "lucide-react";

interface GroupedByDifficulty {
  [difficulty: string]: {
    [wordCategory: string]: {
      subcategory: string;
      word_category: string;
      status?: string;
      difficulty?: string;
    }[];
  };
}

const getDifficultyInfo = (difficulty: string | undefined) => {
  switch (difficulty?.toLowerCase()) {
    case "beginner":
      return { order: 1, icon: <Sprout className="h-5 w-5 text-green-500 mr-2" />, bgClass: "bg-green-50 dark:bg-green-950/20", borderClass: "border-green-200 dark:border-green-800" };
    case "low intermediate":
      return { order: 2, icon: <Leaf className="h-5 w-5 text-blue-500 mr-2" />, bgClass: "bg-blue-50 dark:bg-blue-950/20", borderClass: "border-blue-200 dark:border-blue-800" };
    case "high intermediate":
      return { order: 3, icon: <TreePine className="h-5 w-5 text-orange-500 mr-2" />, bgClass: "bg-orange-50 dark:bg-orange-950/20", borderClass: "border-orange-200 dark:border-orange-800" };
    case "advanced":
      return { order: 4, icon: <Mountain className="h-5 w-5 text-purple-500 mr-2" />, bgClass: "bg-purple-50 dark:bg-purple-950/20", borderClass: "border-purple-200 dark:border-purple-800" };
    default:
      return { order: 5, icon: null, bgClass: "", borderClass: "" };
  }
};

const Index = () => {
  const { data: subcategories } = useQuery({
    queryKey: ["featuredSubcategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subcategories")
        .select("subcategory, word_category, status, difficulty")
        .eq("status", "online");
      if (error) throw error;
      return data;
    },
  });

  const groupedByDifficulty: GroupedByDifficulty = {};
  subcategories?.forEach((sub) => {
    const difficulty = sub.difficulty || "Unknown";
    if (!groupedByDifficulty[difficulty]) groupedByDifficulty[difficulty] = {};
    if (!groupedByDifficulty[difficulty][sub.word_category]) groupedByDifficulty[difficulty][sub.word_category] = [];
    groupedByDifficulty[difficulty][sub.word_category].push(sub);
  });

  const sortedDifficulties = Object.keys(groupedByDifficulty).sort(
    (a, b) => getDifficultyInfo(a).order - getDifficultyInfo(b).order
  );

  return (
    <div className="px-4 py-6 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center px-2">
        What do you want to practice today?
      </h1>

      <div className="space-y-8 md:space-y-12">
        {sortedDifficulties.map((difficulty) => {
          const { bgClass, borderClass, icon } = getDifficultyInfo(difficulty);
          return (
            <div key={difficulty} className={`space-y-6 p-4 md:p-6 rounded-lg border ${borderClass} ${bgClass}`}>
              <div className="flex items-center backdrop-blur py-2 px-3 rounded-md sticky top-12 md:top-0 z-10">
                {icon}
                <h2 className="text-xl md:text-2xl font-bold text-left">{difficulty}</h2>
              </div>

              <div className="space-y-8">
                {Object.entries(groupedByDifficulty[difficulty]).map(([wordCategory, subs]) => (
                  <div key={`${difficulty}-${wordCategory}`} className="space-y-3 md:space-y-4">
                    <h3 className="text-lg md:text-xl font-semibold text-left pl-2 sticky top-24 md:top-12 backdrop-blur py-2 z-5">
                      {wordCategory}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 px-2">
                      {subs.map((sub) => (
                        <CategoryCard
                          key={sub.subcategory}
                          title={sub.subcategory || ""}
                          category={sub.word_category || ""}
                          difficulty={sub.difficulty}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Index;
