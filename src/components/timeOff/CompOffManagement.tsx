'use client';
import { Plus, ArrowRight, Loader } from 'lucide-react';
import clsx from 'clsx';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface CompOffRecord {
  _id: string;
  compOffId: string;
  employeeId: string;
  employeeName: string;
  workType: string;
  days: number;
  earnedOn: string;
  expiryDate: string;
  status: string;
}

const statusMap = {
  Available: 'badge-green',
  Used:      'badge-gray',
  Expired:   'badge-red',
};

const workTypeOptions = [
  'Weekend Deployment Support',
  'Critical Release Weekend Work',
  'Holiday On-call Duty',
  'Production Support',
  'Emergency Maintenance',
  'Other',
];

function daysUntilExpiry(dateStr: string) {
  // Handle both formats: "01 Jan 2025" and ISO date "2025-01-01"
  let d: Date;
  
  if (dateStr.includes('-')) {
    // ISO format
    d = new Date(dateStr);
  } else {
    // Format like "01 Jan 2025"
    const parts = dateStr.split(' ');
    const months: Record<string,number> = {
      Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,
      Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11,
    };
    d = new Date(parseInt(parts[2]), months[parts[1]], parseInt(parts[0]));
  }
  
  const diff = Math.ceil((d.getTime() - Date.now()) / 86400000);
  return diff;
}

function formatDate(dateStr: string): string {
  // Convert ISO date or string to "DD Mon YYYY" format
  if (!dateStr) return '';
  
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  
  const formatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  return formatter.format(date);
}

