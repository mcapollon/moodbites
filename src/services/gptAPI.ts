import { MoodAnalysis } from '../types';
import OpenAI from 'openai';

interface RecipeType {
  type: string;
  reason: string;
  preparationTime: 'quick' | 'medium' | 'lengthy';
  complexity: 'simple' | 'moderate' | 'complex';
  comfort: number; // 1-10
}

const OPEN_AI_API_KEY = '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'

const openai = new OpenAI({ apiKey: OPEN_AI_API_KEY, dangerouslyAllowBrowser: true });

// This would be replaced with actual GPT-3 API integration
export const getMoodMatchedRecipeType = async (moodAnalysis: MoodAnalysis): Promise<RecipeType> => {
  // Compose a prompt for GPT to recommend a recipe type based on mood analysis
  const prompt = `Given the following mood analysis, recommend a recipe type (e.g. comfort food, fresh and vibrant, spicy and robust, etc.), a reason for your choice, an estimated preparation time (quick, medium, lengthy), a complexity (simple, moderate, complex), and a comfort score (1-10).

Mood analysis:
${JSON.stringify(moodAnalysis, null, 2)}

Respond in JSON with keys: type, reason, preparationTime, complexity, comfort.`;

  const chatRes = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful culinary assistant.' },
      { role: 'user', content: prompt }
    ],
    response_format: { type: 'json_object' },
    max_tokens: 300,
    temperature: 0.7,
  });

  let recipeType: RecipeType;
  try {
    const content = chatRes.choices[0].message.content ?? '{}';
    recipeType = JSON.parse(content);
  } catch (e) {
    // fallback: use neutral
    recipeType = {
      type: 'balanced and nourishing',
      reason: 'A well-rounded dish complements your balanced state',
      preparationTime: 'medium',
      complexity: 'moderate',
      comfort: 6,
    };
  }
  return recipeType;
};

export const getRecipeVideoUrl = async (recipeTitle: string): Promise<string | null> => {
  // Try up to 3 different prompts to maximize chance of finding a video
  const prompts = [
    `Find a YouTube video URL for the following recipe. If no video exists, reply with "NO_VIDEO". Recipe: ${recipeTitle}`,
    `Find a YouTube video URL for the following recipe. If no video exists, reply with "NO_VIDEO". Recipe: ${recipeTitle} recipe`,
    `Find a YouTube cooking video for: ${recipeTitle}. If no video exists, reply with "NO_VIDEO".`
  ];

  for (let i = 0; i < prompts.length; i++) {
    const prompt = prompts[i];
    const chatRes = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that finds YouTube recipe videos.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 100,
      temperature: 0.2,
    });
    const content = chatRes.choices[0].message.content?.trim() || '';
    if (content.includes('NO_VIDEO')) continue;
    // Try to extract a YouTube URL
    const urlMatch = content.match(/https?:\/\/(www\.)?youtube\.com\S+|https?:\/\/(www\.)?youtu\.be\S+/);
    if (urlMatch) return urlMatch[0];
  }
  return null;
};