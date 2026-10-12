"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { RequestError } from "@/components/feedback/request-error";
import { useTickets } from "@/features/tickets/hooks/use-tickets";
import {
  priorityLabels,
  statusLabels,
  ticketPriorities,
  ticketStatuses,
  teamMembers,
  type TicketStatus,
} from "@/features/tickets/types/ticket";

const statusStyles: Record<TicketStatus, string> = {
  open: "status-open",
  in_progress: "status-in_progress",
  blocked: "status-blocked",
  resolved: "status-resolved",
};

const pageSize = 5;

export default function TicketsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const status =
    ticketStatuses.find((item) => item === searchParams.get("status")) ?? "";
  const priority =
    ticketPriorities.find((item) => item === searchParams.get("priority")) ?? "";
  const assigneeParam = searchParams.get("assignee");
  const assignee =
    assigneeParam === "unassigned"
      ? "unassigned"
      : teamMembers.find((member) => member === assigneeParam) ?? "";
  const sortBy = searchParams.get("sort") === "priority" ? "priority" : "createdAt";
  const orderParam = searchParams.get("order");
  const sortOrder =
    orderParam === "asc" || orderParam === "desc"
      ? orderParam
      : sortBy === "priority"
        ? "asc"
        : "desc";
  const listUrl = `${pathname}${searchParams.size ? `?${searchParams.toString()}` : ""}`;
  const withReturnTo = (path: string) =>
    `${path}?${new URLSearchParams({ returnTo: listUrl }).toString()}`;

  function updateFilter(name: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) params.set(name, value.trim());
    else params.delete(name);
    if (name !== "page") params.delete("page");

    const queryString = params.toString();
    router.replace(`${pathname}${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  }

  const requestedPage = Number(searchParams.get("page"));
  const requestedPageNumber =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;
  const { data, error, isError, isPending, refetch } = useTickets({
    q: query.trim(),
    status: status || undefined,
    priority: priority || undefined,
    assignee: assignee || undefined,
    sort: sortBy,
    order: sortOrder,
    page: requestedPageNumber,
    pageSize,
  });
  const tickets = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const currentPage = data?.page ?? 1;
  const hasFilters = Boolean(query || status || priority || assignee);

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString());
    ["q", "status", "priority", "assignee", "page"].forEach((key) =>
      params.delete(key),
    );
    const queryString = params.toString();
    router.replace(`${pathname}${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  }

  return (
    <div className="space-y-7">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="eyebrow">Workspace / Operações</p>
          <h1 className="mt-2 text-[30px] font-bold tracking-[-0.04em] text-foreground sm:text-[34px]">
            Solicitações
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Acompanhe e organize os pedidos da sua equipe em um só lugar.
          </p>
        </div>
        <Link
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] bg-primary px-4 text-sm font-semibold text-white shadow-[0_5px_12px_rgb(91_85_231/18%)] transition hover:bg-primary-strong"
          href={withReturnTo("/tickets/new")}
        >
          <svg aria-hidden="true" fill="none" height="17" viewBox="0 0 20 20" width="17">
            <path d="M10 4v12M4 10h12" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
          </svg>
          Nova solicitação
        </Link>
      </header>

      {isError ? (
        <RequestError onRetry={() => void refetch()}>
          {error instanceof Error
            ? error.message
            : "Não foi possível carregar as solicitações."}
        </RequestError>
      ) : null}

      <section aria-label="Filtros de solicitações" className="surface-card p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1.5fr)_repeat(3,minmax(130px,1fr))_minmax(140px,1fr)]">
          <label className="relative block">
            <span className="sr-only">Buscar por título ou identificador</span>
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              fill="none"
              height="17"
              viewBox="0 0 20 20"
              width="17"
            >
              <circle cx="8.8" cy="8.8" r="5.8" stroke="currentColor" strokeWidth="1.7" />
              <path d="m13 13 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
            </svg>
            <input
              className="control w-full pl-10 pr-3 text-sm placeholder:text-slate-400"
              onChange={(event) => updateFilter("q", event.target.value)}
              placeholder="Buscar solicitação..."
              type="search"
              value={query}
            />
          </label>

          <label className="block">
            <span className="sr-only">Filtrar por status</span>
            <select
              className="control w-full px-3 text-sm"
              onChange={(event) => updateFilter("status", event.target.value)}
              value={status}
            >
              <option value="">Todos os status</option>
              {ticketStatuses.map((ticketStatus) => (
                <option key={ticketStatus} value={ticketStatus}>
                  {statusLabels[ticketStatus]}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="sr-only">Filtrar por prioridade</span>
            <select
              className="control w-full px-3 text-sm"
              onChange={(event) => updateFilter("priority", event.target.value)}
              value={priority}
            >
              <option value="">Todas as prioridades</option>
              {ticketPriorities.map((ticketPriority) => (
                <option key={ticketPriority} value={ticketPriority}>
                  Prioridade {priorityLabels[ticketPriority].toLocaleLowerCase("pt-BR")}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="sr-only">Filtrar por responsável</span>
            <select
              className="control w-full px-3 text-sm"
              onChange={(event) => updateFilter("assignee", event.target.value)}
              value={assignee}
            >
              <option value="">Todos os responsáveis</option>
              <option value="unassigned">Sem responsável</option>
              {teamMembers.map((person) => (
                <option key={person} value={person}>
                  {person}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="sr-only">Ordenar por</span>
            <select
              className="control w-full px-3 text-sm"
              onChange={(event) => updateFilter("sort", event.target.value)}
              value={sortBy}
            >
              <option value="createdAt">Data de criação</option>
              <option value="priority">Prioridade</option>
            </select>
          </label>

          <label className="block">
            <span className="sr-only">Ordem de classificação</span>
            <select
              className="control w-full px-3 text-sm"
              onChange={(event) => updateFilter("order", event.target.value)}
              value={sortOrder}
            >
              <option value="desc">
                {sortBy === "priority" ? "Menor para maior" : "Mais recentes"}
              </option>
              <option value="asc">
                {sortBy === "priority" ? "Maior para menor" : "Mais antigos"}
              </option>
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <p aria-live="polite" className="text-xs text-muted">
            <span className="font-semibold text-slate-700">{total}</span>{" "}
            {total === 1 ? "solicitação encontrada" : "solicitações encontradas"}
          </p>
          {hasFilters ? (
            <button
              className="rounded-md px-2 py-1 text-xs font-semibold text-primary hover:bg-primary-soft"
              onClick={clearFilters}
              type="button"
            >
              Limpar filtros
            </button>
          ) : null}
        </div>
      </section>

      <section aria-label="Lista de solicitações" className="surface-card overflow-hidden">
        <div className="hidden grid-cols-[minmax(240px,2fr)_minmax(120px,1fr)_minmax(110px,0.8fr)_minmax(150px,1.2fr)_minmax(110px,0.8fr)] gap-4 border-b border-border bg-surface-subtle px-5 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-muted lg:grid lg:px-6">
          <span>Solicitação</span>
          <span>Status</span>
          <span>Prioridade</span>
          <span>Responsável</span>
          <span>Data de criação</span>
        </div>

        {isError ? null : isPending ? (
          <p aria-live="polite" className="px-6 py-12 text-center text-sm text-muted">
            Carregando solicitações...
          </p>
        ) : tickets.length ? (
          <ul className="divide-y divide-border">
            {tickets.map((ticket) => (
              <li
                className="grid gap-3 px-5 py-4 transition-colors hover:bg-surface-subtle/70 lg:grid-cols-[minmax(240px,2fr)_minmax(120px,1fr)_minmax(110px,0.8fr)_minmax(150px,1.2fr)_minmax(110px,0.8fr)] lg:items-center lg:gap-4 lg:px-6"
                key={ticket.id}
              >
                <div className="min-w-0">
                  <Link
                    className="block truncate text-sm font-semibold text-foreground hover:text-primary"
                    href={withReturnTo(`/tickets/${ticket.id}`)}
                  >
                    {ticket.title}
                  </Link>
                  <p className="mt-1 text-xs text-muted">
                    {ticket.id} <span aria-hidden="true">·</span> {ticket.category}
                  </p>
                </div>
                <div>
                  <span className={`status-badge ${statusStyles[ticket.status]}`}>
                    {statusLabels[ticket.status]}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span aria-hidden="true" className={`size-2 rounded-full ${ticket.priority === "urgent" || ticket.priority === "high" ? "bg-rose-500" : ticket.priority === "medium" ? "bg-amber-500" : "bg-slate-400"}`} />
                  <span className={`font-semibold priority-${ticket.priority}`}>
                    {priorityLabels[ticket.priority]}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  {ticket.assignee ? (
                    <>
                      <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full bg-[#e8e6ff] text-[10px] font-bold text-primary-strong">
                        {ticket.assignee.split(" ").map((part) => part[0]).slice(0, 2).join("")}
                      </span>
                      <span>{ticket.assignee}</span>
                    </>
                  ) : (
                    <span className="text-muted">Sem responsável</span>
                  )}
                </div>
                <time className="text-xs text-muted" dateTime={ticket.createdAt}>
                  {new Intl.DateTimeFormat("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    timeZone: "UTC",
                  }).format(new Date(ticket.createdAt))}
                </time>
              </li>
            ))}
          </ul>
        ) : (
          <div className="grid min-h-56 place-items-center px-5 py-10 text-center">
            <div>
              <span aria-hidden="true" className="mx-auto grid size-11 place-items-center rounded-full bg-surface-subtle text-muted">
                <svg fill="none" height="20" viewBox="0 0 20 20" width="20">
                  <circle cx="8.8" cy="8.8" r="5.8" stroke="currentColor" strokeWidth="1.6" />
                  <path d="m13 13 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
                </svg>
              </span>
              <h2 className="mt-4 text-sm font-semibold text-foreground">Nenhuma solicitação encontrada</h2>
              <p className="mt-1 max-w-sm text-sm text-muted">
                Tente ajustar os termos da busca ou remover alguns filtros.
              </p>
              {hasFilters ? (
                <button
                  className="mt-4 text-sm font-semibold text-primary hover:text-primary-strong"
                  onClick={clearFilters}
                  type="button"
                >
                  Limpar filtros
                </button>
              ) : null}
            </div>
          </div>
        )}
        {!isPending && total > pageSize ? (
          <nav
            aria-label="Paginação de solicitações"
            className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4 sm:px-6"
          >
            <p aria-live="polite" className="text-xs text-muted">
              Página {currentPage} de {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                aria-label="Página anterior"
                className="min-h-9 rounded-lg border border-border px-3 text-sm font-medium text-slate-700 transition hover:bg-surface-subtle disabled:cursor-not-allowed disabled:opacity-40"
                disabled={currentPage <= 1}
                onClick={() => updateFilter("page", String(currentPage - 1))}
                type="button"
              >
                Anterior
              </button>
              <button
                aria-label="Próxima página"
                className="min-h-9 rounded-lg border border-border px-3 text-sm font-medium text-slate-700 transition hover:bg-surface-subtle disabled:cursor-not-allowed disabled:opacity-40"
                disabled={currentPage >= totalPages}
                onClick={() => updateFilter("page", String(currentPage + 1))}
                type="button"
              >
                Próxima
              </button>
            </div>
          </nav>
        ) : null}
      </section>

      <p className="text-center text-xs text-muted">
        Os dados desta central são fictícios e ficam em memória durante a execução da API demonstrativa.
      </p>
    </div>
  );
}
