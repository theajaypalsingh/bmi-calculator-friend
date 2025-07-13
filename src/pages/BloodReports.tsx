import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface AnalysisResult {
  dietary_recommendations: {
    foods_to_eat: string[];
    foods_to_avoid: string[];
  };
  lifestyle_recommendations: {
    dos: string[];
    donts: string[];
  };
  summary: string;
}

const BloodReports = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        setSelectedFile(file);
        setAnalysisResult(null);
        setAnalysisId(null);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF file",
          variant: "destructive",
        });
      }
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${user?.id}/${fileName}`;

    const { error } = await supabase.storage
      .from('blood-reports')
      .upload(filePath, file);

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    return filePath;
  };

  const createAnalysisRecord = async (fileName: string, filePath: string): Promise<string> => {
    const { data, error } = await supabase
      .from('blood_report_analyses')
      .insert({
        user_id: user?.id,
        file_name: fileName,
        file_path: filePath,
        status: 'processing'
      })
      .select('id')
      .single();

    if (error) {
      throw new Error(`Failed to create analysis record: ${error.message}`);
    }

    return data.id;
  };

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    return interval;
  };

  const handleSubmit = async () => {
    if (!selectedFile || !user) {
      toast({
        title: "Error",
        description: "Please select a file and ensure you're logged in",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    const progressInterval = simulateProgress();

    try {
      // Upload file
      const filePath = await uploadFile(selectedFile);
      
      // Create analysis record
      const analysisRecordId = await createAnalysisRecord(selectedFile.name, filePath);
      setAnalysisId(analysisRecordId);

      // Simulate AI analysis (replace with actual AI service call)
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock analysis result
      const mockResult: AnalysisResult = {
        dietary_recommendations: {
          foods_to_eat: [
            "Leafy green vegetables (spinach, kale)",
            "Lean proteins (chicken, fish, tofu)",
            "Whole grains (quinoa, brown rice)",
            "Nuts and seeds",
            "Fresh fruits (berries, citrus)"
          ],
          foods_to_avoid: [
            "Processed meats",
            "Sugary drinks and desserts",
            "Trans fats and fried foods",
            "Refined carbohydrates",
            "Excessive salt"
          ]
        },
        lifestyle_recommendations: {
          dos: [
            "Exercise regularly (30 minutes daily)",
            "Stay hydrated (8-10 glasses of water)",
            "Get adequate sleep (7-9 hours)",
            "Practice stress management",
            "Take prescribed medications as directed"
          ],
          donts: [
            "Don't skip meals",
            "Avoid smoking and excessive alcohol",
            "Don't ignore symptoms",
            "Avoid sedentary lifestyle",
            "Don't self-medicate"
          ]
        },
        summary: "Your blood report indicates some areas that need attention. Following these dietary and lifestyle recommendations can help improve your overall health markers."
      };

      // Update analysis record with results
      await supabase
        .from('blood_report_analyses')
        .update({
          analysis_result: mockResult as any,
          status: 'completed'
        })
        .eq('id', analysisRecordId);

      setProgress(100);
      setAnalysisResult(mockResult);
      
      toast({
        title: "Analysis Complete",
        description: "Your blood report has been analyzed successfully!",
      });

    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your blood report. Please try again.",
        variant: "destructive",
      });
      
      if (analysisId) {
        await supabase
          .from('blood_report_analyses')
          .update({ status: 'failed' })
          .eq('id', analysisId);
      }
    } finally {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to access blood report analysis.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Blood Report Analysis</h1>
          <p className="text-gray-600">
            Upload your blood report PDF and get personalized dietary and lifestyle recommendations
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Blood Report
              </CardTitle>
              <CardDescription>
                Select a PDF file of your blood report for analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center w-full">
                <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileText className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span>
                    </p>
                    <p className="text-xs text-gray-500">PDF files only</p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileSelect}
                    disabled={isAnalyzing}
                  />
                </label>
              </div>

              {selectedFile && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800">{selectedFile.name}</span>
                </div>
              )}

              <Button
                onClick={handleSubmit}
                disabled={!selectedFile || isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? "Analyzing..." : "Submit for Analysis"}
              </Button>

              {isAnalyzing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Analysis Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Analysis Results
              </CardTitle>
              <CardDescription>
                AI-powered recommendations based on your blood report
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analysisResult ? (
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Summary</h4>
                    <p className="text-blue-800 text-sm">{analysisResult.summary}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-green-900 mb-3">Foods to Eat</h4>
                    <ul className="space-y-1">
                      {analysisResult.dietary_recommendations.foods_to_eat.map((food, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          {food}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-red-900 mb-3">Foods to Avoid</h4>
                    <ul className="space-y-1">
                      {analysisResult.dietary_recommendations.foods_to_avoid.map((food, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <AlertCircle className="h-3 w-3 text-red-600" />
                          {food}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-green-900 mb-3">Lifestyle Dos</h4>
                    <ul className="space-y-1">
                      {analysisResult.lifestyle_recommendations.dos.map((item, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-red-900 mb-3">Lifestyle Don'ts</h4>
                    <ul className="space-y-1">
                      {analysisResult.lifestyle_recommendations.donts.map((item, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <AlertCircle className="h-3 w-3 text-red-600" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Upload and submit your blood report to see analysis results here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BloodReports;