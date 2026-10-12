import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { TicketStoreProvider } from "@/features/tickets/context/ticket-store";

export default function WorkspaceLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <TicketStoreProvider>
      <AppShell>{children}</AppShell>
    </TicketStoreProvider>
  );
}
