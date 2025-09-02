-- Enable RLS on sentences_backup table
ALTER TABLE public.sentences_backup ENABLE ROW LEVEL SECURITY;

-- Allow public read access to sentences_backup (if needed)
CREATE POLICY "Allow public read access to sentences_backup" 
ON public.sentences_backup 
FOR SELECT 
USING (true);