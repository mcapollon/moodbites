import { MoodAnalysis } from '../types';

interface RecipeType {
  type: string;
  reason: string;
  preparationTime: 'quick' | 'medium' | 'lengthy';
  complexity: 'simple' | 'moderate' | 'complex';
  comfort: number; // 1-10
}

// This would be replaced with actual GPT-3 API integration
export const getMoodMatchedRecipeType = async (moodAnalysis: MoodAnalysis): Promise<RecipeType> => {
  // Simulate API call with a delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Determine primary emotion by weighting all available analyses
  let primaryEmotion = 'neutral';
  let reasons: string[] = [];
  
  if (moodAnalysis.facial) {
    primaryEmotion = moodAnalysis.facial.primaryEmotion;
    reasons.push(`Your facial expression showed ${primaryEmotion}`);
  }
  
  if (moodAnalysis.voice) {
    // If facial and voice don't match, blend them
    if (primaryEmotion !== moodAnalysis.voice.primaryEmotion) {
      reasons.push(`Your voice conveyed ${moodAnalysis.voice.primaryEmotion}`);
    }
  }
  
  if (moodAnalysis.text) {
    reasons.push(`You expressed ${moodAnalysis.text.primaryEmotion} energy and desire for comfort`);
  }
  
  // Map emotions to recipe types
  const recipeMapping: Record<string, RecipeType> = {
    happy: {
      type: 'fresh and vibrant',
      reason: 'Your positive mood calls for something bright and energetic',
      preparationTime: 'medium',
      complexity: 'moderate',
      comfort: 5,
    },
    sad: {
      type: 'comfort food',
      reason: 'A warm, soothing dish can help lift your spirits',
      preparationTime: 'medium',
      complexity: 'simple',
      comfort: 9,
    },
    angry: {
      type: 'spicy and robust',
      reason: 'Something with bold flavors matches your intense energy',
      preparationTime: 'quick',
      complexity: 'simple',
      comfort: 4,
    },
    neutral: {
      type: 'balanced and nourishing',
      reason: 'A well-rounded dish complements your balanced state',
      preparationTime: 'medium',
      complexity: 'moderate',
      comfort: 6,
    },
    surprised: {
      type: 'unique and unexpected',
      reason: 'Try something new and exciting that matches your sense of wonder',
      preparationTime: 'lengthy',
      complexity: 'complex',
      comfort: 3,
    },
    fear: {
      type: 'simple and familiar',
      reason: 'Something predictable and easy to enjoy',
      preparationTime: 'quick',
      complexity: 'simple',
      comfort: 8,
    },
  };
  
  return {
    ...recipeMapping[primaryEmotion] || recipeMapping.neutral,
    reason: reasons.join(' and ') + '. ' + (recipeMapping[primaryEmotion]?.reason || recipeMapping.neutral.reason),
  };
};