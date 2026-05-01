import { Send, Loader } from "lucide-react";
import { useRef, useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  };

  return (
    <div className="w-full p-3 sm:p-4 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
      <div className="flex gap-2 sm:gap-3">
        <div className="flex-1 glass rounded-xl p-2 sm:p-3 flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              handleInput();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything... (Shift+Enter for new line)"
            rows={1}
            disabled={isLoading}
            className="flex-1 bg-transparent text-white placeholder-slate-500 resize-none focus:outline-none text-sm"
            style={{ maxHeight: "120px" }}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center flex-shrink-0 ${
              isLoading || !input.trim()
                ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg hover:shadow-cyan-500/50"
            }`}
          >
            {isLoading ? (
              <Loader size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
