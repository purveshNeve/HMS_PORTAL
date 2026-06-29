'use client';
import { useEffect, useState, useCallback } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import clsx from 'clsx';

interface CommentEntry {
  requestId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  approver: string;
  status: string;
  comments: string;
}

export default function ManagerComments() {
  const { user, session } = useAuth();
  const employeeId = user?.userId || user?.id || session?.user?.userId || session?.user?.id;
  const [items, setItems] = useState<CommentEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchComments = useCallback(async () => {
    if (!employeeId) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `/api/timeOff/manager-comments?employeeId=${encodeURIComponent(employeeId)}&status=APPROVED,PENDING,REJECTED`
      );

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || 'Failed to load comments');
      }

      const requests = (await res.json()) as any[];
      const commented = requests.map((r: any) => ({
        requestId: r.requestId || r._id,
        leaveType: r.leaveType || 'Leave',
        startDate: r.startDate ? new Date(r.startDate).toLocaleDateString() : '-',
        endDate: r.endDate ? new Date(r.endDate).toLocaleDateString() : '-',
        approver: r.managerName || 'Manager',
        status: r.status || 'PENDING',
        comments: typeof r.comments === 'string' ? r.comments : '',
      }));

      setItems(commented);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load manager comments');
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    fetchComments();

    const handleLeaveRequestsUpdated = () => {
      fetchComments();
    };

    window.addEventListener('leave-request-updated', handleLeaveRequestsUpdated);
    window.addEventListener('focus', handleLeaveRequestsUpdated);

    return () => {
      window.removeEventListener('leave-request-updated', handleLeaveRequestsUpdated);
      window.removeEventListener('focus', handleLeaveRequestsUpdated);
    };
  }, [fetchComments]);

  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100">
        <h2 className="section-title">Manager Feedback</h2>
        <p className="section-subtitle">Comments from your reporting manager on leave requests</p>
      </div>
      {loading ? (
        <div className="p-8 text-center">Loading...</div>
      ) : error ? (
        <div className="p-8 text-center text-rose-600">{error}</div>
      ) : items.length === 0 ? (
        <div className="p-8 text-center">
          <MessageSquare size={20} className="text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-400">No manager comments yet.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {items.map(req => (
            <div key={req.requestId} className="px-4 py-3 hover:bg-slate-25 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-teal-700 text-2xs font-semibold">{(req.approver || '').split(' ').map(s => s[0]).join('').slice(0,2)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium text-slate-800">{req.approver}</span>
                    <span className="text-2xs text-slate-400">on</span>
                    <span className="text-2xs text-slate-600">{req.leaveType}</span>
                    <span className={clsx(
                      'badge ml-auto',
                      req.status === 'APPROVED' ? 'badge-green' :
                      req.status === 'REJECTED' ? 'badge-red' : 'badge-yellow'
                    )}>
                      {req.status === 'APPROVED' ? (
                        <><ThumbsUp size={8} className="mr-0.5" />{req.status}</>
                      ) : req.status === 'REJECTED' ? (
                        <><ThumbsDown size={8} className="mr-0.5" />{req.status}</>
                      ) : (
                        <><Clock size={8} className="mr-0.5" />{req.status}</>
                      )}
                    </span>
                  </div>
                  <div className="mt-1.5 bg-slate-50 border border-slate-200 rounded px-2.5 py-2">
                    <p className="text-xs text-slate-700 leading-relaxed">"{req.comments}"</p>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-2xs text-slate-400">{req.requestId}</span>
                    <span className="text-slate-200">·</span>
                    <span className="text-2xs text-slate-400">{req.startDate}</span>
                    <span className="text-2xs text-slate-400">–</span>
                    <span className="text-2xs text-slate-400">{req.endDate}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
