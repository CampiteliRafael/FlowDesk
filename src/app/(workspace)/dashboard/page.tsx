"use client";

import Link from "next/link";
import { RequestError } from "@/components/feedback/request-error";
import { useTickets } from "@/features/tickets/hooks/use-tickets";
import {
  priorityLabels,
  statusLabels,
  ticketStatuses,
  type TicketStatus,
} from "@/features/tickets/types/ticket";

const statusStyles: Record<TicketStatus, string> = {
  open: "status-open",
  in_progress: "status-in_progress",
  blocked: "status-blocked",
  resolved: "status-resolved",
};

const metricStyles: Record<TicketStatus, { icon: string; tone: string }> = {
  open: { icon: "↗", tone: "bg-[#fff4e8] text-[#ae6811]" },
  in_progress: { icon: "◷", tone: "bg-[#eef1ff] text-[#5555c4]" },
  blocked: { icon: "!", tone: "bg-[#fff0f1] text-[#b43c4e]" },
  resolved: { icon: "✓", tone: "bg-[#eaf7f1] text-[#177454]" },
};

function formatDate(date: Date, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("pt-BR", {
    ...options,
    timeZone: "UTC",
  }).format(date);
}

export default function DashboardPage() {
  const { data, error, isError, isPending, refetch } = useTickets({
    q: "",
    sort: "createdAt",
    order: "desc",
    page: 1,
    pageSize: 50,
  });
  const tickets = data?.items ?? [];

  if (isError) {
    return (
      <RequestError onRetry={() => void refetch()}>
        {error instanceof Error ? error.message : undefined}
      </RequestError>
    );
  }

  if (isPending) {
    return (
      <p aria-live="polite" className="surface-card px-6 py-12 text-center text-sm text-muted">
        Carregando visão geral...
      </p>
    );
  }

  const counts = tickets.reduce<Record<TicketStatus, number>>(
    (result, ticket) => {
      result[ticket.status] += 1;
      return result;
    },
    { open: 0, in_progress: 0, blocked: 0, resolved: 0 },
  );

  const latestCreatedAt = tickets.reduce(
    (latest, ticket) => (ticket.createdAt > latest ? ticket.createdAt : latest),
    tickets[0]?.createdAt ?? "2026-01-01T00:00:00.000Z",
  );
  const referenceDate = new Date(latestCreatedAt);
  const week = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(
      Date.UTC(
        referenceDate.getUTCFullYear(),
        referenceDate.getUTCMonth(),
        referenceDate.getUTCDate() - 6 + index,
      ),
    );
    const count = tickets.filter((ticket) => {
      const created = new Date(ticket.createdAt);
      return (
        created.getUTCFullYear() === date.getUTCFullYear() &&
        created.getUTCMonth() === date.getUTCMonth() &&
        created.getUTCDate() === date.getUTCDate()
      );
    }).length;

    return { date, count };
  });
  const maxDayCount = Math.max(1, ...week.map((day) => day.count));
  const attentionTickets = tickets
    .filter((ticket) => ticket.status === "open" || ticket.status === "blocked")
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === "blocked" ? -1 : 1;
      return a.createdAt.localeCompare(b.createdAt);
    });
  const categories = tickets.reduce<Record<string, number>>((result, ticket) => {
    result[ticket.category] = (result[ticket.category] ?? 0) + 1;
    return result;
  }, {});
  const topCategories = Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="space-y-7">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="eyebrow">
            Dados atualizados até{" "}
            {formatDate(referenceDate, {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <h1 className="mt-2 text-[30px] font-bold tracking-[-0.04em] text-foreground sm:text-[34px]">
            Visão geral
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Aqui está o resumo das operações da sua equipe.
          </p>
        </div>
        <Link
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] bg-primary px-4 text-sm font-semibold text-white shadow-[0_5px_12px_rgb(91_85_231/18%)] transition hover:bg-primary-strong"
          href="/tickets/new"
        >
          <svg aria-hidden="true" fill="none" height="17" viewBox="0 0 20 20" width="17">
            <path d="M10 4v12M4 10h12" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
          </svg>
          Nova solicitação
        </Link>
      </header>

      <section aria-label="Solicitações por status">
        <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {ticketStatuses.map((status) => {
            const metric = metricStyles[status];

            return (
              <div className="surface-card p-5 sm:p-5" key={status}>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-sm font-medium text-slate-600">{statusLabels[status]}</dt>
                  <span className={`grid size-9 place-items-center rounded-[11px] text-base font-semibold ${metric.tone}`}>
                    {metric.icon}
                  </span>
                </div>
                <dd className="mt-4 text-[32px] font-bold leading-none tracking-[-0.04em] text-foreground">
                  {counts[status]}
                </dd>
                <p className="mt-2 text-xs text-muted">
                  {counts[status] === 1 ? "solicitação" : "solicitações"} na demonstração
                </p>
              </div>
            );
          })}
        </dl>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,1fr)]">
        <article className="surface-card min-w-0 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-bold tracking-tight">Volume de solicitações</h2>
              <p className="mt-1 text-sm text-muted">Novas solicitações recebidas nos últimos 7 dias</p>
            </div>
            <span className="rounded-lg border border-border bg-surface-subtle px-3 py-2 text-xs font-medium text-slate-600">
              Últimos 7 dias
            </span>
          </div>

          <div
            aria-label={`Total de ${week.reduce((sum, day) => sum + day.count, 0)} solicitações nos últimos sete dias`}
            className="mt-7 grid h-40 grid-cols-7 items-end gap-2 sm:gap-4"
            role="img"
          >
            {week.map(({ date, count }) => (
              <div className="flex h-full flex-col items-center justify-end gap-2" key={date.toISOString()}>
                <span className="text-[11px] font-medium text-muted">{count || ""}</span>
                <div className="flex h-[112px] w-full items-end overflow-hidden rounded-t-md bg-[#f1f1fb]">
                  <div
                    className="w-full rounded-t-md bg-primary transition-[height] duration-300"
                    style={{ height: `${count ? Math.max(15, (count / maxDayCount) * 100) : 3}%` }}
                  />
                </div>
                <span className="text-[11px] text-muted">
                  {formatDate(date, { weekday: "short" }).replace(".", "")}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 border-t border-border pt-4 text-xs leading-5 text-muted">
            Dados ilustrativos agrupados pela data de criação. Os resultados podem variar conforme o período.
          </p>
        </article>

        <article className="surface-card p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-bold tracking-tight">Por categoria</h2>
              <p className="mt-1 text-sm text-muted">Distribuição da fila atual</p>
            </div>
            <span aria-hidden="true" className="grid size-9 place-items-center rounded-[11px] bg-primary-soft text-primary">
              <svg fill="none" height="18" viewBox="0 0 20 20" width="18">
                <path d="M3 16V9m7 7V4m7 12v-5" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
              </svg>
            </span>
          </div>
          {topCategories.length ? (
            <ul className="mt-6 space-y-5">
              {topCategories.map(([category, count]) => (
                <li key={category}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-slate-700">{category}</span>
                    <span className="text-xs text-muted">{count}</span>
                  </div>
                  <div
                    aria-label={`${category}: ${count} de ${tickets.length} solicitações`}
                    className="h-2 overflow-hidden rounded-full bg-[#f0f1f6]"
                    role="img"
                  >
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(count / tickets.length) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 rounded-xl bg-surface-subtle p-5 text-sm text-muted">
              Ainda não há solicitações para exibir.
            </p>
          )}
          <p className="mt-6 border-t border-border pt-4 text-xs text-muted">
            {tickets.length} solicitações no total
          </p>
        </article>
      </section>

      <section className="surface-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-5 py-5 sm:px-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold tracking-tight">Precisam de atenção</h2>
              <span className="rounded-full bg-[#fff4e8] px-2 py-0.5 text-xs font-semibold text-[#ae6811]">
                {attentionTickets.length}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted">Solicitações abertas e bloqueadas da equipe</p>
          </div>
          <Link className="text-sm font-semibold text-primary hover:text-primary-strong" href="/tickets">
            Ver todas <span aria-hidden="true">→</span>
          </Link>
        </div>

        {attentionTickets.length ? (
          <ul className="divide-y divide-border">
            {attentionTickets.map((ticket) => (
              <li className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-6" key={ticket.id}>
                <div className="flex min-w-0 items-center gap-3">
                  <span className="hidden size-9 shrink-0 place-items-center rounded-full bg-surface-subtle text-xs font-semibold text-slate-600 sm:grid">
                    {ticket.category.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <Link
                      className="block truncate text-sm font-semibold text-foreground hover:text-primary"
                      href={`/tickets/${ticket.id}`}
                    >
                      {ticket.title}
                    </Link>
                    <p className="mt-1 text-xs text-muted">
                      {ticket.id} <span aria-hidden="true">·</span> {ticket.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`hidden text-xs font-semibold sm:inline priority-${ticket.priority}`}>
                    {priorityLabels[ticket.priority]}
                  </span>
                  <span className={`status-badge ${statusStyles[ticket.status]}`}>
                    {statusLabels[ticket.status]}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-6 py-8 text-sm text-muted">Tudo em dia: não há solicitações que precisem de atenção.</p>
        )}
      </section>

      <p className="text-center text-xs text-muted">
        Os dados desta página são fictícios e ficam em memória durante a execução da API demonstrativa.
      </p>
    </div>
  );
}
