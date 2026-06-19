// import Link from "next/link";

// import { cn } from "@/lib/utils";

// export interface BreadcrumbItem {
//   label: string;
//   href?: string;
// }

// export interface BreadcrumbsProps {
//   items: BreadcrumbItem[];
//   className?: string;
// }

// export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
//   return (
//     <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
//       <ol className="flex flex-wrap items-center gap-2 text-zinc-500 dark:text-zinc-400">
//         {items.map((item, index) => {
//           const isLast = index === items.length - 1;

//           return (
//             <li key={`${item.label}-${index}`} className="flex items-center gap-2">
//               {index > 0 ? <span aria-hidden="true">/</span> : null}
//               {item.href && !isLast ? (
//                 <Link
//                   href={item.href}
//                   className="font-medium text-zinc-700 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
//                 >
//                   {item.label}
//                 </Link>
//               ) : (
//                 <span
//                   className={cn(
//                     isLast && "font-medium text-zinc-900 dark:text-zinc-50",
//                   )}
//                   aria-current={isLast ? "page" : undefined}
//                 >
//                   {item.label}
//                 </span>
//               )}
//             </li>
//           );
//         })}
//       </ol>
//     </nav>
//   );
// }
