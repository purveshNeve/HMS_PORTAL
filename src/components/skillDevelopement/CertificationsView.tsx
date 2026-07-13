"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Download,
  FileSpreadsheet,
  Printer,
  Pencil,
  Trash2,
  ShieldCheck,
  FileDown,
  BellRing,
  Award,
  Users,
} from "lucide-react";
import { Certificate, CertificateStatus } from "@/types/skill-development";
import { departments } from "@/data/skillDevelopmentData";
import StatusBadge from "@/components/ui/StatusBadge";
import Pagination from "@/components/ui/Pagination";
import EmptyState from "@/components/ui/EmptyState";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/lib/toast";
import { exportToCSV, exportToExcel } from "@/lib/export_cultural";
import CertificateFormDrawer from "./CertificateFormDrawer";
import { useAuth } from "@/hooks/useAuth";
const PAGE_SIZE = 6;


interface DashboardStats {
  stats: {
    attendance: number;
    leaves: number;
    wfhLeaves: number;
    payroll: number;
    tasks: number;
  };
  UpcomingEvents: {
    meetings: Array<{
      _id?: string;
      title?: string;
      date?: string | Date;
      time?: string;
      note?: string;
      duration?: string;
    }>;
    projectDeadline?: Array<{
      _id?: string;
      title?: string;
      dueDate?: string | Date;
    }>;
  };
  payrollBreakdown: {
    baseSalary: number;
    workingDays: number;
    prevMonthSal: number;
    creditedDate: string | null;
  };
  details: {
    approvedLeaves: Array<{
      type: string;
      date: string;
      status: string;
      color: string;
    }>;
    approvedWFH: Array<{
      type: string;
      date: string;
      status: string;
      color: string;
    }>;
    pendingGoals: Array<{
      id: string;
      title: string;
      dueDate: string;
      priority: string;
      progress: number;
    }>;
  };
}


const statusTone: Record<CertificateStatus, "success" | "warning" | "danger" | "info"> = {
  Valid: "success",
  "Expiring Soon": "warning",
  Expired: "danger",
  "Pending Verification": "info",
};

