'use client';
import { useState } from 'react';
import { Filter, Download, ChevronDown, MessageSquare, X, RotateCcw } from 'lucide-react';
import { leaveRequests } from '@/data/mockData';
import type { LeaveStatus } from '@/types/indexOriginal';
import clsx from 'clsx';

const statusBadge: Record<LeaveStatus, string> = {
  Pending:   'badge-yellow',
  Approved:  'badge-green',
  Rejected:  'badge-red',
  Cancelled: 'badge-gray',
  Withdrawn: 'badge-gray',
};

const statusFilters: (LeaveStatus | 'All')[] = ['All', 'Pending', 'Approved', 'Rejected', 'Cancelled'];

export default function LeaveApprovalTable() {
  const [filter, setFilter] = useState<LeaveStatus | 'All'>('All');
  const [commentModal, setCommentModal] = useState<string | null>(null);

  const rows = filter === 'All' ? leaveRequests : leaveRequests.filter(r => r.status === filter);

  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="section-title">Leave Request History</h2>
          <p className="section-subtitle">All leave requests for the current leave year</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary">
            <Filter size={11} />
            Filter
          </button>
          <button className="btn-secondary">
            <Download size={11} />
            Export
          </button>
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
                ({leaveRequests.filter(r => r.status === s).length})
              </span>
            )}
          </button>
        ))}
        <span className="ml-auto text-2xs text-slate-400 whitespace-nowrap">{rows.length} record{rows.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              {['Request ID','Leave Type','Start Date','End Date','Duration','Applied On','Approver','Status','','Actions'].map(h => (
                <th key={h} className="table-th whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={10} className="table-td text-center py-10 text-slate-400">
                  No records found for selected filter.
                </td>
              </tr>
            ) : rows.map(row => (
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
      </div>

      <div className="px-4 py-2.5 border-t border-slate-100 flex items-center justify-between bg-slate-25">
        <span className="text-2xs text-slate-400">Showing {rows.length} of {leaveRequests.length} requests</span>
        <div className="flex items-center gap-1">
          <button className="px-2 py-0.5 text-2xs border border-slate-200 rounded text-slate-500 hover:bg-slate-100 disabled:opacity-40" disabled>Prev</button>
          <span className="px-2 py-0.5 text-2xs border border-brand-600 bg-brand-600 text-white rounded">1</span>
          <button className="px-2 py-0.5 text-2xs border border-slate-200 rounded text-slate-500 hover:bg-slate-100 disabled:opacity-40" disabled>Next</button>
        </div>
      </div>

      {/* Comment Modal */}
      {commentModal && (() => {
        const req = leaveRequests.find(r => r.id === commentModal);
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
