// 'use client';
// import {
//   LayoutDashboard, Calendar, Clock, FileText,
//   Users, BarChart2, Settings, ChevronRight,
//   Briefcase, CreditCard, HelpCircle,
// } from 'lucide-react';
// import { useState } from 'react';
// import clsx from 'clsx';

// const navItems = [
//   { icon: LayoutDashboard, label: 'Dashboard',    active: false },
//   { icon: Clock,           label: 'Time Off',      active: false },
//   { icon: Calendar,        label: 'Attendance',    active: false },
//   { icon: FileText,        label: 'Payslips',      active: false },
//   { icon: Briefcase,       label: 'Benefits',      active: false },
//   { icon: Users,           label: 'Team',          active: false },
//   { icon: CreditCard,      label: 'Expenses',      active: false },
//   { icon: BarChart2,       label: 'Reports',       active: false },
//   { icon: Settings,        label: 'Settings',      active: false },
//   { icon: HelpCircle,      label: 'Help & Support',active: false },
// ];

// export default function Sidebar() {
//   const [collapsed, setCollapsed] = useState(false);

//   return (
//     <aside className={clsx(
//       'bg-white border-r border-slate-200 flex flex-col transition-all duration-200 shrink-0 hidden lg:flex',
//       collapsed ? 'w-12' : 'w-48'
//     )}>
//       {/* Collapse toggle */}
//       <div className="h-10 flex items-center justify-end px-2 border-b border-slate-100">
//         <button
//           onClick={() => setCollapsed(v => !v)}
//           className={clsx(
//             'w-5 h-5 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 transition-all duration-200',
//             collapsed && 'rotate-180'
//           )}
//         >
//           <ChevronRight size={12} />
//         </button>
//       </div>

//       <nav className="flex-1 py-2 overflow-y-auto">
//         {navItems.map(({ icon: Icon, label, active }) => (
//           <button
//             key={label}
//             className={clsx(
//               'w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors duration-150',
//               active
//                 ? 'text-brand-700 bg-brand-50 border-r-2 border-brand-600'
//                 : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800',
//               collapsed && 'justify-center'
//             )}
//             title={collapsed ? label : undefined}
//           >
//             <Icon size={14} className={active ? 'text-brand-600' : 'text-slate-400'} />
//             {!collapsed && <span className="truncate">{label}</span>}
//           </button>
//         ))}
//       </nav>

//       {!collapsed && (
//         <div className="p-3 border-t border-slate-100">
//           <div className="bg-slate-50 rounded p-2.5">
//             <p className="text-2xs font-medium text-slate-700">Q2 2025</p>
//             <p className="text-2xs text-slate-500 mt-0.5">Apr – Jun cycle</p>
//             <div className="mt-1.5 progress-bar">
//               <div className="progress-fill bg-brand-500" style={{ width: '72%' }} />
//             </div>
//             <p className="text-2xs text-slate-400 mt-1">72% complete</p>
//           </div>
//         </div>
//       )}
//     </aside>
//   );
// }
