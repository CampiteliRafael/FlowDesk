import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { ApiError, listTickets } from "@/features/tickets/api/tickets-api";
import { server } from "./mocks/server";

describe("ticket API client", () => {
  it("sends the failure scenario header and preserves the API error", async () => {
    server.use(
      http.get(/\/api\/tickets(?:\?.*)?$/, ({ request }) => {
        expect(
          request.headers.get("x-flowdesk-simulate-error"),
        ).toBe("true");

        return HttpResponse.json(
          { error: { message: "Falha simulada para o teste." } },
          { status: 503 },
        );
      }),
    );

    const request = listTickets(
      {
        q: "",
        sort: "createdAt",
        order: "desc",
        page: 1,
        pageSize: 5,
      },
      true,
    );

    await expect(request).rejects.toBeInstanceOf(ApiError);
    await expect(request).rejects.toMatchObject({
      name: "ApiError",
      message: "Falha simulada para o teste.",
      status: 503,
    });
  });
});
