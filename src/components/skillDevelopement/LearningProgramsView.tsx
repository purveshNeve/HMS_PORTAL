"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  LayoutGrid,
  List as ListIcon,
  Download,
  FileSpreadsheet,
  Printer,
  Pencil,
  Trash2,
  Users,
  Clock,
  BookMarked,
} from "lucide-react";
import { LearningProgram, ProgramStatus, ProgramLevel } from "@/types/skill-development";
import { programCategories, departments } from "@/data/skillDevelopmentData";
import StatusBadge from "@/components/ui/StatusBadge";
import Pagination from "@/components/ui/Pagination";
import EmptyState from "@/components/ui/EmptyState";
import { useToast } from "@/lib/toast";
import { exportToCSV, exportToExcel } from "@/lib/export_cultural";
import { cn } from "@/lib/utils";
import ProgramFormDrawer from "./ProgramFormDrawer";

const PAGE_SIZE = 6;

const statusTone: Record<ProgramStatus, "success" | "warning" | "danger" | "neutral" | "info"> = {
  Draft: "neutral",
  Active: "success",
  Completed: "info",
  Archived: "neutral",
};

const levelTone: Record<ProgramLevel, "success" | "warning" | "danger"> = {
  Beginner: "success",
  Intermediate: "warning",
  Advanced: "danger",
};

