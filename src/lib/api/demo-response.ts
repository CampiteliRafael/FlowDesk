const networkDelayMs = 180;

export async function simulatedFailure(request: Request) {
  await new Promise((resolve) => setTimeout(resolve, networkDelayMs));
  if (request.headers.get("x-flowdesk-simulate-error") !== "true") return null;

  return Response.json(
    {
      error: {
        message:
          "Não foi possível concluir a solicitação de demonstração. Desative a simulação de erro e tente novamente.",
      },
    },
    { status: 503 },
  );
}

export function invalidRequest(message: string, status = 400) {
  return Response.json({ error: { message } }, { status });
}

export function parseJsonBody(request: Request): Promise<unknown> {
  return request.json();
}
