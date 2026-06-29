'use client';
import { useEffect, useMemo, useState } from 'react';
import { Filter, Download, MessageSquare, X, RotateCcw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import type { LeaveStatus } from '@/types/indexOriginal';
import clsx from 'clsx';

interface LeaveRequestRow {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  duration: number;
  appliedDate: string;
  approver: string;
  status: LeaveStatus;
  comments: string;
}

interface BackendLeaveRequest {
  requestId?: string;
  _id?: string;
  leaveType?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  managerName?: string;
  comments?: string;
  createdAt?: string;
}

const statusBadge: Record<LeaveStatus, string> = {
  Pending:   'badge-yellow',
  Approved:  'badge-green',
  Rejected:  'badge-red',
  Cancelled: 'badge-gray',
  Withdrawn: 'badge-gray',
};

const statusFilters: (LeaveStatus | 'All')[] = ['All', 'Pending', 'Approved', 'Rejected', 'Cancelled'];

export default function LeaveApprovalTable() {
  const { user } = useAuth();
  const employeeId = user?.userId;
  const [filter, setFilter] = useState<LeaveStatus | 'All'>('All');
  const [commentModal, setCommentModal] = useState<string | null>(null);
  const [rows, setRows] = useState<LeaveRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadLeaveRequests = async () => {
      if (!employeeId) {
        setRows([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/timeOff/leave-requests?employeeId=${encodeURIComponent(employeeId)}&status=APPROVED,PENDING,REJECTED`);
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.error || 'Failed to load leave requests');
        }

        const data = (await res.json()) as BackendLeaveRequest[];
        const mappedRows = data.map((req) => ({
          id: req.requestId || req._id || 'UNKNOWN',
          type: req.leaveType || 'Leave',
          startDate: req.startDate ? new Date(req.startDate).toLocaleDateString() : '-',
          endDate: req.endDate ? new Date(req.endDate).toLocaleDateString() : '-',
          duration: req.startDate && req.endDate
            ? Math.max(1, Math.ceil((new Date(req.endDate).getTime() - new Date(req.startDate).getTime()) / 86400000) + 1)
            : 1,
          appliedDate: req.createdAt ? new Date(req.createdAt).toLocaleDateString() : '-',
          approver: req.managerName || 'Manager',
          status: (req.status?.toLowerCase() === 'approved' ? 'Approved' : req.status?.toLowerCase() === 'rejected' ? 'Rejected' : req.status?.toLowerCase() === 'cancelled' ? 'Cancelled' : 'Pending') as LeaveStatus,
          comments: req.comments || '',
        }));

        setRows(mappedRows);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load leave requests');
      } finally {
        setLoading(false);
      }
    };

    loadLeaveRequests();

    const handleRefresh = () => {
      loadLeaveRequests();
    };

    window.addEventListener('leave-request-updated', handleRefresh);
    window.addEventListener('focus', handleRefresh);

    return () => {
      window.removeEventListener('leave-request-updated', handleRefresh);
      window.removeEventListener('focus', handleRefresh);
    };
  }, [employeeId]);

  const filteredRows = useMemo(() => {
    if (filter === 'All') return rows;
    return rows.filter((row) => row.status === filter);
  }, [filter, rows]);

  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="section-title">Leave Request History</h2>
          <p className="section-subtitle">All leave requests for the current leave year</p>
        </div>
        <div className="flex items-center gap-2">
          {/* <button className="btn-secondary">
            <Filter size={11} />
            Filter
          </button>
          <button className="btn-secondary">
            <Download size={11} />
            Export
          </button> */}
        </div>
      </div>

      {/* Status filter strip */}
      <div className="px-4 py-2 flex items-center gap-1 border-b border-slate-100 overflow-x-auto">
        {statusFilters.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={clsx(
              'px-3 py-1 text-2xs font-medium rounded-full border transition-colors whitespace-nowrap',
              filter === s
                ? 'bg-slate-800 text-white border-slate-800'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
            )}
          >
            {s}
            {s !== 'All' && (
              <span className="ml-1 opacity-60">
                ({rows.filter(r => r.status === s).length})
              </span>
            )}
          </button>
        ))}
        <span className="ml-auto text-2xs text-slate-400 whitespace-nowrap">{filteredRows.length} record{filteredRows.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading leave requests...</div>
        ) : error ? (
          <div className="p-8 text-center text-rose-600">{error}</div>
        ) : (
        <table className="w-full">
          <thead>
            <tr>
              {['Request ID','Leave Type','Start Date','End Date','Duration','Applied On','Approver','Status','','Actions'].map(h => (
                <th key={h} className="table-th whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={10} className="table-td text-center py-10 text-slate-400">
                  No records found for selected filter.
                </td>
              </tr>
            ) : filteredRows.map(row => (
              <tr key={row.id} className="hover-row">
                <td className="table-td font-mono text-2xs text-slate-500">{row.id}</td>
                <td className="table-td font-medium text-slate-800 whitespace-nowrap">{row.type}</td>
                <td className="table-td text-slate-600 whitespace-nowrap">{row.startDate}</td>
                <td className="table-td text-slate-600 whitespace-nowrap">{row.endDate}</td>
                <td className="table-td text-slate-600 whitespace-nowrap">
                  {row.duration} {row.duration === 1 ? 'day' : 'days'}
                </td>
                <td className="table-td text-slate-500 whitespace-nowrap">{row.appliedDate}</td>
                <td className="table-td text-slate-600 whitespace-nowrap">{row.approver}</td>
                <td className="table-td">
                  <span className={clsx('badge', statusBadge[row.status])}>{row.status}</span>
                </td>
                <td className="table-td">
                  {row.comments && (
                    <button
                      onClick={() => setCommentModal(row.id)}
                      className="flex items-center gap-1 text-2xs text-slate-500 hover:text-brand-600 transition-colors"
                    >
                      <MessageSquare size={11} />
                      <span className="hidden sm:inline">Note</span>
                    </button>
                  )}
                </td>
                <td className="table-td whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    {row.status === 'Pending' && (
                      <>
                        <button className="btn-ghost text-red-500 hover:text-red-700 px-2 py-1">
                          <X size={11} />
                          <span className="hidden sm:inline">Cancel</span>
                        </button>
                      </>
                    )}
                    {row.status === 'Approved' && (
                      <button className="btn-ghost text-slate-500 px-2 py-1">
                        <RotateCcw size={11} />
                        <span className="hidden sm:inline">Withdraw</span>
                      </button>
                    )}
                    <button className="btn-ghost text-slate-500 px-2 py-1 text-2xs">View</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

      <div className="px-4 py-2.5 border-t border-slate-100 flex items-center justify-between bg-slate-25">
        <span className="text-2xs text-slate-400">Showing {filteredRows.length} of {rows.length} requests</span>
        <div className="flex items-center gap-1">
          <button className="px-2 py-0.5 text-2xs border border-slate-200 rounded text-slate-500 hover:bg-slate-100 disabled:opacity-40" disabled>Prev</button>
          <span className="px-2 py-0.5 text-2xs border border-brand-600 bg-brand-600 text-white rounded">1</span>
          <button className="px-2 py-0.5 text-2xs border border-slate-200 rounded text-slate-500 hover:bg-slate-100 disabled:opacity-40" disabled>Next</button>
        </div>
      </div>

      {/* Comment Modal */}
      {commentModal && (() => {
        const req = rows.find(r => r.id === commentModal);
        return req ? (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg border border-slate-200 shadow-dropdown w-80 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-800">Manager Comment</h3>
                <button onClick={() => setCommentModal(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded p-2.5 text-xs text-slate-700">
                "{req.comments}"
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-2xs text-slate-400">Approver: {req.approver}</span>
                <span className={clsx('badge', statusBadge[req.status])}>{req.status}</span>
              </div>
              <button onClick={() => setCommentModal(null)} className="btn-secondary mt-3 w-full justify-center">Close</button>
            </div>
          </div>
        ) : null;
      })()}
    </div>
  );
}
