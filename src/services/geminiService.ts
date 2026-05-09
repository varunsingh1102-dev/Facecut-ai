import { GoogleGenAI, Type } from "@google/genai";
import { FacialAnalysis, RecommendationSet } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const analyzeFace = async (imageBase64: string): Promise<FacialAnalysis> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `Analyze this front-facing selfie in extreme detail for a premium grooming AI. 
  Provide a professional, clear, and encouraging summary of their facial architecture. 
  Avoid overly technical jargon and focus on what makes their face unique.
  
  Result in JSON format:
  {
    "faceShape": "oval | round | square | diamond | oblong | heart | triangle",
    "jawline": "Detailed description (e.g., 'Strong and defined', 'Softly rounded')",
    "forehead": "Description (e.g., 'Broad', 'Narrow')",
    "cheekbones": "Description (e.g., 'High and prominent', 'Subtle')",
    "hairline": "Description (e.g., 'Straight', 'Widow\\'s peak')",
    "beardCompatibility": "Advice on whether a beard would suit this structure.",
    "symmetry": 0-100,
    "proportions": "A clear explanation of their facial balance.",
    "skinTone": "Brief description for color matching.",
    "eyeShape": "Description.",
    "noseStructure": "Description.",
    "summaryAnalysis": "A comprehensive 3-4 sentence analysis that is easy to understand and explains their key structural features.",
    "confidenceScores": { "shape": 0-100, "features": 0-100, "overall": 0-100 },
    "tips": ["Clear, actionable grooming tip 1", "tip 2", "tip 3"]
  }`;

  const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;

  const result = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { inlineData: { mimeType: "image/jpeg", data: base64Data } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
    }
  });

  return JSON.parse(result.text || '{}');
};

export const getRecommendations = async (analysis: FacialAnalysis, gender: 'male' | 'female', hairType: string): Promise<RecommendationSet> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `Based on this facial analysis: ${JSON.stringify(analysis)} for a ${gender} with ${hairType} hair.
  Recommend 3 best hairstyles to opt for (in detail) and 2 styles to strictly avoid.
  
  IMPORTANT: For "imageUrl", you MUST use one of these high-quality Unsplash IDs that matches the style best:
  - Buzz Cut: photo-1621605815971-fbc98d665033
  - Texture/Quiff: photo-1599351431202-1e0f0137899a
  - Modern Fade: photo-1583035139031-bb66627bad1d
  - Sharp Part/Classic: photo-1618331835717-801e976710b2
  - Long/Flow: photo-1599566150163-29194dcaad36
  - Curly/Volume: photo-1503951914875-452162b0f3f1
  - Slicked: photo-1563229871-331ba18606ce
  
  Format the URL as: https://images.unsplash.com/[ID]?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80
  If none of these fit perfectly, use photo-1517832606299-7ae9b720a186
  
  For each "bestStyle", include:
  1. "name": The common name of the haircut.
  2. "description": A simple, clear 1-2 sentence description of the style.
  3. "whyItWorks": A detailed explanation (3-4 sentences) explaining why this style complements their specific face shape and features (e.g., "The volume on top balances your strong jawline...").
  4. "imageUrl": A high-quality Unsplash image URL that matches this specific haircut.
  
  For "avoidStyles", explain exactly why it would conflict with their facial structure.
  
  Format as JSON:
  {
    "bestStyles": [{ 
      "id": "uuid",
      "name": "...", 
      "description": "...",
      "whyItWorks": "...",
      "tags": ["trendy", "classic", "etc"],
      "imageUrl": "..."
    }],
    "avoidStyles": [{ 
      "id": "uuid",
      "name": "...", 
      "description": "Clear explanation of why this specific cut is not recommended for their face shape."
    }],
    "celebrityInspiration": ["Celebrity Name 1", "Celebrity Name 2"],
    "beardpairing": "Specific beard advice for this face shape.",
    "fadeSuggestions": "Detailed advice on tapers/fades/lengths."
  }`;

  const result = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    }
  });

  return JSON.parse(result.text || '{}');
};
