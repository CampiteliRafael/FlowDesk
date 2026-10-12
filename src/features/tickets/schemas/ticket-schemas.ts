import { z } from "zod";
import {
  teamMembers,
  ticketPriorities,
  ticketStatuses,
} from "@/features/tickets/types/ticket";

export const ticketFiltersSchema = z.object({
  q: z.string().trim().max(120).default(""),
  status: z.enum(ticketStatuses).optional(),
  priority: z.enum(ticketPriorities).optional(),
  assignee: z
    .union([z.enum(teamMembers), z.literal("unassigned")])
    .optional(),
  sort: z.enum(["createdAt", "priority"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(5),
});

export const newTicketSchema = z.object({
  title: z.string().trim().min(3, "O título precisa ter ao menos 3 caracteres.").max(120),
  description: z.string().trim().min(10, "A descrição precisa ter ao menos 10 caracteres.").max(2000),
  category: z.enum(["Acesso", "Dados", "Integrações", "Relatórios", "Outro"], {
    error: "Selecione uma categoria.",
  }),
  priority: z.enum(ticketPriorities),
  assignee: z
    .union([z.enum(teamMembers), z.literal("")])
    .nullable()
    .transform((value) => (value === "" ? null : value)),
});

export const updateTicketSchema = z
  .object({
    status: z.enum(ticketStatuses).optional(),
    priority: z.enum(ticketPriorities).optional(),
    assignee: z
      .union([z.enum(teamMembers), z.literal("")])
      .nullable()
      .optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Informe ao menos uma propriedade para atualizar.",
  });

export const newCommentSchema = z.object({
  body: z.string().trim().min(1, "O comentário não pode ficar vazio.").max(2000),
});

export const ticketSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  status: z.enum(ticketStatuses),
  priority: z.enum(ticketPriorities),
  assignee: z.enum(teamMembers).nullable(),
  requester: z.object({
    name: z.string(),
    email: z.email(),
  }),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  dueAt: z.iso.datetime().nullable(),
  tags: z.array(z.string()),
});

export const ticketPageSchema = z.object({
  items: z.array(ticketSchema),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().positive(),
});

export const ticketCommentSchema = z.object({
  id: z.string(),
  ticketId: z.string(),
  author: z.string(),
  body: z.string(),
  createdAt: z.iso.datetime(),
});

export const ticketActivitySchema = z.object({
  id: z.string(),
  ticketId: z.string(),
  actor: z.string(),
  type: z.enum([
    "created",
    "status_changed",
    "priority_changed",
    "assignee_changed",
    "comment_added",
  ]),
  description: z.string(),
  createdAt: z.iso.datetime(),
});

export const ticketResponseSchema = z.object({ ticket: ticketSchema });
export const commentsResponseSchema = z.object({
  comments: z.array(ticketCommentSchema),
});
export const activitiesResponseSchema = z.object({
  activities: z.array(ticketActivitySchema),
});
export const commentResponseSchema = z.object({ comment: ticketCommentSchema });

export type TicketFilters = z.infer<typeof ticketFiltersSchema>;
export type NewTicketInput = z.input<typeof newTicketSchema>;
export type ValidNewTicket = z.output<typeof newTicketSchema>;
export type TicketUpdateInput = z.input<typeof updateTicketSchema>;
export type NewCommentInput = z.infer<typeof newCommentSchema>;
export type TicketPageResponse = z.infer<typeof ticketPageSchema>;

export function getActivityDescription(
  type: "created" | "status_changed" | "priority_changed" | "assignee_changed" | "comment_added",
  value?: string | null,
) {
  switch (type) {
    case "created":
      return "criou esta solicitação";
    case "status_changed":
      return `alterou o status para ${value ?? ""}`;
    case "priority_changed":
      return `alterou a prioridade para ${value ?? ""}`;
    case "assignee_changed":
      return value
        ? `atribuiu a solicitação a ${value}`
        : "removeu a pessoa responsável";
    case "comment_added":
      return "adicionou um comentário";
  }
}
