import { Plus, MessageSquare, Trash2 } from "lucide-react";

interface Conversation {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
}

interface ConversationListProps {
  conversations: Conversation[];
  activeId?: string;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete?: (id: string) => void;
}

export function ConversationList({
  conversations,
  activeId,
  onSelect,
  onCreate,
  onDelete,
}: ConversationListProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* New Chat Button */}
      <button
        onClick={onCreate}
        className="m-3 flex items-center justify-center gap-2 w-auto px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-200"
      >
        <Plus size={18} />
        <span>New Chat</span>
      </button>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto space-y-2 px-2">
        {conversations && conversations.length > 0 ? (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className="group relative"
            >
              <button
                onClick={() => onSelect(conv.id)}
                className={`w-full flex items-start gap-3 p-3 rounded-lg transition-all duration-200 text-left ${
                  activeId === conv.id
                    ? "bg-slate-700/60 border border-cyan-500/30"
                    : "hover:bg-slate-700/40 border border-transparent"
                }`}
              >
                <MessageSquare
                  size={16}
                  className="mt-1 flex-shrink-0 text-cyan-400"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {conv.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {formatDate(conv.createdAt)}
                  </p>
                </div>
              </button>

              {/* Delete button - show on hover */}
              {onDelete && (
                <button
                  onClick={() => onDelete(conv.id)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-slate-400">
            <MessageSquare size={32} className="mb-2 opacity-50" />
            <p className="text-xs">No conversations yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
