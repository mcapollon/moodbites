import React from 'react';
import Card from './Card';
import Button from './Button';

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: any;
  videoUrl?: string;
  videoLoading: boolean;
  videoError?: string;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ isOpen, onClose, recipe, videoUrl, videoLoading, videoError }) => {
  if (!isOpen || !recipe) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-lg">
        <button
          className="absolute top-3 right-3 text-2xl text-gray-500 hover:text-gray-800 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow focus:outline-none focus:ring-2 focus:ring-teal-500"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2 text-center">{recipe.title}</h2>
          <img src={recipe.image} alt={recipe.title} className="w-full h-56 object-cover rounded mb-4" />
          <div className="mb-4">
            <h3 className="font-medium mb-1">Ingredients</h3>
            <ul className="text-sm list-disc ml-5">
              {recipe.ingredients.map((ing: any) => (
                <li key={ing.id}>{ing.amount} {ing.unit} {ing.name}</li>
              ))}
            </ul>
          </div>
          <div className="mb-4">
            <h3 className="font-medium mb-1">Instructions</h3>
            <ol className="text-sm list-decimal ml-5">
              {recipe.instructions.map((ins: any) => (
                <li key={ins.number}>{ins.step}</li>
              ))}
            </ol>
          </div>
          <div className="mb-4">
            <h3 className="font-medium mb-1">Recipe Video</h3>
            {videoLoading ? (
              <div>Loading video...</div>
            ) : videoUrl ? (
              <div>
                <iframe
                  width="100%"
                  height="250"
                  src={videoUrl}
                  title="Recipe Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="block mt-2 text-blue-600 underline">Watch on YouTube</a>
              </div>
            ) : (
              <div className="text-red-600 text-sm">{videoError || "Couldn't find a video for this recipe."}</div>
            )}
          </div>
          <Button onClick={onClose} className="w-full mt-2">Close</Button>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
