import {
  createDemoTicket,
  listDemoTickets,
} from "@/features/tickets/data/demo-database";
import {
  newTicketSchema,
  ticketFiltersSchema,
} from "@/features/tickets/schemas/ticket-schemas";
import {
  invalidRequest,
  parseJsonBody,
  simulatedFailure,
} from "@/lib/api/demo-response";

export async function GET(request: Request) {
  const failed = await simulatedFailure(request);
  if (failed) return failed;

  const url = new URL(request.url);
  const parsedFilters = ticketFiltersSchema.safeParse({
    q: url.searchParams.get("q") ?? undefined,
    status: url.searchParams.get("status") ?? undefined,
    priority: url.searchParams.get("priority") ?? undefined,
    assignee: url.searchParams.get("assignee") ?? undefined,
    sort: url.searchParams.get("sort") ?? undefined,
    order: url.searchParams.get("order") ?? undefined,
    page: url.searchParams.get("page") ?? undefined,
    pageSize: url.searchParams.get("pageSize") ?? undefined,
  });

  if (!parsedFilters.success) {
    return invalidRequest("Os filtros informados são inválidos.");
  }

  return Response.json(listDemoTickets(parsedFilters.data));
}

export async function POST(request: Request) {
  const failed = await simulatedFailure(request);
  if (failed) return failed;

  let body: unknown;
  try {
    body = await parseJsonBody(request);
  } catch {
    return invalidRequest("O corpo da solicitação não contém um JSON válido.");
  }

  const parsedInput = newTicketSchema.safeParse(body);
  if (!parsedInput.success) {
    return invalidRequest(
      parsedInput.error.issues[0]?.message ?? "Revise os dados da solicitação.",
    );
  }

  return Response.json(
    { ticket: createDemoTicket(parsedInput.data) },
    { status: 201 },
  );
}
