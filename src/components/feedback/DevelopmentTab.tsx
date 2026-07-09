"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useToast } from "@/lib/toast";
import { useAuth } from "@/hooks/useAuth";
import { GraduationCap, BadgeCheck, Users2, Briefcase, ChevronRight, UploadCloud } from "lucide-react";
import {
  developmentStrengths,
  developmentGaps,
  recommendations,
  managerComments,
} from "@/data/mockDataFeedback";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/ButtonFeedback";

const recTypeIcon: Record<string, React.ElementType> = {
  Course: GraduationCap,
  Certification: BadgeCheck,
  Mentorship: Users2,
  "Internal Mobility": Briefcase,
};

function SkillBar({ name, level, type }: { name: string; level: number; type: "strength" | "gap" }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-ink-muted">{name}</span>
        <span className="text-ink-faint text-xs">{level}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-surface-subtle overflow-hidden">
        <div
          className={`h-full rounded-full ${type === "strength" ? "bg-success-500" : "bg-warning-500"}`}
          style={{ width: `${level}%` }}
        />
      </div>
    </div>
  );
}

const roleOptions = [
  "SDE1",
  "SDE2",
  "SDE3",
  "Product Manager",
  "Senior Manager",
  "HR",
  "Project Manager",
  "Operations",
  "Marketing Lead",
];

