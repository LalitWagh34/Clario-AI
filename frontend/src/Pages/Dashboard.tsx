import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/client";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { ChatInput } from "@/components/chat/ChatInput";
import { useChat } from "@/hooks/useChat";
import type { Message } from "@/hooks/useChat";
import {
  Loader2,
  Menu,
  X,
  Globe,
  Sparkles,
  ChevronRight,
  Copy,
  Check,
  Share2,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

const supabase = createClient();

// Source card
function SourceCard({ url, title, index }: { url: string; title?: string; index: number }) {
  const domain = (() => {
    try { return new URL(url).hostname.replace("www.", ""); }
    catch { return url; }
  })();
  const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "12px",
        borderRadius: "12px",
        border: "1px solid #222",
        background: "#161616",
        textDecoration: "none",
        transition: "all 0.15s",
        cursor: "pointer",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#1e1e1e"; (e.currentTarget as HTMLElement).style.borderColor = "#2e2e2e"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#161616"; (e.currentTarget as HTMLElement).style.borderColor = "#222"; }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <img src={favicon} alt="" style={{ width: "14px", height: "14px", borderRadius: "3px", flexShrink: 0 }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        <span style={{ fontSize: "11px", color: "#666", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{domain}</span>
        <span style={{ fontSize: "10px", color: "#444", fontFamily: "monospace", flexShrink: 0 }}>{index + 1}</span>
      </div>
      <span style={{ fontSize: "12px", fontWeight: 500, color: "#ccc", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: "1.5" }}>
        {title || domain}
      </span>
    </a>
  );
}

