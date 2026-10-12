import { describe, expect, it } from "vitest";
import {
  GET as listTickets,
  POST as createTicket,
} from "@/app/api/tickets/route";
import { GET as getActivities } from "@/app/api/tickets/[id]/activities/route";
import { PATCH as updateTicket } from "@/app/api/tickets/[id]/route";
import { POST as createComment } from "@/app/api/tickets/[id]/comments/route";
import { newTicketSchema } from "@/features/tickets/schemas/ticket-schemas";

const validTicket = {
  title: "Atualizar integração",
  description: "A integração precisa de uma nova chave de acesso.",
  category: "Integrações",
  priority: "high",
  assignee: "",
};

describe("newTicketSchema", () => {
  it("normalizes an unassigned ticket", () => {
    const result = newTicketSchema.parse(validTicket);

    expect(result.assignee).toBeNull();
  });

  it("rejects titles below the minimum length", () => {
    const result = newTicketSchema.safeParse({
      ...validTicket,
      title: "Oi",
    });

    expect(result.success).toBe(false);
  });
});

describe("ticket API route handlers", () => {
  it("validates filters and returns paginated tickets", async () => {
    const invalidResponse = await listTickets(
      new Request("http://localhost/api/tickets?status=unknown"),
    );
    expect(invalidResponse.status).toBe(400);
    const invalidAssignee = await listTickets(
      new Request("http://localhost/api/tickets?assignee=unknown"),
    );
    expect(invalidAssignee.status).toBe(400);

    const response = await listTickets(
      new Request("http://localhost/api/tickets?status=open&page=1&pageSize=1"),
    );
    const page = await response.json();

    expect(response.status).toBe(200);
    expect(page).toMatchObject({ page: 1, pageSize: 1 });
    expect(page.items).toHaveLength(1);
    expect(page.items[0].status).toBe("open");
    expect(page.total).toBeGreaterThanOrEqual(1);
  });

  it("returns an explicit validation error for malformed JSON", async () => {
    const response = await createTicket(
      new Request("http://localhost/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{",
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: { message: "O corpo da solicitação não contém um JSON válido." },
    });
  });

  it("returns the configured simulated API failure", async () => {
    const response = await createTicket(
      new Request("http://localhost/api/tickets", {
        method: "POST",
        headers: { "x-flowdesk-simulate-error": "true" },
        body: JSON.stringify(validTicket),
      }),
    );

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      error: { message: expect.stringContaining("Desative a simulação") },
    });
  });

  it("creates and updates tickets and records their activity", async () => {
    const createdResponse = await createTicket(
      new Request("http://localhost/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validTicket),
      }),
    );
    const { ticket: created } = await createdResponse.json();

    expect(createdResponse.status).toBe(201);
    expect(created.assignee).toBeNull();

    const context = { params: Promise.resolve({ id: created.id }) };
    const updatedResponse = await updateTicket(
      new Request(`http://localhost/api/tickets/${created.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "in_progress" }),
      }),
      context,
    );
    expect(updatedResponse.status).toBe(200);
    await expect(updatedResponse.json()).resolves.toMatchObject({
      ticket: { id: created.id, status: "in_progress" },
    });

    const commentResponse = await createComment(
      new Request(`http://localhost/api/tickets/${created.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: "A equipe está verificando." }),
      }),
      context,
    );
    expect(commentResponse.status).toBe(201);

    const activityResponse = await getActivities(
      new Request(`http://localhost/api/tickets/${created.id}/activities`),
      context,
    );
    const { activities } = await activityResponse.json();

    expect(activities.map((activity: { type: string }) => activity.type)).toEqual(
      expect.arrayContaining(["created", "status_changed", "comment_added"]),
    );
  }, 10_000);
});
