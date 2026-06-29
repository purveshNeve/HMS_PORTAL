'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { CheckCircle, AlertCircle, Info, XCircle, X, CheckCheck } from 'lucide-react';
import type { Notification } from '@/types/indexOriginal';
import clsx from 'clsx';

const iconMap = {
  success: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  warning: { icon: AlertCircle, color: 'text-amber-500',   bg: 'bg-amber-50',   border: 'border-amber-200'   },
  info:    { icon: Info,        color: 'text-blue-500',    bg: 'bg-blue-50',    border: 'border-blue-200'    },
  error:   { icon: XCircle,     color: 'text-red-500',     bg: 'bg-red-50',     border: 'border-red-200'     },
};

interface BackendLeaveRequest {
  requestId: string;
  leaveType: string;
  status: string;
  startDate: string;
  endDate: string;
  managerName: string;
  comments?: string;
}

function buildNotificationItems(requests: BackendLeaveRequest[]) {
  const notices: Notification[] = [];
  requests.forEach((req) => {
    const approved = req.status === 'APPROVED';
    const rejected = req.status === 'REJECTED';
    if (approved || rejected) {
      notices.push({
        id: `leave-${req.requestId}`,
        type: approved ? 'success' : 'warning',
        message: `Your ${req.leaveType} request (${req.requestId}) has been ${approved ? 'approved' : 'rejected'} by ${req.managerName}.`,
        time: new Date(req.endDate).toLocaleDateString(),
        read: false,
      });
    } else if (req.status === 'PENDING') {
      notices.push({
        id: `leave-${req.requestId}`,
        type: 'info',
        message: `Your ${req.leaveType} request (${req.requestId}) is pending approval from ${req.managerName}.`,
        time: new Date(req.startDate).toLocaleDateString(),
        read: false,
      });
    }
    if (req.comments && req.comments.trim()) {
      notices.push({
        id: `comment-${req.requestId}`,
        type: 'info',
        message: `Manager commented on ${req.requestId}: "${req.comments}"`,
        time: new Date(req.endDate).toLocaleDateString(),
        read: false,
      });
    }
  });
  return notices;
}

export default function NotificationsAlerts() {
  const { user } = useAuth();
  const employeeId = user?.userId;
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = useCallback(async () => {
    if (!employeeId) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/timeOff/leave-requests?employeeId=${encodeURIComponent(employeeId)}&status=APPROVED,PENDING,REJECTED`);
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || 'Failed to load notifications');
      }

      const data = await res.json() as BackendLeaveRequest[];
      const notices = buildNotificationItems(data);
      setItems(notices);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load notifications');
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    fetchNotifications();

    const handleRefresh = () => {
      fetchNotifications();
    };

    window.addEventListener('leave-request-updated', handleRefresh);
    window.addEventListener('focus', handleRefresh);

    return () => {
      window.removeEventListener('leave-request-updated', handleRefresh);
      window.removeEventListener('focus', handleRefresh);
    };
  }, [fetchNotifications]);

  const dismiss = (id: string) => setItems(prev => prev.filter(n => n.id !== id));
  const markRead = (id: string) => setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const unreadCount = items.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="card p-6 text-center text-slate-500">Loading notifications...</div>
    );
  }

  if (error) {
    return (
      <div className="card p-6 text-center text-rose-600">{error}</div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="section-title">Notifications</h2>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 bg-red-500 text-white text-2xs font-bold rounded-full leading-none">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            className="flex items-center gap-1 text-2xs text-slate-500 hover:text-brand-600 transition-colors"
            onClick={() => setItems([])}
          >
            <CheckCheck size={11} />
            Mark all read
          </button>
        )}
      </div>

      <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
        {items.length === 0 ? (
          <div className="p-6 text-center">
            <CheckCircle size={20} className="text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-400">You're all caught up.</p>
          </div>
        ) : items.map(n => {
          const cfg = iconMap[n.type];
          const Icon = cfg.icon;
          return (
            <div
              key={n.id}
              className={clsx(
                'flex items-start gap-3 px-4 py-3 hover:bg-slate-25 transition-colors',
                !n.read && 'bg-blue-50/30'
              )}
              onClick={() => markRead(n.id)}
            >
              <div className={clsx('shrink-0 w-7 h-7 rounded flex items-center justify-center border mt-0.5', cfg.bg, cfg.border)}>
                <Icon size={13} className={cfg.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={clsx('text-xs leading-relaxed', n.read ? 'text-slate-600' : 'text-slate-800 font-medium')}>{n.message}</p>
                <p className="text-2xs text-slate-400 mt-0.5">{n.time}</p>
              </div>
              <button
                onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                className="shrink-0 w-5 h-5 flex items-center justify-center rounded text-slate-300 hover:text-slate-500 hover:bg-slate-100 transition-colors mt-0.5"
              >
                <X size={11} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
