import { ArrowUp, Square } from "lucide-react";
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
      onSend(input.trim());
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
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  };

  const isEmpty = !input.trim();

  return (
    <div
      style={{
        width: "100%",
        borderRadius: "16px",
        border: "1px solid #222",
        background: "#111",
        transition: "border-color 0.15s",
        overflow: "hidden",
      }}
      onFocusCapture={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "#333";
      }}
      onBlurCapture={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "#222";
      }}
    >
      {/* Textarea */}
      <div style={{ padding: "14px 16px 0" }}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            handleInput();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          rows={1}
          disabled={isLoading}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            resize: "none",
            color: "#e0e0e0",
            fontSize: "15px",
            lineHeight: "1.6",
            fontFamily: "'DM Sans', system-ui, sans-serif",
            maxHeight: "160px",
            overflowY: "auto",
          }}
        />
        {/* Placeholder style override */}
        <style>{`
          textarea::placeholder { color: #3a3a3a; }
          textarea::-webkit-scrollbar { width: 3px; }
          textarea::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 4px; }
        `}</style>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 12px",
        }}
      >
        <span style={{ fontSize: "11px", color: "#2e2e2e", letterSpacing: "0.03em" }}>
          Shift + Enter for new line
        </span>

        <button
          onClick={handleSend}
          disabled={isEmpty && !isLoading}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "10px",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: isEmpty && !isLoading ? "not-allowed" : "pointer",
            background: isLoading
              ? "rgba(32,178,170,0.1)"
              : isEmpty
              ? "#1a1a1a"
              : "#20b2aa",
            color: isLoading
              ? "#20b2aa"
              : isEmpty
              ? "#333"
              : "#fff",
            transition: "all 0.15s",
            flexShrink: 0,
          }}
        >
          {isLoading ? (
            <Square size={12} fill="currentColor" />
          ) : (
            <ArrowUp size={15} strokeWidth={2.5} />
          )}
        </button>
      </div>
    </div>
  );
}