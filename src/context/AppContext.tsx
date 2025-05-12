import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AnalysisStep, MoodAnalysis, Recipe } from '../types';

interface AppContextType {
  currentStep: AnalysisStep;
  setCurrentStep: (step: AnalysisStep) => void;
  completedSteps: AnalysisStep[];
  setStepCompleted: (step: AnalysisStep) => void;
  moodAnalysis: MoodAnalysis;
  updateMoodAnalysis: (data: Partial<MoodAnalysis>) => void;
  recipe: Recipe | null;
  setRecipe: (recipe: Recipe | null) => void;
  savedRecipes: Recipe[];
  saveRecipe: (recipe: Recipe) => void;
  removeSavedRecipe: (recipeId: number) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  resetAnalysis: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<AnalysisStep>('facial');
  const [completedSteps, setCompletedSteps] = useState<AnalysisStep[]>([]);
  const [moodAnalysis, setMoodAnalysis] = useState<MoodAnalysis>({});
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const setStepCompleted = (step: AnalysisStep) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
  };

  const updateMoodAnalysis = (data: Partial<MoodAnalysis>) => {
    setMoodAnalysis(prev => ({ ...prev, ...data }));
  };

  const saveRecipe = (recipe: Recipe) => {
    setSavedRecipes(prev => {
      if (!prev.some(r => r.id === recipe.id)) {
        return [...prev, { ...recipe, saved: true }];
      }
      return prev;
    });
  };

  const removeSavedRecipe = (recipeId: number) => {
    setSavedRecipes(prev => prev.filter(r => r.id !== recipeId));
  };

  const resetAnalysis = () => {
    setMoodAnalysis({});
    setCompletedSteps([]);
    setRecipe(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        completedSteps,
        setStepCompleted,
        moodAnalysis,
        updateMoodAnalysis,
        recipe,
        setRecipe,
        savedRecipes,
        saveRecipe,
        removeSavedRecipe,
        isLoading,
        setIsLoading,
        resetAnalysis,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};