import React, { useState } from 'react';
import { Settings, Zap, Brain, Globe, Trash2, Loader2, Image as ImageIcon, X } from 'lucide-react';
import { AppConfig, AVAILABLE_MODELS, DEFAULT_CONFIG } from '../types';

interface SidebarProps {
  config: AppConfig;
  setConfig: (config: AppConfig) => void;
  onClearChat: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ config, setConfig, onClearChat, isOpen, setIsOpen }) => {
  const [switchingModelId, setSwitchingModelId] = useState<string | null>(null);

  const handleModelSelect = (modelId: string) => {
    if (modelId === config.model) return;
    setSwitchingModelId(modelId);

    // Simulate a brief loading state for better UX
    setTimeout(() => {
      // Reset budget if switching to a model with lower limit
      let newBudget = config.thinkingBudget;
      const maxBudget = getMaxThinkingBudget(modelId);
      if (newBudget > maxBudget) {
        newBudget = maxBudget;
      }

      setConfig({ ...config, model: modelId, thinkingBudget: newBudget });
      setSwitchingModelId(null);
      // On mobile, auto-close sidebar after selection for convenience
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    }, 600);
  };

  const getMaxThinkingBudget = (modelId: string) => {
    // Gemini 3 Pro and Coding Assistant support up to 32k
    if (modelId.includes('pro') || modelId === 'gemini-code-assistant') return 32768;
    // Flash and Lite typically support up to 24k (using 24576 from guidelines)
    return 24576;
  };

  const maxBudget = getMaxThinkingBudget(config.model);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <div className={`fixed inset-y-0 left-0 w-80 bg-zinc-950 border-r border-zinc-900/50 transform transition-transform duration-300 ease-out z-30 flex flex-col shadow-2xl shadow-black/50 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="pt-[env(safe-area-inset-top)] px-5 py-6 border-b border-zinc-900/50 flex items-center justify-between bg-zinc-950/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Zap className="text-white fill-current" size={20} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-extrabold text-zinc-100 tracking-tight leading-none">Gemini Omni</h1>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Settings & History</span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-zinc-500 hover:text-white p-2 hover:bg-zinc-900 rounded-full transition-all"
            aria-label="Close sidebar"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-8">

          {/* Model Selection */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Model</label>
            <div className="space-y-3">
              {AVAILABLE_MODELS.map((model) => {
                const isSelected = config.model === model.id;
                const isLoading = switchingModelId === model.id;

                return (
                  <button
                    key={model.id}
                    onClick={() => handleModelSelect(model.id)}
                    disabled={!!switchingModelId}
                    className={`w-full text-left p-3 rounded-xl border transition-all duration-200 group relative overflow-hidden ${isSelected
                      ? 'bg-zinc-800 border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/20'
                      : 'bg-zinc-900/30 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
                      } ${!!switchingModelId && !isLoading ? 'opacity-40 cursor-not-allowed grayscale' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-semibold text-sm flex items-center gap-2 ${isSelected ? 'text-blue-400' : 'text-zinc-300 group-hover:text-zinc-200'}`}>
                        {model.name}
                        {isLoading && <Loader2 size={14} className="animate-spin text-blue-400 ml-auto" />}
                      </span>
                      {model.badge && !isLoading && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-bold ${isSelected
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-zinc-800 text-zinc-500 group-hover:bg-zinc-700'
                          }`}>
                          {model.badge}
                        </span>
                      )}
                    </div>
                    <div className={`text-xs leading-relaxed ${isSelected ? 'text-zinc-400' : 'text-zinc-500 group-hover:text-zinc-400'}`}>
                      {model.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Capabilities */}
          <div className="space-y-4">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Capabilities</label>

            {/* Thinking Toggle */}
            <div className={`flex items-start justify-between gap-4 ${config.model === 'gemini-2.5-flash-image' ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-zinc-200 text-sm font-medium">
                  <Brain size={16} className="text-purple-400" />
                  Thinking
                </div>
                <p className="text-xs text-zinc-500 mt-1">Enable extended reasoning process (Gemini 3+)</p>
              </div>
              <button
                onClick={() => setConfig({ ...config, useThinking: !config.useThinking })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.useThinking ? 'bg-purple-600' : 'bg-zinc-700'
                  }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.useThinking ? 'translate-x-6' : 'translate-x-1'
                  }`} />
              </button>
            </div>

            {config.useThinking && config.model !== 'gemini-2.5-flash-image' && (
              <div className="pl-6 border-l-2 border-zinc-800 ml-1 space-y-2 animate-in slide-in-from-left-2 duration-200">
                <label className="text-xs text-zinc-400 block">Thinking Budget (Tokens)</label>
                <input
                  type="range"
                  min="1024"
                  max={maxBudget}
                  step="1024"
                  value={config.thinkingBudget}
                  onChange={(e) => setConfig({ ...config, thinkingBudget: parseInt(e.target.value) })}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-zinc-400 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:bg-zinc-200"
                />
                <div className="text-right text-xs text-zinc-500 font-mono flex justify-between">
                  <span>1k</span>
                  <span>{config.thinkingBudget}</span>
                  <span>{maxBudget >= 1000 ? (maxBudget / 1000) + 'k' : maxBudget}</span>
                </div>
              </div>
            )}

            {/* Grounding Toggle */}
            <div className={`flex items-start justify-between gap-4 ${config.model === 'gemini-2.5-flash-image' ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-zinc-200 text-sm font-medium">
                  <Globe size={16} className="text-blue-400" />
                  Google Search
                </div>
                <p className="text-xs text-zinc-500 mt-1">Connect to real-time information</p>
              </div>
              <button
                onClick={() => setConfig({ ...config, useGrounding: !config.useGrounding })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.useGrounding ? 'bg-blue-600' : 'bg-zinc-700'
                  }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.useGrounding ? 'translate-x-6' : 'translate-x-1'
                  }`} />
              </button>
            </div>

            {config.model === 'gemini-2.5-flash-image' && (
              <div className="text-xs text-yellow-500/80 mt-2 px-2 py-1 bg-yellow-900/10 border border-yellow-900/30 rounded">
                Note: Thinking and Search are not available with Image Editing model.
              </div>
            )}
          </div>
        </div>

        <div className="p-5 border-t border-zinc-900/50 pb-[max(20px,env(safe-area-inset-bottom))] bg-zinc-950/30">
          <button
            onClick={onClearChat}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-zinc-900/80 hover:bg-red-950/30 text-zinc-400 hover:text-red-400 border border-zinc-800/50 hover:border-red-900/40 rounded-xl transition-all text-sm font-bold active:scale-95 group"
          >
            <Trash2 size={18} className="transition-transform group-hover:rotate-12" />
            Clear Conversation
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;