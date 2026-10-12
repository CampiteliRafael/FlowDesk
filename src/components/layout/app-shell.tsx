import type { ReactNode } from "react";
import { Suspense } from "react";
import Link from "next/link";
import { AppNavigation } from "@/components/layout/app-navigation";
import { DemoFailureToggle } from "@/components/layout/demo-failure-toggle";
import { SignOutButton } from "@/components/layout/sign-out-button";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground md:grid md:grid-cols-[248px_minmax(0,1fr)]">
      <aside className="border-b border-border bg-surface px-5 py-4 md:sticky md:top-0 md:h-screen md:border-b-0 md:border-r md:px-5 md:py-7">
        <Link
          className="inline-flex items-center gap-3 rounded-lg"
          href="/dashboard"
        >
          <span
            aria-hidden="true"
            className="grid size-10 place-items-center rounded-[13px] bg-primary text-white shadow-[0_5px_12px_rgb(91_85_231/22%)]"
          >
            <svg aria-hidden="true" fill="none" height="21" viewBox="0 0 24 24" width="21">
              <path d="M6 18V6h12M6 12h9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
          </span>
          <span>
            <span className="block text-[15px] font-bold tracking-tight text-foreground">
              FlowDesk
            </span>
            <span className="block text-xs text-muted">Workspace de operações</span>
          </span>
        </Link>

        <div className="mt-6 md:mt-10">
          <p className="eyebrow mb-3 px-3">
            Workspace
          </p>
          <Suspense fallback={<div aria-hidden="true" className="h-24" />}>
            <AppNavigation />
          </Suspense>
        </div>

        <div className="mt-8 hidden rounded-xl border border-primary/10 bg-primary-soft p-4 md:block">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="size-2 rounded-full bg-primary" />
            <p className="text-xs font-semibold text-primary-strong">
              Ambiente de demonstração
            </p>
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-600">
            Explore a central com dados fictícios. Nada é enviado a serviços externos.
          </p>
        </div>

        <div className="mt-8 hidden border-t border-border pt-5 md:block">
          <p className="eyebrow px-3">
            Seu espaço
          </p>
          <div className="mt-4 flex items-center gap-3 px-2">
            <span className="grid size-9 place-items-center rounded-full bg-[#e8e6ff] text-xs font-bold text-primary-strong">
              AC
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">Ana Costa</span>
              <span className="block text-xs text-muted">Administradora</span>
            </span>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="flex min-h-[68px] items-center justify-between gap-4 border-b border-border bg-surface px-5 sm:px-8 lg:px-10">
          <div className="hidden items-center gap-2 text-sm text-muted sm:flex" aria-label="Localização">
            <span>Workspace</span>
            <span aria-hidden="true" className="text-slate-300">/</span>
            <span className="font-medium text-foreground">Operações</span>
          </div>
          <p className="text-sm font-semibold text-foreground sm:hidden">
            FlowDesk
          </p>
          <div className="ml-auto flex items-center gap-3">
            <DemoFailureToggle />
            <span className="hidden rounded-full border border-border bg-surface-subtle px-3 py-1.5 text-xs font-medium text-muted sm:inline-flex">
              <span className="mr-2 size-1.5 self-center rounded-full bg-emerald-500" />
              Todos os sistemas operacionais
            </span>
            <SignOutButton />
            <span className="grid size-9 place-items-center rounded-full border border-border bg-surface-subtle text-xs font-bold text-slate-600">
              AC
            </span>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1480px] p-5 sm:p-8 lg:px-10 lg:py-9">{children}</main>
      </div>
    </div>
  );
}
