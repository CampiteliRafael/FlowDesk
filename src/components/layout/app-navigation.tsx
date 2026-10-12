"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  {
    href: "/dashboard",
    label: "Visão geral",
    icon: (
      <svg aria-hidden="true" fill="none" height="19" viewBox="0 0 24 24" width="19">
        <rect height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" width="7" x="3" y="3" />
        <rect height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" width="7" x="14" y="3" />
        <rect height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" width="7" x="3" y="14" />
        <rect height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" width="7" x="14" y="14" />
      </svg>
    ),
  },
  {
    href: "/tickets",
    label: "Solicitações",
    icon: (
      <svg aria-hidden="true" fill="none" height="19" viewBox="0 0 24 24" width="19">
        <rect height="17" rx="2.5" stroke="currentColor" strokeWidth="1.7" width="18" x="3" y="3.5" />
        <path d="M8 8h8M8 12h8M8 16h4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
      </svg>
    ),
  },
];

export function AppNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegação principal">
      <ul className="flex gap-2 md:flex-col">
        {navigationItems.map((item) => {
          const isCurrentPage = pathname === item.href;

          return (
            <li className="min-w-0 flex-1 md:flex-none" key={item.href}>
              <Link
                aria-current={isCurrentPage ? "page" : undefined}
                className={`flex items-center justify-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium transition-colors md:justify-start ${
                  isCurrentPage
                    ? "bg-primary-soft text-primary-strong"
                    : "text-slate-600 hover:bg-surface-subtle hover:text-foreground"
                }`}
                href={item.href}
              >
                <span className="shrink-0">{item.icon}</span>
                <span className="truncate">{item.label}</span>
                {isCurrentPage ? (
                  <span aria-hidden="true" className="ml-auto hidden size-1.5 rounded-full bg-primary md:block" />
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
