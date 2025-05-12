export interface Emotion {
  type: string;
  confidence: number;
}

export interface MoodAnalysis {
  facial?: {
    primaryEmotion: string;
    emotions: Emotion[];
  };
  voice?: {
    primaryEmotion: string;
    emotions: Emotion[];
  };
  text?: {
    primaryEmotion: string;
    energyLevel: number;
    comfortDesire: number;
  };
}

export interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  healthScore: number;
  moodMatch: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  saved?: boolean;
}

export interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  image?: string;
}

export interface Instruction {
  number: number;
  step: string;
}

export type AnalysisStep = 'facial' | 'voice' | 'text' | 'recipe';