import React, { useState } from 'react';
import { Camera, RefreshCw, ArrowRight } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';
import EmotionBar from './ui/EmotionBar';
import LoadingSpinner from './ui/LoadingSpinner';
import { useAppContext } from '../context/AppContext';
import { analyzeFacialExpression, captureImage } from '../services/faceAPI';

const FacialAnalysis: React.FC = () => {
  const { updateMoodAnalysis, setCurrentStep, setStepCompleted } = useAppContext();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{ primaryEmotion: string; emotions: { type: string; confidence: number }[] } | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = async () => {
    setIsCapturing(true);
    setError(null);
    setAnalysisResult(null); // Reset analysis when retaking photo
    
    try {
      const imageData = await captureImage();
      setCapturedImage(imageData);
      setIsCapturing(false);
    } catch (err) {
      setIsCapturing(false);
      setError('Failed to access camera. Please check your permissions.');
      console.error(err);
    }
  };

  const handleAnalyze = async () => {
    if (!capturedImage) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await analyzeFacialExpression(capturedImage);
      setAnalysisResult(result);
      updateMoodAnalysis({ facial: result });
      setIsAnalyzing(false);
    } catch (err) {
      setIsAnalyzing(false);
      setError('Failed to analyze facial expression. Please try again.');
      console.error(err);
    }
  };

  const handleSkip = () => {
    setCurrentStep('voice');
  };

  const handleContinue = () => {
    setStepCompleted('facial');
    setCurrentStep('voice');
  };

  return (
    <Card
      title="Facial Expression Analysis"
      subtitle="Let's analyze your current mood by your facial expression"
      icon={<Camera size={20} />}
      className="max-w-lg mx-auto"
    >
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {!capturedImage ? (
          <div className="bg-gray-100 rounded-lg h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
            {isCapturing ? (
              <LoadingSpinner text="Accessing camera..." />
            ) : (
              <>
                <Camera size={48} className="text-gray-400 mb-2" />
                <p className="text-gray-500 mb-4">No image captured yet</p>
                <Button onClick={handleCapture} leftIcon={<Camera size={16} />}>
                  Capture Image
                </Button>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="relative">
              <img 
                src={capturedImage} 
                alt="Captured" 
                className="w-full h-48 object-cover rounded-lg" 
              />
              <Button 
                size="sm" 
                className="absolute bottom-2 right-2 opacity-90"
                onClick={handleCapture}
                leftIcon={<RefreshCw size={14} />}
              >
                Retake
              </Button>
            </div>

            {!analysisResult ? (
              <div className="flex justify-center">
                {isAnalyzing ? (
                  <LoadingSpinner text="Analyzing expression..." />
                ) : (
                  <Button onClick={handleAnalyze}>Analyze Expression</Button>
                )}
              </div>
            ) : (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-lg font-medium text-gray-800">
                  Analysis Results
                </h3>
                <div className="p-4 bg-teal-50 rounded-lg">
                  <p className="text-center mb-3">
                    Your primary emotion appears to be:
                  </p>
                  <p className="text-2xl text-center font-bold text-teal-700 capitalize mb-3">
                    {analysisResult.primaryEmotion}
                  </p>
                  <div className="mt-4">
                    {analysisResult.emotions.map((emotion, index) => (
                      <EmotionBar key={emotion.type} emotion={emotion} index={index} />
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Button 
                    variant="outline"
                    onClick={handleCapture}
                    leftIcon={<RefreshCw size={16} />}
                  >
                    Retake Photo
                  </Button>
                  <Button 
                    onClick={handleContinue} 
                    rightIcon={<ArrowRight size={16} />}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {!analysisResult && (
          <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-4">
            <p className="text-sm text-gray-500">
              Want to skip this step?
            </p>
            <Button variant="text" onClick={handleSkip}>
              Skip
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FacialAnalysis;