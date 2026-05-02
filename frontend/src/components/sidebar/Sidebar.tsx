import { useState } from "react";
import { ConversationList } from "../chat/ConversationList";
import type { User } from "@supabase/supabase-js";
import { Plus, LogOut, Settings, Sparkles, ChevronDown } from "lucide-react";

interface Conversation {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
}

interface SidebarProps {
  user: User | null;
  conversations: Conversation[];
  activeConversationId?: string;
  onSelectConversation: (id: string) => void;
  onCreate: () => void;
  onSignOut: () => void;
  onDeleteConversation?: (id: string) => void;
}

export function Sidebar({
  user,
  conversations,
  activeConversationId,
  onSelectConversation,
  onCreate,
  onSignOut,
  onDeleteConversation,
}: SidebarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const avatarInitials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? "??";

  return (
    <div className="w-64 h-screen flex flex-col bg-[#0a0c10] border-r border-white/[0.05] flex-shrink-0">

      {/* Logo */}
      <div className="px-4 pt-5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Sparkles size={13} className="text-white" />
          </div>
          <span className="text-white font-bold text-base tracking-tight" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            Clario
          </span>
        </div>
      </div>

      {/* New Chat Button */}
      
      <div className="px-3 mb-4">
        <button
          onClick={onCreate}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 hover:border-teal-500/40 text-teal-400 hover:text-teal-300 transition-all duration-200 text-sm font-medium group"
        >
          <div className="w-5 h-5 rounded-md bg-teal-500/20 group-hover:bg-teal-500/30 flex items-center justify-center transition-colors">
            <Plus size={12} strokeWidth={2.5} />
          </div>
          New Chat
        </button>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto px-2 scrollbar-hide">
        {conversations.length > 0 && (
          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-2 mb-2">
            Recent
          </p>
        )}
        <ConversationList
          conversations={conversations}
          activeId={activeConversationId}
          onSelect={onSelectConversation}
          onCreate={onCreate}
          onDelete={onDeleteConversation}
        />
      </div>

      {/* User section */}
      <div className="border-t border-white/[0.05] p-3">
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.04] transition-colors group"
          >
            {/* Avatar */}
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center flex-shrink-0 text-[11px] font-bold text-white shadow-sm">
              {avatarInitials}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-medium text-slate-300 truncate leading-tight">
                {user?.user_metadata?.full_name || "User"}
              </p>
              <p className="text-[10px] text-slate-600 truncate leading-tight">
                {user?.email}
              </p>
            </div>
            <ChevronDown
              size={13}
              className={`text-slate-600 flex-shrink-0 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown */}
          {userMenuOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-[#13151c] border border-white/[0.08] rounded-xl overflow-hidden shadow-xl shadow-black/40">
              <button
                onClick={() => setUserMenuOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-colors"
              >
                <Settings size={13} />
                Settings
              </button>
              <div className="h-px bg-white/[0.05] mx-3" />
              <button
                onClick={() => { setUserMenuOpen(false); onSignOut(); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/[0.06] transition-colors"
              >
                <LogOut size={13} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}