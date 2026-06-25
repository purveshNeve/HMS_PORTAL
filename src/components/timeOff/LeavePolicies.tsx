'use client';
import { useState } from 'react';
import { FileText, ChevronDown, ChevronRight, Download } from 'lucide-react';

const policies = [
  {
    id: 'annual',
    title: 'Annual Leave Policy',
    summary: '21 days per year. Accrual: 1.75 days/month. Carry forward up to 10 days.',
    detail: 'Employees are entitled to 21 days of annual leave per calendar year, accrued at 1.75 days per month. Annual leave can be carried forward up to a maximum of 10 days into the next leave year. Unused leave beyond 10 days lapses on 31 December. Leave must be applied at least 2 working days in advance for durations up to 3 days, and at least 5 working days in advance for longer periods.',
    doc: 'Annual_Leave_Policy_2025.pdf',
  },
  {
    id: 'carryforward',
    title: 'Carry Forward Rules',
    summary: 'Annual Leave: max 10 days. Sick, Casual, and WFH: no carry forward.',
    detail: 'Only Annual Leave may be carried forward, subject to a maximum of 10 days. Casual Leave, Sick Leave, Optional Holidays, and WFH quota cannot be carried forward and lapse at year-end. Comp Off must be utilized within 90 days of being earned; unused Comp Off is forfeited.',
    doc: 'Carry_Forward_Policy_2025.pdf',
  },
  {
    id: 'sick',
    title: 'Sick Leave Rules',
    summary: '12 days per year. Medical certificate required for 3+ consecutive days.',
    detail: 'Employees are entitled to 12 days of sick leave per year. For absences of 3 or more consecutive days, a medical certificate from a registered medical practitioner must be submitted within 5 working days of return. Sick leave cannot be carried forward and does not qualify for encashment. In case of hospitalization, extended sick leave may be granted on a case-by-case basis by HR.',
    doc: 'Sick_Leave_Policy_2025.pdf',
  },
  {
    id: 'notice',
    title: 'Notice Period Requirements',
    summary: 'Leave applications must be submitted 2–5 days in advance depending on duration.',
    detail: 'Leaves of 1–3 days require a minimum of 2 working days notice. Leaves of 4–7 days require 5 working days notice. Leaves exceeding 7 days require 10 working days notice. Emergency leave (e.g., bereavement, hospitalisation) may be notified within 24 hours with supporting documentation submitted on return.',
    doc: 'Leave_Notice_Requirements_2025.pdf',
  },
  {
    id: 'encashment',
    title: 'Leave Encashment Rules',
    summary: 'Annual leave may be encashed up to 10 days per year at full basic salary.',
    detail: 'Employees who have accumulated Annual Leave above 10 days (the carry-forward ceiling) may apply for encashment of up to 10 days per leave year, calculated at full basic salary. Encashment requests must be submitted to HR by 15 December each year. Encashment is processed in the January payroll. Sick, Casual, and Comp Off leaves are not eligible for encashment.',
    doc: 'Leave_Encashment_Policy_2025.pdf',
  },
  {
    id: 'approval',
    title: 'Approval Process',
    summary: 'All leave requires reporting manager approval. HR is notified for absences exceeding 5 days.',
    detail: 'Leave requests are routed to the employee\'s direct reporting manager for approval. The manager has 2 working days to act on a request before it escalates to HR for resolution. For leaves exceeding 5 days, HR Business Partner is automatically notified. Rejected requests include a mandatory comment explaining the reason. Employees may appeal a rejection by contacting HR directly.',
    doc: 'Leave_Approval_Process_2025.pdf',
  },
];

export default function LeavePolicies() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="section-title">Leave Policies</h2>
          <p className="section-subtitle">Company leave rules and entitlements · Effective 1 Jan 2025</p>
        </div>
        <button className="btn-secondary">
          <Download size={11} />
          All Policies
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {policies.map(policy => (
          <div key={policy.id}>
            <button
              onClick={() => setOpen(open === policy.id ? null : policy.id)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-25 transition-colors text-left"
            >
              <FileText size={14} className="text-slate-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-800">{policy.title}</p>
                <p className="text-2xs text-slate-500 mt-0.5 truncate">{policy.summary}</p>
              </div>
              {open === policy.id
                ? <ChevronDown size={13} className="text-slate-400 flex-shrink-0" />
                : <ChevronRight size={13} className="text-slate-400 flex-shrink-0" />
              }
            </button>

            {open === policy.id && (
              <div className="px-4 pb-3 ml-5">
                <div className="pl-3 border-l-2 border-slate-200">
                  <p className="text-xs text-slate-600 leading-relaxed">{policy.detail}</p>
                  <button className="mt-2 flex items-center gap-1.5 text-2xs text-brand-600 hover:underline">
                    <Download size={10} />
                    {policy.doc}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-25">
        <p className="text-2xs text-slate-400">
          For policy clarifications, contact <span className="text-brand-600 cursor-pointer hover:underline">hr@company.com</span> or raise an HR ticket.
        </p>
      </div>
    </div>
  );
}