export function DevelopmentTab() {
  const { toast } = useToast();
  const { userId, user } = useAuth();
  const [fetchedRecs, setFetchedRecs] = useState<{ _id?: string; managerName: string; role: string; comment: string; date: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [goalInput, setGoalInput] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [submittedGoal, setSubmittedGoal] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [adminCourses, setAdminCourses] = useState<any[]>([]);
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [enrollingCertId, setEnrollingCertId] = useState<string | null>(null);
  const [enrolledCertIds, setEnrolledCertIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await fetch("/api/recommendations");
        if (res.ok) {
          const data = await res.json();
          setFetchedRecs(data.recommendations || []);
        }
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses");
        if (res.ok) {
          const data = await res.json();
          setAdminCourses(data.courses || []);
        }
      } catch (err) {
        console.error("Failed to fetch admin courses:", err);
      }
    };

    const fetchCertifications = async () => {
      try {
        const res = await fetch("/api/certificates");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.certificates)) {
            const mappedCertificates = data.certificates.map((cert: any) => ({
              id: cert.certificateId,
              name: cert.certificateName,
              issuer: cert.issuer,
              issuedDate: cert.issueDate,
              status: cert.status,
              enrolledUsers: cert.enrolledUsers || [],
              enrolledUserIds: cert.enrolledUserIds || [],
            }));
            setCertifications(mappedCertificates);
            if (userId) {
              setEnrolledCertIds(
                mappedCertificates
                  .filter((cert: any) => cert.enrolledUserIds?.includes(userId))
                  .map((cert: any) => cert.id)
              );
            }
          }
        } else {
          console.error("Failed to fetch certifications", await res.text());
        }
      } catch (err) {
        console.error("Failed to fetch certifications:", err);
      }
    };

    fetchRecs();
    fetchCourses();
    fetchCertifications();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    setEnrolledCertIds(
      certifications
        .filter((cert) => cert.enrolledUserIds?.includes(userId))
        .map((cert) => cert.id)
    );
  }, [userId, certifications]);

  const handleCertificateEnroll = async (certificate: any) => {
    const certificateId = certificate?.id;
    if (!certificateId) return;

    if (!userId) {
      toast("Please sign in to enroll in a certificate.", "warning");
      return;
    }

    const alreadyEnrolled =
      (certificate?.enrolledUserIds || []).includes(userId) ||
      enrolledCertIds.includes(certificateId);
    if (alreadyEnrolled) {
      toast("You are already enrolled in this certificate.", "info");
      return;
    }

    setEnrollingCertId(certificateId);

    try {
      const url = `/api/certificates/${encodeURIComponent(certificateId)}`;
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "enroll",
          userId,
          user: {
            userId,
            name: user?.name || "",
            email: user?.email || "",
            department: user?.department || "",
          },
        }),
      });

      const rawResponse = await res.text();
      let result: any = {};
      try {
        result = rawResponse ? JSON.parse(rawResponse) : {};
      } catch (parseError) {
        throw new Error(`Server returned invalid JSON: ${rawResponse}`);
      }

      if (!res.ok) {
        throw new Error(result.message || `Failed to enroll in certificate (${res.status})`);
      }

      const updatedCertificate = result.certificate || certificate;
      setCertifications((prev) =>
        prev.map((item) =>
          item.id === certificateId
            ? {
                ...item,
                ...(updatedCertificate || {}),
                enrolledUsers: updatedCertificate.enrolledUsers || item.enrolledUsers || [],
                enrolledUserIds: updatedCertificate.enrolledUserIds || item.enrolledUserIds || [],
              }
            : item
        )
      );
      setEnrolledCertIds((prev) => (prev.includes(certificateId) ? prev : [...prev, certificateId]));

      toast(`Enrolled in ${certificate.name}.`, "success");
    } catch (err) {
      console.error(err);
      toast(err instanceof Error ? err.message : "Failed to enroll in certificate", "warning");
    } finally {
      setEnrollingCertId(null);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setAnalyzing(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("goal", goalInput.trim());

    try {
      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        const message = result.error || result.message || "Failed to analyze resume";
        throw new Error(message);
      }

      setAnalysis(result.data || result.analysis || null);
      setSubmittedGoal(goalInput.trim() || "Career growth plan");
      toast("Resume uploaded and analyzed successfully.", "success");
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Failed to analyze resume";
      setUploadError(message);
      toast(message, "warning");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleEnroll = async (course: any) => {
    const courseId = course?.courseId || course?.id;
    if (!courseId) return;

    if (!userId) {
      toast("Please sign in to enroll in a course.", "warning");
      return;
    }

    const alreadyEnrolled =
      (course?.enrolledUsers || []).some((entry: any) => entry?.userId === userId) ||
      enrolledCourseIds.includes(courseId);
    if (alreadyEnrolled) {
      toast("You are already enrolled in this course.", "info");
      return;
    }

    setEnrollingCourseId(courseId);

    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "enroll",
          userId,
          user: {
            userId,
            name: user?.name || "",
            email: user?.email || "",
            department: user?.department || "",
          },
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Failed to enroll in course");
      }

      setAdminCourses((prev) =>
        prev.map((item) => {
          const itemId = item?.courseId || item?.id;
          if (itemId !== courseId) return item;
          return {
            ...item,
            ...(result.course || {}),
            enrolledUsers: result.course?.enrolledUsers || item.enrolledUsers || [],
            enrolledUserIds: result.course?.enrolledUserIds || item.enrolledUserIds || [],
          };
        })
      );
      setEnrolledCourseIds((prev) => (prev.includes(courseId) ? prev : [...prev, courseId]));

      toast(`You are enrolled in ${course.title || course.programName || course.name}.`, "success");
    } catch (err) {
      console.error(err);
      toast(err instanceof Error ? err.message : "Failed to enroll in course", "warning");
    } finally {
      setEnrollingCourseId(null);
    }
  };

  const handleGoalSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!goalInput.trim()) return;
    setSubmittedGoal(goalInput.trim());
    toast("Goal updated. Upload a resume to generate insights.", "info");
  };

  const recommendedCourses = (() => {
    const aiCourses = Array.isArray(analysis?.courses) ? analysis.courses : [];

    if (!adminCourses.length) {
      return aiCourses.map((course: any) => ({
        ...course,
        title: course.title || course.name || "Recommended course",
      }));
    }

    const mappedCourses = aiCourses
      .map((course: any) => {
        const searchText = `${course?.title || course?.name || ""} ${course?.reason || ""}`.toLowerCase();
        const match = adminCourses.find((dbCourse: any) => {
          const dbTitle = `${dbCourse?.programName || dbCourse?.name || dbCourse?.title || ""}`.toLowerCase();
          return dbTitle && (dbTitle.includes(searchText) || searchText.includes(dbTitle));
        });

        if (!match) return null;

        return {
          ...match,
          title: match.programName || match.title || match.name,
          reason: course.reason || "Recommended from the admin course catalog",
        };
      })
      .filter(Boolean);

    if (mappedCourses.length) {
      return mappedCourses;
    }

    return adminCourses.slice(0, 3).map((course: any) => ({
      ...course,
      title: course.programName || course.title || course.name,
      reason: "Recommended from the admin course catalog",
    }));
  })();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* <Card>
          <CardHeader>
            <CardTitle>Strengths</CardTitle>
          </CardHeader>
          <div className="p-3 space-y-3">
            {developmentStrengths.map((s) => (
              <SkillBar key={s.id} name={s.name} level={s.level} type={s.type} />
            ))}
          </div>
        </Card> */}

        {/* <Card>
          <CardHeader>
            <CardTitle>Improvement Areas</CardTitle>
          </CardHeader>
          <div className="p-3 space-y-3">
            {developmentGaps.map((s) => (
              <SkillBar key={s.id} name={s.name} level={s.level} type={s.type} />
            ))}
          </div>
        </Card> */}
      </div>

      {/* <Card>
        <CardHeader>
          <CardTitle>Recommended Training &amp; Growth Opportunities</CardTitle>
        </CardHeader>
        <div>
          {recommendations.map((rec, idx) => {
            const Icon = recTypeIcon[rec.type];
            return (
              <div
                key={rec.id}
                className={`flex items-center gap-3 px-3 py-2.5 ${
                  idx !== recommendations.length - 1 ? "border-b border-border" : ""
                } hover:bg-surface-subtle/50 transition-colors`}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-surface-subtle text-ink-muted shrink-0">
                  <Icon size={15} strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink leading-tight">{rec.title}</p>
                  <p className="text-xs text-ink-faint leading-tight mt-0.5">
                    {rec.provider} · {rec.duration}
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="shrink-0">
                  {rec.type === "Internal Mobility" ? "View Role" : "Enroll"}
                  <ChevronRight size={12} />
                </Button>
              </div>
            );
          })}
        </div>
      </Card> */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-subtle/60 text-left">
                  <th className="px-3 py-2 font-medium text-ink-muted text-xs uppercase tracking-wide">Certification</th>
                  <th className="px-3 py-2 font-medium text-ink-muted text-xs uppercase tracking-wide">Issued</th>
                  <th className="px-3 py-2 font-medium text-ink-muted text-xs uppercase tracking-wide">Status</th>
                  <th className="px-3 py-2 font-medium text-ink-muted text-xs uppercase tracking-wide">Enrollement</th>
                </tr>
              </thead>
              <tbody>
                {certifications.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-b-0">
                    <td className="px-3 py-2.5">
                      <p className="text-ink font-medium">{c.name}</p>
                      <p className="text-xs text-ink-faint">{c.issuer}</p>
                    </td>
                    <td className="px-3 py-2.5 text-ink-muted whitespace-nowrap">{c.issuedDate}</td>
                    <td className="px-3 py-2.5">
                      <div className="space-y-1">
                        <span className="text-success-600 text-xs font-medium">{c.status}</span>
                        <span className="text-ink-faint text-[11px]">
                          {((c.enrolledUserIds || []).length || 0) === 1
                            ? "1 enrolled"
                            : `${(c.enrolledUserIds || []).length || 0} enrolled`}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      {(c.enrolledUserIds || []).includes(userId) || enrolledCertIds.includes(c.id) ? (
                        <span className="inline-flex items-center rounded-full bg-surface-subtle px-2 py-1 text-[11px] font-semibold text-ink-muted">
                          Enrolled
                        </span>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCertificateEnroll(c)}
                          disabled={enrollingCertId === c.id}
                          className="rounded-full border border-border px-2 py-1 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {enrollingCertId === c.id ? "Enrolling..." : "Enroll"}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manager Recommendations</CardTitle>
          </CardHeader>
          <div className="p-3 space-y-3">
            {loading ? (
              <p className="text-sm text-ink-muted">Loading recommendations...</p>
            ) : fetchedRecs.length > 0 ? (
              fetchedRecs.map((comment, i) => (
                <div key={comment._id || i}>
                  <p className="text-sm font-medium text-ink">{comment.managerName}</p>
                  <p className="text-xs text-ink-faint mb-1.5">{comment.role}</p>
                  <p className="text-sm text-ink-muted leading-snug">{comment.comment}</p>
                </div>
              ))
            ) : (
              <>
                {managerComments.map((comment) => (
                  <div key={comment.id}>
                    <p className="text-sm font-medium text-ink">{comment.manager}</p>
                    <p className="text-xs text-ink-faint mb-1.5">{comment.role}</p>
                    <p className="text-sm text-ink-muted leading-snug">{comment.comment}</p>
                  </div>
                ))}
                <div className="pt-2 border-t border-border">
                  <p className="text-sm text-ink-muted leading-snug">
                    Suggested focus for next cycle: take on a mentee and lead the executive readout for the platform migration retrospective.
                  </p>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Career Goal Form</CardTitle>
        </CardHeader>
        <form onSubmit={handleGoalSubmit} className="space-y-4 p-4">
          <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <label htmlFor="career-goal-pdf" className="mb-2 block text-sm font-medium text-ink">
                Upload PDF
              </label>
              <label
                htmlFor="career-goal-pdf"
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-subtle/50 px-4 py-6 text-center transition hover:border-brand-500 hover:bg-brand-50"
              >
                <input id="career-goal-pdf" type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
                <UploadCloud className="mb-2 h-6 w-6 text-brand-600" />
                <p className="text-sm font-medium text-ink">
                  {uploadedFileName ? `Selected: ${uploadedFileName}` : "Choose a PDF file"}
                </p>
                <p className="mt-1 text-xs text-ink-faint">Resume, learning plan, or certificate</p>
              </label>
            </div>

            <div className="rounded-xl border border-border bg-surface-subtle/40 p-3">
              <p className="mb-2 text-sm font-medium text-ink">Suggested roles</p>
              <div className="flex flex-wrap gap-2">
                {roleOptions.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setGoalInput(role)}
                    className="rounded-full border border-border bg-white px-2.5 py-1 text-xs text-ink-muted transition hover:border-brand-500 hover:text-brand-600"
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="career-goal-input" className="mb-2 block text-sm font-medium text-ink">
              Your target role
            </label>
            <input
              id="career-goal-input"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              placeholder="What do you want to become?"
              list="career-role-options"
              className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-brand-500"
            />
            <datalist id="career-role-options">
              {roleOptions.map((role) => (
                <option key={role} value={role} />
              ))}
            </datalist>
          </div>

          {uploadError && (
            <div className="rounded-lg border border-warning-300 bg-warning-50 p-3 text-sm text-warning-700">
              {uploadError}
            </div>
          )}

          <div className="flex flex-col gap-2 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink-muted">
              {submittedGoal ? `Saved goal: ${submittedGoal}` : "Set your next milestone and upload supporting documents."}
            </p>
            <Button type="submit" variant="primary" size="sm">
              Save Goal
            </Button>
          </div>
        </form>
      </Card>

      {analysis && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Strengths</CardTitle>
            </CardHeader>
            <div className="space-y-3 p-4">
              {(analysis.strengths || []).map((item: any, index: number) => (
                <div key={`${item.name}-${index}`} className="rounded-lg border border-border bg-surface-subtle/40 p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-sm font-medium text-ink">{item.name}</p>
                    <span className="text-xs font-semibold text-success-600">{item.score}%</span>
                  </div>
                  <p className="text-xs text-ink-muted">{item.reason}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Areas of Improvement</CardTitle>
            </CardHeader>
            <div className="space-y-3 p-4">
              {(analysis.improvements || []).map((item: any, index: number) => (
                <div key={`${item.name}-${index}`} className="rounded-lg border border-border bg-surface-subtle/40 p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-sm font-medium text-ink">{item.name}</p>
                    <span className="text-xs font-semibold text-warning-600">{item.gap}%</span>
                  </div>
                  <p className="text-xs text-ink-muted">{item.reason}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommended Courses</CardTitle>
            </CardHeader>
            <div className="space-y-3 p-4">
              {recommendedCourses.map((course: any, index: number) => (
                <div key={`${course.title || course.programName || course.name}-${index}`} className="rounded-lg border border-border bg-surface-subtle/40 p-3">
                  <p className="text-sm font-medium text-ink">{course.title || course.programName || course.name}</p>
                  <p className="mt-1 text-xs text-ink-muted">{course.reason || course.description}</p>
                  <button
                    type="button"
                    onClick={() => handleEnroll(course)}
                    disabled={
                      enrollingCourseId === (course?.courseId || course?.id) ||
                      (course?.enrolledUsers || []).some((entry: any) => entry?.userId === userId) ||
                      enrolledCourseIds.includes(course?.courseId || course?.id)
                    }
                    className="mt-3 rounded-full border border-brand-500 px-3 py-1.5 text-xs font-medium text-brand-600 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {enrollingCourseId === (course?.courseId || course?.id)
                      ? "Enrolling..."
                      : (course?.enrolledUsers || []).some((entry: any) => entry?.userId === userId) || enrolledCourseIds.includes(course?.courseId || course?.id)
                        ? "Enrolled"
                        : "Enroll"}
                  </button>
                  {(course.category || course.duration) && (
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-ink-faint">
                      {course.category && <span>Category: {course.category}</span>}
                      {course.duration && <span>Duration: {course.duration}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skill Gap Summary</CardTitle>
            </CardHeader>
            <div className="p-4">
              <p className="text-sm text-ink-muted">
                Highest skill gap: <span className="font-semibold text-ink">{analysis.highestGap?.name || "N/A"}</span> at <span className="font-semibold text-warning-600">{analysis.highestGap?.gap || 0}%</span>
              </p>
              <div className="mt-3 h-2 rounded-full bg-surface-subtle">
                <div className="h-2 rounded-full bg-warning-500" style={{ width: `${analysis.highestGap?.gap || 0}%` }} />
              </div>
            </div>
          </Card>
        </div>
      )}

      {analyzing && (
        <Card>
          <CardHeader>
            <CardTitle>Analyzing Resume</CardTitle>
          </CardHeader>
          <div className="p-4 text-sm text-ink-muted">Parsing your PDF and generating career insights...</div>
        </Card>
      )}

       <Card>
        <CardHeader>
          <CardTitle>Career Roadmap</CardTitle>
        </CardHeader>
        <div className="p-4">
          <div className="flex items-center gap-0">
            {["Software Engineer II", "Senior Software Engineer", "Staff Engineer"].map((role, idx) => (
              <div key={role} className="flex items-center flex-1">
                <div className="flex flex-col items-center text-center flex-1">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      idx === 0 ? "bg-brand-600" : "bg-border-strong"
                    }`}
                  />
                  <p className={`text-xs mt-2 ${idx === 0 ? "text-ink font-medium" : "text-ink-faint"}`}>
                    {role}
                  </p>
                  {idx === 0 && <span className="text-xs text-brand-600 mt-0.5">You are here</span>}
                </div>
                {idx < 2 && <div className="h-px bg-border-strong flex-1 -mt-5" />}
              </div>
            ))}
          </div>
        </div>
      </Card>


    </div>
  );
}
