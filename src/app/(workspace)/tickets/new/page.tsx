"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateTicket } from "@/features/tickets/hooks/use-tickets";
import {
  newTicketSchema,
  type NewTicketInput,
  type ValidNewTicket,
} from "@/features/tickets/schemas/ticket-schemas";
import {
  priorityLabels,
  teamMembers,
  ticketPriorities,
} from "@/features/tickets/types/ticket";

const categories = ["Acesso", "Dados", "Integrações", "Relatórios", "Outro"];

export default function NewTicketPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createTicket = useCreateTicket();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewTicketInput, unknown, ValidNewTicket>({
    resolver: zodResolver(newTicketSchema),
    defaultValues: { priority: "medium", assignee: "" },
  });
  const requestedReturnTo = searchParams.get("returnTo");
  const returnTo =
    requestedReturnTo && /^\/tickets(?:\?.*)?$/.test(requestedReturnTo)
      ? requestedReturnTo
      : "/tickets";

  function onSubmit(input: ValidNewTicket) {
    createTicket.mutate(input, {
      onSuccess: (ticket) => {
        const params = new URLSearchParams({ returnTo });
        router.push(`/tickets/${ticket.id}?${params.toString()}`);
      },
    });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <nav aria-label="Caminho de navegação" className="flex items-center gap-2 text-sm">
        <Link className="font-medium text-muted hover:text-primary" href={returnTo}>Solicitações</Link>
        <span aria-hidden="true" className="text-slate-300">/</span>
        <span className="font-semibold text-foreground">Nova solicitação</span>
      </nav>

      <header>
        <p className="eyebrow">Central de operações</p>
        <h1 className="mt-2 text-[30px] font-bold tracking-[-0.04em] text-foreground sm:text-[34px]">
          Criar solicitação
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Registre um pedido para que a equipe possa acompanhar e priorizar.
        </p>
      </header>

      <form className="surface-card space-y-6 p-5 sm:p-7" onSubmit={handleSubmit(onSubmit)}>
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-700">Título</span>
          <input
            className="control w-full px-3 text-sm"
            maxLength={120}
            placeholder="Resuma a solicitação em poucas palavras"
            {...register("title")}
          />
          {errors.title ? <span className="block text-xs text-rose-700">{errors.title.message}</span> : null}
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-700">Descrição</span>
          <textarea
            className="control min-h-36 w-full resize-y p-3 text-sm leading-6 placeholder:text-slate-400"
            maxLength={2000}
            placeholder="Inclua contexto e os detalhes necessários para a equipe..."
            {...register("description")}
          />
          {errors.description ? <span className="block text-xs text-rose-700">{errors.description.message}</span> : null}
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-700">Categoria</span>
            <select className="control w-full px-3 text-sm" defaultValue="" {...register("category")}>
              <option disabled value="">Selecione uma categoria</option>
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            {errors.category ? <span className="block text-xs text-rose-700">{errors.category.message}</span> : null}
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-700">Prioridade</span>
            <select
              className="control w-full px-3 text-sm"
              {...register("priority")}
            >
              {ticketPriorities.map((ticketPriority) => (
                <option key={ticketPriority} value={ticketPriority}>
                  {priorityLabels[ticketPriority]}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-2 sm:col-span-2">
            <span className="text-sm font-semibold text-slate-700">Responsável <span className="font-normal text-muted">(opcional)</span></span>
            <select className="control w-full px-3 text-sm" {...register("assignee")}>
              <option value="">Sem responsável</option>
              {teamMembers.map((member) => <option key={member} value={member}>{member}</option>)}
            </select>
          </label>
        </div>

        {createTicket.isError ? (
          <p aria-live="polite" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800" role="alert">
            {createTicket.error instanceof Error
              ? createTicket.error.message
              : "Não foi possível criar a solicitação."}
          </p>
        ) : null}

        <div className="flex flex-wrap justify-end gap-3 border-t border-border pt-5">
          <Link className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border px-4 text-sm font-semibold text-slate-700 hover:bg-surface-subtle" href={returnTo}>
            Cancelar
          </Link>
          <button className="min-h-11 rounded-lg bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-strong disabled:cursor-wait disabled:opacity-60" disabled={createTicket.isPending} type="submit">
            {createTicket.isPending ? "Criando..." : "Criar solicitação"}
          </button>
        </div>
        <p className="text-center text-xs text-muted">
          Esta demonstração mantém os dados em memória enquanto o servidor estiver em execução.
        </p>
      </form>
    </div>
  );
}
