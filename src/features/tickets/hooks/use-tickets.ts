"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useDemoNetworkScenario } from "@/features/tickets/context/ticket-store";
import {
  addTicketComment,
  createTicket,
  getTicket,
  getTicketActivities,
  getTicketComments,
  listTickets,
  updateTicket,
} from "@/features/tickets/api/tickets-api";
import type {
  NewCommentInput,
  TicketFilters,
  TicketUpdateInput,
  ValidNewTicket,
} from "@/features/tickets/schemas/ticket-schemas";

export function useTickets(filters: TicketFilters) {
  const { simulateFailures } = useDemoNetworkScenario();

  return useQuery({
    queryKey: ["tickets", filters, simulateFailures],
    queryFn: () => listTickets(filters, simulateFailures),
  });
}

export function useTicket(id: string) {
  const { simulateFailures } = useDemoNetworkScenario();

  return useQuery({
    enabled: Boolean(id),
    queryKey: ["ticket", id, simulateFailures],
    queryFn: () => getTicket(id, simulateFailures),
  });
}

export function useTicketComments(id: string) {
  const { simulateFailures } = useDemoNetworkScenario();

  return useQuery({
    enabled: Boolean(id),
    queryKey: ["ticket-comments", id, simulateFailures],
    queryFn: () => getTicketComments(id, simulateFailures),
  });
}

export function useTicketActivities(id: string) {
  const { simulateFailures } = useDemoNetworkScenario();

  return useQuery({
    enabled: Boolean(id),
    queryKey: ["ticket-activities", id, simulateFailures],
    queryFn: () => getTicketActivities(id, simulateFailures),
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  const { simulateFailures } = useDemoNetworkScenario();

  return useMutation({
    mutationFn: (input: ValidNewTicket) =>
      createTicket(input, simulateFailures),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}

export function useUpdateTicket(id: string) {
  const queryClient = useQueryClient();
  const { simulateFailures } = useDemoNetworkScenario();

  return useMutation({
    mutationFn: (input: TicketUpdateInput) =>
      updateTicket(id, input, simulateFailures),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["tickets"] }),
        queryClient.invalidateQueries({ queryKey: ["ticket", id] }),
        queryClient.invalidateQueries({ queryKey: ["ticket-activities", id] }),
      ]);
    },
  });
}

export function useAddTicketComment(id: string) {
  const queryClient = useQueryClient();
  const { simulateFailures } = useDemoNetworkScenario();

  return useMutation({
    mutationFn: (input: NewCommentInput) =>
      addTicketComment(id, input, simulateFailures),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["ticket-comments", id],
        }),
        queryClient.invalidateQueries({
          queryKey: ["ticket-activities", id],
        }),
        queryClient.invalidateQueries({ queryKey: ["ticket", id] }),
      ]);
    },
  });
}
