'use client';
import { MessageSquare, ThumbsUp, ThumbsDown, Clock } from 'lucide-react';
import { leaveRequests } from '@/data/mockData';
import clsx from 'clsx';

const commented = leaveRequests.filter(r => r.comments);

export default function ManagerComments() {
  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100">
        <h2 className="section-title">Manager Feedback</h2>
        <p className="section-subtitle">Comments from your reporting manager on leave requests</p>
      </div>

      {commented.length === 0 ? (
        <div className="p-8 text-center">
          <MessageSquare size={20} className="text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-400">No manager comments yet.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {commented.map(req => (
            <div key={req.id} className="px-4 py-3 hover:bg-slate-25 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-teal-700 text-2xs font-semibold">AS</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium text-slate-800">{req.approver}</span>
                    <span className="text-2xs text-slate-400">on</span>
                    <span className="text-2xs text-slate-600">{req.type}</span>
                    <span className={clsx(
                      'badge ml-auto',
                      req.status === 'Approved' ? 'badge-green' :
                      req.status === 'Rejected' ? 'badge-red' : 'badge-yellow'
                    )}>
                      {req.status === 'Approved' ? (
                        <><ThumbsUp size={8} className="mr-0.5" />{req.status}</>
                      ) : req.status === 'Rejected' ? (
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
                    <span className="text-2xs text-slate-400">{req.id}</span>
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
