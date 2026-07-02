"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Star,
  Sparkles,
  Send,
  CalendarPlus,
  XCircle,
  MessageSquarePlus,
} from "lucide-react";
import { Candidate, PipelineStage } from "@/lib/types";
import { StatusBadge } from "@/components/ui/StatusBadge";

const stages: PipelineStage[] = [
  "Applied", "Screening", "Shortlisted", "Interview Scheduled", "Technical Round",
  "HR Round", "Selected", "Rejected", "Offer Released", "Joined",
];

const questionBank: Record<string, string[]> = {
  Engineering: [
    "Walk me through a system you designed for scale — what tradeoffs did you make?",
    "Describe a production incident you handled. What was your debugging process?",
    "How do you approach code review feedback you disagree with?",
  ],
  Product: [
    "Tell me about a feature you shipped that didn't move the metric you expected.",
    "How do you prioritize a roadmap when engineering capacity is limited?",
  ],
  Design: [
    "Walk me through your design process for a recent complex feature.",
    "How do you balance user needs with business constraints?",
  ],
  default: [
    "What's an accomplishment you're most proud of in your current role?",
    "Tell me about a time you had to influence without authority.",
  ],
};

export function CandidateDrawer({
  candidate,
  onClose,
  onUpdateStage,
  onAddNote,
}: {
  candidate: Candidate | null;
  onClose: () => void;
  onUpdateStage: (id: string, stage: PipelineStage) => void;
  onAddNote: (id: string, note: string) => void;
}) {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<string[]>([]);

  if (!candidate) return null;
  const questions = questionBank[candidate.department] ?? questionBank.default;
  const skillGap = ["System Design", "Leadership", "Public Speaking"].filter((s) => !candidate.skills.includes(s));

  return (
    <AnimatePresence>
      {candidate && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-ink-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col bg-white shadow-lift dark:bg-surface-darkcard"
          >
            <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4 dark:border-ink-700">
              <h2 className="font-display text-lg font-semibold text-ink-900 dark:text-ink-50">Candidate Profile</h2>
              <button onClick={onClose} className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-700">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {/* Header */}
              <div className="flex items-start gap-4">
                <img src={candidate.avatar} alt={candidate.name} className="h-16 w-16 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-xl font-semibold text-ink-900 dark:text-ink-50">{candidate.name}</h3>
                  <p className="text-sm text-ink-500 dark:text-ink-300">{candidate.positionApplied}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <StatusBadge status={candidate.stage} />
                    <span className="chip bg-evergreen-50 font-mono text-evergreen-700 dark:bg-evergreen-900/30 dark:text-evergreen-300">
                      {candidate.matchScore}% match
                    </span>
                    <span className="flex items-center gap-1 text-xs text-ink-400">
                      <Star size={12} className="fill-gold-400 text-gold-400" /> {candidate.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="mt-5 grid grid-cols-1 gap-2 text-sm text-ink-500 dark:text-ink-300 sm:grid-cols-2">
                <span className="flex items-center gap-2"><Mail size={14} className="text-ink-300" /> {candidate.email}</span>
                <span className="flex items-center gap-2"><Phone size={14} className="text-ink-300" /> {candidate.phone}</span>
                <span className="flex items-center gap-2"><MapPin size={14} className="text-ink-300" /> {candidate.location}</span>
                <span className="flex items-center gap-2"><Briefcase size={14} className="text-ink-300" /> {candidate.experience} experience</span>
                <span className="flex items-center gap-2 sm:col-span-2"><GraduationCap size={14} className="text-ink-300" /> {candidate.education}</span>
              </div>

              {/* Resume summary */}
              <div className="mt-5 rounded-xl border border-ink-100 p-4 dark:border-ink-700">
                <p className="eyebrow mb-2">Resume Summary</p>
                <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300">{candidate.resumeSummary}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {candidate.skills.map((s) => (
                    <span key={s} className="chip bg-ink-50 text-ink-500 dark:bg-ink-700 dark:text-ink-300">{s}</span>
                  ))}
                </div>
              </div>

              {/* AI Skill Gap */}
              <div className="mt-4 rounded-xl border border-gold-200 bg-gold-50/50 p-4 dark:border-gold-800 dark:bg-gold-900/10">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gold-700 dark:text-gold-400">
                  <Sparkles size={13} /> Skill Gap Analysis
                </p>
                {skillGap.length ? (
                  <p className="text-sm text-ink-600 dark:text-ink-300">
                    Consider probing for: <span className="font-medium">{skillGap.join(", ")}</span> during interviews.
                  </p>
                ) : (
                  <p className="text-sm text-ink-600 dark:text-ink-300">No significant skill gaps detected for this role.</p>
                )}
              </div>

              {/* Interview questions */}
              <div className="mt-4">
                <p className="eyebrow mb-2">Suggested Interview Questions</p>
                <ul className="space-y-2">
                  {questions.map((q, i) => (
                    <li key={i} className="rounded-lg bg-ink-50 px-3 py-2 text-sm text-ink-600 dark:bg-ink-800/50 dark:text-ink-300">
                      {q}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stage updater */}
              <div className="mt-5">
                <p className="eyebrow mb-2">Pipeline Stage</p>
                <select
                  value={candidate.stage}
                  onChange={(e) => onUpdateStage(candidate.id, e.target.value as PipelineStage)}
                  className="w-full rounded-xl border border-ink-100 bg-white px-3 py-2.5 text-sm text-ink-700 focus:border-evergreen-400 focus:outline-none dark:border-ink-700 dark:bg-surface-darkcard dark:text-ink-100"
                >
                  {stages.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div className="mt-5">
                <p className="eyebrow mb-2 flex items-center gap-1.5"><MessageSquarePlus size={13} /> Internal Notes</p>
                <div className="space-y-2">
                  {notes.map((n, i) => (
                    <div key={i} className="rounded-lg bg-ink-50 px-3 py-2 text-sm text-ink-600 dark:bg-ink-800/50 dark:text-ink-300">
                      {n}
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add an internal comment…"
                    className="flex-1 rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm focus:border-evergreen-400 focus:outline-none dark:border-ink-700 dark:bg-surface-darkcard dark:text-ink-100"
                  />
                  <button
                    onClick={() => {
                      if (!note.trim()) return;
                      setNotes((n) => [note, ...n]);
                      onAddNote(candidate.id, note);
                      setNote("");
                    }}
                    className="btn-secondary text-xs"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 border-t border-ink-100 px-6 py-4 dark:border-ink-700">
              <button className="btn-primary flex-1 text-xs"><CalendarPlus size={14} /> Schedule Interview</button>
              <button className="btn-secondary flex-1 text-xs"><Send size={14} /> Send Update</button>
              <button
                onClick={() => onUpdateStage(candidate.id, "Rejected")}
                className="btn-secondary flex-1 text-xs text-coral-600 hover:border-coral-300"
              >
                <XCircle size={14} /> Reject
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
