"use client";

import { useState } from "react";
import { Paperclip, X, Eye, Save, Send } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/CardFeedback";
import { Button } from "@/components/ui/ButtonFeedback";
import { FeedbackCategory, RecipientType } from "@/types/feedback";

const recipientTypes: RecipientType[] = ["Manager", "Peer", "Team Member", "HR", "Cross Functional Employee"];

const categories: FeedbackCategory[] = [
  "Appreciation",
  "Recognition",
  "Collaboration",
  "Leadership",
  "Communication",
  "Technical Skills",
  "Improvement Suggestion",
  "Project Feedback",
];

const feedbackTypes = ["Positive", "Constructive", "Mixed"];
const visibilityOptions = ["Public", "Manager Only", "Private"];

const suggestedRecipients = [
  "Priya Nair — Senior Product Manager",
  "Daniel Cho — Staff Engineer",
  "Arjun Mehta — Backend Engineer",
  "Sandra Wells — Engineering Manager",
  "Lena Brandt — UX Researcher",
];

export function GiveFeedbackTab() {
  const [recipientType, setRecipientType] = useState<RecipientType>("Peer");
  const [category, setCategory] = useState<FeedbackCategory>("Appreciation");
  const [feedbackType, setFeedbackType] = useState("Positive");
  const [rating, setRating] = useState(0);
  const [anonymous, setAnonymous] = useState(false);
  const [visibility, setVisibility] = useState("Public");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const addMockAttachment = () => {
    setAttachments((prev) => [...prev, `Attachment-${prev.length + 1}.pdf`]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Give Feedback</CardTitle>
          </CardHeader>

          <div className="p-4 space-y-4">
            {/* Recipient type */}
            <div>
              <label className="text-sm font-medium text-ink block mb-1.5">Recipient Type</label>
              <div className="flex flex-wrap gap-1.5">
                {recipientTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setRecipientType(type)}
                    className={`px-2.5 py-1.5 rounded-md text-sm border transition-colors ${
                      recipientType === type
                        ? "bg-brand-50 border-brand-300 text-brand-700 font-medium"
                        : "bg-surface-raised border-border text-ink-muted hover:bg-surface-subtle"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient */}
            <div>
              <label className="text-sm font-medium text-ink block mb-1.5" htmlFor="recipient">
                Recipient
              </label>
              <input
                id="recipient"
                type="text"
                list="recipient-suggestions"
                placeholder="Search by name or email…"
                className="w-full h-9 rounded-md border border-border bg-surface-raised px-3 text-sm text-ink placeholder:text-ink-faint focus:border-brand-300 outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
              />
              <datalist id="recipient-suggestions">
                {suggestedRecipients.map((r) => (
                  <option key={r} value={r} />
                ))}
              </datalist>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Category */}
              <div>
                <label className="text-sm font-medium text-ink block mb-1.5" htmlFor="category">
                  Feedback Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FeedbackCategory)}
                  className="w-full h-9 rounded-md border border-border bg-surface-raised px-3 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Feedback type */}
              <div>
                <label className="text-sm font-medium text-ink block mb-1.5" htmlFor="ftype">
                  Feedback Type
                </label>
                <select
                  id="ftype"
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value)}
                  className="w-full h-9 rounded-md border border-border bg-surface-raised px-3 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
                >
                  {feedbackTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="text-sm font-medium text-ink block mb-1.5">Rating</label>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i + 1)}
                    className="p-0.5"
                    aria-label={`Rate ${i + 1} out of 5`}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      className={i < rating ? "fill-warning-500 text-warning-500" : "fill-transparent text-border-strong"}
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                ))}
                {rating > 0 && (
                  <span className="text-sm text-ink-muted ml-1">{rating} / 5</span>
                )}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="text-sm font-medium text-ink block mb-1.5" htmlFor="subject">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of your feedback"
                className="w-full h-9 rounded-md border border-border bg-surface-raised px-3 text-sm text-ink placeholder:text-ink-faint focus:border-brand-300 outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-ink block mb-1.5" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                placeholder="Share specific, actionable feedback…"
                className="w-full rounded-md border border-border bg-surface-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-brand-300 outline-none resize-none focus-visible:ring-2 focus-visible:ring-brand-200"
              />
              <p className="text-xs text-ink-faint mt-1">{description.length} / 2000 characters</p>
            </div>

            {/* Attachments */}
            <div>
              <label className="text-sm font-medium text-ink block mb-1.5">Attachments</label>
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {attachments.map((file, idx) => (
                  <span
                    key={file}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-subtle px-2 py-1 text-xs text-ink-muted"
                  >
                    <Paperclip size={11} />
                    {file}
                    <button
                      type="button"
                      onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== idx))}
                      className="hover:text-danger-500"
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
              <Button type="button" variant="secondary" size="sm" onClick={addMockAttachment}>
                <Paperclip size={13} />
                Add Attachment
              </Button>
            </div>

            {/* Anonymous + Visibility */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex items-center justify-between rounded-md border border-border bg-surface-subtle px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-ink">Submit Anonymously</p>
                  <p className="text-xs text-ink-faint mt-0.5">Your name will be hidden from the recipient</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={anonymous}
                  onClick={() => setAnonymous((v) => !v)}
                  className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ml-3 ${
                    anonymous ? "bg-brand-600" : "bg-border-strong"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                      anonymous ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="text-sm font-medium text-ink block mb-1.5" htmlFor="visibility">
                  Visibility Settings
                </label>
                <select
                  id="visibility"
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-full h-9 rounded-md border border-border bg-surface-raised px-3 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
                >
                  {visibilityOptions.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border bg-surface-subtle/50">
            <Button variant="ghost" size="md">
              <Eye size={14} />
              Preview
            </Button>
            <Button variant="secondary" size="md">
              <Save size={14} />
              Save Draft
            </Button>
            <Button variant="primary" size="md">
              <Send size={14} />
              Submit
            </Button>
          </div>
        </Card>
      </div>

      {/* Sidebar guidance */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Writing Effective Feedback</CardTitle>
          </CardHeader>
          <div className="p-3 space-y-2.5 text-sm text-ink-muted">
            <p>Be specific about the situation, behavior, and impact rather than general impressions.</p>
            <p>Balance recognition with actionable suggestions where relevant.</p>
            <p>Keep the tone professional and constructive, even for improvement suggestions.</p>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visibility Reference</CardTitle>
          </CardHeader>
          <div className="p-3 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-muted">Public</span>
              <span className="text-ink-faint text-xs">Visible on recipient&apos;s profile</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Manager Only</span>
              <span className="text-ink-faint text-xs">Shared with their manager</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Private</span>
              <span className="text-ink-faint text-xs">Visible to recipient only</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
