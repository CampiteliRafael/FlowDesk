import {
  findDemoTicket,
  listDemoActivities,
} from "@/features/tickets/data/demo-database";
import {
  invalidRequest,
  simulatedFailure,
} from "@/lib/api/demo-response";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  const failed = await simulatedFailure(request);
  if (failed) return failed;

  const { id } = await params;
  if (!findDemoTicket(id)) return invalidRequest("Solicitação não encontrada.", 404);

  return Response.json({ activities: listDemoActivities(id) });
}
