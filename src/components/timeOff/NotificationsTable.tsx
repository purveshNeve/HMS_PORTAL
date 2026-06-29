"use client";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";

interface NotificationRow {
  requestId: string;
  leaveType: string;
  status: string;
  managerName: string;
  comments?: string;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export default function NotificationsTable() {
  const { user } = useAuth();
  const userId = user?.userId;
  const [rows, setRows] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError("");
    try {
      // fetch leave requests for the user (both as employee and as manager)
      const res = await fetch(`/api/timeOff/leave-requests?employeeId=${encodeURIComponent(userId)}&status=APPROVED,PENDING,REJECTED`);
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Failed to load notifications");
      }
      const data = await res.json();
      const mapped = (data || []).map((r: any) => ({
        requestId: r.requestId || r._id,
        leaveType: r.leaveType,
        status: r.status,
        managerName: r.managerName,
        comments: r.comments,
        startDate: new Date(r.startDate).toLocaleDateString(),
        endDate: new Date(r.endDate).toLocaleDateString(),
        createdAt: new Date(r.createdAt).toLocaleString(),
      }));
      setRows(mapped);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load notifications");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  if (loading) return <div className="p-6">Loading notifications...</div>;
  if (error) return <div className="p-6 text-rose-600">{error}</div>;

  return (
    <div className="card p-4">
      <h2 className="section-title">Notifications</h2>
      <p className="section-subtitle">All leave-related notifications</p>
      <div className="mt-4 overflow-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-2xs text-slate-500 uppercase tracking-[0.12em]">
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Dates</th>
              <th className="px-3 py-2">Manager</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Comment</th>
              <th className="px-3 py-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.requestId} className="border-t border-slate-100 hover:bg-slate-25">
                <td className="px-3 py-2 align-top">{r.requestId}</td>
                <td className="px-3 py-2 align-top">{r.leaveType}</td>
                <td className="px-3 py-2 align-top">{r.startDate} – {r.endDate}</td>
                <td className="px-3 py-2 align-top">{r.managerName}</td>
                <td className="px-3 py-2 align-top">{r.status}</td>
                <td className="px-3 py-2 align-top">{r.comments ?? '-'}</td>
                <td className="px-3 py-2 align-top">{r.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
