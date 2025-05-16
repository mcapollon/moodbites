import React, { useEffect, useState } from 'react';
import { ChefHat, Clock, Users, ArrowRight, Heart, Award, BookOpen, RefreshCw } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';
import LoadingSpinner from './ui/LoadingSpinner';
import { Recipe } from '../types';
import { useAppContext } from '../context/AppContext';
import { getMoodMatchedRecipeType } from '../services/gptAPI';
import { getRecipeRecommendations } from '../services/recipeAPI';

const RecipeRecommendation: React.FC = () => {
  const { moodAnalysis, setRecipe, saveRecipe, isLoading, setIsLoading, currentStep, setCurrentStep, resetAnalysis } = useAppContext();
  const [recommendedRecipes, setRecommendedRecipes] = useState<Recipe[]>([]);
  const [recipeReason, setRecipeReason] = useState('');
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (currentStep === 'recipe' && Object.keys(moodAnalysis).length > 0) {
      fetchRecipeRecommendations();
    }
  }, [currentStep, moodAnalysis]);

  const fetchRecipeRecommendations = async () => {
    setIsLoading(true);
    
    try {
      const recipeType = await getMoodMatchedRecipeType(moodAnalysis);
      setRecipeReason(recipeType.reason);
      
      const recipes = await getRecipeRecommendations(recipeType);
      setRecommendedRecipes(recipes);
      
      if (recipes.length > 0) {
        setRecipe(recipes[0]);
      }
    } catch (error) {
      console.error('Failed to fetch recipe recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextRecipe = () => {
    const nextIndex = (currentRecipeIndex + 1) % recommendedRecipes.length;
    setCurrentRecipeIndex(nextIndex);
    setRecipe(recommendedRecipes[nextIndex]);
    setIsSaved(false);
  };

  const handleSaveRecipe = () => {
    if (recommendedRecipes.length > 0) {
      saveRecipe(recommendedRecipes[currentRecipeIndex]);
      setIsSaved(true);
    }
  };

  const handleStartOver = () => {
    resetAnalysis();
    setCurrentStep('facial');
  };

  const handleGetNewRecipes = async () => {
    setIsLoading(true);
    setIsSaved(false);
    setCurrentRecipeIndex(0);
    try {
      const recipeType = await getMoodMatchedRecipeType(moodAnalysis);
      setRecipeReason(recipeType.reason);
      const recipes = await getRecipeRecommendations(recipeType);
      setRecommendedRecipes(recipes);
      if (recipes.length > 0) {
        setRecipe(recipes[0]);
      }
    } catch (error) {
      console.error('Failed to fetch new recipes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentRecipe = recommendedRecipes[currentRecipeIndex];

  if (isLoading) {
    return (
      <Card className="max-w-lg mx-auto h-96 flex items-center justify-center">
        <LoadingSpinner text="Finding the perfect recipe for your mood..." />
      </Card>
    );
  }

  if (!currentRecipe) {
    return (
      <Card 
        title="No Recipe Found" 
        subtitle="Sorry, we couldn't find a recipe matching your mood"
        className="max-w-lg mx-auto"
      >
        <div className="text-center p-6">
          <ChefHat size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">
            Try adjusting your mood analysis or try again later.
          </p>
          <Button onClick={fetchRecipeRecommendations}>
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="max-w-lg mx-auto"
    >
      <div>
        <div className="relative mb-6">
          <img 
            src={currentRecipe.image} 
            alt={currentRecipe.title}
            className="w-full h-48 object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
          <div className="absolute bottom-0 left-0 p-4">
            <h2 className="text-white text-xl font-bold">{currentRecipe.title}</h2>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center text-gray-600">
            <Clock size={18} className="mr-1" />
            <span className="text-sm">{currentRecipe.readyInMinutes} min</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users size={18} className="mr-1" />
            <span className="text-sm">{currentRecipe.servings} servings</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Award size={18} className="mr-1" />
            <span className="text-sm">Health: {currentRecipe.healthScore}/100</span>
          </div>
        </div>

        <div className="mb-6 p-4 bg-amber-50 rounded-lg">
          <h3 className="font-medium text-amber-800 mb-2 flex items-center">
            <Award className="mr-2" size={18} />
            Why This Recipe Matches Your Mood
          </h3>
          <p className="text-amber-700 text-sm">{recipeReason}</p>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-800 mb-3">Ingredients</h3>
            <ul className="space-y-2">
              {currentRecipe.ingredients.map((ingredient) => (
                <li key={ingredient.id} className="flex items-start">
                  <div className="h-1.5 w-1.5 bg-teal-500 rounded-full mt-2 mr-2"></div>
                  <span>
                    {ingredient.amount} {ingredient.unit} {ingredient.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-800 mb-3">Instructions</h3>
            <ol className="space-y-3">
              {currentRecipe.instructions.map((instruction) => (
                <li key={instruction.number} className="flex">
                  <span className="bg-teal-100 text-teal-800 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                    {instruction.number}
                  </span>
                  <span className="text-gray-700">{instruction.step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-6 pt-4 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Button
              variant={isSaved ? "outline" : "primary"}
              leftIcon={<Heart size={16} className={isSaved ? "text-rose-500 fill-rose-500" : ""} />}
              onClick={handleSaveRecipe}
              disabled={isSaved}
              className="flex-1 min-w-[140px]"
            >
              {isSaved ? "Saved" : "Save Recipe"}
            </Button>
            <Button
              variant="secondary"
              rightIcon={<ArrowRight size={16} />}
              onClick={handleNextRecipe}
              className="flex-1 min-w-[140px]"
            >
              Next Recipe
            </Button>
            <Button
              variant="outline"
              onClick={handleGetNewRecipes}
              className="flex-1 min-w-[140px]"
            >
              Get 3 New Recipes
            </Button>
          </div>
          <Button
            variant="outline"
            leftIcon={<RefreshCw size={16} />}
            onClick={handleStartOver}
            className="w-full"
          >
            Start Over
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default RecipeRecommendation