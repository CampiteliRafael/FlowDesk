export const ticketStatuses = [
  "open",
  "in_progress",
  "blocked",
  "resolved",
] as const;

export type TicketStatus = (typeof ticketStatuses)[number];

export const ticketPriorities = [
  "low",
  "medium",
  "high",
  "urgent",
] as const;

export type TicketPriority = (typeof ticketPriorities)[number];

export const teamMembers = [
  "Marina Costa",
  "Rafael Lima",
  "João Pedro",
  "Ana Costa",
] as const;

export type TeamMember = (typeof teamMembers)[number];

export type Ticket = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignee: TeamMember | null;
  requester: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  dueAt: string | null;
  tags: string[];
};

export type TicketComment = {
  id: string;
  ticketId: string;
  author: string;
  body: string;
  createdAt: string;
};

export type TicketActivity = {
  id: string;
  ticketId: string;
  actor: string;
  type:
    | "created"
    | "status_changed"
    | "priority_changed"
    | "assignee_changed"
    | "comment_added";
  description: string;
  createdAt: string;
};

export const statusLabels: Record<TicketStatus, string> = {
  open: "Aberto",
  in_progress: "Em andamento",
  blocked: "Bloqueado",
  resolved: "Resolvido",
};

export const priorityLabels: Record<TicketPriority, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  urgent: "Urgente",
};
