import {
  createDemoComment,
  findDemoTicket,
  listDemoComments,
} from "@/features/tickets/data/demo-database";
import { newCommentSchema } from "@/features/tickets/schemas/ticket-schemas";
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
  if (!findDemoTicket(id)) return invalidRequest("Solicitação não encontrada.", 404);

  return Response.json({ comments: listDemoComments(id) });
}

export async function POST(request: Request, { params }: RouteContext) {
  const failed = await simulatedFailure(request);
  if (failed) return failed;

  const { id } = await params;
  if (!findDemoTicket(id)) return invalidRequest("Solicitação não encontrada.", 404);

  let body: unknown;
  try {
    body = await parseJsonBody(request);
  } catch {
    return invalidRequest("O corpo da solicitação não contém um JSON válido.");
  }

  const parsedComment = newCommentSchema.safeParse(body);
  if (!parsedComment.success) {
    return invalidRequest(
      parsedComment.error.issues[0]?.message ?? "Revise o comentário.",
    );
  }

  const comment = createDemoComment(id, parsedComment.data.body);
  if (!comment) return invalidRequest("Solicitação não encontrada.", 404);

  return Response.json({ comment }, { status: 201 });
}
