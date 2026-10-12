import { z } from "zod";
import type { Ticket } from "@/features/tickets/types/ticket";
import type {
  NewCommentInput,
  TicketFilters,
  TicketPageResponse,
  TicketUpdateInput,
  ValidNewTicket,
} from "@/features/tickets/schemas/ticket-schemas";
import {
  activitiesResponseSchema,
  commentResponseSchema,
  commentsResponseSchema,
  ticketPageSchema,
  ticketResponseSchema,
} from "@/features/tickets/schemas/ticket-schemas";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function apiUrl(path: string) {
  const origin =
    typeof window === "undefined" ? "http://localhost" : window.location.origin;
  return new URL(path, origin);
}

async function requestJson<T>(
  path: string,
  schema: z.ZodType<T>,
  simulateFailure: boolean,
  init?: RequestInit,
): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");
  if (init?.body) headers.set("Content-Type", "application/json");
  if (simulateFailure) headers.set("x-flowdesk-simulate-error", "true");

  const response = await fetch(apiUrl(path), {
    ...init,
    headers,
    cache: "no-store",
  });
  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const errorPayload = z
      .object({ error: z.object({ message: z.string() }) })
      .safeParse(payload);
    throw new ApiError(
      errorPayload.success
        ? errorPayload.data.error.message
        : "Não foi possível concluir a solicitação.",
      response.status,
    );
  }

  const parsedPayload = schema.safeParse(payload);
  if (!parsedPayload.success) {
    throw new ApiError(
      "A API de demonstração retornou dados em um formato inesperado.",
      response.status,
    );
  }

  return parsedPayload.data;
}

export function listTickets(
  filters: TicketFilters,
  simulateFailure = false,
): Promise<TicketPageResponse> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== "" && value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  }
  const query = params.toString();

  return requestJson(
    `/api/tickets${query ? `?${query}` : ""}`,
    ticketPageSchema,
    simulateFailure,
  );
}

export async function getTicket(id: string, simulateFailure = false) {
  const response = await requestJson(
    `/api/tickets/${encodeURIComponent(id)}`,
    ticketResponseSchema,
    simulateFailure,
  );
  return response.ticket;
}

export async function getTicketComments(
  id: string,
  simulateFailure = false,
) {
  const response = await requestJson(
    `/api/tickets/${encodeURIComponent(id)}/comments`,
    commentsResponseSchema,
    simulateFailure,
  );
  return response.comments;
}

export async function getTicketActivities(
  id: string,
  simulateFailure = false,
) {
  const response = await requestJson(
    `/api/tickets/${encodeURIComponent(id)}/activities`,
    activitiesResponseSchema,
    simulateFailure,
  );
  return response.activities;
}

export async function createTicket(
  input: ValidNewTicket,
  simulateFailure = false,
) {
  const response = await requestJson(
    "/api/tickets",
    ticketResponseSchema,
    simulateFailure,
    { method: "POST", body: JSON.stringify(input) },
  );
  return response.ticket;
}

export async function updateTicket(
  id: string,
  input: TicketUpdateInput,
  simulateFailure = false,
): Promise<Ticket> {
  const response = await requestJson(
    `/api/tickets/${encodeURIComponent(id)}`,
    ticketResponseSchema,
    simulateFailure,
    { method: "PATCH", body: JSON.stringify(input) },
  );
  return response.ticket;
}

export async function addTicketComment(
  id: string,
  input: NewCommentInput,
  simulateFailure = false,
) {
  const response = await requestJson(
    `/api/tickets/${encodeURIComponent(id)}/comments`,
    commentResponseSchema,
    simulateFailure,
    { method: "POST", body: JSON.stringify(input) },
  );
  return response.comment;
}