// Copy button
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      style={{
        display: "flex", alignItems: "center", gap: "6px",
        padding: "6px 10px", borderRadius: "8px",
        background: "transparent", border: "none",
        color: copied ? "#20b2aa" : "#555",
        cursor: "pointer", fontSize: "12px",
        transition: "all 0.15s",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#1e1e1e"; (e.currentTarget as HTMLElement).style.color = "#ccc"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = copied ? "#20b2aa" : "#555"; }}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      <span>{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

// Answer block
function AnswerBlock({
  message,
  isStreaming,
  onFollowUp,
}: {
  message: Message;
  isStreaming: boolean;
  onFollowUp: (q: string) => void;
}) {
  if (message.role === "user") {
    return (
      <div style={{ paddingTop: "32px", paddingBottom: "8px" }}>
        <h2 style={{
          fontSize: "22px", fontWeight: 600,
          color: "#f0f0f0", lineHeight: "1.4",
          fontFamily: "'DM Serif Display', Georgia, serif",
          margin: 0,
        }}>
          {message.content}
        </h2>
      </div>
    );
  }

  const sources: { url: string; title?: string }[] = message.sources || [];
  const followUps: string[] = message.followUps || [];

  return (
    <div style={{
      paddingBottom: "32px",
      marginBottom: "8px",
      borderBottom: "1px solid #1a1a1a",
    }}>
      {/* Sources */}
      {sources.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Globe size={13} style={{ color: "#555" }} />
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em" }}>Sources</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "8px" }}>
            {sources.slice(0, 4).map((s, i) => (
              <SourceCard key={i} url={s.url} title={s.title} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Answer */}
      <div style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
          <Sparkles size={13} style={{ color: "#20b2aa" }} />
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em" }}>Answer</span>
        </div>

        <div className="answer-md" style={{ fontSize: "15px", color: "#d0d0d0", lineHeight: "1.8" }}>
          {message.content ? (
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", margin: "20px 0 10px" }}>{children}</h1>,
                h2: ({ children }) => <h2 style={{ fontSize: "17px", fontWeight: 600, color: "#eee", margin: "18px 0 8px" }}>{children}</h2>,
                h3: ({ children }) => <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#ddd", margin: "14px 0 6px" }}>{children}</h3>,
                p: ({ children }) => <p style={{ margin: "0 0 14px", lineHeight: "1.8" }}>{children}</p>,
                ul: ({ children }) => <ul style={{ margin: "0 0 14px", paddingLeft: "0", listStyle: "none" }}>{children}</ul>,
                ol: ({ children }) => <ol style={{ margin: "0 0 14px", paddingLeft: "20px" }}>{children}</ol>,
                li: ({ children }) => (
                  <li style={{ display: "flex", gap: "10px", marginBottom: "8px", alignItems: "flex-start" }}>
                    <span style={{ color: "#20b2aa", flexShrink: 0, fontWeight: 700, marginTop: "1px" }}>•</span>
                    <span>{children}</span>
                  </li>
                ),
                strong: ({ children }) => <strong style={{ color: "#fff", fontWeight: 600 }}>{children}</strong>,
                em: ({ children }) => <em style={{ color: "#bbb", fontStyle: "italic" }}>{children}</em>,
                code: ({ children, className }) => {
                  const isBlock = className?.includes("language-");
                  return isBlock
                    ? <code style={{ display: "block", background: "#111", border: "1px solid #222", borderRadius: "10px", padding: "16px", fontSize: "13px", color: "#7ec8a0", fontFamily: "monospace", overflowX: "auto", margin: "12px 0" }}>{children}</code>
                    : <code style={{ background: "#1e1e1e", color: "#7ec8a0", padding: "2px 6px", borderRadius: "4px", fontSize: "13px", fontFamily: "monospace" }}>{children}</code>;
                },
                pre: ({ children }) => <pre style={{ margin: "12px 0" }}>{children}</pre>,
                blockquote: ({ children }) => <blockquote style={{ borderLeft: "2px solid #20b2aa", paddingLeft: "16px", margin: "12px 0", color: "#888", fontStyle: "italic" }}>{children}</blockquote>,
                a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: "#20b2aa", textDecoration: "none" }}>{children}</a>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          ) : null}
          {isStreaming && (
            <span style={{
              display: "inline-block", width: "2px", height: "16px",
              background: "#20b2aa", marginLeft: "2px",
              verticalAlign: "middle", borderRadius: "2px",
              animation: "pulse 1s infinite",
            }} />
          )}
        </div>

        {/* Actions */}
        {!isStreaming && message.content && (
          <div style={{
            display: "flex", alignItems: "center", gap: "4px",
            marginTop: "16px", paddingTop: "12px",
            borderTop: "1px solid #1a1a1a",
          }}>
            <CopyButton text={message.content} />
            <button
              style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 10px", borderRadius: "8px", background: "transparent", border: "none", color: "#555", cursor: "pointer", fontSize: "12px", transition: "all 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#1e1e1e"; (e.currentTarget as HTMLElement).style.color = "#ccc"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#555"; }}
            >
              <Share2 size={13} />
              <span>Share</span>
            </button>
            <div style={{ flex: 1 }} />
            <button
              style={{ padding: "6px", borderRadius: "8px", background: "transparent", border: "none", color: "#444", cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#4ade80"; (e.currentTarget as HTMLElement).style.background = "#1e1e1e"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#444"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <ThumbsUp size={13} />
            </button>
            <button
              style={{ padding: "6px", borderRadius: "8px", background: "transparent", border: "none", color: "#444", cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#f87171"; (e.currentTarget as HTMLElement).style.background = "#1e1e1e"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#444"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <ThumbsDown size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Follow-ups */}
      {followUps.length > 0 && !isStreaming && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <ChevronRight size={13} style={{ color: "#555" }} />
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em" }}>Related</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {followUps.map((q, i) => (
              <button
                key={i}
                onClick={() => onFollowUp(q)}
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "12px 16px", borderRadius: "12px",
                  border: "1px solid #1e1e1e", background: "#111",
                  cursor: "pointer", textAlign: "left",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#181818"; (e.currentTarget as HTMLElement).style.borderColor = "#2a2a2a"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#111"; (e.currentTarget as HTMLElement).style.borderColor = "#1e1e1e"; }}
              >
                <ChevronRight size={13} style={{ color: "#444", flexShrink: 0 }} />
                <span style={{ fontSize: "13px", color: "#888", lineHeight: "1.5" }}>{q}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Skeleton
function AnswerSkeleton() {
  return (
    <div style={{ paddingBottom: "32px" }}>
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <Globe size={13} style={{ color: "#555" }} />
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em" }}>Sources</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ height: "64px", borderRadius: "12px", background: "#161616", border: "1px solid #1e1e1e", animation: "pulse 1.5s infinite" }} />
          ))}
        </div>
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
          <Sparkles size={13} style={{ color: "#20b2aa" }} />
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em" }}>Answer</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[95, 80, 88, 65, 72].map((w, i) => (
            <div key={i} style={{ height: "14px", borderRadius: "8px", background: "#1a1a1a", width: `${w}%`, animation: `pulse 1.5s ${i * 80}ms infinite` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Home
const SUGGESTED = [
  "What are the latest AI breakthroughs in 2025?",
  "Explain how transformer models work",
  "Best practices for React performance",
  "What's happening in quantum computing?",
  "How does the human immune system work?",
  "Latest developments in renewable energy",
];

function HomeState({ onPrompt }: { onPrompt: (q: string) => void }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", height: "100%",
      padding: "0 16px 128px",
    }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "12px",
          marginBottom: "20px",
        }}>
          <div style={{
            width: "44px", height: "44px", borderRadius: "14px",
            background: "rgba(32,178,170,0.12)", border: "1px solid rgba(32,178,170,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Sparkles size={20} style={{ color: "#20b2aa" }} />
          </div>
        </div>
        <h1 style={{
          fontSize: "30px", fontWeight: 600,
          color: "#f0f0f0", margin: "0 0 10px",
          fontFamily: "'DM Serif Display', Georgia, serif",
          letterSpacing: "-0.5px",
        }}>
          Where knowledge begins
        </h1>
        <p style={{ fontSize: "14px", color: "#555", maxWidth: "340px", lineHeight: "1.6", margin: 0 }}>
          Ask anything. Clario searches the web and synthesizes a clear, sourced answer.
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: "520px" }}>
        <p style={{ fontSize: "11px", color: "#444", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: "12px", textAlign: "center" }}>
          Try asking
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {SUGGESTED.map((prompt) => (
            <button
              key={prompt}
              onClick={() => onPrompt(prompt)}
              style={{
                display: "flex", alignItems: "flex-start", gap: "10px",
                padding: "14px 16px", borderRadius: "12px",
                border: "1px solid #1a1a1a", background: "#111",
                cursor: "pointer", textAlign: "left", transition: "all 0.15s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#181818"; (e.currentTarget as HTMLElement).style.borderColor = "#262626"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#111"; (e.currentTarget as HTMLElement).style.borderColor = "#1a1a1a"; }}
            >
              <ChevronRight size={13} style={{ color: "#444", flexShrink: 0, marginTop: "2px" }} />
              <span style={{ fontSize: "13px", color: "#666", lineHeight: "1.5" }}>{prompt}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main
export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    conversations,
    currentConversation,
    messages,
    isLoading,
    error,
    fetchConversations,
    fetchConversation,
    sendMessage,
    sendFollowUp,
  } = useChat();

  useEffect(() => {
    async function getUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) navigate("/auth");
      else setUser(data.user);
      setUserLoading(false);
    }
    getUser();
  }, [navigate]);

  useEffect(() => {
    if (user) fetchConversations();
  }, [user, fetchConversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleSendMessage = async (query: string) => {
    if (currentConversation) await sendFollowUp(query);
    else await sendMessage(query);
  };

  const handleNewChat = () => {
    window.location.reload();
  };

  if (userLoading) {
    return (
      <div style={{ width: "100vw", height: "100vh", background: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 style={{ width: "20px", height: "20px", color: "#333", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'DM Sans', system-ui, sans-serif; background: #0d0d0d; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 4px; }
        .answer-md p:last-child { margin-bottom: 0; }
      `}</style>

      <div style={{ display: "flex", height: "100vh", background: "#0d0d0d", overflow: "hidden" }}>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 30, backdropFilter: "blur(4px)" }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div style={{
          position: "fixed",
          top: 0, left: 0, height: "100%", zIndex: 40,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s ease",
        }} className="md-sidebar">
          <style>{`
            @media (min-width: 768px) {
              .md-sidebar { position: static !important; transform: none !important; }
            }
          `}</style>
          <Sidebar
            user={user}
            conversations={conversations}
            activeConversationId={currentConversation?.id}
            onSelectConversation={(id) => { fetchConversation(id); setSidebarOpen(false); }}
            onCreate={handleNewChat}
            onSignOut={handleSignOut}
          />
        </div>

        {/* Main */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, position: "relative" }}>

          {/* Mobile topbar */}
          <div className="mobile-bar" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #1a1a1a" }}>
            <style>{`@media (min-width: 768px) { .mobile-bar { display: none !important; } }`}</style>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ padding: "8px", borderRadius: "8px", background: "transparent", border: "none", color: "#666", cursor: "pointer" }}>
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <span style={{ color: "#e0e0e0", fontWeight: 600, fontSize: "14px", fontFamily: "'DM Serif Display', serif" }}>Clario</span>
            <div style={{ width: "32px" }} />
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            <div style={{ maxWidth: "680px", margin: "0 auto", padding: "16px 20px" }}>
              {messages.length === 0 && !isLoading ? (
                <HomeState onPrompt={handleSendMessage} />
              ) : (
                <div style={{ paddingBottom: "160px" }}>
                  {messages.map((message, idx) => (
                    <AnswerBlock
                      key={idx}
                      message={message}
                      isStreaming={isLoading && idx === messages.length - 1 && message.role === "assistant"}
                      onFollowUp={handleSendMessage}
                    />
                  ))}

                  {isLoading && messages[messages.length - 1]?.role === "user" && <AnswerSkeleton />}

                  {error && (
                    <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", color: "#f87171", fontSize: "14px" }}>
                      {error}
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>

          {/* Input pinned */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "linear-gradient(to top, #0d0d0d 60%, transparent)",
            paddingTop: "48px", paddingBottom: "16px", paddingLeft: "16px", paddingRight: "16px",
          }}>
            <div style={{ maxWidth: "680px", margin: "0 auto" }}>
              <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
              <p style={{ textAlign: "center", fontSize: "11px", color: "#2a2a2a", marginTop: "10px", fontWeight: 500, letterSpacing: "0.04em" }}>
                Clario searches the web in real-time · Results may vary
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}