export default function LearningProgramsView() {
  const { toast } = useToast();
  const [programs, setPrograms] = useState<LearningProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"All" | ProgramStatus>("All");
  const [levelFilter, setLevelFilter] = useState<"All" | ProgramLevel>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<LearningProgram | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<LearningProgram | null>(null);

  useEffect(() => {
    async function fetchPrograms() {
      try {
        const res = await fetch("/api/courses");
        if (res.ok) {
          const data = await res.json();
          if (data.courses) {
            const mapped = data.courses.map((c: any) => ({
              id: c.courseId,
              name: c.programName,
              description: c.description || "",
              category: c.category || "Technical",
              duration: c.duration || "",
              level: c.level,
              department: c.department,
              instructor: c.instructor,
              resources: c.resources || 0,
              assignments: c.assignments || 0,
              progress: c.progress || 0,
              status: c.status,
              enrolledUsers: Array.isArray(c.enrolledUsers) ? c.enrolledUsers : [],
            }));
            setPrograms(mapped);
          }
        }
      } catch (err) {
        console.error("Error fetching programs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPrograms();
  }, []);

  const filtered = useMemo(() => {
    return programs.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.instructor.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
      const matchesStatus = statusFilter === "All" || p.status === statusFilter;
      const matchesLevel = levelFilter === "All" || p.level === levelFilter;
      return matchesSearch && matchesCategory && matchesStatus && matchesLevel;
    });
  }, [programs, search, categoryFilter, statusFilter, levelFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openCreate = () => {
    setEditing(null);
    setDrawerOpen(true);
  };
  const openEdit = (program: LearningProgram) => {
    setEditing(program);
    setDrawerOpen(true);
  };

  const handleSave = async (program: LearningProgram) => {
    try {
      const isEdit = programs.some((p) => p.id === program.id);
      const url = isEdit ? `/api/courses/${program.id}` : "/api/courses";
      const method = isEdit ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(program),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to save program");
      }

      const data = await res.json();
      const savedCourse = data.course;
      const savedProgram: LearningProgram = {
        id: savedCourse.courseId,
        name: savedCourse.programName,
        description: savedCourse.description || "",
        category: savedCourse.category || "Technical",
        duration: savedCourse.duration || "",
        level: savedCourse.level,
        department: savedCourse.department,
        instructor: savedCourse.instructor,
        resources: savedCourse.resources || 0,
        assignments: savedCourse.assignments || 0,
        progress: savedCourse.progress || 0,
        status: savedCourse.status,
        enrolledUsers: Array.isArray(savedCourse.enrolledUsers) ? savedCourse.enrolledUsers : [],
      };

      setPrograms((prev) => {
        const exists = prev.some((p) => p.id === savedProgram.id);
        return exists ? prev.map((p) => (p.id === savedProgram.id ? savedProgram : p)) : [savedProgram, ...prev];
      });

      setDrawerOpen(false);
      toast(isEdit ? "Program updated successfully." : "Program created successfully.", "success");
    } catch (err) {
      console.error(err);
      toast(err instanceof Error ? err.message : "Failed to save program", "warning");
    }
  };

  const handleDelete = async (program: LearningProgram) => {
    try {
      const res = await fetch(`/api/courses/${program.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete program");
      }

      setPrograms((prev) => prev.filter((p) => p.id !== program.id));
      toast(`"${program.name}" deleted.`, "warning");
    } catch (err) {
      console.error(err);
      toast(err instanceof Error ? err.message : "Failed to delete program", "warning");
    }
  };

  const handleExportCSV = () => {
    exportToCSV(
      filtered.map(({ name, category, level, department, instructor, duration, status, progress }) => ({
        name, category, level, department, instructor, duration, status, progress,
      })),
      "learning-programs"
    );
    toast("Exported learning programs to CSV.", "info");
  };

  const handleExportExcel = () => {
    exportToExcel(
      filtered.map(({ name, category, level, department, instructor, duration, status, progress }) => ({
        name, category, level, department, instructor, duration, status, progress,
      })),
      "learning-programs"
    );
    toast("Exported learning programs to Excel.", "info");
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-5 flex flex-col gap-3 rounded-xl2 border border-line bg-card p-4 shadow-soft lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <div className="relative w-full sm:w-56">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search programs or instructors…"
              className="w-full rounded-full border border-line bg-paper/60 py-2 pl-8 pr-3 text-xs outline-none transition-colors focus:border-indigoink focus:bg-card"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="rounded-full border border-line bg-paper/60 px-3 py-2 text-xs font-medium outline-none focus:border-indigoink"
          >
            <option value="All">All Categories</option>
            {programCategories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={levelFilter}
            onChange={(e) => { setLevelFilter(e.target.value as "All" | ProgramLevel); setPage(1); }}
            className="rounded-full border border-line bg-paper/60 px-3 py-2 text-xs font-medium outline-none focus:border-indigoink"
          >
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as "All" | ProgramStatus); setPage(1); }}
            className="rounded-full border border-line bg-paper/60 px-3 py-2 text-xs font-medium outline-none focus:border-indigoink"
          >
            <option value="All">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Archived">Archived</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-0.5 rounded-full border border-line bg-paper/60 p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={cn("rounded-full p-1.5", viewMode === "grid" ? "bg-indigoink text-white" : "text-muted")}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn("rounded-full p-1.5", viewMode === "list" ? "bg-indigoink text-white" : "text-muted")}
              aria-label="List view"
            >
              <ListIcon className="h-3.5 w-3.5" />
            </button>
          </div>
          <button onClick={handleExportCSV} className="flex items-center gap-1.5 rounded-full border border-line px-3 py-2 text-xs font-medium text-ink transition-colors hover:bg-paper">
            <Download className="h-3.5 w-3.5" /> CSV
          </button>
          <button onClick={handleExportExcel} className="flex items-center gap-1.5 rounded-full border border-line px-3 py-2 text-xs font-medium text-ink transition-colors hover:bg-paper">
            <FileSpreadsheet className="h-3.5 w-3.5" /> Excel
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 rounded-full border border-line px-3 py-2 text-xs font-medium text-ink transition-colors hover:bg-paper">
            <Printer className="h-3.5 w-3.5" /> Print
          </button>
          <button
            onClick={openCreate}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-indigoink px-4 py-2.5 text-sm font-semibold text-white shadow-lg ring-2 ring-indigoink/20 transition-all hover:scale-[1.02] hover:bg-indigoink/90 sm:w-auto"
            aria-label="Add learning program"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200">
  <Plus className="h-4 w-4 text-black" />
</span>
            <span className="text-black">Add Course</span>
          </button>
        </div>
      </div>

      {selectedProgram && (
        <div className="mb-5 rounded-xl2 border border-line bg-card p-4 shadow-soft">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-ink">{selectedProgram.name}</p>
              <p className="text-xs text-muted">{selectedProgram.enrolledUsers?.length || 0} enrolled employee(s)</p>
            </div>
            <button onClick={() => setSelectedProgram(null)} className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink hover:bg-paper">
              Close
            </button>
          </div>
          {selectedProgram.enrolledUsers?.length ? (
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {selectedProgram.enrolledUsers.map((user: any, index: number) => (
                <div key={`${user.userId || user.email || index}-${index}`} className="rounded-lg border border-line bg-paper/60 p-3">
                  <p className="font-medium text-ink">{user.name || user.email || user.userId}</p>
                  <p className="text-xs text-muted">
                    {user.department ? `${user.department}` : "Department not listed"}
                    {user.email ? ` • ${user.email}` : ""}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted">No employees have enrolled in this course yet.</p>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={BookMarked}
          title="No matching programs"
          description="Try adjusting your search or filters, or create a new learning program."
          action={
            <button onClick={openCreate} className="rounded-full bg-indigoink px-4 py-2 text-xs font-semibold text-white">
              Add Program
            </button>
          }
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {paged.map((program, i) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="flex flex-col rounded-xl2 border border-line bg-card p-4 shadow-soft"
            >
              <div className="flex items-start justify-between gap-2">
                <StatusBadge status={program.status} className="mr-2" />
                <StatusBadge status={program.level} />
              </div>
              <h3 onClick={() => setSelectedProgram(program)} className="mt-3 cursor-pointer font-display text-base font-semibold text-ink">{program.name}</h3>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{program.description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-muted">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {program.duration}</span>
                <button type="button" onClick={() => setSelectedProgram(program)} className="flex items-center gap-1 rounded-full border border-line px-2 py-1 text-[10.5px] text-muted hover:bg-paper">
                  <Users className="h-3 w-3" /> {program.enrolledUsers?.length || 0} enrolled
                </button>
              </div>
              <div className="mt-1 text-[11px] text-muted">{program.instructor} · {program.department}</div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-line">
                <div className="h-full rounded-full bg-indigoink" style={{ width: `${program.progress}%` }} />
              </div>
              <div className="mt-1 text-[10.5px] font-medium text-muted">{program.progress}% average progress</div>
              <div className="mt-4 flex justify-end gap-2 border-t border-line pt-3">
                <button onClick={() => openEdit(program)} className="flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-[11px] font-medium text-ink hover:bg-paper">
                  <Pencil className="h-3 w-3" /> Edit
                </button>
                <button onClick={() => handleDelete(program)} className="flex items-center gap-1 rounded-full border border-coral/30 px-3 py-1.5 text-[11px] font-medium text-coral hover:bg-coral-light">
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl2 border border-line bg-card shadow-soft">
          <table className="w-full min-w-215 text-left text-xs">
            <thead>
              <tr className="border-b border-line bg-paper/60 text-[10.5px] uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-semibold">Program</th>
                <th className="px-4 py-3 font-semibold">Level</th>
                <th className="px-4 py-3 font-semibold">Department</th>
                <th className="px-4 py-3 font-semibold">Instructor</th>
                <th className="px-4 py-3 font-semibold">Progress</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/70">
              {paged.map((program) => (
                <tr key={program.id} className="transition-colors hover:bg-paper/50">
                  <td className="px-4 py-3">
                    <div onClick={() => setSelectedProgram(program)} className="cursor-pointer font-semibold text-ink">{program.name}</div>
                    <div className="text-[10.5px] text-muted">{program.category} · {program.duration}</div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={program.level} /></td>
                  <td className="px-4 py-3 text-muted">{program.department}</td>
                  <td className="px-4 py-3 text-muted">{program.instructor}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-line">
                        <div className="h-full rounded-full bg-indigoink" style={{ width: `${program.progress}%` }} />
                      </div>
                      <span className="text-[10.5px] text-muted">{program.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={program.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      <button type="button" onClick={() => setSelectedProgram(program)} className="rounded-full p-1.5 text-muted hover:bg-paper hover:text-ink" aria-label="View enrolled employees">
                        <Users className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => openEdit(program)} className="rounded-full p-1.5 text-muted hover:bg-paper hover:text-ink" aria-label="Edit">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleDelete(program)} className="rounded-full p-1.5 text-muted hover:bg-coral-light hover:text-coral" aria-label="Delete">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-4">
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
      <ProgramFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        initial={editing}
        onSave={handleSave}
      />
    </div>
  );
}
