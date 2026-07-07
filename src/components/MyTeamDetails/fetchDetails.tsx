"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Building2,
  Users,
  Home,
  UserCircle2,
} from "lucide-react";
import Modal from "@/components/ui/Modal";

type TodayStatus = "On Duty" | "On Leave" | "WFH" | "Comp-Off";

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  userId: string;
  role: string;
  department: string;
  designation: string;
  joiningDate?: string;
  phone?: string;
  gender?: string;
  employmentType?: string;
  workLocation?: string;
  profileImage?: string | null;
  todayStatus: TodayStatus;
}

function SkeletonCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-5">
        <div className="h-16 w-16 rounded-full bg-zinc-200 dark:bg-zinc-700 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4" />
          <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-full" />
        ))}
      </div>
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarGradient(name: string) {
  const gradients = [
    "from-indigo-500 to-purple-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-sky-500 to-blue-600",
    "from-violet-500 to-fuchsia-600",
    "from-cyan-500 to-teal-600",
    "from-lime-500 to-green-600",
  ];
  const idx = name.charCodeAt(0) % gradients.length;
  return gradients[idx];
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function EmployeeCard({ member, onClick }: { member: TeamMember; onClick: (member: TeamMember) => void }) {
  const gradient = getAvatarGradient(member.name);

  // Status badge config
  const statusConfig: Record<TodayStatus, { label: string; classes: string }> = {
    "On Duty": { label: "● On Duty", classes: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" },
    "On Leave": { label: "● On Leave", classes: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300" },
    "WFH": { label: "● WFH", classes: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300" },
    "Comp-Off": { label: "● Comp-Off", classes: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
  };
  const status = statusConfig[member.todayStatus ?? "On Duty"];

  return (
    <div 
      onClick={() => onClick(member)}
      className="group relative overflow-hidden rounded-2xl border border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      {/* Decorative background blob */}
      <div
        className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
      />

      {/* Card header */}
      <div className="relative p-6 pb-4">
        {/* Status badge row — sits above avatar/name, flush right */}
        <div className="flex justify-end mb-3">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide ${status.classes}`}>
            {status.label}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Avatar */}
          {member.profileImage ? (
            <img
              src={member.profileImage}
              alt={member.name}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-white dark:ring-zinc-800 shadow-md shrink-0"
            />
          ) : (
            <div
              className={`h-16 w-16 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-xl ring-2 ring-white dark:ring-zinc-800 shadow-md shrink-0`}
            >
              {getInitials(member.name)}
            </div>
          )}

          {/* Name & designation */}
          <div className="min-w-0">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-base leading-tight truncate">
              {member.name}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
              {member.designation || "—"}
            </p>
            {/* Role badge */}
            <span
              className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${member.role === "MANAGER"
                ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
                : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                }`}
            >
              {member.role}
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 border-t border-zinc-100 dark:border-zinc-800" />

      {/* Card body */}
      <div className="relative p-6 pt-4 space-y-2.5">
        {/* Employee ID */}
        <div className="flex items-center gap-2.5 text-sm">
          <UserCircle2 size={15} className="text-zinc-400 shrink-0" />
          <span className="text-zinc-500 dark:text-zinc-400 text-xs font-medium w-16 shrink-0">
            EMP ID
          </span>
          <span className="text-zinc-800 dark:text-zinc-200 text-xs font-semibold truncate">
            {member.userId}
          </span>
        </div>

        {/* Department */}
        <div className="flex items-center gap-2.5 text-sm">
          <Building2 size={15} className="text-zinc-400 shrink-0" />
          <span className="text-zinc-500 dark:text-zinc-400 text-xs font-medium w-16 shrink-0">
            Dept
          </span>
          <span className="text-zinc-800 dark:text-zinc-200 text-xs truncate">
            {member.department || "—"}
          </span>
        </div>

        {/* Email */}
        <div className="flex items-center gap-2.5 text-sm">
          <Mail size={15} className="text-zinc-400 shrink-0" />
          <span className="text-zinc-500 dark:text-zinc-400 text-xs font-medium w-16 shrink-0">
            Email
          </span>
          <a
            href={`mailto:${member.email}`}
            className="text-indigo-600 dark:text-indigo-400 text-xs hover:underline truncate"
          >
            {member.email}
          </a>
        </div>

        {/* Phone */}
        {member.phone && (
          <div className="flex items-center gap-2.5 text-sm">
            <Phone size={15} className="text-zinc-400 shrink-0" />
            <span className="text-zinc-500 dark:text-zinc-400 text-xs font-medium w-16 shrink-0">
              Phone
            </span>
            <span className="text-zinc-800 dark:text-zinc-200 text-xs">
              {member.phone}
            </span>
          </div>
        )}

        {/* Employment type */}
        <div className="flex items-center gap-2.5 text-sm">
          <Briefcase size={15} className="text-zinc-400 shrink-0" />
          <span className="text-zinc-500 dark:text-zinc-400 text-xs font-medium w-16 shrink-0">
            Type
          </span>
          <span className="text-zinc-800 dark:text-zinc-200 text-xs">
            {member.employmentType || "—"}
          </span>
        </div>

        {/* Work location */}
        <div className="flex items-center gap-2.5 text-sm">
          {member.workLocation?.toLowerCase().includes("remote") ? (
            <Home size={15} className="text-zinc-400 shrink-0" />
          ) : (
            <MapPin size={15} className="text-zinc-400 shrink-0" />
          )}
          <span className="text-zinc-500 dark:text-zinc-400 text-xs font-medium w-16 shrink-0">
            Location
          </span>
          <span className="text-zinc-800 dark:text-zinc-200 text-xs truncate">
            {member.workLocation || "—"}
          </span>
        </div>

        {/* Joining date */}
        <div className="flex items-center gap-2.5 text-sm">
          <Calendar size={15} className="text-zinc-400 shrink-0" />
          <span className="text-zinc-500 dark:text-zinc-400 text-xs font-medium w-16 shrink-0">
            Joined
          </span>
          <span className="text-zinc-800 dark:text-zinc-200 text-xs">
            {formatDate(member.joiningDate)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function MyTeamDetails() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [recommendationText, setRecommendationText] = useState("");
  const [submittingRec, setSubmittingRec] = useState(false);

  const handleSubmitRecommendation = async () => {
    if (!selectedMember || !recommendationText.trim()) return;
    
    setSubmittingRec(true);
    try {
      const res = await fetch("/api/recommendations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: selectedMember.userId,
          comment: recommendationText.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to submit recommendation");
      }
      
      // Reset and close modal
      setRecommendationText("");
      setSelectedMember(null);
      alert("Recommendation submitted successfully!");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmittingRec(false);
    }
  };

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch("/api/myTeamDetail");
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to fetch team members");
        }
        const data = await res.json();
        setTeamMembers(data.teamMembers ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  return (
    <div className="p-6">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
            <Users size={18} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
            My Team
          </h1>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 ml-12">
          {loading
            ? "Loading team members…"
            : error
              ? ""
              : `${teamMembers.length} member${teamMembers.length !== 1 ? "s" : ""} reporting to you`}
        </p>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 dark:border-rose-800/40 dark:bg-rose-900/10 p-6 text-center">
          <p className="text-rose-600 dark:text-rose-400 font-semibold">{error}</p>
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && teamMembers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
            <Users size={28} className="text-zinc-400" />
          </div>
          <h2 className="text-lg font-bold text-zinc-700 dark:text-zinc-300">
            No team members yet
          </h2>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">
            Employees assigned to you will appear here.
          </p>
        </div>
      )}

      {/* Team cards grid */}
      {!loading && !error && teamMembers.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {teamMembers.map((member) => (
            <EmployeeCard key={member._id} member={member} onClick={setSelectedMember} />
          ))}
        </div>
      )}

      {/* Give Recommendation Modal */}
      {selectedMember && (
        <Modal
          open={!!selectedMember}
          onClose={() => {
            if (!submittingRec) {
              setSelectedMember(null);
              setRecommendationText("");
            }
          }}
          title="Give Recommendations"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Provide a recommendation or constructive feedback for <span className="font-semibold text-zinc-900 dark:text-zinc-100">{selectedMember.name}</span>.
            </p>
            <textarea
              className="w-full h-32 p-3 text-sm border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow resize-none"
              placeholder="E.g., Suggested focus for next cycle..."
              value={recommendationText}
              onChange={(e) => setRecommendationText(e.target.value)}
              disabled={submittingRec}
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedMember(null);
                  setRecommendationText("");
                }}
                disabled={submittingRec}
                className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRecommendation}
                disabled={submittingRec || !recommendationText.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center justify-center min-w-[80px]"
              >
                {submittingRec ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
