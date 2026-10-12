import { Suspense } from "react";
import TicketDetail from "./ticket-detail";

export default function TicketDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ returnTo?: string | string[] }>;
}) {
  return (
    <Suspense
      fallback={
        <div
          aria-label="Carregando solicitação"
          className="surface-card min-h-96 animate-pulse"
        />
      }
    >
      {Promise.all([params, searchParams]).then(([{ id }, query]) => (
        <TicketDetail
          returnTo={Array.isArray(query.returnTo) ? query.returnTo[0] : query.returnTo}
          ticketId={id}
        />
      ))}
    </Suspense>
  );
}
