import { UserProfile } from "./UserProfile";
import { ConversationList } from "../chat/ConversationList";
import type { User } from "@supabase/supabase-js";

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
  return (
    <div className="w-72 h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-700/50 flex-shrink-0">
      {/* Logo/Branding */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
            <span className="text-lg font-bold text-white">✨</span>
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Clario
          </span>
        </div>
      </div>

      {/* User Profile */}
      <UserProfile user={user} onSignOut={onSignOut} />

      {/* Conversations List */}
      <ConversationList
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={onSelectConversation}
        onCreate={onCreate}
        onDelete={onDeleteConversation}
      />
    </div>
  );
}
