import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
}

export function ChatMessage({ message, isLoading }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = message.role === "user";

  return (
    <div
      className={`flex w-full mb-6 message-slide-in ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg group ${
          isUser
            ? "bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-2xl rounded-tr-none"
            : "glass-dark text-slate-100 rounded-2xl rounded-tl-none"
        } px-3 sm:px-4 py-3 shadow-lg`}
      >
        {/* Message content */}
        <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
          {isLoading && (
            <div className="loading-dots mt-2">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
        </div>

        {/* Copy button - only show on hover for assistant messages */}
        {!isUser && !isLoading && (
          <button
            onClick={copyToClipboard}
            className="mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs text-slate-400 hover:text-slate-200"
          >
            {copied ? (
              <>
                <Check size={14} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

/* Sources display component */
interface SourcesProps {
  sources: Array<{ url: string }>;
  isLoading?: boolean;
}

export function Sources({ sources, isLoading }: SourcesProps) {
  const [expanded, setExpanded] = useState(false);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-4 sm:mt-6 mb-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors"
      >
        <span>📚 Sources ({sources.length})</span>
        <span className={`text-xs transform transition-transform ${expanded ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {expanded && (
        <div className="mt-2 sm:mt-3 space-y-2">
          {sources.map((source, idx) => (
            <a
              key={idx}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xs text-cyan-400 hover:text-cyan-300 break-all py-2 px-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/50 transition-colors"
            >
              {source.url}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
