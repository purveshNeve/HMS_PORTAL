'use client';
import { useState, useEffect, useCallback } from 'react';
import { Plus, Laptop, CalendarDays } from 'lucide-react';
import { attendanceStats } from '@/data/mockData';
import { useAuth } from '@/hooks/useAuth';

type WFHRequest = {
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
};

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

export default function WFHRequests() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [requests, setRequests] = useState<WFHRequest[]>([]);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    managerName: '',
    managerId: '',
  });
  const [message, setMessage] = useState('');
  const pct = Math.round((attendanceStats.wfhDaysUsed / attendanceStats.wfhDaysTotal) * 100);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchRequests = useCallback(async () => {
    if (!user?.userId) return;

    setLoadingRequests(true);
    try {
      const response = await fetch(`/api/timeOff/wfh-request?employeeId=${encodeURIComponent(user.userId)}`);
      const rawText = await response.text();
      let data: unknown = [];
      if (rawText) {
        try {
          data = JSON.parse(rawText);
        } catch {
          console.error('Unable to parse WFH request response', rawText);
        }
      }
      if (!response.ok) {
        const body = typeof data === 'object' && data !== null ? (data as any).error : undefined;
        throw new Error(body || 'Failed to load WFH requests');
      }

      const parsed = Array.isArray(data) ? data : [];
      const normalizedRequests = parsed
        .map((req) => ({
          ...(req as WFHRequest),
          requestId: (req as any).requestId || (req as any)._id || '',
        }))
        .filter((req) => req.requestId) as WFHRequest[];

      setRequests(normalizedRequests);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRequests(false);
    }
  }, [user?.userId]);

  useEffect(() => {
    if (user?.userId) {
      fetchRequests();
    }
  }, [fetchRequests, user?.userId]);

  useEffect(() => {
    const handleUpdate = () => fetchRequests();
    window.addEventListener('wfh-request-updated', handleUpdate);
    return () => window.removeEventListener('wfh-request-updated', handleUpdate);
  }, [fetchRequests]);

  const handleSubmit = async () => {
    if (!user?.userId || !formData.startDate || !formData.endDate || !formData.reason || !formData.managerName || !formData.managerId) {
      setMessage('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      const response = await fetch('/api/timeOff/wfh-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: user.userId,
          employeeName: user.name || 'Employee',
          managerId: formData.managerId,
          managerName: formData.managerName,
          startDate: formData.startDate,
          endDate: formData.endDate,
          reason: formData.reason,
          notifyManager: true,
        }),
      });

      const rawText = await response.text();
      let result: { error?: string } | null = null;

      if (rawText) {
        try {
          result = JSON.parse(rawText) as { error?: string };
        } catch {
          result = { error: rawText };
        }
      }

      if (!response.ok) {
        const serverMessage = result?.error || 'Failed to submit WFH request';
        throw new Error(serverMessage);
      }

      setMessage('WFH request submitted successfully.');
      setFormData({ startDate: '', endDate: '', reason: '', managerName: '', managerId: '' });
      setShowForm(false);
      await fetchRequests();
      window.dispatchEvent(new Event('wfh-request-updated'));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to submit WFH request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="section-title">Work From Home</h2>
          <p className="section-subtitle">Remote work requests and quota tracker</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(v => !v)}>
          <Plus size={11} />
          Request WFH
        </button>
      </div>

      {/* Quota strip */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-6">
        <div>
          <p className="text-xs text-slate-500">Days Used</p>
          <p className="text-2xl font-semibold text-slate-800">{attendanceStats.wfhDaysUsed}</p>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-2xs text-slate-500">Annual quota</span>
            <span className="text-2xs font-medium text-slate-700">{attendanceStats.wfhDaysUsed} / {attendanceStats.wfhDaysTotal} days</span>
          </div>
          <div className="progress-bar h-1.5">
            <div className="progress-fill bg-indigo-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div>
          <p className="text-xs text-slate-500">Remaining</p>
          <p className="text-2xl font-semibold text-indigo-700">{attendanceStats.wfhDaysTotal - attendanceStats.wfhDaysUsed}</p>
        </div>
      </div>

      {/* Inline WFH request form */}
      {showForm && (
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-25">
          <p className="text-xs font-semibold text-slate-700 mb-2.5">New WFH Request</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Start Date *</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="form-input" />
            </div>
            <div>
              <label className="form-label">End Date *</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="form-input" />
            </div>
            <div className="col-span-2">
              <label className="form-label">Reason *</label>
              <input type="text" name="reason" value={formData.reason} onChange={handleChange} className="form-input" placeholder="Reason for remote work" />
            </div>
            <div>
              <label className="font-label">Manager Name *</label>
              <input type="text" name="managerName" value={formData.managerName} onChange={handleChange} className='form-input' placeholder='Enter your manager name'/>
            </div>
            <div>
              <label className="font-label">Manager ID *</label>
              <input type="text" name="managerId" value={formData.managerId} onChange={handleChange} className='form-input' placeholder='Enter your manager ID'/>
            </div>
          </div>
          {message && (
            <p className="mt-2 text-sm text-slate-600">{message}</p>
          )}
          <div className="flex items-center gap-2 mt-3">
            <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
            <button className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Pending requests */}
      <div className="px-4 py-2.5 border-b border-slate-100">
        <p className="text-2xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Pending Requests</p>
        {loadingRequests ? (
          <div className="text-xs text-slate-500">Loading requests…</div>
        ) : (
          <div className="space-y-1.5">
            {requests.filter((req) => req.status === 'PENDING').map((req) => (
              <div key={req.requestId} className="flex items-center gap-2">
                <Laptop size={12} className="text-slate-400" />
                <span className="text-xs text-slate-700">{new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}</span>
                <span className={`badge ${statusClasses[req.status] ?? 'badge-gray'} ml-auto`}>{statusLabels[req.status] ?? req.status}</span>
              </div>
            ))}
            {requests.filter((req) => req.status === 'PENDING').length === 0 && (
              <div className="text-xs text-slate-500">No pending requests at the moment.</div>
            )}
          </div>
        )}
      </div>

      {/* History */}
      <div className="px-4 py-2.5">
        <p className="text-2xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Recent History</p>
        <div className="space-y-2">
          {requests.filter((req) => req.status !== 'PENDING').length > 0 ? (
            requests
              .filter((req) => req.status !== 'PENDING')
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .map((req) => (
                <div key={req.requestId} className="flex items-center gap-2">
                  <CalendarDays size={11} className="text-slate-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-slate-700">{new Date(req.updatedAt).toLocaleDateString()}</span>
                    <p className="text-sm text-slate-700 truncate">
                      {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()} · {req.managerName}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{req.reason}</p>
                  </div>
                  <span className={`badge ${statusClasses[req.status] ?? 'badge-gray'}`}>{statusLabels[req.status] ?? req.status}</span>
                </div>
              ))
          ) : (
            <div className="text-xs text-slate-500">No approved or rejected history yet.</div>
          )}
        </div>
      </div>

      <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-25">
        <button className="text-2xs text-brand-600 hover:underline">View full WFH history →</button>
      </div>
    </div>
  );
}
