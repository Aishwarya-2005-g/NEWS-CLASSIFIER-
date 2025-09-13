import { GoogleGenAI, Type } from "@google/genai";
import { NEWS_TOPICS } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API key is not set. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const classifyArticle = async (content: string, imageBase64: string, imageMimeType: string): Promise<string[]> => {
  if (!API_KEY) {
    console.warn("No API Key, returning mock classification.");
    // Return mock data if API key is not available
    const shuffled = [...NEWS_TOPICS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * 3) + 1);
  }

  try {
    const textPart = {
      text:`
        Analyze the following news article content and its accompanying image.
        Classify the article into the most relevant topics from the provided list.
        Base your classification on both the text and the visual context from the image.
        Return only the topics that are strongly represented.

        Article Content:
        ---
        ${content}
        ---

        Available Topics:
        ${NEWS_TOPICS.join(', ')}
      `
    };

    const imagePart = {
      inlineData: {
        mimeType: imageMimeType,
        data: imageBase64,
      },
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [textPart, imagePart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topics: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                enum: NEWS_TOPICS,
                description: 'A relevant topic from the list provided.'
              },
              description: 'A list of relevant topics for the article, based on text and image.'
            }
          },
        },
      },
    });
    
    const jsonString = response.text;
    const result = JSON.parse(jsonString);

    if (result && Array.isArray(result.topics)) {
      return result.topics;
    }

    return [];
  } catch (error) {
    console.error("Error classifying article with Gemini:", error);
    // Fallback to mock data on API error
    const shuffled = [...NEWS_TOPICS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * 2) + 1);
  }
};