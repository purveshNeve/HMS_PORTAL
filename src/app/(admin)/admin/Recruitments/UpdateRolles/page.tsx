"use client";

import { useMemo, useState } from "react";
import { Briefcase } from "lucide-react";
import { PageShell } from "@/components/ui/PageShell";
import { RoleFilters, SortKey } from "@/components/recruitments/roles/RoleFilters";
import { RoleCard } from "@/components/recruitments/roles/RoleCard";
import { RoleTable } from "@/components/recruitments/roles/RoleTable";
import { RoleFormModal, RoleFormValues } from "@/components/recruitments/roles/RoleFormModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { KpiCard } from "@/components/ui/KpiCard";
import { jobRoles as initialRoles, avatar } from "@/lib/mock-data";
import { JobRole } from "@/lib/types";
import { Layers, Clock3, Users } from "lucide-react";

const priorityRank: Record<string, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };

export default function RolesPage() {
  const [roles, setRoles] = useState<JobRole[]>(initialRoles);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [view, setView] = useState<"grid" | "table">("grid");

  const [formOpen, setFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<JobRole | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<JobRole | null>(null);

  const filtered = useMemo(() => {
    let list = roles.filter((r) => {
      const matchesSearch =
        !search ||
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.hiringManager.toLowerCase().includes(search.toLowerCase()) ||
        r.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
      const matchesDept = department === "all" || r.department === department;
      const matchesStatus = status === "all" || r.status === status;
      const matchesPriority = priority === "all" || r.priority === priority;
      return matchesSearch && matchesDept && matchesStatus && matchesPriority;
    });

    list = [...list].sort((a, b) => {
      if (sort === "applications") return b.applications - a.applications;
      if (sort === "priority") return priorityRank[a.priority] - priorityRank[b.priority];
      if (sort === "deadline") return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      return new Date(b.postedOn).getTime() - new Date(a.postedOn).getTime();
    });

    return list;
  }, [roles, search, department, status, priority, sort]);

  const stats = useMemo(() => {
    const open = roles.filter((r) => r.status === "Open").length;
    const totalOpenings = roles.reduce((s, r) => s + r.openings, 0);
    const totalApplications = roles.reduce((s, r) => s + r.applications, 0);
    const critical = roles.filter((r) => r.priority === "Critical" && r.status === "Open").length;
    return { open, totalOpenings, totalApplications, critical };
  }, [roles]);

  const handleCreate = () => {
    setEditingRole(null);
    setFormOpen(true);
  };

  const handleEdit = (role: JobRole) => {
    setEditingRole(role);
    setFormOpen(true);
  };

  const handleDuplicate = (role: JobRole) => {
    const copy: JobRole = {
      ...role,
      id: `role-${Date.now()}`,
      title: `${role.title} (Copy)`,
      applications: 0,
      filled: 0,
      status: "Draft",
      postedOn: new Date().toISOString(),
      version: 1,
    };
    setRoles((prev) => [copy, ...prev]);
  };

  const handleArchive = (role: JobRole) => {
    setRoles((prev) => prev.map((r) => (r.id === role.id ? { ...r, status: "Closed" } : r)));
  };

  const handleCloseHiring = (role: JobRole) => {
    setRoles((prev) => prev.map((r) => (r.id === role.id ? { ...r, status: "Closed", filled: r.openings } : r)));
  };

  const handleDelete = (role: JobRole) => {
    setRoles((prev) => prev.filter((r) => r.id !== role.id));
  };

  const handleSubmit = (values: RoleFormValues) => {
    if (editingRole) {
      setRoles((prev) =>
        prev.map((r) =>
          r.id === editingRole.id
            ? {
              ...r,
              title: values.title,
              department: values.department,
              hiringManager: values.hiringManager,
              managerAvatar: avatar(values.hiringManager),
              experience: values.experience,
              skills: values.skills.split(",").map((s) => s.trim()).filter(Boolean),
              employmentType: values.employmentType,
              openings: values.openings,
              salaryMin: values.salaryMin * 100000,
              salaryMax: values.salaryMax * 100000,
              location: values.location,
              remote: values.remote,
              priority: values.priority,
              deadline: new Date(values.deadline).toISOString(),
              version: r.version + 1,
            }
            : r
        )
      );
    } else {
      const newRole: JobRole = {
        id: `role-${Date.now()}`,
        title: values.title,
        department: values.department,
        hiringManager: values.hiringManager,
        managerAvatar: avatar(values.hiringManager),
        openings: values.openings,
        filled: 0,
        applications: 0,
        priority: values.priority,
        experience: values.experience,
        employmentType: values.employmentType,
        salaryMin: values.salaryMin * 100000,
        salaryMax: values.salaryMax * 100000,
        location: values.location,
        remote: values.remote,
        status: "Pending Approval",
        postedOn: new Date().toISOString(),
        deadline: new Date(values.deadline).toISOString(),
        skills: values.skills.split(",").map((s) => s.trim()).filter(Boolean),
        version: 1,
      };
      setRoles((prev) => [newRole, ...prev]);
    }
  };

  return (
    <PageShell onCreate={handleCreate} createLabel="Create Role">
      <div className="mx-auto max-w-[1400px] space-y-6">
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard label="Open Positions" value={String(stats.open)} delta={4.1} trend="up" icon={Briefcase} index={0} />
          <KpiCard label="Total Openings" value={String(stats.totalOpenings)} delta={2.4} trend="up" icon={Layers} index={1} />
          <KpiCard label="Total Applications" value={stats.totalApplications.toLocaleString()} delta={8.7} trend="up" icon={Users} index={2} />
          <KpiCard label="Critical Priority Open" value={String(stats.critical)} delta={1.2} trend="up" goodDirection="down" icon={Clock3} index={3} />
        </section>

        <RoleFilters
          search={search}
          setSearch={setSearch}
          department={department}
          setDepartment={setDepartment}
          status={status}
          setStatus={setStatus}
          priority={priority}
          setPriority={setPriority}
          sort={sort}
          setSort={setSort}
          view={view}
          setView={setView}
          resultCount={filtered.length}
        />

        {filtered.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No roles match your filters"
            description="Try adjusting your search or filters, or create a new role to get started."
            action={
              <button onClick={handleCreate} className="btn-primary">
                Create Role
              </button>
            }
          />
        ) : view === "grid" ? (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((role, i) => (
              <RoleCard
                key={role.id}
                role={role}
                index={i}
                onEdit={() => handleEdit(role)}
                onDuplicate={() => handleDuplicate(role)}
                onArchive={() => handleArchive(role)}
                onCloseHiring={() => handleCloseHiring(role)}
                onDelete={() => setDeleteTarget(role)}
              />
            ))}
          </section>
        ) : (
          <RoleTable
            roles={filtered}
            onEdit={handleEdit}
            onDuplicate={handleDuplicate}
            onArchive={handleArchive}
            onCloseHiring={handleCloseHiring}
            onDelete={(r) => setDeleteTarget(r)}
          />
        )}
      </div>

      <RoleFormModal open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} initial={editingRole} />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        title="Delete this role?"
        description={`"${deleteTarget?.title}" will be permanently removed along with its audit history. This can't be undone.`}
        confirmLabel="Delete Role"
      />
    </PageShell>
  );
}
