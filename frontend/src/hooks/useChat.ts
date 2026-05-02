import { useCallback, useState } from "react";
import { createClient } from "@/lib/client";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";

export interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Array<{ url: string; title?: string }>;
  followUps?: string[];
}

export interface Conversation {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  messages?: Message[];
}

// ── Stream parsers ────────────────────────────────────────────────────────────

/** Extract content between <ANSWER>...</ANSWER> */
function parseAnswer(raw: string): string {
  const match = raw.match(/<ANSWER>([\s\S]*?)<\/ANSWER>/);
  return match ? match[1].trim() : "";
}

/** Extract all <question>...</question> entries */
function parseFollowUps(raw: string): string[] {
  const matches = [...raw.matchAll(/<question>([\s\S]*?)<\/question>/g)];
  return matches.map((m) => m[1].trim());
}

/** Extract sources JSON between \nSources\n markers */
function parseSources(raw: string): Array<{ url: string; title?: string }> {
  const match = raw.match(/\nSources\n([\s\S]*?)\nSources\n/);
  if (!match) return [];
  try {
    return JSON.parse(match[1].trim());
  } catch {
    return [];
  }
}

/** Extract conversationId between \nConversationId\n markers */
function parseConversationId(raw: string): string | null {
  const match = raw.match(/\nConversationId\n([\s\S]*?)\nConversationId\n/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[1].trim());
    return parsed.conversationId ?? null;
  } catch {
    return null;
  }
}

/**
 * Extract the best partial answer while still streaming.
 * Once <ANSWER> opens, show everything inside it even if </ANSWER> hasn't arrived yet.
 */
function parsePartialAnswer(raw: string): string {
  // Full answer available
  const full = parseAnswer(raw);
  if (full) return full;

  // Partial — inside open <ANSWER> tag
  const openIdx = raw.indexOf("<ANSWER>");
  if (openIdx !== -1) {
    return raw.slice(openIdx + "<ANSWER>".length).trim();
  }

  return "";
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const getJWT = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    return data?.session?.access_token ?? "";
  }, []);

  // ── Fetch all conversations ──────────────────────────────────────────────
  const fetchConversations = useCallback(async () => {
    try {
      const jwt = await getJWT();
      const response = await axios.get(`${BACKEND_URL}/conversation`, {
        headers: { Authorization: jwt },
      });
      setConversations(response.data.conversations);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch conversations");
    }
  }, [getJWT]);

  // ── Fetch single conversation ────────────────────────────────────────────
  const fetchConversation = useCallback(
    async (conversationId: string) => {
      try {
        setIsLoading(true);
        const jwt = await getJWT();
        const response = await axios.get(
          `${BACKEND_URL}/conversation/${conversationId}`,
          { headers: { Authorization: jwt } }
        );
        const conversation = response.data.conversation;
        setCurrentConversation(conversation);
        const cleanedMessages = (conversation.messages || []).map((m: any) => ({
        role: m.role === "User" ? "user" : "assistant",
        content: m.role === "Assistant"
          ? (parseAnswer(m.content) || m.content)
          : m.content,
      }));
        setMessages(conversation.messages || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch conversation");
      } finally {
        setIsLoading(false);
      }
    },
    [getJWT]
  );

  // ── Stream helper ────────────────────────────────────────────────────────
  async function streamResponse(
    url: string,
    jwt: string,
    body: object,
    onChunk: (raw: string) => void
  ): Promise<string> {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: jwt,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let raw = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      raw += decoder.decode(value, { stream: true });
      onChunk(raw);
    }

    return raw;
  }

  // ── Send new message ─────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (query: string) => {
      try {
        setIsLoading(true);
        setError(null);
        const jwt = await getJWT();

        // Add user message immediately
        setMessages((prev) => [...prev, { role: "user", content: query }]);

        const raw = await streamResponse(
          `${BACKEND_URL}/Clario_ask`,
          jwt,
          { query },
          (rawSoFar) => {
            const partialAnswer = parsePartialAnswer(rawSoFar);
            if (!partialAnswer) return;

            setMessages((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              if (last?.role === "assistant") {
                next[next.length - 1] = { ...last, content: partialAnswer };
              } else {
                next.push({ role: "assistant", content: partialAnswer });
              }
              return next;
            });
          }
        );

        // Final parse — enrich assistant message with sources + follow-ups
        const finalAnswer = parseAnswer(raw);
        const sources = parseSources(raw);
        const followUps = parseFollowUps(raw);
        const conversationId = parseConversationId(raw);

        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last?.role === "assistant") {
            next[next.length - 1] = {
              ...last,
              content: finalAnswer || last.content,
              sources,
              followUps,
            };
          }
          return next;
        });

        // Set current conversation so follow-ups work
        if (conversationId) {
          setCurrentConversation({
            id: conversationId,
            title: query.slice(0, 100),
            slug: "",
            createdAt: new Date().toISOString(),
          });
          // Refresh sidebar list
          fetchConversations();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send message");
      } finally {
        setIsLoading(false);
      }
    },
    [getJWT, fetchConversations]
  );

  // ── Send follow-up ───────────────────────────────────────────────────────
  const sendFollowUp = useCallback(
    async (query: string) => {
      if (!currentConversation) return;

      try {
        setIsLoading(true);
        setError(null);
        const jwt = await getJWT();

        setMessages((prev) => [...prev, { role: "user", content: query }]);

        const raw = await streamResponse(
          `${BACKEND_URL}/Clario_ask/follow_up`,
          jwt,
          { conversationId: currentConversation.id, query },
          (rawSoFar) => {
            // Follow-up responses are plain text (no <ANSWER> tags from backend)
            // strip any stray markers and show progressively
            const cleaned = rawSoFar
              .replace(/\nConversationId\n[\s\S]*?\nConversationId\n/g, "")
              .trim();

            setMessages((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              if (last?.role === "assistant") {
                next[next.length - 1] = { ...last, content: cleaned };
              } else {
                next.push({ role: "assistant", content: cleaned });
              }
              return next;
            });
          }
        );

        // Final parse for follow-up (also goes through system prompt so has tags)
        const finalAnswer = parseAnswer(raw) || raw
          .replace(/\nSources\n[\s\S]*?\nSources\n/g, "")
          .replace(/\nConversationId\n[\s\S]*?\nConversationId\n/g, "")
          .trim();

        const followUps = parseFollowUps(raw);

        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last?.role === "assistant") {
            next[next.length - 1] = {
              ...last,
              content: finalAnswer,
              followUps,
            };
          }
          return next;
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send follow-up");
      } finally {
        setIsLoading(false);
      }
    },
    [currentConversation, getJWT]
  );

  return {
    conversations,
    currentConversation,
    messages,
    isLoading,
    error,
    fetchConversations,
    fetchConversation,
    sendMessage,
    sendFollowUp,
  };
}