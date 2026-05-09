
export interface FacialAnalysis {
  faceShape: 'oval' | 'round' | 'square' | 'diamond' | 'oblong' | 'heart' | 'triangle';
  jawline: string;
  forehead: string;
  cheekbones: string;
  hairline: string;
  beardCompatibility: string;
  symmetry: number; // 0-100
  proportions: string;
  skinTone: string;
  eyeShape: string;
  noseStructure: string;
  summaryAnalysis: string;
  confidenceScores: {
    shape: number;
    features: number;
    overall: number;
  };
  tips: string[];
}

export interface Hairstyle {
  id: string;
  name: string;
  description: string;
  whyItWorks?: string;
  category: 'men' | 'women';
  hairType: 'straight' | 'curly' | 'wavy';
  imageUrl: string;
  suitabilityScore: number;
  tags: string[];
}

export interface RecommendationSet {
  bestStyles: Hairstyle[];
  avoidStyles: Hairstyle[];
  celebrityInspiration: string[];
  beardpairing?: string;
  fadeSuggestions?: string;
}

export interface StylePreview {
  id: string;
  hairstyleName: string;
  imageUrl: string;
  beforeImageUrl: string;
}
