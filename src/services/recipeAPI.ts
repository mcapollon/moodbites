import { Recipe, Ingredient, Instruction } from '../types';

interface RecipeType {
  type: string;
  reason: string;
  preparationTime: 'quick' | 'medium' | 'lengthy';
  complexity: 'simple' | 'moderate' | 'complex';
  comfort: number;
}

// This would be replaced with actual Spoonacular API integration
export const getRecipeRecommendations = async (recipeType: RecipeType): Promise<Recipe[]> => {
  // Simulate API call with a delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock recipes based on recipe type
  const mockRecipes: Record<string, Recipe[]> = {
    'fresh and vibrant': [
      createMockRecipe(1, 'Citrus Avocado Salad', 'A bright, refreshing salad with mixed greens, avocado, and citrus segments', 15, 2, 90, recipeType.reason),
      createMockRecipe(2, 'Summer Berry Smoothie Bowl', 'A vibrant smoothie bowl topped with fresh berries and granola', 10, 1, 85, recipeType.reason),
      createMockRecipe(3, 'Mediterranean Chickpea Bowl', 'Fresh vegetables, chickpeas, and feta cheese with a lemon dressing', 20, 2, 95, recipeType.reason),
    ],
    'comfort food': [
      createMockRecipe(4, 'Classic Mac and Cheese', 'Creamy, cheesy pasta baked to perfection', 35, 4, 60, recipeType.reason),
      createMockRecipe(5, 'Homestyle Chicken Soup', 'Warming chicken soup with vegetables and herbs', 45, 6, 75, recipeType.reason),
      createMockRecipe(6, 'Chocolate Chip Cookies', 'Warm, gooey chocolate chip cookies like grandma used to make', 25, 12, 50, recipeType.reason),
    ],
    'spicy and robust': [
      createMockRecipe(7, 'Spicy Beef Tacos', 'Fiery beef tacos with homemade salsa and lime', 25, 4, 70, recipeType.reason),
      createMockRecipe(8, 'Thai Red Curry', 'Bold, aromatic curry with vegetables and your choice of protein', 30, 4, 80, recipeType.reason),
      createMockRecipe(9, 'Buffalo Cauliflower Bites', 'Crispy cauliflower coated in spicy buffalo sauce', 35, 4, 65, recipeType.reason),
    ],
    'balanced and nourishing': [
      createMockRecipe(10, 'Quinoa Power Bowl', 'Protein-packed quinoa with roasted vegetables and tahini dressing', 30, 2, 95, recipeType.reason),
      createMockRecipe(11, 'Baked Salmon with Vegetables', 'Omega-rich salmon with seasonal vegetables', 25, 2, 100, recipeType.reason),
      createMockRecipe(12, 'Hearty Vegetable Soup', 'A mix of seasonal vegetables in a savory broth', 40, 6, 90, recipeType.reason),
    ],
    'unique and unexpected': [
      createMockRecipe(13, 'Watermelon Gazpacho', 'A surprising twist on traditional gazpacho using fresh watermelon', 20, 4, 85, recipeType.reason),
      createMockRecipe(14, 'Lavender Honey Ice Cream', 'Homemade ice cream infused with lavender and sweetened with honey', 240, 8, 60, recipeType.reason),
      createMockRecipe(15, 'Savory Oatmeal with Egg', 'A savory take on traditionally sweet oatmeal, topped with a fried egg', 15, 1, 80, recipeType.reason),
    ],
    'simple and familiar': [
      createMockRecipe(16, 'Classic Grilled Cheese', 'The ultimate comfort sandwich with melted cheese', 10, 1, 50, recipeType.reason),
      createMockRecipe(17, 'Tomato Basil Pasta', 'Simple pasta with fresh tomatoes and basil', 20, 2, 70, recipeType.reason),
      createMockRecipe(18, 'Baked Potato with Toppings', 'A familiar favorite with your choice of toppings', 60, 1, 65, recipeType.reason),
    ],
  };
  
  // Default to balanced if the type isn't found
  return mockRecipes[recipeType.type] || mockRecipes['balanced and nourishing'];
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