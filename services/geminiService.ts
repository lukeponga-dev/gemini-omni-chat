import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AppConfig, Message, Role, GroundingSource } from "../types";

// Helper to convert File to Base64
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export class GeminiService {
  private ai: GoogleGenAI;
  private chatSession: any | null = null;

  constructor() {
    // API Key must be from process.env.API_KEY. 
    // We allow empty string here to avoid crash on load; validation happens in streamMessage.
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  private buildConfig(config: AppConfig) {
    const generationConfig: any = {
      temperature: config.temperature,
    };

    // Inject system instruction for the specialized coding model
    if (config.model === 'gemini-code-assistant') {
      generationConfig.systemInstruction = "You are an expert Senior Software Engineer and Architect. You write clean, efficient, secure, and well-documented code. You prefer modern patterns and best practices. Always include helpful code comments and generate documentation for complex logic. When explaining concepts, be concise but thorough. Always consider edge cases and performance implications.";
    }

    const tools: any[] = [];

    // Only add tools/thinking if NOT using the image model (it handles things differently or doesn't support them)
    // and if the feature is enabled.
    const isImageModel = config.model === 'gemini-2.5-flash-image';

    if (!isImageModel && config.useGrounding) {
      tools.push({ googleSearch: {} });
    }

    if (!isImageModel && config.useThinking) {
      // Thinking budget requires specific config structure
      generationConfig.thinkingConfig = {
        thinkingBudget: config.thinkingBudget
      };
    }

    return {
      ...generationConfig,
      tools: tools.length > 0 ? tools : undefined,
    };
  }

  async *streamMessage(
    message: string, 
    images: File[], 
    config: AppConfig,
    previousMessages: Message[]
  ): AsyncGenerator<{ text: string; groundingSources?: GroundingSource[]; generatedImages?: string[] }, void, unknown> {
    
    // Robust check for API Key presence
    if (!process.env.API_KEY) {
      throw new Error("MISSING_API_KEY");
    }

    // Map virtual models to real API models
    const actualModel = config.model === 'gemini-code-assistant' ? 'gemini-3-pro-preview' : config.model;

    // Always create a fresh chat session with the current config and history
    // This ensures that toggling tools (Thinking, Grounding) or changing models works immediately
    this.chatSession = this.ai.chats.create({
        model: actualModel,
        history: previousMessages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }] // Simplified history mapping. Note: History with images might need handling if we want multi-turn visual chat.
        })),
        config: this.buildConfig(config)
    });

    let contents: any;
    
    if (images.length > 0) {
      const imageParts = await Promise.all(images.map(fileToGenerativePart));
      // Construct parts array: images followed by text
      contents = [...imageParts, { text: message }];
    } else {
      contents = message;
    }

    // Send message stream
    const result = await this.chatSession.sendMessageStream({ 
        message: contents 
    });

    for await (const chunk of result) {
      const c = chunk as GenerateContentResponse;
      const text = c.text;
      
      let groundingSources: GroundingSource[] = [];
      
      // Extract grounding metadata if available
      const metadata = c.candidates?.[0]?.groundingMetadata;
      if (metadata?.groundingChunks) {
        metadata.groundingChunks.forEach((chunk: any) => {
          if (chunk.web?.uri) {
            groundingSources.push({
              title: chunk.web.title || "Source",
              uri: chunk.web.uri
            });
          }
        });
      }

      // Extract generated images (e.g. from gemini-2.5-flash-image)
      let generatedImages: string[] = [];
      const parts = c.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
            generatedImages.push(part.inlineData.data);
        }
      }

      yield { 
          text: text || '', 
          groundingSources: groundingSources.length > 0 ? groundingSources : undefined,
          generatedImages: generatedImages.length > 0 ? generatedImages : undefined
      };
    }
  }
}

export const geminiService = new GeminiService();