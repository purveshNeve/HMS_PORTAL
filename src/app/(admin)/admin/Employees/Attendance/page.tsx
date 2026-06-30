'use client';
import { useState, useEffect } from 'react';
import { Loader, Check, X } from 'lucide-react';

interface CompOffRequest {
  _id: string;
  requestId: string;
  employeeId: string;
  employeeName: string;
  department: string;
  workDate: string;
  workType: string;
  hoursWorked: number;
  status: string;
  compOffDaysEarned: number;
}

export default function ApplicationsPage() {
  const [approvedRequests, setApprovedRequests] = useState<CompOffRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expiryDates, setExpiryDates] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchApprovedRequests();
    const interval = setInterval(fetchApprovedRequests, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchApprovedRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/timeOff/comp-off-approved');
      const data = await response.json();
      setApprovedRequests(data.data || []);
    } catch (error) {
      console.error('Failed to fetch approved requests:', error);
      setMessage('Failed to load approved requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAllocate = async (request: CompOffRequest) => {
    const expiryDate = expiryDates[request._id];
    
    if (!expiryDate) {
      setMessage('Please select an expiry date');
      return;
    }

    try {
      setActionLoading(request._id);
      setMessage('');

      const response = await fetch('/api/timeOff/comp-off-allocate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          compOffRequestId: request._id,
          employeeId: request.employeeId,
          employeeName: request.employeeName,
          workDate: request.workDate,
          workType: request.workType,
          days: request.compOffDaysEarned,
          earnedOn: new Date(request.workDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          expiryDate: expiryDate,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to allocate comp off');
      }

      setMessage('Comp off allocated successfully');

      // Delete the request from DB after successful allocation
      try {
        const deleteResponse = await fetch(`/api/timeOff/comp-off-request/${request._id}`, {
          method: 'DELETE',
        });

        if (!deleteResponse.ok) {
          console.error('Warning: Failed to delete request after allocation');
        } else {
          console.log('Successfully deleted request from DB');
        }
      } catch (deleteError) {
        console.error('Error during deletion:', deleteError);
      }

      // Clear the expiry date for this request
      setExpiryDates(prev => {
        const updated = { ...prev };
        delete updated[request._id];
        return updated;
      });
      
      // Refresh the list after a brief delay
      setTimeout(() => {
        fetchApprovedRequests();
      }, 800);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to allocate comp off');
      console.error('Allocation error:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (request: CompOffRequest) => {
    try {
      setActionLoading(request._id);
      
      // Delete rejected request
      const response = await fetch(`/api/timeOff/comp-off-request/${request._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reject request');
      }

      setMessage('Request rejected and deleted');
      setExpiryDates(prev => {
        const updated = { ...prev };
        delete updated[request._id];
        return updated;
      });
      
      // Refresh the list after a brief delay
      setTimeout(() => {
        fetchApprovedRequests();
      }, 800);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to reject request');
      console.error('Rejection error:', error);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Attendance and Leave Management
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Review and process employee applications.
        </p>
      </div>

      {/* Comp Off Allocation Cards */}
      <div>
        <div className="mb-4">
          <h2 className="section-title">Allocate Compensatory Off</h2>
          <p className="section-subtitle">Process approved comp off requests</p>
        </div>

        {/* Global Message */}
        {message && (
          <div className={`mb-4 p-3 rounded-md text-sm ${message.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size={24} className="animate-spin text-slate-400" />
            <span className="ml-2 text-slate-500">Loading requests...</span>
          </div>
        ) : approvedRequests.length === 0 ? (
          <div className="text-center py-12 border border-slate-200 rounded-lg bg-slate-25">
            <p className="text-slate-500">No approved comp off requests to process.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {approvedRequests.map((request) => (
              <div key={request._id} className="card border-slate-200 p-5">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-slate-500 text-2xs uppercase tracking-[0.16em] mb-2">
                      <span>Request ID</span>
                      <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600">{request.requestId}</span>
                    </div>
                    <h3 className="text-base font-semibold text-slate-900">{request.employeeName}</h3>
                    <p className="text-sm text-slate-600">{request.workType}</p>
                  </div>
                  <span className="badge badge-yellow">{request.status}</span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4 text-sm text-slate-600">
                  <div>
                    <span className="block text-slate-500 text-2xs uppercase tracking-[0.2em]">Department</span>
                    <span>{request.department}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 text-2xs uppercase tracking-[0.2em]">Work Date</span>
                    <span>{new Date(request.workDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 text-2xs uppercase tracking-[0.2em]">Hours Worked</span>
                    <span>{request.hoursWorked}h</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 text-2xs uppercase tracking-[0.2em]">Days Earned</span>
                    <span className="font-semibold text-indigo-600">{request.compOffDaysEarned}d</span>
                  </div>
                </div>

                {/* Form Section */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-25 rounded-md border border-slate-100">
                  {/* Earned Date - Read only */}
                  <div>
                    <label className="form-label">Earned (Work Date) *</label>
                    <input
                      type="date"
                      value={request.workDate.split('T')[0]}
                      readOnly
                      className="form-input bg-white cursor-not-allowed text-slate-600"
                    />
                  </div>

                  {/* Expiry Date */}
                  <div>
                    <label className="form-label">Expires *</label>
                    <input
                      type="date"
                      value={expiryDates[request._id] || ''}
                      onChange={(e) => setExpiryDates(prev => ({ ...prev, [request._id]: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      className="form-input"
                      placeholder="Select expiry date"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
                  <button
                    className="btn-primary min-w-32 flex items-center justify-center gap-2"
                    onClick={() => handleAllocate(request)}
                    disabled={actionLoading === request._id || !expiryDates[request._id]}
                  >
                    {actionLoading === request._id ? (
                      <>
                        <Loader size={14} className="animate-spin" />
                        Allocating...
                      </>
                    ) : (
                      <>
                        <Check size={14} />
                        Allocate
                      </>
                    )}
                  </button>
                  <button
                    className="btn-secondary min-w-30 flex items-center justify-center gap-2"
                    onClick={() => handleReject(request)}
                    disabled={actionLoading === request._id}
                  >
                    {actionLoading === request._id ? (
                      <>
                        <Loader size={14} className="animate-spin" />
                        Rejecting...
                      </>
                    ) : (
                      <>
                        <X size={14} />
                        Reject
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