function downloadCertificateSummary(cert: Certificate) {
  const content = [
    `Certificate: ${cert.certificateName}`,
    `Issued to: ${cert.employee} (${cert.department})`,
    `Issuer: ${cert.issuer}`,
    `Issue Date: ${cert.issueDate}`,
    `Expiry Date: ${cert.expiryDate}`,
    `Status: ${cert.status}`,
  ].join("\n");
  const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${cert.certificateName.replace(/\s+/g, "-").toLowerCase()}-summary.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function formatDate(dateValue: string | null | Date) {
  if (!dateValue) return "Not available";
  const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
  return !Number.isNaN(date.getTime())
    ? date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "Not available";
}

export default function CertificationsView() {
  const { toast } = useToast();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | CertificateStatus>("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [loading , setLoading] = useState(false);
  const [applicantModalOpen, setApplicantModalOpen] = useState(false);
  const [selectedCertificateName, setSelectedCertificateName] = useState("");
  const [applicants, setApplicants] = useState<Certificate["enrolledUsers"]>([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [applicantError, setApplicantError] = useState<string | null>(null);
  const [loadingStats , setLoadingStats] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [prevMonth, setPrevMonthSalary] = useState<string>("₹100");
  const [creditedDate, setCreditedDate] = useState<string>("Not available");
  const { session, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
      if (isAuthenticated) {
        fetchDashboardStats();
      }
    }, [isAuthenticated]);

  const fetchDashboardStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch("/api/employee/dashboard-stats");
      if (!res.ok) {
        throw new Error(`Failed to fetch dashboard stats`);
      }
      const data = (await res.json()) as DashboardStats;
      setDashboardStats(data);

      const prevMonthSalary = data.payrollBreakdown.prevMonthSal;
      setPrevMonthSalary(`₹${prevMonthSalary?.toLocaleString("en-IN") ?? "0"}`);
      setCreditedDate(
        data.payrollBreakdown.creditedDate
          ? formatDate(data.payrollBreakdown.creditedDate)
          : "Not available"
      );
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Keep default stats on error
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    async function fetchCertificates() {
      try {
        const res = await fetch("/api/certificates");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.certificates)) {
            setCertificates(
              data.certificates.map((cert: any) => ({
                id: cert.certificateId,
                employee: cert.employee,
                department: cert.department,
                certificateName: cert.certificateName,
                issuer: cert.issuer,
                issueDate: cert.issueDate,
                expiryDate: cert.expiryDate || "—",
                status: cert.status,
                fileName: cert.fileName || "certificate.pdf",
              }))
            );
          }
        } else {
          console.error("Failed to fetch certificates", await res.text());
        }
      } catch (error) {
        console.error("Error fetching certificates:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCertificates();
  }, []);

  const filtered = useMemo(() => {
    return certificates.filter((c) => {
      const matchesSearch =
        c.employee.toLowerCase().includes(search.toLowerCase()) ||
        c.certificateName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || c.status === statusFilter;
      const matchesDept = departmentFilter === "All" || c.department === departmentFilter;
      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [certificates, search, statusFilter, departmentFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openCreate = () => { setEditing(null); setDrawerOpen(true); };
  const openEdit = (cert: Certificate) => { setEditing(cert); setDrawerOpen(true); };

  const handleViewApplicants = async (cert: Certificate) => {
    setApplicantError(null);
    setApplicantsLoading(true);
    setSelectedCertificateName(cert.certificateName);
    setApplicantModalOpen(true);
    try {
      const res = await fetch(`/api/certificates/${encodeURIComponent(cert.id)}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to load applicants (${res.status})`);
      }
      const data = await res.json();
      setApplicants(Array.isArray(data.certificate?.enrolledUsers) ? data.certificate.enrolledUsers : []);
    } catch (error) {
      console.error("Error loading applicants:", error);
      setApplicantError(error instanceof Error ? error.message : "Failed to load applicants");
      setApplicants([]);
    } finally {
      setApplicantsLoading(false);
    }
  };

  const handleSave = async (cert: Certificate) => {
    try {
      const res = await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cert),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save certificate");
      }

      const data = await res.json();
      const saved = data.certificate;
      const savedCertificate: Certificate = {
        id: saved.certificateId,
        employee: saved.employee,
        department: saved.department,
        certificateName: saved.certificateName,
        issuer: saved.issuer,
        issueDate: saved.issueDate,
        expiryDate: saved.expiryDate || "—",
        status: saved.status,
        fileName: saved.fileName || "certificate.pdf",
      };

      setCertificates((prev) => {
        const exists = prev.some((c) => c.id === savedCertificate.id);
        return exists
          ? prev.map((c) => (c.id === savedCertificate.id ? savedCertificate : c))
          : [savedCertificate, ...prev];
      });

      setDrawerOpen(false);
      toast(editing ? "Certificate updated." : "Certificate issued successfully.", "success");
    } catch (error) {
      console.error("Error saving certificate:", error);
      toast(error instanceof Error ? error.message : "Failed to save certificate", "warning");
    }
  };

  const handleDelete = (cert: Certificate) => {
    setCertificates((prev) => prev.filter((c) => c.id !== cert.id));
    toast(`"${cert.certificateName}" removed.`, "warning", {
      label: "Undo",
      onClick: () => setCertificates((prev) => [cert, ...prev]),
    });
  };

  const handleVerify = (cert: Certificate) => {
    setCertificates((prev) => prev.map((c) => (c.id === cert.id ? { ...c, status: "Valid" } : c)));
    toast(`Verified "${cert.certificateName}" for ${cert.employee}.`, "success");
  };

  const handleRemind = (cert: Certificate) => {
    toast(`Renewal reminder sent to ${cert.employee}.`, "info");
  };

  const handleExportCSV = () => {
    exportToCSV(
      filtered.map(({ employee, department, certificateName, issuer, issueDate, expiryDate, status }) => ({
        employee, department, certificateName, issuer, issueDate, expiryDate, status,
      })),
      "certifications"
    );
    toast("Exported certificates to CSV.", "info");
  };

  const handleExportExcel = () => {
    exportToExcel(
      filtered.map(({ employee, department, certificateName, issuer, issueDate, expiryDate, status }) => ({
        employee, department, certificateName, issuer, issueDate, expiryDate, status,
      })),
      "certifications"
    );
    toast("Exported certificates to Excel.", "info");
  };

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 rounded-xl2 border border-line bg-card p-4 shadow-soft lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <div className="relative w-full sm:w-56">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search employees or certificates…"
              className="w-full rounded-full border border-line bg-paper/60 py-2 pl-8 pr-3 text-xs outline-none transition-colors focus:border-indigoink focus:bg-card"
            />
          </div>
          <select
            value={departmentFilter}
            onChange={(e) => { setDepartmentFilter(e.target.value); setPage(1); }}
            className="rounded-full border border-line bg-paper/60 px-3 py-2 text-xs font-medium outline-none focus:border-indigoink"
          >
            <option value="All">All Departments</option>
            {departments.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as "All" | CertificateStatus); setPage(1); }}
            className="rounded-full border border-line bg-paper/60 px-3 py-2 text-xs font-medium outline-none focus:border-indigoink"
          >
            <option value="All">All Statuses</option>
            <option value="Valid">Valid</option>
            <option value="Expiring Soon">Expiring Soon</option>
            <option value="Expired">Expired</option>
            <option value="Pending Verification">Pending Verification</option>
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
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
            aria-label="Issue certificate"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
              <Plus className="h-4 w-4" />
            </span>
            <span>Issue Certificate</span>
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No certificates found"
          description="Try adjusting your filters, or issue a new certificate."
          action={
            <button onClick={openCreate} className="rounded-full bg-indigoink px-4 py-2 text-xs font-semibold text-white">
              Issue Certificate
            </button>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-xl2 border border-line bg-card shadow-soft">
          <table className="w-full min-w-[920px] text-left text-xs">
            <thead>
              <tr className="border-b border-line bg-paper/60 text-[10.5px] uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-semibold">Certificate</th>
                <th className="px-4 py-3 font-semibold">Mentor</th>
                <th className="px-4 py-3 font-semibold">Issuer</th>
                <th className="px-4 py-3 font-semibold">Issued</th>
                <th className="px-4 py-3 font-semibold">Expires</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/70">
              {paged.map((cert, i) => (
                <motion.tr
                  key={cert.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                  className="transition-colors hover:bg-paper/50"
                >
                  <td className="px-4 py-3">
                    <div className="font-semibold text-ink">{cert.certificateName}</div>
                    <div className="text-[10.5px] text-muted">{cert.fileName}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-ink">{cert.employee}</div>
                    <div className="text-[10.5px] text-muted">{cert.department}</div>
                  </td>
                  <td className="px-4 py-3 text-muted">{cert.issuer}</td>
                  <td className="px-4 py-3 text-muted">{cert.issueDate}</td>
                  <td className="px-4 py-3 text-muted">{cert.expiryDate}</td>
                  <td className="px-4 py-3"><StatusBadge status={cert.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                                <button onClick={() => handleViewApplicants(cert)} className="rounded-full p-1.5 text-muted hover:bg-paper hover:text-ink" aria-label="View applicants" title="View applicants">
                        <Users className="h-3.5 w-3.5" />
                      </button>
                      {cert.status === "Pending Verification" && (
                        <button onClick={() => handleVerify(cert)} className="rounded-full p-1.5 text-muted hover:bg-moss-light hover:text-moss" aria-label="Verify" title="Verify certificate">
                          <ShieldCheck className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {cert.status === "Expiring Soon" && (
                        <button onClick={() => handleRemind(cert)} className="rounded-full p-1.5 text-muted hover:bg-marigold-light hover:text-marigold" aria-label="Send reminder" title="Send renewal reminder">
                          <BellRing className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button onClick={() => downloadCertificateSummary(cert)} className="rounded-full p-1.5 text-muted hover:bg-paper hover:text-ink" aria-label="Download" title="Download summary">
                        <FileDown className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => openEdit(cert)} className="rounded-full p-1.5 text-muted hover:bg-paper hover:text-ink" aria-label="Edit">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleDelete(cert)} className="rounded-full p-1.5 text-muted hover:bg-coral-light hover:text-coral" aria-label="Delete">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4">
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>

      <CertificateFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        initial={editing}
        onSave={handleSave}
      />
      <Modal
        open={applicantModalOpen}
        onClose={() => setApplicantModalOpen(false)}
        title={
          selectedCertificateName
            ? `Applicants for ${selectedCertificateName}`
            : "Certificate applicants"
        }
        size="md"
      >
        {applicantsLoading ? (
          <p className="text-sm text-muted">Loading applicants…</p>
        ) : applicantError ? (
          <p className="text-sm text-red-600">{applicantError}</p>
        ) : applicants?.length ? (
          <div className="space-y-3">
            {applicants.map((applicant, index) => (
              <div key={`${applicant.userId || applicant.email || index}-${index}`} className="rounded-xl border border-line bg-paper/70 p-4">
                <p className="font-medium text-ink">{applicant.name || applicant.email || applicant.userId}</p>
                <p className="text-xs text-muted">
                  {applicant.department || "Department not listed"}
                  {applicant.email ? ` • ${applicant.email}` : ""}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">No applicants have applied for this certificate yet.</p>
        )}
      </Modal>
    </div>
  );
}
