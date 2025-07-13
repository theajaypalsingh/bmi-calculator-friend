
-- Create storage bucket for blood reports
INSERT INTO storage.buckets (id, name, public)
VALUES ('blood-reports', 'blood-reports', false);

-- Create storage policies for blood reports
CREATE POLICY "Users can upload their own blood reports"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'blood-reports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own blood reports"
ON storage.objects FOR SELECT
USING (bucket_id = 'blood-reports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own blood reports"
ON storage.objects FOR DELETE
USING (bucket_id = 'blood-reports' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create table for blood report analyses
CREATE TABLE public.blood_report_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  analysis_result JSONB,
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on blood report analyses
ALTER TABLE public.blood_report_analyses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for blood report analyses
CREATE POLICY "Users can view their own analyses"
ON public.blood_report_analyses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analyses"
ON public.blood_report_analyses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analyses"
ON public.blood_report_analyses FOR UPDATE
USING (auth.uid() = user_id);
