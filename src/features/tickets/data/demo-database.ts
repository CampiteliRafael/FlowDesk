import { demoTickets } from "@/features/tickets/data/demo-tickets";
import type {
  Ticket,
  TicketActivity,
  TicketComment,
  TicketPriority,
} from "@/features/tickets/types/ticket";
import {
  priorityLabels,
  statusLabels,
} from "@/features/tickets/types/ticket";
import type {
  TicketFilters,
  TicketUpdateInput,
  ValidNewTicket,
} from "@/features/tickets/schemas/ticket-schemas";
import { getActivityDescription } from "@/features/tickets/schemas/ticket-schemas";

export type TicketPage = {
  items: Ticket[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

type DemoDatabase = {
  tickets: Ticket[];
  comments: TicketComment[];
  activities: TicketActivity[];
};

declare global {
  var flowdeskDemoDatabase: DemoDatabase | undefined;
}

const seedComments: TicketComment[] = [
  {
    id: "comment-FD-1048-1",
    ticketId: "FD-1048",
    author: "Marina Costa",
    body: "Estou verificando os registros de geração do relatório e retorno com uma atualização em breve.",
    createdAt: "2026-10-09T15:10:00.000Z",
  },
  {
    id: "comment-FD-1046-1",
    ticketId: "FD-1046",
    author: "Bruno Alves",
    body: "Enviei uma mensagem ao parceiro para solicitar as novas credenciais.",
    createdAt: "2026-10-09T10:05:00.000Z",
  },
];

function createActivity(
  ticketId: string,
  actor: string,
  type: TicketActivity["type"],
  createdAt: string,
  value?: string | null,
): TicketActivity {
  return {
    id: crypto.randomUUID(),
    ticketId,
    actor,
    type,
    description: getActivityDescription(type, value),
    createdAt,
  };
}

export function getDemoDatabase() {
  if (!globalThis.flowdeskDemoDatabase) {
    globalThis.flowdeskDemoDatabase = {
      tickets: structuredClone(demoTickets),
      comments: structuredClone(seedComments),
      activities: demoTickets.map((ticket) => ({
        id: `${ticket.id}-created`,
        ticketId: ticket.id,
        actor: ticket.requester.name,
        type: "created",
        description: getActivityDescription("created"),
        createdAt: ticket.createdAt,
      })),
    };
  }


  return globalThis.flowdeskDemoDatabase;
}

export function listDemoTickets(filters: TicketFilters): TicketPage {
  const { tickets } = getDemoDatabase();
  const normalizedQuery = filters.q.toLocaleLowerCase("pt-BR");
  const priorities: Record<TicketPriority, number> = {
    urgent: 0,
    high: 1,
    medium: 2,
    low: 3,
  };
  const filtered = tickets
    .filter((ticket) => {
      const matchesQuery =
        !normalizedQuery ||
        ticket.id.toLocaleLowerCase("pt-BR").includes(normalizedQuery) ||
        ticket.title.toLocaleLowerCase("pt-BR").includes(normalizedQuery);

      return (
        matchesQuery &&
        (!filters.status || ticket.status === filters.status) &&
        (!filters.priority || ticket.priority === filters.priority) &&
        (!filters.assignee ||
          (filters.assignee === "unassigned"
            ? ticket.assignee === null
            : ticket.assignee === filters.assignee))
      );
    })
    .sort((left, right) => {
      let difference: number;
      if (filters.sort === "priority") {
        difference = priorities[left.priority] - priorities[right.priority];
      } else {
        difference = left.createdAt.localeCompare(right.createdAt);
      }
      return filters.order === "asc" ? difference : -difference;
    });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));
  const page = Math.min(filters.page, totalPages);
  const start = (page - 1) * filters.pageSize;

  return {
    items: filtered.slice(start, start + filters.pageSize),
    page,
    pageSize: filters.pageSize,
    total,
    totalPages,
  };
}

export function findDemoTicket(id: string) {
  return getDemoDatabase().tickets.find((ticket) => ticket.id === id) ?? null;
}

export function createDemoTicket(input: ValidNewTicket) {
  const database = getDemoDatabase();
  const latestId = database.tickets.reduce((latest, ticket) => {
    const match = /^FD-(\d+)$/.exec(ticket.id);
    return match ? Math.max(latest, Number(match[1])) : latest;
  }, 1043);
  const createdAt = new Date().toISOString();
  const ticket: Ticket = {
    ...input,
    id: `FD-${latestId + 1}`,
    status: "open",
    requester: { name: "Ana Costa", email: "ana@empresa-demo.com" },
    createdAt,
    updatedAt: createdAt,
    dueAt: null,
    tags: [input.category.toLocaleLowerCase("pt-BR")],
  };

  database.tickets.unshift(ticket);
  database.activities.push(
    createActivity(ticket.id, ticket.requester.name, "created", createdAt),
  );
  return ticket;
}

export function updateDemoTicket(id: string, updates: TicketUpdateInput) {
  const database = getDemoDatabase();
  const ticket = database.tickets.find((item) => item.id === id);
  if (!ticket) return null;

  const updatedAt = new Date().toISOString();
  const activities: TicketActivity[] = [];
  if (updates.status !== undefined && ticket.status !== updates.status) {
    activities.push(
      createActivity(
        id,
        "Ana Costa",
        "status_changed",
        updatedAt,
        statusLabels[updates.status],
      ),
    );
  }
  if (updates.priority !== undefined && ticket.priority !== updates.priority) {
    activities.push(
      createActivity(
        id,
        "Ana Costa",
        "priority_changed",
        updatedAt,
        priorityLabels[updates.priority],
      ),
    );
  }
  const assignee = updates.assignee === "" ? null : updates.assignee;
  if (assignee !== undefined && ticket.assignee !== assignee) {
    activities.push(
      createActivity(
        id,
        "Ana Costa",
        "assignee_changed",
        updatedAt,
        assignee,
      ),
    );
  }

  Object.assign(
    ticket,
    { ...updates, ...(assignee !== undefined ? { assignee } : {}) },
    { updatedAt },
  );
  database.activities.push(...activities);
  return ticket;
}

export function listDemoComments(ticketId: string) {
  return getDemoDatabase().comments
    .filter((comment) => comment.ticketId === ticketId)
    .sort((left, right) => left.createdAt.localeCompare(right.createdAt));
}

export function createDemoComment(ticketId: string, body: string) {
  const database = getDemoDatabase();
  if (!database.tickets.some((ticket) => ticket.id === ticketId)) return null;

  const createdAt = new Date().toISOString();
  const comment: TicketComment = {
    id: crypto.randomUUID(),
    ticketId,
    author: "Ana Costa",
    body,
    createdAt,
  };
  database.comments.push(comment);
  database.activities.push(
    createActivity(ticketId, comment.author, "comment_added", createdAt),
  );
  return comment;
}

export function listDemoActivities(ticketId: string) {
  return getDemoDatabase().activities
    .filter((activity) => activity.ticketId === ticketId)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}
