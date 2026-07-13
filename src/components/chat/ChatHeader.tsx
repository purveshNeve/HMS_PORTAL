import { ArrowLeft, User, Phone, Video, Info } from "lucide-react";

interface ChatHeaderProps {
  name: string;
  department?: string;
  avatarUrl?: string | null;
  status?: string;
  onBack?: () => void; // Used for mobile responsive layout to go back to the list
}

export default function ChatHeader({
  name,
  department,
  avatarUrl,
  status = "Active now",
  onBack,
}: ChatHeaderProps) {
  // Get initials for avatar fallback
  const getInitials = (userName: string) => {
    return userName
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex items-center justify-between px-4 py-3.5 bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800 shadow-sm z-10">
      <div className="flex items-center gap-3 min-w-0">
        {/* Back Button for mobile responsive */}
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-500 dark:text-zinc-400 transition-colors"
            aria-label="Back to conversations list"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}

        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-zinc-700"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
              {getInitials(name)}
            </div>
          )}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900" />
        </div>

        {/* User Info */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-zinc-100 truncate">
              {name}
            </h3>
            {department && (
              <span className="hidden sm:inline-block text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-1.5 py-0.5 rounded uppercase tracking-wider">
                {department}
              </span>
            )}
          </div>
          <p className="text-3xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping" />
            {status}
          </p>
        </div>
      </div>

      {/* Action Icons */}
      <div className="flex items-center gap-1">
        <button className="p-2 hover:bg-slate-50 dark:hover:bg-zinc-800/50 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition-all">
          <Phone className="h-4 w-4" />
        </button>
        <button className="p-2 hover:bg-slate-50 dark:hover:bg-zinc-800/50 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition-all">
          <Video className="h-4 w-4" />
        </button>
        <button className="p-2 hover:bg-slate-50 dark:hover:bg-zinc-800/50 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition-all">
          <Info className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
