import { Suspense } from "react";
import TicketsList from "./tickets-list";

export default function TicketsPage() {
  return (
    <Suspense
      fallback={
        <div aria-label="Carregando solicitações" className="surface-card min-h-72 animate-pulse" />
      }
    >
      <TicketsList />
    </Suspense>
  );
}
