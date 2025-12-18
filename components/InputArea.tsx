import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, X, Loader2 } from 'lucide-react';

interface InputAreaProps {
  onSendMessage: (text: string, images: File[]) => void;
  disabled: boolean;
  model?: string;
}

// Sub-component for individual image preview to handle memory cleanup
const ImagePreview = ({ file, onRemove }: { file: File, onRemove: () => void }) => {
  const [preview, setPreview] = useState<string>('');

  useEffect(() => {
    // Create object URL for preview
    const url = URL.createObjectURL(file);
    setPreview(url);
    
    // Cleanup URL on unmount or file change to prevent memory leaks
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!preview) return null;

  return (
    <div className="relative group flex-shrink-0 animate-in fade-in zoom-in duration-200">
      <img 
        src={preview} 
        alt="preview" 
        className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-lg border border-zinc-700 bg-zinc-800" 
      />
      <button 
        onClick={(e) => {
            e.stopPropagation(); // Prevent event bubbling
            onRemove();
        }}
        className="absolute -top-1.5 -right-1.5 bg-zinc-800 rounded-full p-1 text-zinc-400 hover:text-red-400 border border-zinc-700 shadow-sm transition-colors hover:bg-zinc-700 z-10"
        title="Remove image"
        type="button"
      >
        <X size={10} />
      </button>
    </div>
  );
};

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, disabled, model }) => {
  const [text, setText] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [text]);

  const handleSend = () => {
    if ((!text.trim() && images.length === 0) || disabled) return;
    onSendMessage(text, images);
    setText('');
    setImages([]);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...newFiles]);
    }
    // Reset input so same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const getPlaceholder = () => {
    if (model === 'gemini-2.5-flash-image') {
      if (images.length > 0) return "Describe edits...";
      return "Describe image or upload to edit...";
    }
    return "Message Gemini...";
  };

  return (
    <div className="border-t border-zinc-800/50 bg-zinc-950/80 backdrop-blur-lg p-3 md:p-4 z-20 pb-[max(12px,env(safe-area-inset-bottom))] transition-all duration-200">
      <div className="max-w-3xl mx-auto flex flex-col gap-3">
        
        {/* Image Previews */}
        {images.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent px-1">
            {images.map((img, i) => (
              <ImagePreview 
                key={`${img.name}-${i}`} 
                file={img} 
                onRemove={() => removeImage(i)} 
              />
            ))}
          </div>
        )}

        <div className="relative flex items-end gap-2 bg-zinc-900/50 p-1.5 md:p-2 rounded-2xl border border-zinc-800 focus-within:border-zinc-700 focus-within:bg-zinc-900 transition-all shadow-sm">
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-xl transition-colors flex-shrink-0 active:scale-95"
            title="Add images"
            disabled={disabled}
            aria-label="Upload images"
          >
            <ImageIcon size={20} strokeWidth={2} />
          </button>
          
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={getPlaceholder()}
            className="flex-1 bg-transparent text-zinc-100 placeholder-zinc-500 resize-none outline-none py-2.5 max-h-[120px] md:max-h-[200px] overflow-y-auto text-base md:text-sm leading-relaxed"
            rows={1}
            disabled={disabled}
          />
          
          <button 
            onClick={handleSend}
            disabled={(!text.trim() && images.length === 0) || disabled}
            className={`p-2.5 rounded-xl transition-all flex-shrink-0 active:scale-95 flex items-center justify-center ${
              (!text.trim() && images.length === 0) || disabled
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
                : 'bg-white text-black hover:bg-zinc-200 shadow-lg shadow-white/5'
            }`}
            aria-label="Send message"
          >
            {disabled ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} fill="currentColor" className="ml-0.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputArea;