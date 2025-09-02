-- Enable RLS and create policy for exemplars table
ALTER TABLE public.exemplars ENABLE ROW LEVEL SECURITY;

-- Allow public read access to exemplars (needed for the filter UI)
CREATE POLICY "Allow public read access to exemplars" 
ON public.exemplars 
FOR SELECT 
USING (true);