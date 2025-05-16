import { Recipe, Ingredient, Instruction } from '../types';

interface RecipeType {
  type: string;
  reason: string;
  preparationTime: 'quick' | 'medium' | 'lengthy';
  complexity: 'simple' | 'moderate' | 'complex';
  comfort: number;
}

export const getRecipeRecommendations = async (recipeType: RecipeType): Promise<Recipe[]> => {
  const SPOONACULAR_API_KEY = '195fa19f510f4072857e1209c1b19411';
  const baseUrl = 'https://api.spoonacular.com/recipes/complexSearch';

  // Helper to fetch and map recipes by query
  const fetchRecipesByQuery = async (query: string, n: number) => {
    const params = new URLSearchParams({
      apiKey: SPOONACULAR_API_KEY,
      query,
      number: String(n),
      sort: 'random', // Add random sort for more variety
    });
    const url = `${baseUrl}?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch recipes from Spoonacular');
    const data = await res.json();
    if (!data.results || !Array.isArray(data.results) || data.results.length === 0) return [];
    return data.results;
  };

  // Try the GPT-recommended type first
  const primaryResults = await fetchRecipesByQuery(recipeType.type || 'comfort food', 10);
  let allResults = [...primaryResults];

  // If less than 3, try a random fallback query and merge unique
  if (allResults.length < 3) {
    const fallbackQueries = ['dinner', 'lunch', 'main course', 'easy', 'healthy', 'quick', 'vegetarian', 'chicken', 'pasta', 'soup'];
    const fallbackQuery = fallbackQueries[Math.floor(Math.random() * fallbackQueries.length)];
    const fallbackResults = await fetchRecipesByQuery(fallbackQuery, 10);
    const ids = new Set(allResults.map((r: any) => r.id));
    for (const r of fallbackResults) {
      if (!ids.has(r.id)) {
        allResults.push(r);
        ids.add(r.id);
      }
      if (allResults.length >= 15) break;
    }
  }

  // Deduplicate by id (in case of overlap)
  const uniqueResults: any[] = [];
  const seen = new Set();
  for (const r of allResults) {
    if (!seen.has(r.id)) {
      uniqueResults.push(r);
      seen.add(r.id);
    }
  }

  // Shuffle unique results for variety
  function shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  const shuffledResults = shuffle(uniqueResults);

  // If still less than 3, duplicate as needed
  while (shuffledResults.length < 3 && shuffledResults.length > 0) {
    shuffledResults.push(shuffledResults[shuffledResults.length % shuffledResults.length]);
    if (shuffledResults.length > 10) break;
  }
  if (shuffledResults.length === 0) return [];

  // Fetch detailed info for each recipe, but continue if some fail
  const detailPromises = shuffledResults.slice(0, 3).map(async (r: any) => {
    try {
      const detailUrl = `https://api.spoonacular.com/recipes/${r.id}/information?apiKey=${SPOONACULAR_API_KEY}`;
      const detailRes = await fetch(detailUrl);
      if (!detailRes.ok) throw new Error('Failed to fetch recipe details from Spoonacular');
      const detail = await detailRes.json();
      return {
        id: detail.id,
        title: detail.title,
        image: detail.image,
        readyInMinutes: detail.readyInMinutes,
        servings: detail.servings,
        healthScore: detail.healthScore || 0,
        moodMatch: recipeType.reason,
        ingredients: (detail.extendedIngredients || []).map((ing: any, idx: number) => ({
          id: ing.id || idx + 1,
          name: ing.name,
          amount: ing.amount,
          unit: ing.unit,
        })),
        instructions: parseInstructions(detail.analyzedInstructions),
      };
    } catch (err) {
      console.error('Error fetching recipe detail:', err);
      return null;
    }
  });

  const recipesWithNulls = await Promise.all(detailPromises);
  const recipes: Recipe[] = recipesWithNulls.filter((r): r is Recipe => r !== null);
  // If after all, still <3, duplicate as needed
  while (recipes.length < 3 && recipes.length > 0) {
    recipes.push(recipes[recipes.length % recipes.length]);
    if (recipes.length > 10) break;
  }
  return recipes.slice(0, 3);
};

