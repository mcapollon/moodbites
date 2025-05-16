import React, { useState, useEffect, useRef } from 'react';
import { Mic, ArrowRight, Volume2, Play, Pause } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';
import EmotionBar from './ui/EmotionBar';
import LoadingSpinner from './ui/LoadingSpinner';
import { useAppContext } from '../context/AppContext';
import { analyzeVoice, recordAudio } from '../services/voiceAPI';

const VoiceAnalysis: React.FC = () => {
  const { updateMoodAnalysis, setCurrentStep, setStepCompleted } = useAppContext();
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{ primaryEmotion: string; emotions: { type: string; confidence: number }[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordTime(prevTime => {
          if (prevTime >= 10) {
            stopRecording();
            return 10;
          }
          return prevTime + 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  useEffect(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.onended = () => setIsPlaying(false);
      }
      return () => URL.revokeObjectURL(url);
    }
  }, [audioBlob]);

  const startRecording = async () => {
    setError(null);
    setRecordTime(0);
    setIsRecording(true);
    setAnalysisResult(null);
    
    try {
      const blob = await recordAudio(10);
      setAudioBlob(blob);
      setRecordingComplete(true);
    } catch (err) {
      setError('Failed to access microphone. Please check your permissions.');
      console.error(err);
    } finally {
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleAnalyze = async () => {
    if (!audioBlob) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await analyzeVoice(audioBlob);
      setAnalysisResult(result);
      updateMoodAnalysis({ voice: result });
      setIsAnalyzing(false);
    } catch (err) {
      setIsAnalyzing(false);
      setError('Failed to analyze voice. Please try again.');
      console.error(err);
    }
  };

  const handleSkip = () => {
    setCurrentStep('text');
  };

  const handleContinue = () => {
    setStepCompleted('voice');
    setCurrentStep('text');
  };

  return (
    <Card
      title="Voice Analysis"
      subtitle="Let's analyze your current mood by your voice"
      icon={<Volume2 size={20} />}
      className="max-w-lg mx-auto"
    >
      <audio ref={audioRef} className="hidden" />
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-gray-100 rounded-lg p-6 flex flex-col items-center justify-center">
          {isRecording ? (
            <div className="text-center">
              <div className="relative inline-flex justify-center">
                <div className="absolute w-16 h-16 bg-rose-500 rounded-full opacity-75 animate-ping"></div>
                <div className="relative flex items-center justify-center w-16 h-16 bg-rose-600 rounded-full">
                  <Mic size={24} className="text-white" />
                </div>
              </div>
              <p className="mt-4 font-medium">Recording... {recordTime}s</p>
              <p className="text-sm text-gray-500 mt-1">
                Please speak naturally about how your day is going
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={stopRecording}
              >
                Stop Recording
              </Button>
            </div>
          ) : recordingComplete ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                <Volume2 size={24} className="text-gray-600" />
              </div>
              <p className="mt-3 font-medium">Recording Complete</p>
              <div className="flex gap-3 mt-4 justify-center">
                <Button
                  variant="outline"
                  onClick={togglePlayback}
                  leftIcon={isPlaying ? <Pause size={16} /> : <Play size={16} />}
                >
                  {isPlaying ? 'Pause' : 'Play Recording'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={startRecording}
                >
                  Record Again
                </Button>
                {!analysisResult && !isAnalyzing && (
                  <Button onClick={handleAnalyze}>
                    Analyze Voice
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                <Mic size={24} className="text-gray-600" />
              </div>
              <p className="mt-3 font-medium">Ready to record your voice</p>
              <p className="text-sm text-gray-500 mt-1">
                We'll record 10 seconds of your voice to analyze your mood
              </p>
              <Button 
                className="mt-4"
                onClick={startRecording}
                leftIcon={<Mic size={16} />}
              >
                Start Recording
              </Button>
            </div>
          )}
        </div>

        {isAnalyzing && (
          <div className="flex justify-center py-4">
            <LoadingSpinner text="Analyzing voice patterns..." />
          </div>
        )}

        {analysisResult && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-lg font-medium text-gray-800">
              Voice Analysis Results
            </h3>
            <div className="p-4 bg-amber-50 rounded-lg">
              <p className="text-center mb-3">
                Your voice indicates your mood is:
              </p>
              <p className="text-2xl text-center font-bold text-amber-700 capitalize mb-3">
                {analysisResult.primaryEmotion}
              </p>
              <div className="mt-4">
                {analysisResult.emotions.map((emotion) => (
                  <EmotionBar key={emotion.type} emotion={emotion}  />
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={togglePlayback}
                  leftIcon={isPlaying ? <Pause size={16} /> : <Play size={16} />}
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={startRecording}
                >
                  Record Again
                </Button>
              </div>
              <Button 
                onClick={handleContinue} 
                rightIcon={<ArrowRight size={16} />}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {!analysisResult && !isAnalyzing && (
          <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-4">
            <p className="text-sm text-gray-500">
              This step is optional
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

export default VoiceAnalysis;