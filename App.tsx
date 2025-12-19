import React, { useState, useEffect } from 'react';
import { Menu, Sparkles, History, SquarePen } from 'lucide-react';
import Sidebar from './components/Sidebar';
import MessageList from './components/MessageList';
import InputArea from './components/InputArea';
import SnowBackground from './components/SnowBackground';
import { geminiService, fileToGenerativePart } from './services/geminiService';
import { Message, Role, AppConfig, DEFAULT_CONFIG, AVAILABLE_MODELS } from './types';

const STORAGE_KEY = 'gemini_omni_chat_history';

function App() {
  // Initialize messages from localStorage
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load chat history:', error);
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Persist messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save chat history (likely quota exceeded):', error);
    }
  }, [messages]);

  const handleSendMessage = async (text: string, files: File[]) => {
    // Optimistic UI update
    const userMessageId = Date.now().toString();

    // Process images for state display (convert to base64)
    let base64Images: string[] = [];
    if (files.length > 0) {
      const parts = await Promise.all(files.map(fileToGenerativePart));
      base64Images = parts.map(p => p.inlineData.data);
    }

    const userMessage: Message = {
      id: userMessageId,
      role: Role.USER,
      text: text,
      images: base64Images,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Create placeholder for bot response
    const botMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      {
        id: botMessageId,
        role: Role.MODEL,
        text: '',
        timestamp: Date.now()
      }
    ]);

    try {
      const stream = geminiService.streamMessage(text, files, config, messages);

      let accumulatedText = '';
      let accumulatedImages: string[] = [];

      for await (const chunk of stream) {
        accumulatedText += chunk.text;

        if (chunk.generatedImages) {
          // Add new images to our list if they aren't already there (simple check)
          // Note: Usually images come in one chunk, but robustly append if needed.
          accumulatedImages = [...accumulatedImages, ...chunk.generatedImages];
        }

        setMessages((prev) => prev.map(msg => {
          if (msg.id === botMessageId) {
            return {
              ...msg,
              text: accumulatedText,
              images: accumulatedImages.length > 0 ? accumulatedImages : undefined,
              // Merge grounding sources if any new ones appear
              groundingSources: chunk.groundingSources ?
                [...(msg.groundingSources || []), ...chunk.groundingSources]
                  // Simple deduplication based on URI
                  .filter((v, i, a) => a.findIndex(t => t.uri === v.uri) === i)
                : msg.groundingSources
            };
          }
          return msg;
        }));
      }

    } catch (error: any) {
      console.error("Error processing message:", error);

      let errorMessage = "Sorry, an unexpected error occurred. Please try again.";
      const errString = error.toString();

      if (error.message === "MISSING_API_KEY") {
        errorMessage = "⚠️ Configuration Error: API Key is missing. Please set `process.env.API_KEY`.";
      } else if (errString.includes("403") || errString.includes("API key not valid")) {
        errorMessage = "⚠️ Access Denied: Invalid API Key. Please check your credentials.";
      } else if (errString.includes("429")) {
        errorMessage = "⚠️ Rate Limit Exceeded: You are sending requests too quickly.";
      } else if (errString.includes("503") || errString.includes("500") || errString.includes("Overloaded")) {
        errorMessage = "⚠️ Service Unavailable: The model is currently overloaded. Please try again later.";
      } else if (errString.includes("SAFETY")) {
        errorMessage = "⚠️ Safety Block: The response was blocked due to safety settings.";
      }

      // Update the placeholder message with the error message
      setMessages((prev) => prev.map(msg =>
        msg.id === botMessageId
          ? { ...msg, text: errorMessage }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    // The useEffect will handle clearing the localStorage
  };

  const currentModelName = AVAILABLE_MODELS.find(m => m.id === config.model)?.name || config.model;

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-zinc-950 text-zinc-100 font-sans selection:bg-blue-500/30 relative">
      <SnowBackground />

      <Sidebar
        config={config}
        setConfig={setConfig}
        onClearChat={handleClearChat}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Removed bg-zinc-950 from main to allow snow to show through */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Header - Improved for Android safe areas and navigation */}
        <header className="pt-[env(safe-area-inset-top)] border-b border-zinc-800/40 bg-zinc-950/80 backdrop-blur-2xl z-20 flex-shrink-0 sticky top-0 transition-all duration-300">
          <div className="h-14 md:h-16 flex items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-3 md:hidden">
              <button
                className="p-2.5 -ml-2 text-zinc-400 hover:text-white rounded-xl active:bg-zinc-800/80 transition-all active:scale-90"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Open Menu"
              >
                <Menu size={22} strokeWidth={2.5} />
              </button>

              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 tracking-tight drop-shadow-[0_0_12px_rgba(34,211,238,0.3)]">
                  Gemini Omni
                </span>
                <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest -mt-1 opacity-80">
                  AI Assistant
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <span className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 tracking-tight">
                Gemini Omni
              </span>
            </div>

            {/* Model Badge & Quick Actions */}
            <div className="flex items-center gap-3">
              {/* Reset/New Chat Button - Visible on mobile for quick access */}
              <button
                className="p-2 text-zinc-500 hover:text-white rounded-lg active:bg-zinc-800/50 transition-colors md:hidden"
                onClick={handleClearChat}
                aria-label="New Chat"
              >
                <SquarePen size={18} />
              </button>

              <button
                onClick={() => setIsSidebarOpen(true)}
                className="group relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-cyan-500/20 hover:border-cyan-400/50 hover:bg-zinc-800 text-cyan-200 transition-all cursor-pointer shadow-sm shadow-cyan-500/5 active:scale-95"
              >
                <div className="relative">
                  <span className={`block w-2 h-2 rounded-full ${isLoading ? 'bg-cyan-400 animate-pulse' : 'bg-cyan-400'} shadow-[0_0_8px_rgba(34,211,238,0.6)]`}></span>
                  {isLoading && <span className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-75"></span>}
                </div>
                <span className="text-[11px] md:text-xs font-bold truncate max-w-[100px] md:max-w-none tracking-tight">
                  {currentModelName}
                </span>
                {(config.useThinking || config.useGrounding) && config.model !== 'gemini-2.5-flash-image' && (
                  <div className="flex gap-1 pl-2 border-l border-zinc-700 ml-1">
                    {config.useThinking && <span className="text-[10px]" title="Thinking Enabled">🧠</span>}
                    {config.useGrounding && <span className="text-[10px]" title="Search Enabled">🌐</span>}
                  </div>
                )}
              </button>
            </div>
          </div>
        </header>

        <MessageList
          messages={messages}
          isLoading={isLoading}
          currentModel={config.model}
          onExampleClick={(text) => handleSendMessage(text, [])}
        />

        <InputArea
          onSendMessage={handleSendMessage}
          disabled={isLoading}
          model={config.model}
        />
      </main>
    </div>
  );
}

export default App;