export default function CompOffManagement() {
  const { user } = useAuth();
  const [compOffRecords, setCompOffRecords] = useState<CompOffRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    workDate: '',
    workType: '',
    hoursWorked: '',
    reason: '',
    managerId: '',
    managerName: '',
  });

  useEffect(() => {
    if (user?.userId) {
      console.log('User loaded, fetching comp off records for:', user.userId);
      fetchCompOffRecords();
    }
    
    // Listen for comp off allocation event
    const handleCompOffAllocated = () => {
      console.log('Comp off allocated event received');
      if (user?.userId) {
        fetchCompOffRecords();
      }
    };
    
    window.addEventListener('compoff-allocated', handleCompOffAllocated);
    return () => window.removeEventListener('compoff-allocated', handleCompOffAllocated);
  }, [user?.userId]);

  const fetchCompOffRecords = async () => {
    try {
      if (!user?.userId) {
        console.warn('No user ID available');
        return;
      }
      
      setRecordsLoading(true);
      const response = await fetch(`/api/timeOff/comp-off?employeeId=${user.userId}`);
      console.log('Fetch response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched comp off records:', data.data);
        setCompOffRecords(data.data || []);
      } else {
        console.error('Failed to fetch comp off records:', response.statusText);
        setCompOffRecords([]);
      }
    } catch (error) {
      console.error('Failed to fetch comp off records:', error);
      setCompOffRecords([]);
    } finally {
      setRecordsLoading(false);
    }
  };

  const available = compOffRecords.filter(r => r.status === 'Available');
  const totalAvail = available.reduce((s, r) => s + r.days, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.workDate || !formData.workType || !formData.hoursWorked || !formData.reason || !formData.managerId || !formData.managerName) {
      setMessage('Please fill in all required fields.');
      return;
    }

    if (parseInt(formData.hoursWorked) < 1 || parseInt(formData.hoursWorked) > 24) {
      setMessage('Hours worked must be between 1 and 24.');
      return;
    }

    if (formData.reason.length > 500) {
      setMessage('Reason must not exceed 500 characters.');
      return;
    }

    // Check if work date is in the future
    const workDateObj = new Date(formData.workDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    workDateObj.setHours(0, 0, 0, 0);

    if (workDateObj > today) {
      setMessage('Work date cannot be in the future.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      const response = await fetch('/api/timeOff/comp-off-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: user?.userId,
          employeeName: user?.name || 'Employee',
          department: user?.department || '',
          managerId: formData.managerId,
          managerName: formData.managerName,
          workDate: formData.workDate,
          workType: formData.workType,
          hoursWorked: parseInt(formData.hoursWorked),
          reason: formData.reason,
        }),
      });

      const rawText = await response.text();
      let result: { error?: string; success?: boolean } | null = null;

      if (rawText) {
        try {
          result = JSON.parse(rawText);
        } catch {
          result = { error: rawText };
        }
      }

      if (!response.ok) {
        const serverMessage = result?.error || 'Failed to submit comp-off request';
        throw new Error(serverMessage);
      }

      setMessage('Comp-off request submitted successfully.');
      setFormData({ workDate: '', workType: '', hoursWorked: '', reason: '', managerId: '', managerName: '' });
      setShowForm(false);
      window.dispatchEvent(new Event('compoff-request-updated'));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to submit comp-off request');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="section-title">Compensatory Off</h2>
          <p className="section-subtitle">Earned comp off balance and usage history</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-semibold text-slate-800">{totalAvail} <span className="text-sm font-normal text-slate-500">day{totalAvail !== 1 ? 's' : ''}</span></p>
          <p className="text-2xs text-slate-400">available</p>
        </div>
      </div>

      {/* Comp Off Request Form */}
      {showForm && (
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-25">
          <p className="text-xs font-semibold text-slate-700 mb-3">Request Comp Off</p>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* Employee ID - Readonly */}
            <div>
              <label className="form-label">Employee ID *</label>
              <input 
                type="text" 
                value={user?.userId || ''} 
                readOnly 
                className="form-input bg-slate-100 cursor-not-allowed text-slate-600" 
              />
            </div>

            {/* Employee Name - Readonly */}
            <div>
              <label className="form-label">Employee Name *</label>
              <input 
                type="text" 
                value={user?.name || ''} 
                readOnly 
                className="form-input bg-slate-100 cursor-not-allowed text-slate-600" 
              />
            </div>

            {/* Department - Readonly */}
            <div>
              <label className="form-label">Department *</label>
              <input 
                type="text" 
                value={user?.department || ''} 
                readOnly 
                className="form-input bg-slate-100 cursor-not-allowed text-slate-600" 
              />
            </div>

            {/* Manager - Readonly */}
            <div>
              <label className="form-label">Manager *</label>
              <input 
                type="text" 
                value={formData.managerName} 
                readOnly 
                className="form-input bg-slate-100 cursor-not-allowed text-slate-600" 
              />
            </div>

            {/* Work Date - Date Picker */}
            <div>
              <label className="form-label">Work Date *</label>
              <input 
                type="date" 
                name="workDate" 
                value={formData.workDate} 
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                className="form-input" 
              />
            </div>

            {/* Work Type - Dropdown */}
            <div>
              <label className="form-label">Work Type *</label>
              <select 
                name="workType" 
                value={formData.workType} 
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Select Work Type</option>
                {workTypeOptions.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Hours Worked */}
            <div>
              <label className="form-label">Hours Worked</label>
              <input 
                type="number" 
                name="hoursWorked" 
                value={formData.hoursWorked} 
                onChange={handleChange}
                min="1"
                max="24"
                className="form-input" 
                placeholder="1-24 hours"
              />
            </div>

            {/* Manager ID - for backend requirement */}
            <div className="hidden">
              <input 
                type="text" 
                name="managerId" 
                value={formData.managerId} 
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Manager Selection Section */}
          <div className="mb-3 p-3 bg-white border border-slate-200 rounded-md">
            <p className="text-xs font-medium text-slate-700 mb-2">Select Your Manager *</p>
            <div className="flex gap-2">
              <input 
                type="text" 
                name="managerId" 
                value={formData.managerId} 
                onChange={handleChange}
                placeholder="Manager ID (e.g., EMP001)"
                className="form-input flex-1"
              />
              <input 
                type="text" 
                name="managerName" 
                value={formData.managerName} 
                onChange={handleChange}
                placeholder="Manager Name"
                className="form-input flex-1"
              />
            </div>
          </div>

          {/* Reason - Textarea */}
          <div className="mb-3">
            <label className="form-label">Reason *</label>
            <textarea 
              name="reason" 
              value={formData.reason} 
              onChange={handleChange}
              maxLength={500}
              placeholder="Describe the work performed and business justification"
              className="form-input resize-none"
              rows={3}
            />
            <p className="text-2xs text-slate-400 mt-1">{formData.reason.length}/500 characters</p>
          </div>

          {/* Message */}
          {message && (
            <p className={`mt-2 text-sm ${message.includes('success') || message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}

          {/* Buttons */}
          <div className="flex items-center gap-2 mt-3">
            <button 
              className="btn-primary flex items-center gap-2" 
              onClick={handleSubmit} 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader size={11} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Comp Off Request'
              )}
            </button>
            <button 
              className="btn-ghost" 
              onClick={() => {
                setShowForm(false);
                setMessage('');
              }}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="divide-y divide-slate-100">
        {recordsLoading ? (
          <div className="px-4 py-8 flex items-center justify-center">
            <Loader size={20} className="animate-spin text-slate-400" />
            <span className="ml-2 text-sm text-slate-500">Loading records...</span>
          </div>
        ) : compOffRecords.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-slate-500">No comp off records yet.</p>
          </div>
        ) : (
          compOffRecords.map(rec => {
            const countdown = daysUntilExpiry(rec.expiryDate);
            const earnedDate = formatDate(rec.earnedOn);
            const expiryDate = formatDate(rec.expiryDate);
            return (
              <div key={rec._id} className="px-4 py-3 flex items-center gap-3 hover:bg-slate-25 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium text-slate-800">{rec.workType}</span>
                    <span className={clsx('badge', statusMap[rec.status as keyof typeof statusMap])}>{rec.status}</span>
                  </div>
                  <p className="text-2xs text-slate-400 mt-0.5">
                    Earned: {earnedDate} · Expires: {expiryDate}
                    {rec.status === 'Available' && countdown > 0 && countdown <= 30 && (
                      <span className="ml-1.5 text-amber-600 font-medium">· {countdown} days left</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-sm font-semibold text-slate-700">{rec.days}d</span>
                  {rec.status === 'Available' && (
                    <button className="btn-ghost px-2 py-1 text-2xs text-brand-600">
                      Use <ArrowRight size={10} />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="px-4 py-3 border-t border-slate-100 flex items-center gap-2 bg-slate-25">
        <button onClick={() => setShowForm(v => !v)} className="btn-primary">
          <Plus size={11} />
          Request Comp Off
        </button>
        <button className="btn-secondary">Convert to Leave</button>
      </div>
    </div>
  );
}
