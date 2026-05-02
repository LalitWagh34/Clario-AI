import { Trash2 } from "lucide-react";

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
  onDelete,
}: ConversationListProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  };

  if (!conversations || conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-24 text-slate-600">
        <p className="text-sm">No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      {conversations.map((conv) => {
        const isActive = activeId === conv.id;
        return (
          <div key={conv.id} className="group relative">
            <button
              onClick={() => onSelect(conv.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-150 text-left ${
                isActive
                  ? "bg-white/[0.07] text-white"
                  : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-teal-400 rounded-full" />
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate leading-snug">
                  {conv.title}
                </p>
                <p className="text-[10px] text-slate-600 mt-0.5">
                  {formatDate(conv.createdAt)}
                </p>
              </div>
            </button>

            {/* Delete on hover */}
            {onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/10 text-slate-600 hover:text-red-400"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}