"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { RequestError } from "@/components/feedback/request-error";
import { ApiError } from "@/features/tickets/api/tickets-api";
import {
  useAddTicketComment,
  useTicket,
  useTicketActivities,
  useTicketComments,
  useUpdateTicket,
} from "@/features/tickets/hooks/use-tickets";
import {
  priorityLabels,
  statusLabels,
  ticketPriorities,
  ticketStatuses,
  teamMembers,
  type TicketPriority,
  type TicketStatus,
} from "@/features/tickets/types/ticket";

const statusStyles: Record<TicketStatus, string> = {
  open: "status-open",
  in_progress: "status-in_progress",
  blocked: "status-blocked",
  resolved: "status-resolved",
};

function formatDate(date: string, includeTime = false) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(new Date(date));
}

function TicketNotFound({ returnHref }: { returnHref: string }) {
  return (
    <section className="surface-card grid min-h-72 place-items-center px-6 py-12 text-center">
      <div>
        <span aria-hidden="true" className="mx-auto grid size-12 place-items-center rounded-full bg-surface-subtle text-muted">
          <svg fill="none" height="22" viewBox="0 0 24 24" width="22">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" />
            <path d="m16 16 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
          </svg>
        </span>
        <h1 className="mt-4 text-lg font-bold">Solicitação não encontrada</h1>
        <p className="mt-1 text-sm text-muted">Confira o identificador ou volte para a central.</p>
        <Link className="mt-4 inline-block text-sm font-semibold text-primary" href={returnHref}>
          Voltar para solicitações
        </Link>
      </div>
    </section>
  );
}

