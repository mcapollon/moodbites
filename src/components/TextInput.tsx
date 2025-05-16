import React, { useState } from 'react';
import { MessageSquare, ArrowRight } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';
import { useAppContext } from '../context/AppContext';
import { analyzeSentiment } from '../services/voiceAPI';

const TextInput: React.FC = () => {
  const { updateMoodAnalysis, setCurrentStep, setStepCompleted } = useAppContext();
  const [moodDescription, setMoodDescription] = useState('');
  const [energyLevel, setEnergyLevel] = useState(5);
  const [comfortDesire, setComfortDesire] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Combine all user input into a single string for sentiment analysis
    const combinedText = `Mood: ${moodDescription}. Energy level: ${energyLevel}/10. Comfort desire: ${comfortDesire}/10.`;
    let primaryEmotion = 'neutral';
    try {
      const sentiment = await analyzeSentiment(combinedText);
      // Handle NLP Cloud scored_labels array
      if (sentiment?.scored_labels && Array.isArray(sentiment.scored_labels) && sentiment.scored_labels.length > 0) {
        primaryEmotion = sentiment.scored_labels[0].label || 'neutral';
      } else if (sentiment?.label) {
        primaryEmotion = sentiment.label;
      } else if (sentiment?.sentiment) {
        primaryEmotion = sentiment.sentiment;
      }
    } catch (err) {
      console.error('Sentiment analysis failed:', err);
      // fallback to old logic if API fails
      const moodWords = {
        happy: ['happy', 'joy', 'excited', 'good', 'great', 'wonderful', 'fantastic'],
        sad: ['sad', 'upset', 'depressed', 'down', 'blue', 'unhappy', 'miserable'],
        angry: ['angry', 'mad', 'frustrated', 'annoyed', 'irritated', 'furious'],
        neutral: ['okay', 'fine', 'alright', 'neutral', 'normal'],
        anxious: ['anxious', 'nervous', 'worried', 'stressed', 'concerned'],
        tired: ['tired', 'exhausted', 'sleepy', 'fatigued', 'drained'],
      };
      let highestCount = 0;
      Object.entries(moodWords).forEach(([emotion, words]) => {
        const count = words.filter(word => 
          moodDescription.toLowerCase().includes(word)
        ).length;
        if (count > highestCount) {
          highestCount = count;
          primaryEmotion = emotion;
        }
      });
      if (highestCount === 0) {
        if (energyLevel >= 7) {
          primaryEmotion = 'happy';
        } else if (energyLevel <= 3) {
          primaryEmotion = 'tired';
        }
      }
    }
    // Update context with text input analysis
    updateMoodAnalysis({
      text: {
        primaryEmotion,
        energyLevel,
        comfortDesire,
      }
    });
    setTimeout(() => {
      setIsSubmitting(false);
      setStepCompleted('text');
      setCurrentStep('recipe');
    }, 1000);
  };

  const handleSkip = () => {
    setCurrentStep('recipe');
  };

  return (
    <Card
      title="Tell Us About Your Mood"
      subtitle="Share how you're feeling right now"
      icon={<MessageSquare size={20} />}
      className="max-w-lg mx-auto"
    >
      <div className="space-y-6">
        <div>
          <label htmlFor="mood-description" className="block text-sm font-medium text-gray-700 mb-1">
            How would you describe your current mood?
          </label>
          <textarea
            id="mood-description"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            placeholder="I'm feeling..."
            value={moodDescription}
            onChange={(e) => setMoodDescription(e.target.value)}
          ></textarea>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            How's your energy level right now?
          </label>
          <div className="flex items-center">
            <span className="text-xs text-gray-500">Low Energy</span>
            <input
              type="range"
              min="1"
              max="10"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
              className="mx-3 w-full accent-teal-600"
            />
            <span className="text-xs text-gray-500">High Energy</span>
          </div>
          <div className="mt-2 text-center">
            <span className="text-sm font-medium">{energyLevel}</span>
            <span className="text-xs text-gray-500">/10</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            How much comfort do you need from your food?
          </label>
          <div className="flex items-center">
            <span className="text-xs text-gray-500">Light & Fresh</span>
            <input
              type="range"
              min="1"
              max="10"
              value={comfortDesire}
              onChange={(e) => setComfortDesire(parseInt(e.target.value))}
              className="mx-3 w-full accent-teal-600"
            />
            <span className="text-xs text-gray-500">Hearty & Comforting</span>
          </div>
          <div className="mt-2 text-center">
            <span className="text-sm font-medium">{comfortDesire}</span>
            <span className="text-xs text-gray-500">/10</span>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            rightIcon={<ArrowRight size={16} />}
            isLoading={isSubmitting}
          >
            Find My Recipe
          </Button>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-4">
          <p className="text-sm text-gray-500">
            This step is optional
          </p>
          <Button variant="text" onClick={handleSkip}>
            Skip
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TextInput;