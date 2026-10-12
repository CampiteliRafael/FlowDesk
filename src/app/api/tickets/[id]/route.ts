import {
  findDemoTicket,
  updateDemoTicket,
} from "@/features/tickets/data/demo-database";
import { updateTicketSchema } from "@/features/tickets/schemas/ticket-schemas";
import {
  invalidRequest,
  parseJsonBody,
  simulatedFailure,
} from "@/lib/api/demo-response";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  const failed = await simulatedFailure(request);
  if (failed) return failed;

  const { id } = await params;
  const ticket = findDemoTicket(id);
  if (!ticket) return invalidRequest("Solicitação não encontrada.", 404);

  return Response.json({ ticket });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const failed = await simulatedFailure(request);
  if (failed) return failed;

  const { id } = await params;
  let body: unknown;
  try {
    body = await parseJsonBody(request);
  } catch {
    return invalidRequest("O corpo da solicitação não contém um JSON válido.");
  }

  const parsedUpdates = updateTicketSchema.safeParse(body);
  if (!parsedUpdates.success) {
    return invalidRequest(
      parsedUpdates.error.issues[0]?.message ?? "Revise os dados da atualização.",
    );
  }

  const ticket = updateDemoTicket(id, parsedUpdates.data);
  if (!ticket) return invalidRequest("Solicitação não encontrada.", 404);

  return Response.json({ ticket });
}
