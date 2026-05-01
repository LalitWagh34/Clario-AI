import { LogOut, Settings, MoreVertical } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface UserProfileProps {
  user: User | null;
  onSignOut: () => void;
}

export function UserProfile({ user, onSignOut }: UserProfileProps) {
  if (!user) return null;

  const userInitials = user.email
    ?.split("@")[0]
    .split(".")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  const userDisplayName = user.user_metadata?.name || user.email?.split("@")[0] || "User";

  return (
    <div className="border-b border-slate-700/50 p-3 space-y-3">
      {/* User info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-white">{userInitials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{userDisplayName}</p>
          <p className="text-xs text-slate-400 truncate">{user.email}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-colors text-slate-300 hover:text-white text-sm">
          <Settings size={16} />
          <span>Settings</span>
        </button>
        <button
          onClick={onSignOut}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/20 transition-colors text-slate-300 hover:text-red-400 text-sm"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
