// 'use client';
// import { Bell, Search, ChevronDown, HelpCircle, Settings, LogOut, User } from 'lucide-react';
// import { useState } from 'react';
// import { notifications } from '@/data/mockData';

// export default function TopBar() {
//   const [showNotif, setShowNotif] = useState(false);
//   const [showUser, setShowUser]   = useState(false);
//   const unread = notifications.filter(n => !n.read).length;

//   return (
//     <header className="h-12 bg-white border-b border-slate-200 flex items-center px-4 gap-3 sticky top-0 z-40">
//       {/* Logo / App name */}
//       <div className="flex items-center gap-2 mr-4">
//         <div className="w-6 h-6 bg-brand-600 rounded flex items-center justify-center">
//           <span className="text-white text-2xs font-bold">HR</span>
//         </div>
//         <span className="text-sm font-semibold text-slate-800">PeopleCore</span>
//         <span className="text-slate-300 mx-1">|</span>
//         <span className="text-xs text-slate-500">Employee Self-Service</span>
//       </div>

//       {/* Search */}
//       <div className="relative hidden md:flex items-center">
//         <Search size={12} className="absolute left-2.5 text-slate-400" />
//         <input
//           className="w-52 h-7 pl-7 pr-2 text-xs border border-slate-200 rounded bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-400 focus:bg-white transition-colors"
//           placeholder="Search..."
//         />
//       </div>

//       <div className="ml-auto flex items-center gap-1">
//         {/* Help */}
//         <button className="w-7 h-7 flex items-center justify-center rounded text-slate-500 hover:bg-slate-100 transition-colors">
//           <HelpCircle size={14} />
//         </button>

//         {/* Settings */}
//         <button className="w-7 h-7 flex items-center justify-center rounded text-slate-500 hover:bg-slate-100 transition-colors">
//           <Settings size={14} />
//         </button>

//         {/* Notifications */}
//         <div className="relative">
//           <button
//             onClick={() => { setShowNotif(v => !v); setShowUser(false); }}
//             className="w-7 h-7 flex items-center justify-center rounded text-slate-500 hover:bg-slate-100 transition-colors relative"
//           >
//             <Bell size={14} />
//             {unread > 0 && (
//               <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center text-white text-2xs font-bold leading-none">{unread}</span>
//             )}
//           </button>
//           {showNotif && (
//             <div className="absolute right-0 top-9 w-80 bg-white border border-slate-200 rounded-lg shadow-dropdown z-50">
//               <div className="px-3 py-2.5 border-b border-slate-100 flex items-center justify-between">
//                 <span className="text-xs font-semibold text-slate-800">Notifications</span>
//                 <span className="text-2xs text-brand-600 cursor-pointer hover:underline">Mark all read</span>
//               </div>
//               <div className="max-h-72 overflow-y-auto">
//                 {notifications.map(n => (
//                   <div key={n.id} className={`px-3 py-2.5 border-b border-slate-50 hover:bg-slate-25 transition-colors ${!n.read ? 'bg-blue-50/40' : ''}`}>
//                     <div className="flex gap-2">
//                       <span className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
//                         n.type === 'success' ? 'bg-emerald-500' :
//                         n.type === 'warning' ? 'bg-amber-500' :
//                         n.type === 'error'   ? 'bg-red-500' : 'bg-blue-500'
//                       }`} />
//                       <div>
//                         <p className="text-xs text-slate-700 leading-relaxed">{n.message}</p>
//                         <p className="text-2xs text-slate-400 mt-0.5">{n.time}</p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className="px-3 py-2 text-center">
//                 <span className="text-2xs text-brand-600 cursor-pointer hover:underline">View all notifications</span>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* User Menu */}
//         <div className="relative ml-1">
//           <button
//             onClick={() => { setShowUser(v => !v); setShowNotif(false); }}
//             className="flex items-center gap-2 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
//           >
//             <div className="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center">
//               <span className="text-brand-700 text-2xs font-semibold">NK</span>
//             </div>
//             <div className="hidden md:block text-left">
//               <p className="text-xs font-medium text-slate-800 leading-tight">Nikhil Kumar</p>
//               <p className="text-2xs text-slate-400 leading-tight">Engineering</p>
//             </div>
//             <ChevronDown size={10} className="text-slate-400" />
//           </button>
//           {showUser && (
//             <div className="absolute right-0 top-9 w-44 bg-white border border-slate-200 rounded-lg shadow-dropdown z-50">
//               <div className="px-3 py-2 border-b border-slate-100">
//                 <p className="text-xs font-medium text-slate-800">Nikhil Kumar</p>
//                 <p className="text-2xs text-slate-400">Employee ID: EMP-10482</p>
//               </div>
//               {[
//                 { icon: User,    label: 'My Profile' },
//                 { icon: Settings,label: 'Preferences' },
//                 { icon: LogOut,  label: 'Sign Out' },
//               ].map(({ icon: Icon, label }) => (
//                 <button key={label} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors">
//                   <Icon size={12} className="text-slate-400" /> {label}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }
