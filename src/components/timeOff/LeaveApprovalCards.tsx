'use client';

import { useEffect, useState, useCallback } from 'react';
import { Check, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface LeaveApprovalRequest {
  requestId: string;
  employeeId: string;
  employeeName: string;
  managerId: string;
  managerName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  notifyManager?: boolean;
  createdAt: string;
  updatedAt: string;
}

const statusClasses: Record<string, string> = {
  PENDING: 'badge-yellow',
  APPROVED: 'badge-green',
  REJECTED: 'badge-red',
  CANCELLED: 'badge-gray',
};

const statusLabels: Record<string, string> = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled',
};

export default function LeaveApprovalCards() {
  const { user, isManager } = useAuth();
  const [requests, setRequests] = useState<LeaveApprovalRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState('');

  const managerId = user?.userId;

  const fetchRequests = useCallback(async () => {
    if (!managerId) return;

    setLoading(true);
    setError('');
    try {
      const url = `/api/timeOff/wfh-request?managerId=${encodeURIComponent(managerId)}&status=PENDING`;
      const res = await fetch(url);
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || 'Failed to load WFH requests');
      }
      const data = (await res.json()) as LeaveApprovalRequest[];
      const normalizedRequests = data
        .map(req => ({
          ...req,
          requestId: req.requestId || (req as any)._id || '',
        }))
        .filter(req => req.requestId);

      if (normalizedRequests.length !== data.length) {
        console.warn('Some WFH requests were missing requestId and were filtered out', data);
      }

      setRequests(normalizedRequests);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load requests');
    } finally {
      setLoading(false);
    }
  }, [managerId]);

  useEffect(() => {
    if (managerId && isManager) {
      fetchRequests();
    }
  }, [fetchRequests, managerId, isManager]);

  const submitDecision = async (requestId: string, status: 'APPROVED' | 'REJECTED') => {
    if (!managerId) return;

    setActionLoading(prev => ({ ...prev, [requestId]: true }));
    setError('');
    try {
      const res = await fetch(`/api/timeOff/wfh-request`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, managerId, status }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || 'Failed to submit decision');
      }
      setRequests(prev => prev.filter(req => req.requestId !== requestId));
      window.dispatchEvent(new Event('leave-request-updated'));
      window.dispatchEvent(new Event('wfh-request-updated'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit decision');
    } finally {
      setActionLoading(prev => ({ ...prev, [requestId]: false }));
    }
  };

  if (!isManager) {
    return (
      <div className="card p-6">
        <h2 className="section-title">WFH Approval</h2>
        <p className="text-sm text-slate-500">You must be signed in as a manager to view WFH approvals.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card p-5 border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="section-title">WFH Approval</h2>
            <p className="section-subtitle">Review incoming work-from-home requests and approve or reject them.</p>
          </div>
          <div className="text-slate-500 text-sm">{requests.length} pending request{requests.length !== 1 ? 's' : ''}</div>
        </div>
      </div>

      {error && (
        <div className="card p-4 bg-rose-50 border border-rose-200 text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="card p-6 text-center text-slate-500">Loading WFH requests...</div>
      ) : requests.length === 0 ? (
        <div className="card p-6 text-center text-slate-500">No pending WFH requests at the moment.</div>
      ) : (
        <div className="grid gap-4">
          {requests.map(request => (
            <div key={request.requestId} className="card border-slate-200 p-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-slate-500 text-2xs uppercase tracking-[0.16em] mb-2">
                    <span>Request ID</span>
                    <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600">{request.requestId}</span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">{request.employeeName}</h3>
                  <p className="text-sm text-slate-600">Work From Home Request</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={"badge " + (statusClasses[request.status] ?? 'badge-gray')}>{statusLabels[request.status] ?? request.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-sm text-slate-600">
                <div>
                  <span className="block text-slate-500 text-2xs uppercase tracking-[0.2em]">Start Date</span>
                  <span>{new Date(request.startDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="block text-slate-500 text-2xs uppercase tracking-[0.2em]">End Date</span>
                  <span>{new Date(request.endDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="block text-slate-500 text-2xs uppercase tracking-[0.2em]">Notify Manager</span>
                  <span>{request.notifyManager === false ? 'No' : 'Yes'}</span>
                </div>
              </div>

              <div className="mt-4 text-sm text-slate-700">
                <p className="font-medium">Reason</p>
                <p className="mt-1 whitespace-pre-wrap">{request.reason}</p>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
                <button
                  className="btn-primary min-w-30 flex items-center justify-center gap-2"
                  onClick={() => submitDecision(request.requestId, 'APPROVED')}
                  disabled={request.status !== 'PENDING' || actionLoading[request.requestId]}
                >
                  <Check size={14} />
                  Accept
                </button>
                <button
                  className="btn-secondary min-w-30 flex items-center justify-center gap-2"
                  onClick={() => submitDecision(request.requestId, 'REJECTED')}
                  disabled={request.status !== 'PENDING' || actionLoading[request.requestId]}
                >
                  <X size={14} />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
