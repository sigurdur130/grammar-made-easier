
-- Create a new function for filtered random rows specifically for Cases subcategory
CREATE OR REPLACE FUNCTION public.get_filtered_random_rows(
    subcategory_filter text, 
    word_category_filter text, 
    num_rows integer, 
    mastered_ids bigint[] DEFAULT '{}'::bigint[], 
    retry_ids bigint[] DEFAULT '{}'::bigint[],
    case_filters text[] DEFAULT '{Accusative,Dative,Genitive}'::text[],
    number_filters text[] DEFAULT '{Singular,Plural}'::text[],
    definiteness_filters text[] DEFAULT '{Definite,Indefinite}'::text[]
)
RETURNS TABLE(
    id bigint, 
    english_translation text, 
    icelandic_left text, 
    icelandic_right text, 
    correct_answer text, 
    subcategory text, 
    base_form text, 
    word_category text
)
LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY 
    SELECT 
        sentences.id,
        sentences.english_translation,
        sentences.icelandic_left,
        sentences.icelandic_right,
        sentences.correct_answer,
        sentences.subcategory,
        sentences.base_form,
        sentences.word_category
    FROM sentences
    WHERE sentences.subcategory = subcategory_filter
        AND sentences.word_category = word_category_filter
        AND (mastered_ids IS NULL OR sentences.id != ALL(mastered_ids))
        AND (retry_ids IS NULL OR sentences.id != ALL(retry_ids))
        AND (case_filters IS NULL OR sentences."case" = ANY(case_filters))
        AND (number_filters IS NULL OR sentences."number" = ANY(number_filters))
        AND (definiteness_filters IS NULL OR sentences.definiteness = ANY(definiteness_filters))
    ORDER BY RANDOM()
    LIMIT num_rows;
END;
$function$
