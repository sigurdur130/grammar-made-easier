
-- Drop the get_filtered_random_rows function
DROP FUNCTION IF EXISTS public.get_filtered_random_rows;

-- Update get_random_rows to include optional case, number, and definiteness filtering
CREATE OR REPLACE FUNCTION public.get_random_rows(
    subcategory_filter text, 
    word_category_filter text, 
    num_rows integer, 
    mastered_ids bigint[] DEFAULT '{}'::bigint[], 
    retry_ids bigint[] DEFAULT '{}'::bigint[],
    cases text[] DEFAULT NULL,
    numbers text[] DEFAULT NULL,
    definiteness text[] DEFAULT NULL
)
RETURNS TABLE(
    id bigint, 
    english_translation text, 
    icelandic_left text, 
    icelandic_right text, 
    correct_answer text, 
    subcategory text, 
    base_form text, 
    word_category text,
    "case" text,
    "number" text,
    definiteness text
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
        sentences.word_category,
        sentences."case",
        sentences."number",
        sentences.definiteness
    FROM sentences
    WHERE sentences.subcategory = subcategory_filter
        AND sentences.word_category = word_category_filter
        AND (mastered_ids IS NULL OR sentences.id != ALL(mastered_ids))
        AND (retry_ids IS NULL OR sentences.id != ALL(retry_ids))
        AND (cases IS NULL OR sentences."case" = ANY(cases))
        AND (numbers IS NULL OR sentences."number" = ANY(numbers))
        AND (definiteness IS NULL OR sentences.definiteness = ANY(definiteness))
    ORDER BY RANDOM()
    LIMIT num_rows;
END;
$function$
