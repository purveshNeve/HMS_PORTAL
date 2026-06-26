'use client';
import { useState, useEffect, useCallback } from 'react';
import { Paperclip, X, ChevronDown, Info } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '@/hooks/useAuth';

const leaveTypes = [
  'Annual Leave', 'Casual Leave', 'Sick Leave', 'Maternity Leave',
  'Paternity Leave', 'Bereavement Leave', 'Optional Holiday',
  'Comp Off', 'Work From Home', 'Unpaid Leave',
];

const delegates = [
  'Priya Nair', 'Karan Singh', 'Sneha Iyer', 'Rahul Gupta', 'Deepa Krishnan',
];

export default function LeaveRequestForm() {
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [session, setSession] = useState<'Morning' | 'Afternoon'>('Morning');
  const [reason, setReason] = useState('');
  const [notify, setNotify] = useState(true);
  const [managerId, setManagerId] = useState('');
  const [managerName, setManagerName] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [delegate, setDelegate] = useState('');
  const [fileName, setFileName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [draft, setDraft] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const { user } = useAuth();
  const employeeId = user?.userId ?? 'EMPLOYEE_001';
  const employeeName = user?.name ?? 'Current Employee';

  const calcDays = () => {
    if (!startDate || !endDate) return 0;
    if (isHalfDay) return 0.5;
    const diff = (new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000;
    return diff >= 0 ? diff + 1 : 0;
  };
  const days = calcDays();

  const handleSubmit = useCallback(async () => {
    setError('');
    
    // Validation
    if (!managerId || !managerName) {
      setError('Manager ID and Manager Name are required');
      return;
    }

    if (!leaveType || !startDate || !endDate || !reason) {
      setError('All required fields must be filled');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/timeOff/leave-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId,
          employeeName,
          managerId,
          managerName,
          reason,
          startDate,
          endDate,
          leaveType,
          isHalfDay,
          session,
          emergencyContact,
          delegate,
          notifyManager: notify,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to submit leave request');
      }

      setReferenceId(data.requestId || `LR-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit leave request');
    } finally {
      setLoading(false);
    }
  }, [employeeId, employeeName, managerId, managerName, reason, startDate, endDate, leaveType, isHalfDay, session, emergencyContact, delegate, notify]);

  if (submitted) return (
    <div className="card p-6 text-center">
      <div className="w-10 h-10 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-3">
        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-slate-800">Request Submitted</h3>
      <p className="text-xs text-slate-500 mt-1">Your leave request has been submitted to {managerName} and is pending manager approval.</p>
      <p className="text-2xs text-slate-400 mt-0.5">Reference ID: {referenceId}</p>
      <button onClick={() => {
        setSubmitted(false);
        setLeaveType('');
        setStartDate('');
        setEndDate('');
        setReason('');
        setManagerId('');
        setManagerName('Anita Sharma');
      }} className="btn-secondary mt-4 mx-auto">New Request</button>
    </div>
  );

  if (draft) return (
    <div className="card p-6 text-center">
      <div className="w-10 h-10 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center mx-auto mb-3">
        <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-slate-800">Draft Saved</h3>
      <p className="text-xs text-slate-500 mt-1">Your leave request draft has been saved. You can resume it anytime.</p>
      <button onClick={() => setDraft(false)} className="btn-secondary mt-4 mx-auto">Edit Draft</button>
    </div>
  );

  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100">
        <h2 className="section-title">Request Time Off</h2>
        <p className="section-subtitle">All fields marked * are required. Requests are routed to your reporting manager.</p>
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3.5">
        {/* Leave Type */}
        <div className="sm:col-span-2">
          <label className="form-label">Leave Type *</label>
          <div className="relative">
            <select
              className="form-select pr-7"
              value={leaveType}
              onChange={e => setLeaveType(e.target.value)}
            >
              <option value="">Select leave type</option>
              {leaveTypes.map(t => <option key={t}>{t}</option>)}
            </select>
            <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Dates */}
        <div>
          <label className="form-label">Start Date *</label>
          <input type="date" className="form-input" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div>
          <label className="form-label">End Date *</label>
          <input type="date" className="form-input" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate} />
        </div>

        {/* Half Day toggle */}
        <div className="sm:col-span-2">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isHalfDay}
                onChange={e => setIsHalfDay(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-xs text-slate-700">Half Day</span>
            </label>
            {isHalfDay && (
              <div className="flex items-center gap-2">
                <span className="text-2xs text-slate-500">Session:</span>
                {(['Morning', 'Afternoon'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setSession(s)}
                    className={clsx(
                      'px-2.5 py-0.5 text-2xs rounded border font-medium transition-colors',
                      session === s
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {days > 0 && (
              <div className="ml-auto flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded px-2.5 py-1">
                <Info size={11} className="text-slate-400" />
                <span className="text-xs font-semibold text-slate-700">{days}</span>
                <span className="text-2xs text-slate-500">{days === 1 ? 'working day' : 'working days'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Reason */}
        <div className="sm:col-span-2">
          <label className="form-label">Reason *</label>
          <textarea
            className="form-input resize-none"
            rows={3}
            placeholder="Briefly describe the reason for your leave..."
            value={reason}
            onChange={e => setReason(e.target.value)}
          />
          <p className="text-2xs text-slate-400 mt-0.5">{reason.length}/250 characters</p>
        </div>

        {/* Emergency Contact */}
        <div>
          <label className="form-label">Emergency Contact During Leave</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Name and phone number"
            value={emergencyContact}
            onChange={e => setEmergencyContact(e.target.value)}
          />
        </div>

        {/* Delegate */}
        <div>
          <label className="form-label">Delegate Responsibilities To</label>
          <div className="relative">
            <select 
              className="form-select pr-7"
              value={delegate}
              onChange={e => setDelegate(e.target.value)}
            >
              <option value="">Select team member</option>
              {delegates.map(d => <option key={d}>{d}</option>)}
            </select>
            <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Attachment */}
        <div className="sm:col-span-2">
          <label className="form-label">Supporting Document</label>
          <div className="flex items-center gap-2">
            <label className="btn-secondary cursor-pointer">
              <Paperclip size={11} />
              {fileName ? 'Change File' : 'Attach File'}
              <input
                type="file"
                className="hidden"
                onChange={e => setFileName(e.target.files?.[0]?.name ?? '')}
              />
            </label>
            {fileName && (
              <div className="flex items-center gap-1.5 text-2xs text-slate-600 bg-slate-50 border border-slate-200 rounded px-2 py-1">
                <Paperclip size={10} className="text-slate-400" />
                <span className="truncate max-w-36">{fileName}</span>
                <button onClick={() => setFileName('')}><X size={10} className="text-slate-400 hover:text-red-500" /></button>
              </div>
            )}
            {!fileName && <span className="text-2xs text-slate-400">PDF, JPG or PNG up to 5 MB</span>}
          </div>
        </div>

        {/* Notify manager */}
        <div className="sm:col-span-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={notify}
              onChange={e => setNotify(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-xs text-slate-700">Notify manager (Anita Sharma) by email</span>
          </label>
          <div className="grid gap-3 mt-3 sm:grid-cols-2">
            <div>
              <label className="form-label">Manager ID</label>
              <input
                type="text"
                className="form-input"
                value={managerId}
                onChange={e => setManagerId(e.target.value)}
                placeholder="Enter manager ID"
              />
            </div>
            <div>
              <label className="form-label">Manager Name</label>
              <input
                type="text"
                className="form-input"
                value={managerName}
                onChange={e => setManagerName(e.target.value)}
                placeholder="Enter manager name"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-4 py-3 bg-red-50 border-t border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 border-t border-slate-100 flex items-center gap-2 bg-slate-25">
        <button
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSubmit}
          disabled={loading || !leaveType || !startDate || !endDate || !reason || !managerId || !managerName}
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
        <button className="btn-secondary" onClick={() => setDraft(true)}>
          Save Draft
        </button>
        <button className="btn-ghost ml-auto text-slate-400 hover:text-slate-600">
          Cancel
        </button>
      </div>
    </div>
  );
}
