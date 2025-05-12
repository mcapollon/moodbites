import React from 'react';
import { Emotion } from '../../types';

interface EmotionBarProps {
  emotion: Emotion;
  index: number;
}

const EmotionBar: React.FC<EmotionBarProps> = ({ emotion, index }) => {
  // Colors for different emotions
  const colors: Record<string, string> = {
    happy: 'bg-green-500',
    sad: 'bg-blue-500',
    angry: 'bg-red-500',
    surprised: 'bg-amber-500',
    neutral: 'bg-gray-500',
    fear: 'bg-purple-500',
    disgust: 'bg-orange-500',
  };
  
  // Animation delay for staggered appearance
  const animationDelay = `${index * 0.1}s`;
  
  return (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium capitalize">{emotion.type}</span>
        <span className="text-sm text-gray-500">{Math.round(emotion.confidence)}%</span>
      </div>
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colors[emotion.type] || 'bg-teal-500'} rounded-full transition-all duration-1000`}
          style={{ 
            width: `${emotion.confidence}%`,
            animationDelay,
            animation: 'growWidth 1s ease-out forwards'
          }}
        ></div>
      </div>
      <style jsx>{`
        @keyframes growWidth {
          from { width: 0; }
          to { width: ${emotion.confidence}%; }
        }
      `}</style>
    </div>
  );
};

export default EmotionBar;