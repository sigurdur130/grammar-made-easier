-- Update the get_random_rows function to support exemplar filtering
CREATE OR REPLACE FUNCTION public.get_random_rows(
    subcategory_filter text, 
    word_category_filter text, 
    num_rows integer, 
    mastered_ids bigint[] DEFAULT '{}'::bigint[], 
    retry_ids bigint[] DEFAULT '{}'::bigint[], 
    cases_filter text[] DEFAULT NULL::text[], 
    numbers_filter text[] DEFAULT NULL::text[], 
    definiteness_filter text[] DEFAULT NULL::text[],
    exemplar_filter bigint[] DEFAULT NULL::bigint[]
)
RETURNS TABLE(
    id bigint, 
    english_translation text, 
    icelandic_left text, 
    icelandic_right text, 
    correct_answer jsonb, 
    subcategory text, 
    base_form text, 
    word_category text, 
    "case" text, 
    number text, 
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
        AND (cases_filter IS NULL OR sentences."case" = ANY(cases_filter))
        AND (numbers_filter IS NULL OR sentences."number" = ANY(numbers_filter))
        AND (definiteness_filter IS NULL OR sentences.definiteness = ANY(definiteness_filter))
        AND (exemplar_filter IS NULL OR sentences.exemplar = ANY(exemplar_filter))
    ORDER BY RANDOM()
    LIMIT num_rows;
END;
$function$