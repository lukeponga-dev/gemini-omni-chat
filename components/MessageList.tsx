import React, { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Bot, Loader2, Link as LinkIcon, ExternalLink, Sparkles, Copy, Check } from 'lucide-react';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import { Message, Role } from '../types';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  currentModel: string;
  onExampleClick: (text: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading, currentModel, onExampleClick }) => {
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Render the empty state if there are no messages
  if (messages.length === 0) {
    const isPro = currentModel.includes('pro');
    const isImage = currentModel.includes('image');
    const isLite = currentModel.includes('lite');
    const isCoding = currentModel === 'gemini-code-assistant';

    // Contextual examples based on model type
    let examples = [
      { title: "Continue Draft", prompt: "Help me finish the email I was writing about the project update.", icon: "✍️" },
      { title: "Summarize Link", prompt: "Summarize the key points from the article I just copied.", icon: "🔗" },
      { title: "Quick Idea", prompt: "Give me 5 creative names for a tech startup.", icon: "💡" }
    ];

    if (isCoding) {
      examples = [
        { title: "Debug This Error", prompt: "Explain this error: 'useEffect has a missing dependency'.", icon: "🐛" },
        { title: "Refactor Component", prompt: "Refactor this component to use React Hooks and optimize performance.", icon: "⚡" },
        { title: "Generate Tests", prompt: "Write Jest unit tests for a utility function that formats dates.", icon: "🧪" }
      ];
    } else if (isPro) {
      examples = [
        { title: "Deep Analysis", prompt: "Analyze the potential impact of AGI on the global job market over the next decade.", icon: "🧠" },
        { title: "Visual Reasoning", prompt: "Upload an image of a code snippet and explain what it does.", icon: "👁️" },
        { title: "Complex Problem", prompt: "Explain the relationship between quantum mechanics and consciousness.", icon: "🔬" }
      ];
    } else if (isImage) {
      examples = [
        { title: "Edit Photo", prompt: "Upload a photo and say: 'Add a pair of sunglasses to the dog'.", icon: "🎨" },
        { title: "Style Transfer", prompt: "Upload a sketch and say: 'Turn this into a realistic 3D render'.", icon: "🖼️" },
        { title: "Remove Object", prompt: "Upload a photo and say: 'Remove the person in the background'.", icon: "✂️" }
      ];
    } else if (isLite) {
      examples = [
        { title: "Quick Answer", prompt: "What is the capital of France?", icon: "❓" },
        { title: "Fix Grammar", prompt: "Fix the grammar in this sentence: 'I goes to store yesterday'.", icon: "📝" },
        { title: "Simple List", prompt: "List 5 fruits that are red.", icon: "📋" }
      ];
    }

    return (
      <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 p-4 md:p-8 animate-in fade-in duration-500 overflow-y-auto">
        <div className="w-12 h-12 md:w-16 md:h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-xl border border-zinc-800 group shrink-0 mt-auto md:mt-0">
          <Bot size={24} className="text-zinc-600 group-hover:text-blue-400 transition-colors md:w-8 md:h-8" />
        </div>
        <h2 className="text-lg md:text-xl font-semibold text-zinc-300 mb-2 text-center">Gemini Omni</h2>
        <p className="max-w-md text-center text-zinc-500 mb-6 md:mb-8 text-xs md:text-sm px-4 leading-relaxed">
          You are using <span className="text-zinc-300 font-medium">
            {isCoding ? 'Gemini 3 Coding' : isPro ? 'Gemini 3 Pro' : isImage ? 'Gemini 2.5 Flash Image' : isLite ? 'Gemini 2.5 Flash Lite' : 'Gemini 3 Flash'}
          </span>.
          <span className="block mt-1 opacity-80">
            {isCoding
              ? 'Specialized for programming & architecture.'
              : isPro
                ? 'Complex reasoning, coding & visual analysis.'
                : isImage
                  ? 'Edit images and generate advanced visuals.'
                  : isLite
                    ? 'Fast, low-latency, and simple tasks.'
                    : 'Speed, efficiency & everyday tasks.'}
          </span>
        </p>

        <div className="grid grid-cols-1 gap-2.5 w-full max-w-2xl px-2 mb-4">
          {examples.map((ex, i) => (
            <button
              key={i}
              onClick={() => {
                // Haptic feedback (soft vibration)
                if ('vibrate' in navigator) {
                  navigator.vibrate(5);
                }
                onExampleClick(ex.prompt);
              }}
              className="flex items-center gap-3 p-3.5 bg-gradient-to-br from-zinc-900/60 to-zinc-900/40 hover:from-zinc-800 hover:to-zinc-800/80 border border-zinc-800 hover:border-purple-500/30 rounded-xl text-left transition-all group active:scale-[0.98] shadow-lg hover:shadow-purple-500/10"
            >
              <div className="text-2xl group-hover:scale-110 transition-transform">
                {(ex as any).icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-zinc-200 group-hover:text-purple-200 truncate">{ex.title}</div>
                <div className="text-[10px] md:text-xs text-zinc-500 line-clamp-1 group-hover:text-zinc-400">{ex.prompt}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Recent Chats / Pinned Prompts Section */}
        <div className="w-full max-w-2xl px-2 mb-auto md:mb-0">
          <div className="text-xs font-medium text-zinc-400 mb-2 px-1">Recent Chats</div>
          <div className="flex flex-col gap-1.5">
            <button className="flex items-center gap-2 p-2.5 bg-zinc-900/30 hover:bg-zinc-800/50 border border-zinc-800/50 hover:border-zinc-700 rounded-lg text-left transition-all group text-xs text-zinc-400 hover:text-zinc-300">
              <span className="opacity-50">💬</span>
              <span className="truncate">No recent chats yet</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Row renderer for Virtuoso
  const renderMessage = (index: number, msg: Message) => {
    return (
      <div className={`pb-4 md:pb-6 px-3 md:px-4 ${index === 0 ? 'pt-4' : ''}`}>
        <div
          className={`flex gap-2.5 md:gap-4 max-w-4xl mx-auto ${msg.role === Role.USER ? 'flex-row-reverse' : ''}`}
        >
          {/* Avatar */}
          <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${msg.role === Role.USER ? 'bg-zinc-800' : 'bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-purple-500/20'
            }`}>
            {msg.role === Role.USER ? <User size={14} className="md:w-4 md:h-4" /> : <Bot size={14} className="md:w-4 md:h-4 text-white" />}
          </div>

          {/* Content */}
          <div className={`flex flex-col gap-1.5 max-w-[85%] md:max-w-[80%] ${msg.role === Role.USER ? 'items-end' : 'items-start'}`}>

            {/* Images */}
            {msg.images && msg.images.length > 0 && (
              <div className={`flex flex-wrap gap-2 mb-1 ${msg.role === Role.USER ? 'justify-end' : 'justify-start'}`}>
                {msg.images.map((imgBase64, idx) => (
                  <img
                    key={idx}
                    src={`data:image/png;base64,${imgBase64}`}
                    alt="Content"
                    className="max-w-full md:max-w-[280px] max-h-[300px] rounded-2xl border border-zinc-800/50 object-cover bg-zinc-900"
                  />
                ))}
              </div>
            )}

            {/* Text Bubble */}
            {(msg.text || (msg.role === Role.MODEL && (!msg.images || msg.images.length === 0))) && (
              <div className={`px-4 py-2.5 md:px-5 md:py-3.5 rounded-2xl relative group min-w-[60px] shadow-sm ${msg.role === Role.USER
                ? 'bg-zinc-800 text-zinc-100 rounded-tr-none'
                : 'bg-zinc-900/50 text-zinc-200 rounded-tl-none border border-zinc-800'
                } ${msg.text ? 'pr-8 md:pr-10' : ''}`}>
                {msg.role === Role.MODEL && !msg.text && (!msg.images || msg.images.length === 0) ? (
                  <div className="flex items-center gap-2 text-zinc-500 text-sm">
                    <Loader2 size={14} className="animate-spin" />
                    <span className="text-xs">Thinking...</span>
                  </div>
                ) : (
                  <>
                    <div className="prose prose-invert prose-sm md:prose-base max-w-none prose-p:leading-relaxed prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-xl prose-pre:p-3 break-words">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>

                    {msg.text && (
                      <button
                        onClick={() => handleCopy(msg.text, msg.id)}
                        className={`absolute top-2 right-2 p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700/50 transition-all opacity-0 group-hover:opacity-100 mobile-copy-btn ${copiedId === msg.id ? '!text-green-500 !opacity-100' : ''}`}
                        title="Copy"
                      >
                        {copiedId === msg.id ? <Check size={12} /> : <Copy size={12} />}
                      </button>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Grounding Sources */}
            {msg.groundingSources && msg.groundingSources.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-2">
                {msg.groundingSources.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-[10px] md:text-xs text-blue-400 transition-colors"
                  >
                    <LinkIcon size={10} />
                    <span className="truncate max-w-[120px] md:max-w-[200px]">{source.title}</span>
                    <ExternalLink size={10} className="text-zinc-600" />
                  </a>
                ))}
              </div>
            )}

            <span className="text-[9px] text-zinc-600 px-1 select-none opacity-50">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 h-full">
      <Virtuoso
        ref={virtuosoRef}
        data={messages}
        itemContent={renderMessage}
        initialTopMostItemIndex={messages.length - 1}
        followOutput="smooth"
        atBottomThreshold={60}
        className="scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
      />
    </div>
  );
};

export default MessageList;