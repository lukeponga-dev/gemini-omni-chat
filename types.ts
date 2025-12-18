export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  images?: string[]; // Base64 strings. For User: Input images. For Model: Generated images.
  isThinking?: boolean;
  groundingSources?: GroundingSource[];
  timestamp: number;
}

export interface AppConfig {
  model: string;
  temperature: number;
  useGrounding: boolean;
  useThinking: boolean;
  thinkingBudget: number;
}

export const DEFAULT_CONFIG: AppConfig = {
  model: 'gemini-3-flash-preview',
  temperature: 0.7,
  useGrounding: false,
  useThinking: false,
  thinkingBudget: 16384, // Default reasonable budget
};

export const AVAILABLE_MODELS = [
  { 
    id: 'gemini-2.5-flash-lite', 
    name: 'Gemini 2.5 Flash Lite',
    badge: 'Lite',
    description: 'Extremely fast and cost-effective for simple tasks.'
  },
  { 
    id: 'gemini-3-flash-preview', 
    name: 'Gemini 3 Flash',
    badge: 'Fast',
    description: 'Best for speed, efficiency, and everyday tasks.'
  },
  { 
    id: 'gemini-3-pro-preview', 
    name: 'Gemini 3 Pro',
    badge: 'Reasoning + Vision',
    description: 'Best for complex problems, coding, analysis, and visual understanding.'
  },
  { 
    id: 'gemini-code-assistant', 
    name: 'Gemini 3 Coding',
    badge: 'Dev Mode',
    description: 'Specialized for programming, debugging, and software architecture.'
  },
  {
    id: 'gemini-2.5-flash-image',
    name: 'Gemini 2.5 Flash Image',
    badge: 'Image Editing',
    description: 'Specialized for editing images and generating visual content.'
  }
];