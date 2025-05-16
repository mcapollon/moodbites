import React, { useState } from 'react';
import { BookOpen, Trash2 } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';
import { useAppContext } from '../context/AppContext';
import RecipeModal from './ui/RecipeModal';
import { getRecipeVideoUrl } from '../services/gptAPI';

const SavedRecipes: React.FC = () => {
  const { savedRecipes, removeSavedRecipe, setCurrentStep, resetAnalysis } = useAppContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState<string | undefined>(undefined);

  const handleStartOver = () => {
    resetAnalysis();
    setCurrentStep('facial');
  };

  const handleRecipeClick = async (recipe: any) => {
    setSelectedRecipe(recipe);
    setModalOpen(true);
    setVideoUrl(undefined);
    setVideoError(undefined);
    setVideoLoading(true);
    try {
      const url = await getRecipeVideoUrl(recipe.title);
      if (url) {
        // Convert to embed if it's a YouTube link
        let embedUrl = url;
        if (url.includes('youtube.com/watch?v=')) {
          const videoId = url.split('v=')[1].split('&')[0];
          embedUrl = `https://www.youtube.com/embed/${videoId}`;
        } else if (url.includes('youtu.be/')) {
          const videoId = url.split('youtu.be/')[1].split(/[?&]/)[0];
          embedUrl = `https://www.youtube.com/embed/${videoId}`;
        }
        setVideoUrl(embedUrl);
      } else {
        setVideoError("Couldn't find a video for this recipe.");
      }
    } catch (e) {
      setVideoError("Couldn't find a video for this recipe.");
    } finally {
      setVideoLoading(false);
    }
  };

  if (savedRecipes.length === 0) {
    return (
      <Card
        title="Saved Recipes"
        subtitle="Your recipe collection is empty"
        icon={<BookOpen size={20} />}
        className="max-w-lg mx-auto"
      >
        <div className="text-center py-8">
          <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">
            Start analyzing your mood to get personalized recipe recommendations!
          </p>
          <Button onClick={handleStartOver}>
            Get Recipe Recommendations
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card
        title="Saved Recipes"
        subtitle="Your collection of mood-matched recipes"
        icon={<BookOpen size={20} />}
        className="max-w-lg mx-auto"
      >
        <div className="space-y-4">
          {savedRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => handleRecipeClick(recipe)}
            >
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{recipe.title}</h3>
                <p className="text-sm text-gray-500">
                  {recipe.readyInMinutes} mins | {recipe.servings} servings
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={e => { e.stopPropagation(); removeSavedRecipe(recipe.id); }}
                leftIcon={<Trash2 size={14} />}
                className="text-rose-600 border-rose-600 hover:bg-rose-50"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </Card>
      <RecipeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        recipe={selectedRecipe}
        videoUrl={videoUrl}
        videoLoading={videoLoading}
        videoError={videoError}
      />
    </>
  );
};

export default SavedRecipes;