export default function TicketDetail({
  ticketId,
  returnTo,
}: {
  ticketId: string;
  returnTo?: string;
}) {
  const ticketQuery = useTicket(ticketId);
  const commentsQuery = useTicketComments(ticketId);
  const activitiesQuery = useTicketActivities(ticketId);
  const updateTicket = useUpdateTicket(ticketId);
  const addComment = useAddTicketComment(ticketId);
  const [commentText, setCommentText] = useState("");
  const [notice, setNotice] = useState("");
  const ticket = ticketQuery.data;
  const returnHref =
    returnTo && /^\/tickets(?:\?.*)?$/.test(returnTo) ? returnTo : "/tickets";

  if (ticketQuery.isPending || commentsQuery.isPending || activitiesQuery.isPending) {
    return (
      <p aria-live="polite" className="surface-card px-6 py-12 text-center text-sm text-muted">
        Carregando solicitação...
      </p>
    );
  }

  if (
    (ticketQuery.isError &&
      ticketQuery.error instanceof ApiError &&
      ticketQuery.error.status === 404) ||
    (!ticketQuery.isPending && !ticketQuery.isError && !ticket)
  ) {
    return <TicketNotFound returnHref={returnHref} />;
  }

  if (ticketQuery.isError || commentsQuery.isError || activitiesQuery.isError) {
    const requestError = [
      ticketQuery.error,
      commentsQuery.error,
      activitiesQuery.error,
    ].find((error) => error instanceof Error);

    return (
      <RequestError
        onRetry={() => {
          void Promise.all([
            ticketQuery.refetch(),
            commentsQuery.refetch(),
            activitiesQuery.refetch(),
          ]);
        }}
      >
        {requestError instanceof Error
          ? requestError.message
          : "Não foi possível carregar os dados desta solicitação."}
      </RequestError>
    );
  }

  if (!ticket) return <TicketNotFound returnHref={returnHref} />;

  const ticketComments = [...(commentsQuery.data ?? [])].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  const ticketActivities = [...(activitiesQuery.data ?? [])].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  function handleCommentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!commentText.trim()) return;

    addComment.mutate(
      { body: commentText },
      {
        onSuccess: () => {
          setCommentText("");
          setNotice("Comentário adicionado à demonstração.");
        },
      },
    );
  }

  return (
    <div className="space-y-6">
      <nav aria-label="Caminho de navegação" className="flex flex-wrap items-center gap-2 text-sm">
        <Link className="font-medium text-muted hover:text-primary" href={returnHref}>
          Solicitações
        </Link>
        <span aria-hidden="true" className="text-slate-300">/</span>
        <span className="font-semibold text-foreground">{ticket.id}</span>
      </nav>

      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className={`status-badge ${statusStyles[ticket.status]}`}>
            {statusLabels[ticket.status]}
          </span>
          <span className="text-xs font-medium text-muted">{ticket.id}</span>
          <span className={`text-xs font-bold priority-${ticket.priority}`}>
            Prioridade {priorityLabels[ticket.priority].toLowerCase()}
          </span>
        </div>
        <h1 className="max-w-4xl text-[28px] font-bold leading-tight tracking-[-0.04em] text-foreground sm:text-[34px]">
          {ticket.title}
        </h1>
        <p className="text-sm text-muted">
          Criada em {formatDate(ticket.createdAt)} <span aria-hidden="true">·</span> {ticket.category}
        </p>
      </header>

      {notice ? (
        <p aria-live="polite" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">
          {notice} As alterações existem somente nesta sessão.
        </p>
      ) : null}
      {updateTicket.isError || addComment.isError ? (
        <p aria-live="assertive" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800" role="alert">
          {(updateTicket.error ?? addComment.error) instanceof Error
            ? (updateTicket.error ?? addComment.error)?.message
            : "Não foi possível salvar a alteração."}
        </p>
      ) : null}

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)]">
        <div className="space-y-5">
          <section aria-labelledby="description-title" className="surface-card p-5 sm:p-6">
            <h2 className="text-base font-bold" id="description-title">Descrição</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{ticket.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {ticket.tags.map((tag) => (
                <span className="rounded-full bg-surface-subtle px-3 py-1 text-xs font-medium text-slate-600" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </section>

          <section aria-labelledby="comments-title" className="surface-card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-bold" id="comments-title">Comentários</h2>
              <span className="rounded-full bg-surface-subtle px-2.5 py-1 text-xs font-semibold text-muted">
                {ticketComments.length}
              </span>
            </div>

            <form
              className="mt-5"
              onSubmit={handleCommentSubmit}
            >
              <label className="sr-only" htmlFor="ticket-comment">Escreva um comentário</label>
              <textarea
                className="control min-h-28 w-full resize-y p-3 text-sm leading-6 placeholder:text-slate-400"
                id="ticket-comment"
                onChange={(event) => setCommentText(event.target.value)}
                placeholder="Compartilhe uma atualização com a equipe..."
                required
                value={commentText}
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-muted">Comentários ficam disponíveis apenas nesta sessão.</p>
                <button
                  className="min-h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!commentText.trim() || addComment.isPending}
                  type="submit"
                >
                  {addComment.isPending ? "Enviando..." : "Comentar"}
                </button>
              </div>
            </form>

            <ul className="mt-6 space-y-5 border-t border-border pt-5">
              {ticketComments.length ? ticketComments.map((comment) => (
                <li className="flex gap-3" key={comment.id}>
                  <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-[#e8e6ff] text-xs font-bold text-primary-strong">
                    {comment.author.split(" ").map((part) => part[0]).slice(0, 2).join("")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <p className="text-sm font-semibold">{comment.author}</p>
                      <time className="text-xs text-muted" dateTime={comment.createdAt}>
                        {formatDate(comment.createdAt, true)}
                      </time>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{comment.body}</p>
                  </div>
                </li>
              )) : (
                <li className="py-2 text-sm text-muted">Ainda não há comentários nesta solicitação.</li>
              )}
            </ul>
          </section>
        </div>

        <aside className="space-y-5">
          <section aria-labelledby="properties-title" className="surface-card p-5">
            <h2 className="text-base font-bold" id="properties-title">Detalhes</h2>
            <div className="mt-5 space-y-4">
              <label className="block space-y-2">
                <span className="text-xs font-semibold text-slate-600">Status</span>
                <select
                  className="control w-full px-3 text-sm"
                  disabled={updateTicket.isPending}
                  onChange={(event) => {
                    setNotice("");
                    updateTicket.mutate(
                      { status: event.target.value as TicketStatus },
                      { onSuccess: () => setNotice("Status atualizado.") },
                    );
                  }}
                  value={ticket.status}
                >
                  {ticketStatuses.map((status) => (
                    <option key={status} value={status}>{statusLabels[status]}</option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-semibold text-slate-600">Prioridade</span>
                <select
                  className="control w-full px-3 text-sm"
                  disabled={updateTicket.isPending}
                  onChange={(event) => {
                    setNotice("");
                    updateTicket.mutate(
                      { priority: event.target.value as TicketPriority },
                      { onSuccess: () => setNotice("Prioridade atualizada.") },
                    );
                  }}
                  value={ticket.priority}
                >
                  {ticketPriorities.map((priority) => (
                    <option key={priority} value={priority}>{priorityLabels[priority]}</option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-semibold text-slate-600">Responsável</span>
                <select
                  className="control w-full px-3 text-sm"
                  disabled={updateTicket.isPending}
                  onChange={(event) => {
                    setNotice("");
                    const assignee =
                      teamMembers.find((member) => member === event.target.value) ??
                      null;
                    updateTicket.mutate(
                      { assignee },
                      { onSuccess: () => setNotice("Responsável atualizado.") },
                    );
                  }}
                  value={ticket.assignee ?? ""}
                >
                  <option value="">Sem responsável</option>
                  {teamMembers.map((member) => (
                    <option key={member} value={member}>{member}</option>
                  ))}
                </select>
              </label>

              <dl className="space-y-4 border-t border-border pt-4">
                <div>
                  <dt className="text-xs font-semibold text-slate-600">Solicitante</dt>
                  <dd className="mt-1 text-sm font-medium">{ticket.requester.name}</dd>
                  <dd className="mt-0.5 break-all text-xs text-muted">{ticket.requester.email}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-slate-600">Prazo</dt>
                  <dd className="mt-1 text-sm text-slate-700">
                    {ticket.dueAt ? formatDate(ticket.dueAt) : "Sem prazo definido"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-slate-600">Última atualização</dt>
                  <dd className="mt-1 text-sm text-slate-700">{formatDate(ticket.updatedAt, true)}</dd>
                </div>
              </dl>
            </div>
          </section>

          <section aria-labelledby="activity-title" className="surface-card p-5">
            <h2 className="text-base font-bold" id="activity-title">Atividade recente</h2>
            {ticketActivities.length ? (
              <ol className="mt-5 space-y-5">
                {ticketActivities.map((activity, index) => (
                  <li className="relative flex gap-3" key={activity.id}>
                    {index < ticketActivities.length - 1 ? (
                      <span aria-hidden="true" className="absolute bottom-[-17px] left-[5px] top-3 w-px bg-border" />
                    ) : null}
                    <span aria-hidden="true" className="relative mt-1 size-2.5 shrink-0 rounded-full border-2 border-primary bg-white" />
                    <div className="min-w-0">
                      <p className="text-xs leading-5 text-slate-700">
                        <span className="font-semibold">{activity.actor}</span> {activity.description}
                      </p>
                      <time className="mt-1 block text-[11px] text-muted" dateTime={activity.createdAt}>
                        {formatDate(activity.createdAt, true)}
                      </time>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-4 text-sm text-muted">Nenhuma atividade registrada.</p>
            )}
          </section>
        </aside>
      </div>
      <p className="text-center text-xs text-muted">
        Alterações e comentários ficam em memória enquanto o servidor demonstrativo estiver em execução.
      </p>
    </div>
  );
}