function parseInstructions(analyzedInstructions: any): Instruction[] {
  if (!Array.isArray(analyzedInstructions) || !analyzedInstructions[0] || !Array.isArray(analyzedInstructions[0].steps)) return [];
  return analyzedInstructions[0].steps.map((step: any) => ({
    number: step.number,
    step: step.step,
  }));
}

export const getRecipeDetails = async (recipeId: number): Promise<Recipe> => {
  // In a real app, this would call the API to get detailed recipe info
  // For this mock, we'll simulate a delay and return a mock recipe
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Create a mock recipe with the given ID
  return createMockRecipe(
    recipeId,
    'Detailed Recipe ' + recipeId,
    'A detailed description for recipe ' + recipeId,
    30,
    4,
    80,
    'This recipe matches your current mood because it provides the right balance of comfort and energy.'
  );
};

// Helper function to create mock recipes
function createMockRecipe(
  id: number,
  title: string,
  description: string,
  readyInMinutes: number,
  servings: number,
  healthScore: number,
  moodMatch: string
): Recipe {
  // Generate a random image URL from Pexels
  const imageId = 1000000 + Math.floor(Math.random() * 100000);
  const image = `https://images.pexels.com/photos/${imageId}/pexels-photo-${imageId}.jpeg?auto=compress&cs=tinysrgb&w=600`;
  
  // Create random ingredients
  const ingredients: Ingredient[] = Array(Math.floor(Math.random() * 5) + 5)
    .fill(0)
    .map((_, index) => ({
      id: index + 1,
      name: getRandomIngredient(),
      amount: Math.random() * 3 + 0.5,
      unit: getRandomUnit(),
    }));
  
  // Create random instructions
  const instructions: Instruction[] = Array(Math.floor(Math.random() * 3) + 3)
    .fill(0)
    .map((_, index) => ({
      number: index + 1,
      step: getRandomInstruction(index + 1),
    }));
  
  return {
    id,
    title,
    image,
    readyInMinutes,
    servings,
    healthScore,
    moodMatch,
    ingredients,
    instructions,
  };
}

// Helper functions for generating random recipe components
function getRandomIngredient(): string {
  const ingredients = [
    'Olive oil', 'Garlic', 'Onion', 'Tomatoes', 'Chicken breast',
    'Salmon fillet', 'Rice', 'Pasta', 'Broccoli', 'Bell pepper',
    'Carrots', 'Potatoes', 'Lemon', 'Cheese', 'Butter',
    'Eggs', 'Milk', 'Flour', 'Sugar', 'Salt',
    'Black pepper', 'Basil', 'Oregano', 'Thyme', 'Cumin',
  ];
  return ingredients[Math.floor(Math.random() * ingredients.length)];
}

function getRandomUnit(): string {
  const units = ['cup', 'tablespoon', 'teaspoon', 'ounce', 'pound', 'clove', 'gram', 'milliliter'];
  return units[Math.floor(Math.random() * units.length)];
}

function getRandomInstruction(step: number): string {
  const instructions = [
    'Preheat the oven to 350°F (175°C).',
    'Heat olive oil in a large skillet over medium heat.',
    'Add chopped onions and garlic, sauté until translucent.',
    'Stir in the remaining ingredients and mix well.',
    'Season with salt and pepper to taste.',
    'Cook for 10-15 minutes, stirring occasionally.',
    'Transfer to a baking dish and bake for 20-25 minutes.',
    'Remove from heat and let rest for 5 minutes before serving.',
    'Garnish with fresh herbs and serve immediately.',
    'Store leftovers in an airtight container for up to 3 days.',
  ];
  return instructions[step % instructions.length];
}